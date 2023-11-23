import { Dispatch, SetStateAction } from 'react'

import { CoastLineCoordinates, CoastLineDataProps } from '../types/types'

export const fetchCoastlineData = async (
  setCoastlineData: Dispatch<SetStateAction<CoastLineDataProps | null>>,
) => {
  try {
    const wfsUrl =
      await 'https://gis.lmi.is/geoserver/umhverfisraduneytid/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=umhverfisraduneytid%3Aloka&maxFeatures=100000&outputFormat=application%2Fjson'
    const response = await fetch(wfsUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const coastlineData: CoastLineDataProps = await response.json()
    setCoastlineData(coastlineData)
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error)
  }
}

export const initializeCoastlineData = (
  setCoastlineData: Dispatch<SetStateAction<CoastLineDataProps | null>>,
  setMapCenter: Dispatch<SetStateAction<CoastLineCoordinates | null>>,
) => {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
  }

  fetchCoastlineData(setCoastlineData)

  // Check for geolocation support
  if ('geolocation' in navigator) {
    // Attempt to get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Save the location
        setMapCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Error getting location', error)

        // In case of an error, show Reykjavík University
        setMapCenter({
          latitude: 64.124025,
          longitude: -21.925479,
        })
      },
      options,
    )
  } else {
    console.error('Geolocation is not supported by this browser.')

    // In case of an error, show Reykjavík University
    setMapCenter({
      latitude: 64.124025,
      longitude: -21.925479,
    })
  }
}
