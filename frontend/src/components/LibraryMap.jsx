import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// Default Leaflet marker icons don't resolve correctly under bundlers —
// point them at the CDN copies so pins render.
const bookIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#4d84ff;box-shadow:0 0 0 6px rgba(77,132,255,0.25);"></div>',
  iconSize: [16, 16],
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// --- Google Maps alternative -----------------------------------------
// Swap this whole file's contents for `@react-google-maps/api`'s
// <GoogleMap> + <Marker> components if a GOOGLE_MAPS_API_KEY is available;
// the `libraries` / `userLocation` props below are already shaped to drop
// straight into that component instead.
// -----------------------------------------------------------------------

export default function LibraryMap({ libraries, userLocation, height = '420px' }) {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : libraries[0]
    ? [libraries[0].latitude, libraries[0].longitude]
    : [20.5937, 78.9629]; // India centroid fallback

  return (
    <div className="rounded-2xl overflow-hidden border border-ink-600/60" style={{ height }}>
      <MapContainer center={center} zoom={userLocation ? 12 : 5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {libraries.map((lib) => (
          <Marker key={lib.id} position={[lib.latitude, lib.longitude]} icon={bookIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{lib.name}</p>
                <p>{lib.address}, {lib.city}</p>
                {typeof lib.distanceKm === 'number' && <p>{lib.distanceKm} km away</p>}
                {lib.openingHours && <p>{lib.openingHours}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
