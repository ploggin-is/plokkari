import { MutableRefObject } from 'react'
import ReactDOMServer from 'react-dom/server'
import { RxCorners } from 'react-icons/rx'
import { useMap } from 'react-leaflet'
import L, { Layer } from 'leaflet'

import { CustomLayer, CustomMarkerOptions } from '@/app/types/types'

type CentralcircleProps = {
  circle: MutableRefObject<L.Layer | null>
}

export const Centralcircle = ({ circle }: CentralcircleProps) => {
  const map = useMap()
  map.eachLayer((layer: Layer) =>
    (layer as CustomLayer)._layers.map((subLayer) => {
      if (subLayer.options.id === 'circle') {
        circle.current = layer
      }
    }),
  )

  if (!circle.current) {
    circle.current = L.marker(map.getCenter(), {
      icon: new L.DivIcon({
        html: ReactDOMServer.renderToString(
          <RxCorners
            size={30}
            color="black"
            style={{ transform: 'translate(-25%)' }}
          />,
        ),
        className: 'custom-marker-icon',
      }),
      id: 'circle', // Add an ID to the marker layer
    } as CustomMarkerOptions).addTo(map)
  }

  // Update the marker position when the map is moved
  map.on('move', () => {
    if (circle.current && circle.current instanceof L.Marker) {
      circle.current.setLatLng(map.getCenter())
    }
  })

  return null
}
