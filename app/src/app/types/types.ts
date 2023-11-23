import { EditControl } from 'react-leaflet-draw'
import { CoordPair } from 'h3-js'
import {
  DivIconOptions,
  Handler,
  LatLng,
  LatLngExpression,
  Layer,
} from 'leaflet'

export type Coordinates = Array<Array<LatLngExpression>>

export type HexVerts = Array<Array<Array<CoordPair>>>

export type CustomEditControl = L.Map & {
  _toolbars?: {
    draw: EditControl & {
      _modes: {
        polygon: {
          handler: Handler
        }
      }
    }
    edit?: EditControl & {
      _modes: {
        edit: {
          handler: Handler
        }
      }
    }
  }
}

type SingleCoordinates = {
  lat: number
  lng: number
}

export type CustomPolygonTypes = Layer & {
  _map: L.LayerGroup
  _leaflet_id: number
  _latlngs: Array<LatLng> | Array<Array<LatLng>> | Array<Array<Array<LatLng>>>
  _lastCenter: SingleCoordinates
}

export type CustomPolygonHandlerTypes = {
  completeShape?: () => void
} & Handler

type CustomLayerOptions = {
  icon: {
    options: DivIconOptions
  }
  id: string
} & L.LayerOptions

export type CustomLayer = Layer & {
  _layers: Array<{ options: CustomLayerOptions }>
}

// CoastLine types
export type CoastLineCoordinates = {
  latitude: number
  longitude: number
}

export type CustomMarkerOptions = {
  id?: string
} & L.MarkerOptions

type LineStringGeometry = {
  type: 'LineString'
  coordinates: Array<CoastLineCoordinates>
}

type FeatureProperties = {
  id: number
  hofn: null | string
  lengd: null | string
  name: string
  status: number
}

type CoastLineFeature = {
  type: 'Feature'
  id: string
  geometry: LineStringGeometry
  geometry_name: string
  properties: FeatureProperties
  bbox: [number, number, number, number]
}

export type CoastLineDataProps = {
  bbox?: [number, number, number, number]
  crs?: {
    properties: { name: string }
    type: string
  }
  features: Array<CoastLineFeature>
  numberMatched?: number
  numberReturned?: number
  timeStamp?: string // Assuming the timeStamp is a string in ISO 8601 format
  totalFeatures?: number
  type?: 'FeatureCollection'
}

export type CustomStatistics = {
  areaCleaned: number
} | null
