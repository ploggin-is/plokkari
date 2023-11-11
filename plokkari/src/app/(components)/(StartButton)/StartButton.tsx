"use client";
import { useEffect, useRef, useState } from "react";
import { FeatureGroup, Polygon, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { CleanButton } from "../(CleanButton)/CleanButton";
import L, { LatLngExpression, DefaultMapPanes, LatLng, Layer } from "leaflet";
import "./style.css";
import "./PolygonEditor/style.css";

type Coordinates = LatLngExpression[][];

type PolygonHandlerTypes = DefaultMapPanes & {
  completeShape: () => void;
  disable: () => void;
  enable: () => void;
};

type DrawControl = L.Map & {
  _toolbars?: {
    draw: EditControl & {
      _modes: {
        polygon: {
          handler: PolygonHandlerTypes;
        };
      };
    };
    edit?: EditControl & {
      _modes: {
        edit: {
          handler: PolygonHandlerTypes;
        };
      };
    };
  };
};

type PolygonTypes = Layer & {
  _map: L.LayerGroup;
  _leaflet_id: number;
  _latlngs: LatLng[] | LatLng[][] | LatLng[][][];
};

type Props = {};

export const StartButton = ({}: Props) => {
  const editRef = useRef<DrawControl | null>(null);
  const [polygon, setPolygon] = useState<PolygonTypes | null>(null);
  const polygonHandlerRef = useRef<PolygonHandlerTypes | null>(null);
  const [hasShape, setHasShape] = useState(0);
  const [polygonStuff, setPolygonStuff] = useState<HTMLElement | null>(null);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const h3 = require("h3-js");
  const [hasPolygon, setHasPolygon] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hexVerts, setHexVerts] = useState<Coordinates[][]>([]);
  const map = useMap();

  useEffect(() => {
    if (editRef.current && editRef.current._toolbars?.draw) {
      const polygonHandler =
        editRef.current._toolbars.draw._modes.polygon?.handler;
      polygonHandlerRef.current = polygonHandler;
    }
    var cb = document.getElementsByClassName("leaflet-draw-draw-polygon");
    console.log(cb);
    setPolygonStuff(cb[0] as HTMLElement);
  }, []);

  const polygonHandler = polygonHandlerRef.current;

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        layer.setStyle({ opacity: 0 });
      }
    });
    map.flyTo(map.getCenter(), 18, { animate: true, duration: 1 });
    e.preventDefault();
    var event = document.createEvent("Event");
    event.initEvent("click", true, true);
    polygonStuff?.dispatchEvent(event);
  };

  const finishDrawingPolygon = () => {
    if (map.getZoom() == 18) {
      if (hasShape > 2) {
        try {
          polygonHandler?.completeShape();
          polygonHandler?.disable();
        } catch (ex) {
          console.log(ex);
        }
      }
    } else {
      map.setView(map.getCenter(), 18);
    }
  };

  const cancelWhileDrawingPolygon = () => {
    setIsDrawing(false);
    setHasShape(0);
    try {
      polygonHandler?.disable();
    } catch (ex) {
      // console.log(ex);
    }
    map.setView(map.getCenter(), 13);
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        layer.setStyle({ opacity: 1 });
      }
    });
  };

  const cancelNotComfirming = () => {
    if (polygon && polygon._map && polygon._map.hasLayer(polygon)) {
      polygon._map.removeLayer(polygon);
    }
    setPolygon(null);
    setIsDrawing(false);
    setHasPolygon(false);
    setHasShape(0);
    map.setView(map.getCenter(), 13);
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        layer.setStyle({ opacity: 1 });
      }
    });
  };

  const confirm = () => {
    console.log("Confirm");
    console.log("polygon?._latlngs:", polygon?._latlngs);

    let geometry = (polygon?._latlngs[0] as LatLng[]).map((points: LatLng) =>
      Object.values(points)
    );

    // console.log(h3)
    const data = h3.polygonToCells(geometry, 12);
    console.log(data);
    const requestInput = isPressed
      ? "https://plokkari-api-service.azurewebsites.net/api/Trash/Trash"
      : "https://plokkari-api-service.azurewebsites.net/api/Trash/Clean";
    fetch(requestInput, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hexIds: data,
      }),
    });

    cancelNotComfirming();
    setHasShape(0);
  };

  const onShapeDrawn = (e: L.LeafletEvent) => {
    if (!editRef.current) {
      return;
    }
    setPolygon(e.layer);
    e.layer.editing.enable();

    let geometry = e.layer
      .getLatLngs()[0]
      .map((points: LatLng) => Object.values(points));

    // console.log(h3)
    const data = h3.polygonToCells(geometry, 12);

    setHexVerts(h3.cellsToMultiPolygon(data));

    // editRef.current._toolbars.edit._modes.edit.handler.enable()
    e.layer.on("click", () => {
      editRef?.current?._toolbars?.edit?._modes.edit.handler.enable();
    });
    e.layer.on("contextmenu", () => {
      //do some contextmenu action here
    });
    e.layer.bindTooltip("Text", {
      className:
        "leaflet-draw-tooltip:before leaflet-draw-tooltip leaflet-draw-tooltip-visible",
      sticky: true,
      direction: "right",
    });
    setHasPolygon(true);
    setHasShape(0);
  };

  const onVertexDraw = () => {
    if (map.getZoom() == 18) {
      setHasShape((prevHasShape) => prevHasShape + 1);
    } else {
      map.setView(map.getCenter(), 18);
    }
  };

  const renderedPolygon = hexVerts?.map((coordinateSet: Coordinates[]) => (
    <Polygon
      key={hexVerts.indexOf(coordinateSet)}
      color="green"
      positions={coordinateSet}
    />
  ));

  return (
    <>
      {renderedPolygon}
      <CleanButton changeCleanButton={setIsPressed} isPressed={isPressed} />
      <FeatureGroup>
        <EditControl
          onMounted={(mapInstance: L.Map) => {
            editRef.current = mapInstance;
          }}
          position="bottomleft"
          onCreated={onShapeDrawn}
          onDrawVertex={onVertexDraw}
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
                fillColor: isPressed ? "red" : "green",
              },
            },
          }}
        />
      </FeatureGroup>
      <div
        ref={(ref) => {
          if (!ref) return;
          L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
        }}
      >
        {" "}
        {!isDrawing ? (
          <div
            className="blobs"
            ref={(ref) => {
              if (!ref) return;
              /** import L from "leaflet"; */
              L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(
                ref
              );
            }}
          >
            <button className="start-button" onClick={startDrawing}>
              Start
            </button>
          </div>
        ) : !hasPolygon ? (
          <div
            className="blobs"
            ref={(ref) => {
              if (!ref) return;
              /** import L from "leaflet"; */
              L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(
                ref
              );
            }}
          >
            <button
              className="finish-button"
              onClick={finishDrawingPolygon}
              style={{
                background: hasShape < 3 ? "grey" : "rgb(146, 218, 146)",
              }}
            >
              {hasShape < 3
                ? `Click at least ${3 - hasShape} points`
                : "Finish"}
            </button>
            <button
              className="cancel-button"
              onClick={cancelWhileDrawingPolygon}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            className="blobs"
            ref={(ref) => {
              if (!ref) return;
              /** import L from "leaflet"; */
              L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(
                ref
              );
            }}
          >
            <button className="edit-button" onClick={confirm}>
              Confirm
            </button>
            <button className="cancel-button" onClick={cancelNotComfirming}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};
