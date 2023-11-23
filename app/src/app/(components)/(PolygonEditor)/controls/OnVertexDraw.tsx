import { Dispatch, SetStateAction } from 'react'
import { Map } from 'leaflet'

export const onVertexDraw = (
  map: Map,
  setHasShape: Dispatch<SetStateAction<number>>,
) => {
  if (map.getZoom() === 18) {
    setHasShape((prevHasShape) => prevHasShape + 1)
  } else {
    map.setView(map.getCenter(), 18)
  }
}
