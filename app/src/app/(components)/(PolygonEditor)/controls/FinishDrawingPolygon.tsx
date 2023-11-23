import L from 'leaflet'

import { CustomPolygonHandlerTypes } from '@/app/types/types'

export const finishDrawingPolygon = (
  map: L.Map,
  hasShape: number,
  polygonHandler: CustomPolygonHandlerTypes | null,
) => {
  if (map.getZoom() === 18) {
    if (hasShape > 2) {
      try {
        if (polygonHandler && polygonHandler.completeShape) {
          polygonHandler.completeShape()
          polygonHandler.disable()
        }
      } catch (ex) {
        console.error('ex in finishDrawingPolygon:', ex)
      }
    }
  } else {
    map.setView(map.getCenter(), 18)
  }
}
