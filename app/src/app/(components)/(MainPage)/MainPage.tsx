'use client'

import dynamic from 'next/dynamic'

import { TopToolbar } from '../(TopToolbar)/TopToolbar'

export const MainPage = () => {
  const OpenStreetMap = dynamic(
    () =>
      import('../(OpenStreetMap)/OpenStreetMap').then(
        (module) => module.OpenStreetMap,
      ),
    { ssr: false },
  )

  return (
    <main>
      <TopToolbar />
      <div className="map-container" style={{ position: 'relative' }}>
        <OpenStreetMap zoomLvl={13} />
      </div>
    </main>
  )
}
