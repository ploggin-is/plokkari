import { useMemo } from "react";
import dynamic from "next/dynamic";
import { TopToolbar } from "../(TopToolbar)/TopToolbar";

export const MainPage = () => {
  const OpenStreetMap = useMemo(
    () =>
      dynamic(() => import("../(OpenStreetMap)/OpenStreetMap"), { ssr: false }),
    []
  );
  return (
    <main>
      <TopToolbar />
      <div className="map-container">
        <OpenStreetMap zoomLvl={13} />
      </div>
    </main>
  );
};
