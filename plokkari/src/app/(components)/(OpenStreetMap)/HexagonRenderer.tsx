import { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";
import { useMap, Polygon } from "react-leaflet";

type GetHexProps = {
  triggerGetHexFunction: React.MutableRefObject<() => void>;
};

type DataProps = {
  Clean: {
    coordinates: LatLngExpression[][];
  } | null;
  Dirty: {
    coordinates: LatLngExpression[][];
  } | null;
};

export const HexagonRenderer = ({ triggerGetHexFunction }: GetHexProps) => {
  const [data, setData] = useState<DataProps | null>(null);
  const map = useMap();

  useEffect(() => {
    map.on("moveend", () => {
      const getHex = () => {
        let location = {
          east: map.getBounds().getEast() + 0.005,
          west: map.getBounds().getWest() - 0.005,
          south: map.getBounds().getSouth() - 0.005,
          north: map.getBounds().getNorth() + 0.005,
        };
        fetch(
          `https://plokkari-api-service.azurewebsites.net/api/Trash/polygon?LowerLatBound=${location.south}&LowerLngBound=${location.west}&UpperLatBound=${location.north}&UpperLngBound=${location.east}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data !== null) {
              setData(data);
            }
          });
      };
      getHex();
      triggerGetHexFunction.current = getHex;
    });
  }, [triggerGetHexFunction, map]);

  console.log("data:", data);

  const cleanCoordinates = (
    coordinates: LatLngExpression[][]
  ): JSX.Element[] => {
    return coordinates.map((x: LatLngExpression[], index: number) => (
      <Polygon key={index} fillColor="green" color="black" positions={x} />
    ));
  };

  const cleanHex = data?.Clean ? (
    cleanCoordinates(data.Clean.coordinates)
  ) : (
    <p>asdf</p>
  );
  const dirtyHex = data?.Dirty ? (
    cleanCoordinates(data.Dirty.coordinates)
  ) : (
    <p>asdf</p>
  );

  return (
    <div>
      {cleanHex}
      {dirtyHex}
    </div>
  );
};
