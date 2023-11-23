import { Dispatch, RefObject, SetStateAction } from 'react'
import * as h3 from 'h3-js'
import L, { LatLng } from 'leaflet'

import {
  CustomEditControl,
  CustomPolygonTypes,
  HexVerts,
} from '@/app/types/types'

/* eslint-disable deprecation/deprecation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const onShapeDrawn =
  (
    editRef: RefObject<CustomEditControl | null>,
    setPolygon: Dispatch<SetStateAction<CustomPolygonTypes | null>>,
    setHexVerts: Dispatch<SetStateAction<HexVerts>>,
    setHasPolygon: Dispatch<SetStateAction<boolean>>,
    setHasShape: Dispatch<SetStateAction<number>>,
  ) =>
  (e: L.LeafletEvent) => {
    if (!editRef.current) {
      return
    }

    setPolygon(e.layer)
    e.layer.editing.enable()

    const geometry = e.layer
      .getLatLngs()[0]
      .map((points: LatLng) => Object.values(points))

    const data = h3.polygonToCells(geometry, 12)
    setHexVerts(h3.cellsToMultiPolygon(data))

    const isTouchDevice =
      'ontouchstart' in window ||
      ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0)

    // TODO: add onShapeDrawn for IOS
    e.layer.on('click', () => {
      editRef.current?._toolbars?.edit?._modes.edit.handler.enable()
    })

    e.layer.bindTooltip('Text', {
      className:
        'leaflet-draw-tooltip:before leaflet-draw-tooltip leaflet-draw-tooltip-visible',
      sticky: true,
      direction: 'right',
    })

    setHasPolygon(true)
    setHasShape(0)
  }
