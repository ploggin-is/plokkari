import { useState, useEffect, useRef} from 'react'
import { useMap, Polygon, Marker, Polyline } from 'react-leaflet'

function GetHex(props) {
    const [data, setData] = useState(null);  
    const map = useMap();
    // const h3 = require("h3-js");
    const boundedHex = [];
    let number = 0;
    const {triggerGetHexFunction} = props;
    
    const getHex = () =>  {
      let location = {east: map.getBounds().getEast() + 0.005, west:  map.getBounds().getWest() - 0.005, south: map.getBounds().getSouth() - 0.005, north: map.getBounds().getNorth() + 0.005};
        // fetch(`https://www.api.plokkari.is/api/Trash?LowerLatBound=${location.south}&LowerLngBound=${location.west}&UpperLatBound=${location.north}&UpperLngBound=${location.east}`)
        fetch(`https://plokkari-api-service.azurewebsites.net/api/Trash/polygon?LowerLatBound=${location.south}&LowerLngBound=${location.west}&UpperLatBound=${location.north}&UpperLngBound=${location.east}`)
            .then(res => res.json())
            .then( data => {
                if (data !== null) {
                  setData(data)                
                }
            })        
    };


    useEffect(() => {
      triggerGetHexFunction.current = getHex;
      map.on('moveend', function() { 
           getHex();
      })
    }, []);
    
    if (data !== null) {

      // const cleancoordinates = h3.h3SetToMultiPolygon(data.clean, false);
      // cleancoordinates.forEach((data) => {
      //   boundedHex.push(<Polygon color={'green'} key={number = number +1} positions={data}/>)
      // })
      console.log(data);
      const cleanBoundaries = data.Clean;
      if(cleanBoundaries != null){
          cleanBoundaries.coordinates.forEach((x, index) => {
          // console.log(x);
          boundedHex.push(<Polygon key={index} fillColor={'green'} color={'black'} positions={x} />)
          
        })
      } 
      const dirtyBoundaries = data.Dirty;
      if(dirtyBoundaries != null){
        dirtyBoundaries.coordinates.forEach((x, index) => {
          // console.log(x);
          boundedHex.push(<Polygon key={index} color={'red'} positions={x} />)
          
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
    return data === null ? (
      <p>asdf</p>    
      ) : (
      <div>
          {boundedHex}  
      </div>  
    )
  }

  export default GetHex