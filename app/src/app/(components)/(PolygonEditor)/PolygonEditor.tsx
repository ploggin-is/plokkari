'use client'
import { useEffect, useRef, useState } from 'react'
import { FeatureGroup, Polygon, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { CoordPair } from 'h3-js'
import L from 'leaflet'

import {
  CustomEditControl,
  CustomPolygonHandlerTypes,
  CustomPolygonTypes,
  HexVerts,
} from '@/app/types/types'

import { CleanButton } from '../(CleanButton)/CleanButton'

import { DrawingButtons } from './components/DrawingButtons'
import { onShapeDrawn } from './controls/OnShapeDrawn'
import { onVertexDraw } from './controls/OnVertexDraw'

import './styles/style.css'
import './styles/polygonEditor.style.css'

export const PolygonEditor = () => {
  const map = useMap()

  const editRef = useRef<CustomEditControl | null>(null)
  const polygonHandlerRef = useRef<CustomPolygonHandlerTypes | null>(null)

  const [hasShape, setHasShape] = useState<number>(0)
  const [polygon, setPolygon] = useState<CustomPolygonTypes | null>(null)
  const [hasPolygon, setHasPolygon] = useState<boolean>(false)
  const [polygonStuff, setPolygonStuff] = useState<Element | null>(null)
  const [hexVerts, setHexVerts] = useState<HexVerts>([])
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [isPressed, setIsPressed] = useState<boolean>(false)

  useEffect(() => {
    if (editRef.current && editRef.current._toolbars?.draw) {
      const polygonHandler =
        editRef.current._toolbars.draw._modes.polygon.handler
      polygonHandlerRef.current = polygonHandler
    }
    const cb = document.getElementsByClassName('leaflet-draw-draw-polygon')
    // console.log('cb in StartButton:', cb)
    setPolygonStuff(cb[0])
  }, [])

  const polygonHandler = polygonHandlerRef.current

  const handleOnShapeDrawn = (e: L.LeafletEvent) => {
    onShapeDrawn(
      editRef,
      setPolygon,
      setHexVerts,
      setHasPolygon,
      setHasShape,
    )(e)
  }

  const handleOnVertexDraw = () => {
    onVertexDraw(map, setHasShape)
  }

  const renderedPolygon = hexVerts.map(
    (coordinateSet: Array<Array<CoordPair>>) => (
      <Polygon
        key={hexVerts.indexOf(coordinateSet)}
        color="green"
        positions={coordinateSet}
      />
    ),
  )

  return (
    <>
      {renderedPolygon}
      <CleanButton changeCleanButton={setIsPressed} isPressed={isPressed} />
      <FeatureGroup>
        <EditControl
          onMounted={(mapInstance: L.Map) => {
            editRef.current = mapInstance
          }}
          position="bottomleft"
          onCreated={handleOnShapeDrawn}
          onDrawVertex={handleOnVertexDraw}
          //here you can specify your shape options and which handler you want to enable
          draw={{
            rectangle: false,
            circle: false,
            polyline: false,
            circlemarker: false,
            marker: false,
            polygon: {
              allowIntersection: false,
              shapeOptions: {
                color: 'black',
                fillColor: isPressed ? 'red' : 'green',
              },
            },
          }}
        />
      </FeatureGroup>
      <DrawingButtons
        polygon={polygon}
        hasPolygon={hasPolygon}
        isDrawing={isDrawing}
        hasShape={hasShape}
        map={map}
        isPressed={isPressed}
        polygonStuff={polygonStuff}
        polygonHandler={polygonHandler}
        setIsDrawing={setIsDrawing}
        setHasShape={setHasShape}
        setHasPolygon={setHasPolygon}
        setPolygon={setPolygon}
      />
    </>
  )
}
