import { useState, useEffect, useCallback} from 'react'
import { useMap, Polygon } from 'react-leaflet'

function GetHex(props) {
    const [data, setData] = useState(null);  
    const map = useMap();
    // const h3 = require("h3-js");
    const boundedHex = [];
    let number = 0;
    const {triggerGetHexFunction} = props;
    
    const getHex = useCallback(() => {
      let location = {
        east: map.getBounds().getEast() + 0.005,
        west: map.getBounds().getWest() - 0.005,
        south: map.getBounds().getSouth() - 0.005,
        north: map.getBounds().getNorth() + 0.005,
      };
      fetch(`https://plokkari-api-service.azurewebsites.net/api/Trash/polygon?LowerLatBound=${location.south}&LowerLngBound=${location.west}&UpperLatBound=${location.north}&UpperLngBound=${location.east}`)
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setData(data);
          }
        });
    }, [map]);


    useEffect(() => {
      triggerGetHexFunction.current = getHex;
      map.on('moveend', function() { 
           getHex();
      })
    }, []);

    console.log(data);
    
    if (data !== null) {

      console.log(data);
      const cleanBoundaries = data.Clean;
      if(cleanBoundaries != null){
          cleanBoundaries.coordinates.forEach((x, index) => {
          boundedHex.push(<Polygon key={index} fillColor={'green'} color={'black'} positions={x} />)
          
        })
      } 
      const dirtyBoundaries = data.Dirty;
      if(dirtyBoundaries != null){
        dirtyBoundaries.coordinates.forEach((x, index) => {
          boundedHex.push(<Polygon key={index} color={'red'} positions={x} />)
          
        })
      } 
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