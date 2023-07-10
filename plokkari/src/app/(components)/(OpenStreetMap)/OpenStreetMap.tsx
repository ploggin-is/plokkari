"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../(Loading)/Loading";
import "./style.css";
import L from "leaflet";
import "./leaflet.css";
import "./leaflet.draw.css";
import { HexagonRenderer } from "./HexagonRenderer";
import { StartButton } from "../(StartButton)/StartButton";
import { RxCorners } from "react-icons/rx";
import ReactDOMServer from "react-dom/server";

type Props = {
  zoomLvl: number;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

const SetViewOnClick = ({ zoomLvl }: Props) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(map.getCenter(), zoomLvl, {
      animate: true,
      duration: 1, // in seconds
    });
  });
  return null;
};

const CentralCircle = () => {
  const map = useMap();
  const circleRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer && layer.options && layer.options.attribution === "circle") {
        circleRef.current = layer;
      }
    });

    if (!circleRef.current) {
      const circle = L.marker(map.getCenter(), {
        icon: new L.DivIcon({
          html: ReactDOMServer.renderToString(
            <RxCorners
              size={30}
              color="black"
              style={{ transform: "translate(-25%)" }}
            />
          ),
          className: "custom-marker-icon",
        }),
        attribution: "circle", // Add an ID to the marker layer
      }).addTo(map);
      circleRef.current = circle;
    }

    map.eachLayer((layer) => {
      if (layer && layer.options && layer.options.attribution === "circle") {
        circleRef.current = layer;
      }
    });

    map.on("move", () => {
      if (circleRef.current && circleRef.current instanceof L.Marker) {
        circleRef.current.setLatLng(map.getCenter());
      }
    });
  }, [map]);

  return null;
};

export const OpenStreetMap = ({ zoomLvl }: Props) => {
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);

  const triggerGetHexFunction = useRef(useRef<() => void>);

  const RuIcon = new L.Icon({
    iconUrl: "/RU_logo_no_text.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      };

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          // Save the location
          setMapCenter({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          console.log(error, "Error getting location");
          // In case of an error, show Reykjavík University
          setMapCenter({
            latitude: 64.124025,
            longitude: -21.925479,
          });
        },
        options
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // In case of an error, show Reykjavík University
      setMapCenter({
        latitude: 64.124025,
        longitude: -21.925479,
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
      zoom={zoomLvl}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100vh", margin: "0" }}
      zoomControl={false}
    >
      <Marker icon={RuIcon} position={[64.123721, -21.926725]}>
        <Popup>
          <Image alt="asd" src="/RU_logo.png" width={200} height={0} />
          Reykjavík University <br /> Where it all began.
        </Popup>
      </Marker>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
    contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetViewOnClick zoomLvl={zoomLvl} />

      {/* TODO: Add isPressed */}
      {/* <CentralCircle /> */}
      <CentralCircle />

      {/* <CleanButton /> */}
      <StartButton />
      <HexagonRenderer triggerGetHexFunction={triggerGetHexFunction} />
    </MapContainer>
  );
};
export default OpenStreetMap;
