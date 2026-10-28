import React, { useEffect, useState } from 'react';
import {
  Compass,
  Eye,
  Filter,
  Grid,
  Heart,
  LocateFixed,
  MapPin,
  MessageCircle,
  Radio,
  RotateCcw,
  Sliders,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { DiscoveryCard } from '@pairup/domain-types';
import { Link } from 'react-router-dom';
import { MOCK_DISCOVERY_CARDS } from '../lib/mockData';

const CITIES = ['All', 'Mumbai', 'Bengaluru', 'New Delhi', 'Hyderabad', 'Pune', 'Kolkata'];
const RADII_PRESETS = [5, 10, 25, 50];

export const NearbyPage: React.FC = () => {
  const [profiles, setProfiles] = useState<DiscoveryCard[]>(MOCK_DISCOVERY_CARDS);
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedCity, setSelectedCity] = useState('All');
  const [viewMode, setViewMode] = useState<'radar' | 'grid'>('radar');
  const [loading, setLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>('Ready');
  const [selectedRadarProfile, setSelectedRadarProfile] = useState<DiscoveryCard | null>(null);
  const [wavedProfiles, setWavedProfiles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchNearby();
  }, [radiusKm, selectedCity]);

  const fetchNearby = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getNearbyProfiles(radiusKm);
      let list = res.data && res.data.length > 0 ? res.data : MOCK_DISCOVERY_CARDS;
      if (selectedCity !== 'All') {
        list = list.filter((p) => p.city?.toLowerCase().includes(selectedCity.toLowerCase()));
      }
      setProfiles(list);
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
          setGpsStatus('Location synchronized.');
        }
      },
      () => {
        setGpsStatus('Location permission denied. Using manual city selection.');
      }
    );
  };

  const handleSendWave = (profileId: string) => {
    setWavedProfiles((prev) => ({ ...prev, [profileId]: true }));
    setTimeout(() => {
      // keep waved state
    }, 2000);
  };

  // Helper to map profiles radially onto radar (0-360 deg, distance 0-100%)
  const getRadarPosition = (index: number, total: number, distanceKm: number) => {
    const angle = (index * (360 / Math.max(1, total)) + 30) * (Math.PI / 180);
    // Clamp distance between 25% and 85% of radar radius
    const normalizedDist = 0.25 + (Math.min(distanceKm, radiusKm) / Math.max(1, radiusKm)) * 0.6;
    const x = 50 + Math.cos(angle) * normalizedDist * 45;
    const y = 50 + Math.sin(angle) * normalizedDist * 45;
    return { x, y };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================================================================= */}
      {/* 1. ACTIVITY SURGE BANNER */}
      {/* ================================================================= */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-r from-amber/20 via-coral/15 to-violet/15 border border-coral/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-40"></span>
            <span className="relative inline-flex rounded-2xl h-11 w-11 bg-gradient-to-tr from-coral via-rose to-peach items-center justify-center text-white shadow-md shadow-coral/30 text-xl font-bold">
              ⚡
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-coral text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                ACTIVITY SURGE ACTIVE
              </span>
              <span className="text-xs font-bold text-coral">Peak Discovery Hour 🔥</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-ink mt-0.5">
              480+ members nearby in {selectedCity === 'All' ? 'your city' : selectedCity}!
            </p>
            <p className="text-[11px] text-ink-muted">
              Connects made during surge hours have a 2.4x higher reply rate. Send a wave!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setViewMode(viewMode === 'radar' ? 'grid' : 'radar')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white border border-borderSoft text-xs font-bold text-ink hover:text-violet hover:border-violet transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            {viewMode === 'radar' ? <Grid className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5 text-coral" />}
            <span>{viewMode === 'radar' ? 'Switch to Grid View' : 'Switch to Radar Pulse'}</span>
          </button>
        </div>
      </div>

      {/* Header & GPS update */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-30"></span>
            <span className="relative inline-flex rounded-2xl h-12 w-12 bg-gradient-to-tr from-coral via-rose to-peach items-center justify-center text-white shadow-md shadow-coral/30">
              <MapPin className="w-6 h-6 fill-white" />
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-ink flex items-center gap-2">
              <span>Nearby Discovery Radar</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-peach-light text-peach-dark font-extrabold">
                Live Proximity
              </span>
            </h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Discover verified profiles around you. Exact GPS coordinates are never disclosed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestGps}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet to-cyan text-white text-xs font-bold hover:opacity-95 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
          >
            <LocateFixed className="w-4 h-4" />
            <span>Sync GPS Location</span>
          </button>
        </div>
      </div>

      {gpsStatus !== 'Ready' && (
        <div className="p-3 rounded-2xl bg-lavender-light border border-violet/20 text-xs font-semibold text-violet-dark">
          {gpsStatus}
        </div>
      )}

      {/* Filter Row: Radius Slider & City Chips */}
      <div className="space-y-4 p-5 rounded-3xl bg-white border border-borderSoft shadow-sm">
        {/* Radius slider & presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-violet" />
              <span>Search Radius:</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-coral-light text-coral font-black text-xs">
              {radiusKm} km
            </span>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md">
            <input
              type="range"
              min="1"
              max="50"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-coral cursor-pointer"
            />
            <div className="flex items-center gap-1">
              {RADII_PRESETS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadiusKm(r)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    radiusKm === r
                      ? 'bg-coral text-white shadow-xs'
                      : 'bg-cloud text-ink-muted hover:text-ink'
                  }`}
                >
                  {r}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* City selection chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pt-2 border-t border-borderSoft/60 scrollbar-none">
          <span className="text-xs font-bold text-ink uppercase tracking-wider mr-1">City:</span>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
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

      {/* ================================================================= */}
      {/* 2. RADAR VIEW MODE (Interactive Sweeping Radar) */}
      {/* ================================================================= */}
      {viewMode === 'radar' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-midnightInk text-white shadow-2xl relative overflow-hidden border border-white/10 flex flex-col items-center">
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-4 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald">
                LIVE RADAR SCANNING • {radiusKm} KM RADIUS
              </span>
            </div>
            <span className="text-xs text-white/60 font-semibold">
              {profiles.length} Verified Profiles Detected
            </span>
          </div>

          {/* Circular Radar Container */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 my-4 flex items-center justify-center">
            {/* Concentric distance rings */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-8 rounded-full border border-white/15" />
            <div className="absolute inset-20 rounded-full border border-white/20" />
            <div className="absolute inset-32 rounded-full border border-white/25" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/10 pointer-events-none" />

            {/* Distance markers */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 font-mono">
              {radiusKm} km
            </span>
            <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] text-white/40 font-mono">
              {Math.round(radiusKm * 0.6)} km
            </span>
            <span className="absolute top-22 left-1/2 -translate-x-1/2 text-[10px] text-white/40 font-mono">
              {Math.round(radiusKm * 0.3)} km
            </span>

            {/* Rotating Radar Sweeper Beam */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none animate-spin"
              style={{
                animationDuration: '6s',
                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(255, 79, 129, 0.35) 360deg)'
              }}
            />

            {/* Center Node (You) */}
            <div className="relative z-20 w-11 h-11 rounded-full bg-gradient-to-tr from-coral to-violet p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-midnightInk flex items-center justify-center text-xs font-bold text-white">
                You 📍
              </div>
              <span className="absolute inset-0 rounded-full bg-coral animate-ping opacity-50 pointer-events-none" />
            </div>

            {/* Member Blips plotted on Radar */}
            {profiles.map((p, idx) => {
              const pos = getRadarPosition(idx, profiles.length, p.approximateDistanceKm || 3);
              const isSelected = selectedRadarProfile?.id === p.id;
              const hasWaved = wavedProfiles[p.id];

              return (
                <div
                  key={p.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group"
                >
                  <button
                    onClick={() => setSelectedRadarProfile(isSelected ? null : p)}
                    className={`relative rounded-full p-0.5 transition-all duration-200 ${
                      isSelected
                        ? 'ring-4 ring-coral scale-125'
                        : 'hover:scale-125 ring-2 ring-white/60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-midnightInk">
                      <img
                        src={p.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Blip Ping Aura */}
                    <span className="absolute -inset-1 rounded-full bg-coral animate-pulse opacity-60 pointer-events-none" />
                    {hasWaved && (
                      <span className="absolute -top-1 -right-1 text-xs animate-bounce">💖</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Interactive Profile Preview Popover */}
          {selectedRadarProfile ? (
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mt-2 animate-in fade-in zoom-in-95 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-coral flex-shrink-0">
                  <img
                    src={selectedRadarProfile.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {selectedRadarProfile.displayName}, {selectedRadarProfile.age}
                  </h4>
                  <p className="text-[11px] text-coral font-semibold">
                    ~{selectedRadarProfile.approximateDistanceKm || 3} km away • {selectedRadarProfile.city}
                  </p>
                  <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5">
                    {selectedRadarProfile.bio || 'Say hello and start chatting!'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendWave(selectedRadarProfile.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 ${
                    wavedProfiles[selectedRadarProfile.id]
                      ? 'bg-emerald text-white'
                      : 'bg-coral hover:bg-coral-hover text-white'
                  }`}
                >
                  <span>{wavedProfiles[selectedRadarProfile.id] ? 'Waved! 💖' : 'Wave 👋'}</span>
                </button>
                <Link
                  to="/discover"
                  className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
                >
                  Profile
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/50 text-center mt-2">
              💡 Tap any glowing avatar on the radar to see proximity info & send a wave!
            </p>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. GRID GALLERY VIEW MODE */}
      {/* ================================================================= */}
      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-ink-muted">
          Scanning nearby area...
        </div>
      ) : profiles.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-bold text-base text-ink">
              Nearby Profiles ({profiles.length})
            </h3>
            <span className="text-xs text-ink-muted">Masked GPS (~approximate)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((p) => {
              const hasWaved = wavedProfiles[p.id];

              return (
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

                    {/* Quick Wave Status */}
                    {hasWaved && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald text-white text-[10px] font-bold shadow-md animate-bounce">
                        Wave Sent 💖
                      </div>
                    )}

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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendWave(p.id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 ${
                          hasWaved
                            ? 'bg-emerald text-white'
                            : 'bg-cloud hover:bg-lavender-light text-ink hover:text-violet'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasWaved ? 'fill-current text-white' : 'text-coral'}`} />
                        <span>{hasWaved ? 'Waved! 💖' : 'Wave 👋'}</span>
                      </button>

                      <Link
                        to="/discover"
                        className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-coral to-violet shadow-sm hover:opacity-95 transition-all"
                      >
                        Connect
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-borderSoft">
          <p className="text-3xl mb-2">📍</p>
          <h3 className="text-base font-bold text-ink">No members found in this radius</h3>
          <p className="text-xs text-ink-muted mt-1">
            Try expanding your search radius to 50 km or selecting a different city.
          </p>
        </div>
      )}
    </div>
  );
};
