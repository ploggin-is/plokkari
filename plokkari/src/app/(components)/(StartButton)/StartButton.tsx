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
    const [button, setButton] = useState("start");
    // const [isDrawing, setIsDtawing]


    /**
     * Min logik: Takkar eru synilegir ef ad td. polgon != null og drawing != false, 
     * 
     * 
     * 
     */

    const [polygon, setPolygon] = useState(null)

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

    const polygonHandler = polygonHandlerRef.current;

    const startClick = (e) => {
      setButton("finish")
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
    }; 

    const cancel1Click = (e) => {  
      setButton("start")
        try {
          polygonHandler.disable();
          }
        catch(ex){
          // console.log(ex);
        }
        map.setView(map.getCenter(), 13)
        map.eachLayer((layer) => {
          if (layer instanceof L.Polygon) {
            layer.setStyle({ opacity: 1 });
          }
        });
      }; 

      const finishClick = (e) => {  
        setButton("start")
          try {
            polygonHandler.completeShape();
            polygonHandler.disable();
            }
          catch(ex){
            // console.log(ex);
          }
        }; 

    const cancel2Click = (e) =>{
      setButton("start"); 
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
      };

      const cancel = () => {
        polygon._map.eachLayer(layer => {
          if(layer._leaflet_id  == polygon._leaflet_id){layer.remove()}
        })
        setPolygon(null)
        // polygon._map.eachLayer(layer => {
        //   if(layer._path != undefined){layer.remove()}
        // })
      };

      const confirm = () => {
        console.log("Confirm")
      }

    const onShapeDrawn = (e) => {
        if(!editRef.current) { return; }
        e._temporarylol = true;
        e.layer.editing.enable()
        // editRef.current._toolbars.edit._modes.edit.handler.enable()
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
        setButton("edit")
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
              > { button === "start" ? (
               <div className='blobs'>

                <button
                    className="start-button"
                    onClick={startClick}
                    style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                    >
                      Start 
                  </button> 
                </div>
                )
                : button === "finish" ? 
                (
                  <div className='blobs'>
                    <button 
                    className="finish-button"
                    onClick={finishClick}
                    style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                    >
                    Finish  
                    </button> 
                    <button
                    className="cancel-button"
                    onClick={cancel1Click}
                    style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                    >
                    Cancel  
                    </button> 
                  </div>
                )
                :
                (
                <div className='blobs'>
                  <button
                    className="edit-button"
                    onClick={confirm}
                    style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                    >
                    Confirm  
                  </button> 
                  <button
                    className="cancel-button"
                    onClick={cancel2Click}
                    style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
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