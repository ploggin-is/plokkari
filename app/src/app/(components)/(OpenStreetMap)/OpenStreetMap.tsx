'use client'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { RxCorners } from 'react-icons/rx'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { DivIconOptions, Layer } from 'leaflet'
import Image from 'next/image'

import { Loading } from '../(Loading)/Loading'
import { StartButton } from '../(StartButton)/StartButton'

import { GetHex } from './HexagonRenderer'

import 'leaflet/dist/leaflet.css'
import './style.css'
import './leaflet.css'
import './leaflet.draw.css'

type ZoomLvlProps = {
  zoomLvl: number
}

type Coordinates = {
  latitude: number
  longitude: number
}

type LineStringGeometry = {
  type: 'LineString'
  coordinates: Array<Coordinates>
}

type FeatureProperties = {
  id: number
  hofn: null | string
  lengd: null | string
  name: string
  status: number
}

type Feature = {
  type: 'Feature'
  id: string
  geometry: LineStringGeometry
  geometry_name: string
  properties: FeatureProperties
  bbox: [number, number, number, number]
}

type CoastLineDataProps = {
  bbox?: [number, number, number, number]
  crs?: {
    properties: { name: string }
    type: string
  }
  features: Array<Feature>
  numberMatched?: number
  numberReturned?: number
  timeStamp?: string // Assuming the timeStamp is a string in ISO 8601 format
  totalFeatures?: number
  type?: 'FeatureCollection'
}

type PlotCoastlinesProps = {
  coastlineData: CoastLineDataProps
}

type LayerOptions = {
  icon: {
    options: DivIconOptions
  }
  id: string
} & L.LayerOptions

type CustomLayer = Layer & {
  _layers: Array<{ options: LayerOptions }>
}

type CustomMarkerOptions = {
  id?: string
} & L.MarkerOptions

const SetViewOnClick = ({ zoomLvl }: ZoomLvlProps) => {
  const map = useMap()

  useEffect(() => {
    map.flyTo(map.getCenter(), zoomLvl, {
      animate: true,
      duration: 1, // in seconds
    })
  })
  return null
}

const Centralcircle = () => {
  const map = useMap()

  const circle = useRef<L.Layer | null>(null)

  map.eachLayer((layer: Layer) =>
    (layer as CustomLayer)._layers.map((subLayer) => {
      if (subLayer.options.id === 'circle') {
        circle.current = layer
      }
    }),
  )

  if (!circle.current) {
    circle.current = L.marker(map.getCenter(), {
      icon: new L.DivIcon({
        html: ReactDOMServer.renderToString(
          <RxCorners
            size={30}
            color="black"
            style={{ transform: 'translate(-25%)' }}
          />,
        ),
        className: 'custom-marker-icon',
      }),
      id: 'circle', // Add an ID to the marker layer
    } as CustomMarkerOptions).addTo(map)
  }

  // Update the marker position when the map is moved
  map.on('move', () => {
    if (circle.current && circle.current instanceof L.Marker) {
      circle.current.setLatLng(map.getCenter())
    }
  })

  return null
}

const PlotCoastlines = (coastlineData: PlotCoastlinesProps) => {
  const map = useMap()

  coastlineData.coastlineData.features.forEach((feature, index) => {
    const color = index % 2 === 0 ? '#696969' : '#A9A9A9'
    L.geoJSON(feature, {
      style: {
        color,
        weight: 5,
        opacity: 0.8,
        // zIndex: 9999,
      },
    }).addTo(map)
  })

  //     // Listen for zoomend event and update style accordingly
  //     // map.on('zoomend moveend', () => {
  //     //   // start with removing earlyer
  //     //   const zoomScale = 40075 / (2 ** map.getZoom())
  //     //   coastlineData.features.forEach((feature, index) => {
  //     //     const color = index % 2 === 0 ? '#696969' : '#A9A9A9';
  //     //     L.geoJSON(feature, {
  //     //       style: {
  //     //         color,
  //     //         weight: 20/zoomScale,
  //     //         opacity: 0.8,
  //     //       },
  //     //     }).addTo(map);
  //     //   });
  //     // });

  return null
}

export const OpenStreetMap = ({ zoomLvl }: ZoomLvlProps) => {
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null)
  const [coastlineData, setCoastlineData] = useState<CoastLineDataProps | null>(
    null,
  )

  const triggerGetHexFunction = useRef(null)
  // const [hexData, setHexData] = useState(null)

  const RuIcon = new L.Icon({
    iconUrl: '/RU_logo_no_text.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  })

  // Function to fetch costline GeoJSON data
  async function fetchCoastlineData() {
    try {
      const wfsUrl =
        'https://gis.lmi.is/geoserver/umhverfisraduneytid/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=umhverfisraduneytid%3Aloka&maxFeatures=100000&outputFormat=application%2Fjson'
      const response = await fetch(wfsUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const coastlineData: CoastLineDataProps = await response.json()
      setCoastlineData(coastlineData)
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error)
    }
  }

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
    }

    fetchCoastlineData() // Call this function to fetch GeoJSON data
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Save the location
          setMapCenter({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location', error)

          // In case of an error, show Reykjavík University
          setMapCenter({
            latitude: 64.124025,
            longitude: -21.925479,
          })
        },
        options,
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      // In case of an error, show Reykjavík University
      setMapCenter({
        latitude: 64.124025,
        longitude: -21.925479,
      })
    }
  }, [])

  // Wait while geting location and Get Coast line data
  if (!mapCenter || !coastlineData) {
    return <Loading />
  }
  const { latitude, longitude } = mapCenter
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoomLvl}
      scrollWheelZoom={true}
      minZoom={5}
      style={{ width: '100%', height: '100vh', margin: '0' }}
      zoomControl={false}
    >
      <Marker icon={RuIcon} position={[64.123721, -21.926725]}>
        <Popup>
          <Image
            alt="Reykjavik University Logo"
            src="/RU_logo.png"
            width={200}
            height={0}
          />
          Reykjavík University <br /> Where it all began.
        </Popup>
      </Marker>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
      contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetViewOnClick zoomLvl={zoomLvl} />
      {/* <Centralcircle isPressed={props.isPressed} /> */}
      <Centralcircle />
      <PlotCoastlines coastlineData={coastlineData} />
      {/* <FeatureGroup >
      <EditControl
        ref={editRef}
        position='bottomright'
        onCreated={onShapeDrawn}
        //here you can specify your shape options and which handler you want to enable
        draw={{
          rectangle: false,
          circle: false,
          polyline: false,
          circlemarker: false,
          marker: false,
          polygon: {
            allowIntersection: false,
            shapeOptions: {
              color: "#ff0000"
              },
          }
        }}/>
        
    </FeatureGroup> */}
      {/* <CleanButton /> */}
      <StartButton />
      <GetHex triggerGetHexFunction={triggerGetHexFunction} />
    </MapContainer>
  )
}
