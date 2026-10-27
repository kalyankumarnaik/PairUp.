import React, { useEffect, useState } from 'react';
import {
  Compass,
  Filter,
  LocateFixed,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { DiscoveryCard } from '@pairup/domain-types';
import { Link } from 'react-router-dom';
import { MOCK_DISCOVERY_CARDS } from '../lib/mockData';

const CITIES = ['All', 'Mumbai', 'Bengaluru', 'New Delhi', 'Hyderabad', 'Pune', 'Kolkata'];
const RADII = [5, 10, 25, 50];

export const NearbyPage: React.FC = () => {
  const [profiles, setProfiles] = useState<DiscoveryCard[]>(MOCK_DISCOVERY_CARDS);
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedCity, setSelectedCity] = useState('All');
  const [isLocationPaused, setIsLocationPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>('Ready');

  useEffect(() => {
    fetchNearby();
  }, [radiusKm, selectedCity]);

  const fetchNearby = async () => {
    try {
      const res = await apiClient.getNearbyProfiles(radiusKm);
      if (res.data && res.data.length > 0) {
        let list = res.data;
        if (selectedCity !== 'All') {
          list = list.filter((p) => p.city?.toLowerCase().includes(selectedCity.toLowerCase()));
        }
        setProfiles(list);
      } else {
        let list = MOCK_DISCOVERY_CARDS;
        if (selectedCity !== 'All') {
          list = list.filter((p) => p.city?.toLowerCase().includes(selectedCity.toLowerCase()));
        }
        setProfiles(list);
      }
    } catch {
      let list = MOCK_DISCOVERY_CARDS;
      if (selectedCity !== 'All') {
        list = list.filter((p) => p.city?.toLowerCase().includes(selectedCity.toLowerCase()));
      }
      setProfiles(list);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by browser');
      return;
    }

    setGpsStatus('Acquiring location...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await apiClient.updateLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setGpsStatus('Location updated via GPS! 📍');
          fetchNearby();
        } catch {
          setGpsStatus('Failed to sync location to server');
        }
      },
      (err) => {
        setGpsStatus('Location permission denied. Using manual city selection.');
      }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink flex items-center gap-2">
            <MapPin className="w-6 h-6 text-coral" />
            <span>Nearby Discovery Radar</span>
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Discover verified profiles around you. Exact GPS coordinates are never disclosed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestGps}
            className="px-3.5 py-2 rounded-xl bg-violet-light text-violet text-xs font-bold hover:bg-violet hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
          >
            <LocateFixed className="w-4 h-4" />
            <span>Update GPS</span>
          </button>
        </div>
      </div>

      {gpsStatus !== 'Ready' && (
        <div className="p-3 rounded-2xl bg-lavender-light border border-violet/20 text-xs font-semibold text-violet-dark">
          {gpsStatus}
        </div>
      )}

      {/* Filter Row: Radius & City fallback */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-borderSoft">
        {/* Radius selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">Radius:</span>
          <div className="flex items-center gap-1">
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  radiusKm === r
                    ? 'bg-coral text-white shadow-xs'
                    : 'bg-cloud text-ink-muted hover:text-ink'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* City selection chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs font-bold text-ink uppercase tracking-wider mr-1">City:</span>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCity === c
                  ? 'bg-violet text-white font-bold shadow-xs'
                  : 'bg-cloud text-ink-muted hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-ink-muted">
          Scanning nearby area...
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="group rounded-3xl overflow-hidden bg-white border border-borderSoft shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-72 overflow-hidden bg-midnightInk">
                <img
                  src={p.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'}
                  alt={p.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnightInk via-transparent to-transparent" />

                {/* Distance Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-midnightInk/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-peach" />
                  <span>~{p.approximateDistanceKm || 3} km away</span>
                </div>

                {/* Name & City */}
                <div className="absolute bottom-3 inset-x-3 text-white">
                  <h3 className="font-display font-bold text-lg leading-tight">
                    {p.displayName}, {p.age}
                  </h3>
                  <p className="text-xs text-white/80">{p.city}</p>
                </div>
              </div>

              {/* Bio & Interests */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-ink-muted line-clamp-2 mb-3">
                  {p.bio || 'Say hello and start a conversation!'}
                </p>

                <div className="flex items-center gap-1 flex-wrap mb-4">
                  {p.interests.slice(0, 3).map((int) => (
                    <span
                      key={int.id}
                      className="px-2 py-0.5 rounded-lg bg-cloud text-[10px] font-medium text-ink"
                    >
                      {int.emoji} {int.name}
                    </span>
                  ))}
                </div>

                <Link
                  to="/discover"
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-coral to-violet shadow-sm hover:opacity-95 transition-all"
                >
                  Connect in Swipe Deck
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-borderSoft">
          <p className="text-3xl mb-2">📍</p>
          <h3 className="text-base font-bold text-ink">No members found in this radius</h3>
          <p className="text-xs text-ink-muted mt-1">
            Try expanding your search to 50 km or picking a different city.
          </p>
        </div>
      )}
    </div>
  );
};
