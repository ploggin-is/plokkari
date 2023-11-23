import { useMap } from 'react-leaflet'
import L from 'leaflet'

import { CoastLineDataProps } from '@/app/types/types'

type PlotCoastlinesProps = {
  coastlineData: CoastLineDataProps
}

export const PlotCoastlines = ({ coastlineData }: PlotCoastlinesProps) => {
  const map = useMap()

  coastlineData.features.forEach((feature, index) => {
    const color = index % 2 === 0 ? '#696969' : '#A9A9A9'
    L.geoJSON(feature, {
      style: {
        color,
        weight: 5,
        opacity: 0.8,
      },
    }).addTo(map)
  })
  return null
}
