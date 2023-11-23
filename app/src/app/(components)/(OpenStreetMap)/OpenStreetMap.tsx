'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import Image from 'next/image'

import { initializeCoastlineData } from '@/app/services/coastlineDataServices'
import { CoastLineCoordinates, CoastLineDataProps } from '@/app/types/types'

import { Loading } from '../(Loading)/Loading'
import { PolygonEditor } from '../(PolygonEditor)/PolygonEditor'

import { Centralcircle } from './components/Centralcircle'
import { HexagonRenderer } from './components/HexagonRenderer'
import { PlotCoastlines } from './components/PlotCoastlines'
import { SetViewOnClick } from './components/SetViewOnClick'

import 'leaflet/dist/leaflet.css'
import './styles/style.css'
import './styles/leaflet.css'
import './styles/leaflet.draw.css'

type OpenStreetMapProps = {
  zoomLvl: number
}

export const OpenStreetMap = ({ zoomLvl }: OpenStreetMapProps) => {
  const circle = useRef<L.Layer | null>(null)
  const triggerGetHexFunction = useRef(null)

  const [mapCenter, setMapCenter] = useState<CoastLineCoordinates | null>(null)
  const [coastlineData, setCoastlineData] = useState<CoastLineDataProps | null>(
    null,
  )

  const RuIcon = new L.Icon({
    iconUrl: '/RU_logo_no_text.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  })

  useEffect(() => {
    initializeCoastlineData(setCoastlineData, setMapCenter)
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

      <Centralcircle circle={circle} />
      <PlotCoastlines coastlineData={coastlineData} />
      {/* <PolygonEditor /> */}
      <PolygonEditor />
      <HexagonRenderer triggerGetHexFunction={triggerGetHexFunction} />
    </MapContainer>
  )
}
