import { Dispatch } from 'react'
import * as h3 from 'h3-js'
import L, { LatLng } from 'leaflet'

import { CustomPolygonTypes } from '@/app/types/types'

export const confirmPolygon = (
  polygon: CustomPolygonTypes | null,
  map: L.Map,
  isPressed: boolean,
  setHasShape: Dispatch<React.SetStateAction<number>>,
  cancelNotCofirming: () => void,
) => {
  const geometry = polygon?._latlngs
    ? (polygon._latlngs[0] as Array<LatLng>).map((points: LatLng) =>
        Object.values(points),
      )
    : []

  const data = h3.polygonToCells(geometry, 12)

  const requestInput = isPressed
    ? 'https://plokkari-api-service.azurewebsites.net/api/Trash/Trash'
    : 'https://plokkari-api-service.azurewebsites.net/api/Trash/Clean'

  fetch(requestInput, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hexIds: data,
    }),
  })

  map.setMinZoom(5)
  cancelNotCofirming()
  setHasShape(0)
  map.setView(map.getCenter(), 16)
}
