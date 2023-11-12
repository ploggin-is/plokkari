'use client'
import './style.css'
import L from 'leaflet'

function CleanButton(props) {
  const handleClick = () => {
    props.changeCleanButton(!props.isPressed)
  }

  return (
    <div
      ref={(ref) => {
        if (!ref) return
        /** import L from "leaflet"; */
        L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref)
      }}
    >
      <button className="clean-button" onClick={handleClick}>
        <div
          className="hexagon"
          style={{
            background: props.isPressed
              ? 'rgb(241, 131, 124)'
              : 'rgb(146, 218, 146)',
          }}
        ></div>
      </button>
    </div>
  )
}

export default CleanButton
