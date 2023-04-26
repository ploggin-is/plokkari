"use client"
import { useEffect, useRef, useState } from 'react';
import './style.css'
import { FeatureGroup, Polygon, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import CleanButton from '../(CleanButton)/CleanButton';
import L from "leaflet";

import "./PolygonEditor/style.css"

function StartButton(props) {
  
  const [hasShape, setHasShape] = useState(0);
    const [polygonStuff, setPolygonStuff] = useState(null)
    const [isPressed, setIsPressed] = useState(false);
    const h3 = require("h3-js");
    const editRef = useRef();
    const polygonHandlerRef = useRef(null);
    const [button, setButton] = useState("start");
    const [hasPolygon, setHasPolygon] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    // const [isDrawing, setIsDtawing]


    /**
     * Min logik: Takkar eru synilegir ef ad td. polgon != null og drawing != false, 
     * { drawing ? {
     *    { polygonStuff != null  && < Td. Cancel, finish takkar synilegir. /> }
     *    { polygonStuff != null  && <Eitthvad sem sest thegar drawing er true, og polygonstuff er ekki null /> }
     * }: {
     *  isN
     *  
     * }}
     * 
     * 
     */

    const [polygon, setPolygon] = useState(null)
      const [polyHexRepresentation, setPolyHexRepresentation] = useState(null);

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

    const startDrawing = (e) => {
        setIsDrawing(true)
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

    const finishDrawingPolygon = (e) => {
        try {
          polygonHandler.completeShape();
          polygonHandler.disable();
          }
        catch(ex){
          console.log(ex);
        }
      }; 

    const cancelWhileDrawingPolygon = (e) => {  
      setIsDrawing(false)
        try {
          polygonHandler.disable();
          }
        catch(ex){
          // console.log(ex);
        }
        setPolyHexRepresentation(null)
        map.setView(map.getCenter(), 13)
        map.eachLayer((layer) => {
          if (layer instanceof L.Polygon) {
            layer.setStyle({ opacity: 1 });
          }
        });
      }; 

      const cancelNotComfirming = () => {
        
        polygon._map.eachLayer(layer => {
          if(layer._leaflet_id  == polygon._leaflet_id){layer.remove()}
        })
        setPolygon(null)
        setIsDrawing(false)
        setPolyHexRepresentation(null);
        map.setView(map.getCenter(), 13)
        map.eachLayer((layer) => {
          if (layer instanceof L.Polygon) {
            layer.setStyle({ opacity: 1 });
          }
        });
      }

      const confirm = () => {
        console.log("Confirm")
        console.log(polygon)
        let geometry = polygon.getLatLngs()[0].map(points => Object.values(points));
        const data = h3.polygonToCells(geometry, 12);
        console.log(data);
        const requestInput =isPressed?"https://plokkari-api-service.azurewebsites.net/api/Trash/Trash":"https://plokkari-api-service.azurewebsites.net/api/Trash/Clean"
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

         cancelNotComfirming()
        
      }

    const onShapeDrawn = (e) => {
      if(!editRef.current) { return; }
      console.log('setting polygon');

        map.on("draw:edited", ()=>{
          foo()
        })
        console.log(e.layer);
        
        setPolygon(e.layer)
        
        e.layer

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
        
        setHasPolygon(true)
    }

    // const calculateVertexRep = (polygon) => {
    //   console.log("Pee Pee Poo Poo")
    //   console.log(polygon)
    //     if(polygon == null){
    //       return;
    //     }
    //     let geometry;
    //     try {
    //       geometry = polygon?.getLatLngs()[0].map(points => Object.values(points));
        
    //       console.log("Got Here");
    //       console.log(geometry);
          
    //       const data = h3.polygonToCells(geometry, 12);
    //       const coordinates = h3.cellsToMultiPolygon(data, false);
    //       console.log(coordinates);
    //       setPolyHexRepresentation(coordinates)
    //     }
    //     catch {
    //       return;
    //     }
    // }

  
    return (
          <> 
            <CleanButton changeCleanButton={setIsPressed} isPressed={isPressed} />
            <FeatureGroup >
              <EditControl
                onMounted={  mapInstance => { editRef.current= mapInstance } }
                position='bottomleft'
                onCreated={onShapeDrawn}
                onEditMove={()=>{console.log('foo');
                }}
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
                      fillColor: isPressed ? 'red' : 'green'
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
              > { !isDrawing ? (
               <div className='blobs'>
                  <button className="start-button" onClick={startDrawing} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                    Start 
                  </button> 
                </div>
                )
                : 
                !hasPolygon ? (
                  <div className='blobs'>
                    <button className="finish-button" onClick={finishDrawingPolygon} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                      Finish  
                    </button> 
                    <button className="cancel-button" onClick={cancelWhileDrawingPolygon} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                      Cancel  
                    </button> 
                  </div>
                  ) : (
                    <div className='blobs'>
                      <button className="edit-button" onClick={confirm} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                        Confirm  
                      </button> 
                      <button className="cancel-button" onClick={cancelNotComfirming} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
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