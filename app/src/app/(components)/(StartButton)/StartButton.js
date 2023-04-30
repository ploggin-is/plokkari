"use client"
import { useEffect, useRef, useState } from 'react';
import './style.css'
import { useMap } from 'react-leaflet';
import CleanButton from '../(CleanButton)/CleanButton';
import L from "leaflet";


function StartButton(props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const polygonRef = useRef(null);
  const [vertices, setVertices] = useState([]);
  const map = useMap();
  const h3 = require("h3-js");

  // This is treggerd when starting or stopping marking an area
  useEffect(() => {
    if (isDrawing){
      // create polygon instance
      const polygon = L.polygon([], { color:isDirty?'red':'green'}).addTo(map);
      polygonRef.current = polygon;

      // add click event handler to map
      map.on('click', handleMapClick);

      return () => {
        // cleanup function to remove click event handler
        map.off('click', handleMapClick);
      };
    }
  }, [isDrawing]);

  useEffect(() => {
    // recreate the polygon with new color (One would hope there is a better way to do this)
    if (isDrawing){
      polygonRef.current.remove();
      const polygon = L.polygon(vertices, { color:isDirty?'red':'green'}).addTo(map);
      polygonRef.current = polygon;
    }
    // Don't care if user is not drawing
  }, [isDirty]);

  function handleMapClick(event) {
    console.log('Map clicked');
    const latLng = event.latlng;
    setVertices((prevVertices) => {
      const newVertices = [...prevVertices, latLng];
      polygonRef.current.setLatLngs(newVertices);
      return newVertices;
    });
  }


  const startDrawing = (e) => {
    setIsDrawing(true)
    map.flyTo(map.getCenter(), 18, {animate: true, duration: 1})
    map.once('moveend', function () {
      map.setMinZoom(18)
    });
  }; 

  const cancel = (e) => {  
    map.setMinZoom(5)
    setIsDrawing(false)
    setVertices([]);
    polygonRef.current.remove();
  };



  const confirm = () => {
    console.log("Confirm")
    console.log(polygonRef.current.getLatLngs())
    let geometry = polygonRef.current.getLatLngs()[0].map(points => Object.values(points));
    // // console.log(h3)
    const data = h3.polygonToCells(geometry, 12);
    // console.log(data);
    const requestInput =isDirty?"https://plokkari-api-service.azurewebsites.net/api/Trash/Trash":"https://plokkari-api-service.azurewebsites.net/api/Trash/Clean"
    fetch(requestInput, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
        hexIds: data
        })
     })
    cancel()
  }

  return (
    <>
      <CleanButton changeCleanButton={setIsDirty} isPressed={isDirty} />
      {/* Im im not drawing ican start drawing */}
      {!isDrawing && 
        <button className="green-button" onClick={startDrawing}
          style={{transform: 'translate(-50%)'}}
          >
          Start 
        </button>
      }
      {isDrawing &&
        <>
          <button className="red-button" onClick={cancel}>
            Cancel  
          </button> 
          <button className="green-button" onClick={confirm}>
            {/* {hasShape < 3 ? `Click at least ${3 - hasShape} points` : "Finish"} */}
            Confirm
          </button> 
        </>
      }
    </>
  );
};

export default StartButton;