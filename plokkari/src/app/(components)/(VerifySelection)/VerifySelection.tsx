"use client";
import { Button, Modal } from "react-bootstrap";
import { MapContainer, TileLayer } from "react-leaflet";
import { DropdownBox } from "./DropDownBox";
import "./style.css";
import "leaflet/dist/leaflet.css";
import { LatLng } from "leaflet";

type PopupMapProps = {
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  center: LatLng;
  zoom: number;
};

export const VerifySelection = ({
  showPopup,
  setShowPopup,
  center,
  zoom,
}: PopupMapProps) => {
  const handleClose = () => setShowPopup(false);

  return (
    <Modal show={showPopup} onHide={handleClose}>
      <Modal.Body>
        <div className="verify-selection-popup ">
          <div className="map-container">
            <MapContainer
              center={center}
              zoom={zoom}
              scrollWheelZoom={true}
              zoomControl={false}
              style={{ width: "100%", height: "100%", margin: "0" }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
              contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
          <div className="info-container">
            <h3>Confirm selection</h3>
            <p style={{ color: "dimgray" }}>
              Please confirm your selection below:
            </p>
            <DropdownBox />
            <div>
              <Button style={{ backgroundColor: "gray" }} onClick={handleClose}>
                Edit
              </Button>
              <Button onClick={handleClose}>Confirm</Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
