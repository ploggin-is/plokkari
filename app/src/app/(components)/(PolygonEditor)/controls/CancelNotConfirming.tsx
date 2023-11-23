import { Dispatch, SetStateAction } from 'react'
import L from 'leaflet'

import { CustomPolygonTypes } from '@/app/types/types'

export const cancelNotConfirming = (
  polygon: CustomPolygonTypes | null,
  map: L.Map,
  setPolygon: Dispatch<SetStateAction<CustomPolygonTypes | null>>,
  setIsDrawing: Dispatch<SetStateAction<boolean>>,
  setHasPolygon: Dispatch<SetStateAction<boolean>>,
  setHasShape: Dispatch<SetStateAction<number>>,
) => {
  if (polygon && polygon._map.hasLayer(polygon)) {
    polygon._map.removeLayer(polygon)
  }
  setPolygon(null)
  setIsDrawing(false)
  setHasPolygon(false)
  setHasShape(0)
  map.setView(map.getCenter(), 13)
  map.eachLayer((layer) => {
    if (layer instanceof L.Polygon) {
      layer.setStyle({ opacity: 1 })
    }
  })
}
