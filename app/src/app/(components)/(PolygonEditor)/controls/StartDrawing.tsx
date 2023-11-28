import { Dispatch, MouseEvent } from 'react'
import L from 'leaflet'

export const startDrawing =
  (
    map: L.Map,
    setIsDrawing: Dispatch<React.SetStateAction<boolean>>,
    polygonStuff: Element | null,
  ) =>
  (e: MouseEvent) => {
    setIsDrawing(true)

    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        layer.setStyle({ opacity: 0 })
      }
    })

    map.flyTo(map.getCenter(), 18, { animate: true, duration: 1 })

    e.preventDefault()

    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    const eventName = isiOS ? 'touchstart' : 'click'
    const event = new Event(eventName)

    polygonStuff?.dispatchEvent(event)
  }
