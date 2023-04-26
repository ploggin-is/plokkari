"use client"
import { useEffect, useRef, useState } from 'react';
import './style.css'
import { FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import CleanButton from '../(CleanButton)/CleanButton';
import L from "leaflet";

import "./PolygonEditor/style.css"


function StartButton(props) {

    const [polygonStuff, setPolygonStuff] = useState(null)
    const [isPressed, setIsPressed] = useState(false);
    const h3 = require("h3-js");
    const editRef = useRef();
    const polygonHandlerRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [text, setText] = useState("start");
    const map = useMap();
    useEffect(() => {
      if (editRef.current && editRef.current._toolbars.draw) {
        const polygonHandler = editRef.current._toolbars.draw._modes.polygon.handler;
        polygonHandlerRef.current = polygonHandler;
      }
      var cb = document.getElementsByClassName('leaflet-draw-draw-polygon');
      console.log(cb)
      setPolygonStuff(cb[0])
    }, []);

    const handleClick = (e) => {
      const polygonHandler = polygonHandlerRef.current;
      console.log(polygonHandler)
      if (e.currentTarget.id === "start") {
      setText("cancel")
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          layer.setStyle({ opacity: 0 });
          }
        });
      map.flyTo(map.getCenter(), 18, {animate: true, duration: 1})
      e.preventDefault()
      var event = document.createEvent('Event');
      event.initEvent('click', true, true);
      polygonStuff.dispatchEvent(event);
      } 
      else if (e.currentTarget.id === "edit") {  
        try {
          polygonHandler.completeShape();
          polygonHandler.disable();
          }
        catch(ex){
          console.log(ex);
        }
      } 
      else if (e.currentTarget.id === "cancel1" || e.currentTarget.id === "cancel2") {
        setText("start"); 
        try {
          polygonHandler.disable();
          polygonHandler.deleteLastVertex();
          }
        catch(ex){
          console.log(ex);
        }
        map.setView(map.getCenter(), 13)
        map.eachLayer((layer) => {
          if (layer instanceof L.Polygon) {
            layer.setStyle({ opacity: 1 });
          }
        });
      } 
      };

    const onShapeDrawn = (e) => {
        if(!editRef.current) { return; }
        editRef.current._toolbars.edit._modes.edit.handler.enable()
        e.layer.on('click', () => {
            editRef.current._toolbars.edit._modes.edit.handler.enable()
        })
        e.layer.on('contextmenu', () => {
            //do some contextmenu action here
        })
        e.layer.bindTooltip("Text", 
            {
              className: 'leaflet-draw-tooltip:before leaflet-draw-tooltip leaflet-draw-tooltip-visible',
              sticky: true,
              direction: 'right'
            }
        );
        setText("edit")
    }

    return (
          <>
            <CleanButton changeCleanButton={setIsPressed} isPressed={isPressed} />
            <FeatureGroup >
              <EditControl
                onMounted={  mapInstance => { editRef.current= mapInstance } }
                position='bottomleft'
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
                      color: "black",
                      fillColor: "green"
                    },
                  }
                }}
                />
            </FeatureGroup>
            <div
              ref={(ref) => {
                if (!ref) return;
                L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
              }}
              > { text === "start" ? (
               <div className='blobs'>
              <button id="start"
                className="start-button"
                onClick={handleClick}
                // style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                >
                  Start
                </button> 
                </div>
                )
                : text === "edit" ? 
                (
                <div className='blobs'>
                <button id="edit"
                className="edit-button"
                onClick={handleClick}
                // style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                >
                Confirm  
                </button> 
                <button id="cancel2"
                className="cancel-button-2"
                onClick={handleClick}
                // style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                >
                Cancel  
                </button> 
                </div>
                )
                :
                (
                  <div className='blobs'>
                  <button id="cancel1"
                  className="cancel-button-1"
                  onClick={handleClick}
                  // style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                  >
                  Cancel  
                  </button> 
                  </div>
                )
                
              }
            </div>
        </>
    );
};

export default StartButton;