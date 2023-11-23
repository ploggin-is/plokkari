import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Image from 'next/image'

export const CustomMarker = () => {
  const RuIcon = new L.Icon({
    iconUrl: '/RU_logo_no_text.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  })

  return (
    <Marker icon={RuIcon} position={[64.123721, -21.926725]}>
      <Popup>
        <Image
          alt="Reykjavik University Logo"
          src="/RU_logo.png"
          width={200}
          height={0}
        />
        Reykjavík University <br /> Where it all began.
      </Popup>
    </Marker>
  )
}
