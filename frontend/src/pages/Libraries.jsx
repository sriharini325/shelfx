import { useEffect, useState } from 'react';
import api from '../api/axios';
import LibraryMap from '../components/LibraryMap';

export default function Libraries() {
  const [libraries, setLibraries] = useState([]);
  const [nearby, setNearby] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    api.get('/libraries').then(({ data }) => setLibraries(data.libraries));
  }, []);

  const findNearby = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        try {
          const { data } = await api.get('/libraries/nearby', {
            params: { lat: latitude, lng: longitude, radiusKm: 25 },
          });
          setNearby(data.libraries);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocationError('Could not access your location. Check browser permissions.');
        setLocating(false);
      }
    );
  };

  const displayLibraries = nearby ?? libraries;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink-50">Libraries</h1>
          <p className="text-ink-500 mt-1">Browse the ShelfX network, or find what's nearby.</p>
        </div>
        <button onClick={findNearby} disabled={locating} className="btn-primary shrink-0">
          {locating ? 'Locating…' : 'Find libraries near me'}
        </button>
      </div>

      {locationError && (
        <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 mb-6">
          {locationError}
        </p>
      )}

      <div className="mb-10">
        <LibraryMap libraries={displayLibraries} userLocation={userLocation} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayLibraries.map((lib) => (
          <div key={lib.id} className="card p-5">
            <h3 className="font-display text-lg text-ink-50">{lib.name}</h3>
            <p className="text-sm text-ink-500 mt-1">{lib.address}, {lib.city}</p>
            {typeof lib.distanceKm === 'number' && (
              <p className="text-xs text-shelf-400 mt-2 font-mono">{lib.distanceKm} km away</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-500">
              {lib.openingHours && <span>🕐 {lib.openingHours}</span>}
              {lib.contactPhone && <span>☎ {lib.contactPhone}</span>}
            </div>
            {!lib.hasApiIntegration && (
              <p className="text-[11px] text-ink-600 mt-3 font-mono">Inventory managed manually by admin</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
