"use client"
import { MapContainer, FeatureGroup, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Image from 'next/image'
import React, { useEffect, useState, useRef} from 'react';
import 'leaflet/dist/leaflet.css';
import Loading from '../(Loading)/Loading';
import './style.css'
import L from 'leaflet';

import "./leaflet.css"
import "./leaflet.draw.css"
import HexagonRenderer from './HexagonRenderer';
import StartButton from '../(StartButton)/StartButton';


import { RxCorners } from 'react-icons/rx';
import ReactDOMServer from 'react-dom/server';

const SetViewOnClick = ({zoomLvl}) => {
  const map = useMap();

  useEffect(() => {
  map.flyTo(map.getCenter(),zoomLvl,{
    animate: true,
    duration: 1 // in seconds
  });
});
return null;

}

const Centralcircle = () => {
  const map = useMap();
  let circle = null;
  map.eachLayer(function(layer) {
  if (layer.options && layer.options.id === 'circle') {
      circle = layer;
    }
  }); 
  if (!circle) {
    circle = L.marker(map.getCenter(), {
      icon: new L.divIcon({
        html: ReactDOMServer.renderToString(<RxCorners size={30} color='black' style={{transform: 'translate(-25%)'}} />),
        className: 'custom-marker-icon'
      }),
      id: 'circle' // Add an ID to the marker layer
    }).addTo(map);
  }

  // Update the marker position when the map is moved
  map.on('move', function(e) {
    circle.setLatLng(map.getCenter());
    // map._renderer._update();

  });
  return null
  }

  

const OpenStreetMap = (props) => {
  const [mapCenter, setMapCenter] = useState(null);

  const triggerGetHexFunction = useRef(null)
  const [hexData, setHexData] = useState(null);

  console.log(props.zoomLvl)
  const RuIcon = new L.Icon({
    iconUrl: "/RU_logo_no_text.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
  

  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
  };
  
  
  useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Save the location
        setMapCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

      },
      (error) => {
        console.log("Error getting location")

        // In case of an error, show Reykjavík University
        setMapCenter({
          latitude: 64.124025,
          longitude: -21.925479
        });
      },
      options
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    // In case of an error, show Reykjavík University
    setMapCenter({
      latitude: 64.124025,
      longitude: -21.925479
    });
  }


}, []);

// Wait while geting location
if (!mapCenter) {
  return <Loading />;
}
const { latitude, longitude } = mapCenter;
return (
  <MapContainer 
    center={[latitude, longitude]} 
    zoom={props.zoomLvl} scrollWheelZoom={true} 
    minZoom={5}
    style={{ width: "100%", height: "100vh", margin: '0'}} 
    zoomControl={false}
    >
   <Marker icon={RuIcon} position={[64.123721, -21.926725]}>
      <Popup>
        <Image alt="asd"
          src="/RU_logo.png" 
          width={200} 
          height={0} />   
        Reykjavík University <br /> Where it all began.
      </Popup>
    </Marker>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
      contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <SetViewOnClick zoomLvl={props.zoomLvl}/>
    <Centralcircle isPressed={props.isPressed}/>
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
    <HexagonRenderer triggerGetHexFunction={triggerGetHexFunction} />
  </MapContainer>
);
};

export default OpenStreetMap