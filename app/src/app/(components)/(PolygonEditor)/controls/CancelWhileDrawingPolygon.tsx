import { Dispatch, SetStateAction } from 'react'
import L from 'leaflet'

import { CustomPolygonHandlerTypes } from '@/app/types/types'

export const cancelWhileDrawingPolygon = (
  map: L.Map,
  setIsDrawing: Dispatch<SetStateAction<boolean>>,
  setHasShape: Dispatch<SetStateAction<number>>,
  polygonHandler: CustomPolygonHandlerTypes | null,
) => {
  setIsDrawing(false)
  setHasShape(0)
  try {
    polygonHandler?.disable()
  } catch (ex) {
    console.error(ex)
  }
  map.setView(map.getCenter(), 13)
  map.eachLayer((layer) => {
    if (layer instanceof L.Polygon) {
      layer.setStyle({ opacity: 1 })
    }
  })
}
