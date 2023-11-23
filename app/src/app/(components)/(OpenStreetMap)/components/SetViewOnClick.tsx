import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

type SetViewOnClickProps = {
  zoomLvl: number
}

export const SetViewOnClick = ({ zoomLvl }: SetViewOnClickProps) => {
  const map = useMap()

  useEffect(() => {
    map.flyTo(map.getCenter(), zoomLvl, {
      animate: true,
      duration: 1, // in seconds
    })
  })
  return null
}
