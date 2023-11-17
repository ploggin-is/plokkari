import { MutableRefObject, useEffect, useState } from 'react'
import { Polygon, useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'

type GetHexProps = {
  triggerGetHexFunction: MutableRefObject<(() => void) | null>
}

type DataProps = {
  Clean: {
    coordinates: Array<Array<LatLngExpression>>
  } | null
  Dirty: {
    coordinates: Array<Array<LatLngExpression>>
  } | null
}

export const GetHex = ({ triggerGetHexFunction }: GetHexProps) => {
  const [data, setData] = useState<DataProps | null>(null)
  const map = useMap()
  // const h3 = require("h3-js");
  const boundedHex: Array<JSX.Element> = []
  // const number = 0

  useEffect(() => {
    const getHex = () => {
      const location = {
        east: map.getBounds().getEast() + 0.005,
        west: map.getBounds().getWest() - 0.005,
        south: map.getBounds().getSouth() - 0.005,
        north: map.getBounds().getNorth() + 0.005,
      }
      // fetch(`https://www.api.plokkari.is/api/Trash?LowerLatBound=${location.south}&LowerLngBound=${location.west}&UpperLatBound=${location.north}&UpperLngBound=${location.east}`)
      fetch(
        `https://plokkari-api-service.azurewebsites.net/api/Trash/polygon?LowerLatBound=${location.south}&LowerLngBound=${location.west}&UpperLatBound=${location.north}&UpperLngBound=${location.east}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setData(data)
          }
        })
    }

    const moveEndHandler = () => {
      getHex()
      triggerGetHexFunction.current = getHex
    }

    map.on('moveend', moveEndHandler)

    return () => {
      map.off('moveend', moveEndHandler)
    }
  }, [map, triggerGetHexFunction, setData])

  if (data !== null) {
    // const cleancoordinates = h3.h3SetToMultiPolygon(data.clean, false);
    // cleancoordinates.forEach((data) => {
    //   boundedHex.push(<Polygon color={'green'} key={number = number +1} positions={data}/>)
    // })

    const cleanBoundaries = data.Clean
    if (cleanBoundaries != null) {
      cleanBoundaries.coordinates.forEach((x) => {
        const key = JSON.stringify(x) // Convert coordinates to a string for a unique key
        boundedHex.push(
          <Polygon key={key} fillColor="green" color="black" positions={x} />,
        )
      })
    }
    const dirtyBoundaries = data.Dirty
    if (dirtyBoundaries != null) {
      dirtyBoundaries.coordinates.forEach((x) => {
        const key = JSON.stringify(x) // Convert coordinates to a string for a unique key
        boundedHex.push(<Polygon key={key} color="red" positions={x} />)
      })
    }
    // data.coordinates.foreach(coordList => {
    //   boundedHex.push(<Polygon key={1} color={'green'} positions={coordList} />)

    // })
    // boundedHex.push(<Polygon key={1} color={'green'} positions={data.coordinates} />)

    // const dirtycoordinates = h3.h3SetToMultiPolygon(data.dirty, false);
    // dirtycoordinates.forEach((data) => {
    //   boundedHex.push(<Polygon color={'red'} key={number = number +1} positions={data}/>)
    // })
  }
  return data === null ? <p>asdf</p> : <div>{boundedHex}</div>
}
