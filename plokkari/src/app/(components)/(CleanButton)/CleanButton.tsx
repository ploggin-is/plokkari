"use client";
import "./style.css";
import L from "leaflet";

type Props = {
  isPressed: boolean;
  changeCleanButton: (isPressed: boolean) => void;
};

export const CleanButton = ({ isPressed, changeCleanButton }: Props) => {
  const handleClick = () => {
    changeCleanButton(!isPressed);
  };

  return (
    <div
      ref={(ref) => {
        if (!ref) return;
        /** import L from "leaflet"; */
        L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
      }}
    >
      <button className="clean-button" onClick={handleClick}>
        <div
          className="hexagon"
          style={{
            background: isPressed ? "rgb(241, 131, 124)" : "rgb(146, 218, 146)",
          }}
        ></div>
      </button>
    </div>
  );
};
