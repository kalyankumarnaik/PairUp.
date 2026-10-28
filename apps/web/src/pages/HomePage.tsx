import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Compass,
  Headphones,
  Heart,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { DiscoveryCard, MatchSummary, SocialEvent, VoiceRoom } from '@pairup/domain-types';
import {
  MOCK_DISCOVERY_CARDS,
  MOCK_EVENTS,
  MOCK_MATCHES,
  MOCK_ROOMS
} from '../lib/mockData';

export const HomePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [matches, setMatches] = useState<MatchSummary[]>(MOCK_MATCHES);
  const [recommendations, setRecommendations] = useState<DiscoveryCard[]>(MOCK_DISCOVERY_CARDS.slice(0, 4));
  const [rooms, setRooms] = useState<VoiceRoom[]>(MOCK_ROOMS);
  const [events, setEvents] = useState<SocialEvent[]>(MOCK_EVENTS);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [matchesRes, feedRes, roomsRes, eventsRes] = await Promise.allSettled([
        apiClient.getMatches(),
        apiClient.getDiscoveryFeed(),
        apiClient.getVoiceRooms(),
        apiClient.getEvents()
      ]);

      if (matchesRes.status === 'fulfilled' && matchesRes.value.data?.length) {
        setMatches(matchesRes.value.data);
      }
      if (feedRes.status === 'fulfilled' && feedRes.value.data?.length) {
        setRecommendations(feedRes.value.data.slice(0, 4));
      }
      if (roomsRes.status === 'fulfilled' && roomsRes.value.data?.length) {
        setRooms(roomsRes.value.data.slice(0, 2));
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.data?.length) {
        setEvents(eventsRes.value.data.slice(0, 2));
      }
    } catch {
      // Keep mock fallback data
    }
  };

  const completeness = profile?.completenessScore || 40;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet via-coral to-peach bg-[length:200%_200%] animate-gradient-xy text-white shadow-xl shadow-coral/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Ambient floating orbs inside banner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-coral/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider mb-2.5 shadow-sm">
            <span className="animate-spin text-sm" style={{ animationDuration: '5s' }}>✨</span>
            <span>Welcome back</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
            Hello, {profile?.displayName || 'Explorer'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/95 mt-1.5 max-w-xl font-medium leading-relaxed">
            {matches.length} active matches and new people nearby waiting to meet you in {profile?.city || 'Mumbai'}.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
          <Link
            to="/discover"
            className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-white text-violet hover:text-coral font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-coral animate-bounce" />
            <span>Launch Swipe Deck</span>
          </Link>
          <Link
            to="/rooms"
            className="flex-1 sm:flex-initial px-5 py-3.5 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Headphones className="w-4 h-4" />
            <span>Audio Stage</span>
          </Link>
        </div>
      </div>

      {/* Live Activity Surge Banner */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-r from-amber/15 via-coral/10 to-violet/10 border border-coral/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-40"></span>
            <span className="relative inline-flex rounded-2xl h-11 w-11 bg-gradient-to-tr from-amber via-coral to-rose items-center justify-center text-white shadow-md shadow-coral/30 text-xl font-bold">
              ⚡
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-coral text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                LIVE ACTIVITY SURGE
              </span>
              <span className="text-xs font-bold text-coral">2.4x Match Probability 🔥</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-ink mt-0.5">
              480+ verified members active in your area right now!
            </p>
            <p className="text-[11px] text-ink-muted">
              Peak social discovery window: Profiles active now receive faster responses and instant connects.
            </p>
          </div>
        </div>

        <Link
          to="/nearby"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <span>Join the Surge Radar</span>
          <span>→</span>
        </Link>
      </div>

      {/* Colorful Quick Discovery Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          to="/discover?mode=DATING"
          className="p-4 rounded-2xl bg-gradient-to-br from-coral-light to-rose-light/50 border border-coral/20 hover:border-coral hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral to-rose flex items-center justify-center text-white shadow-md shadow-coral/30 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink group-hover:text-coral transition-colors">Dating Deck</p>
            <p className="text-[10px] text-coral font-medium">Romantic Spark 💖</p>
          </div>
        </Link>

        <Link
          to="/discover?mode=FRIENDSHIP"
          className="p-4 rounded-2xl bg-gradient-to-br from-violet-light to-lavender-light border border-violet/20 hover:border-violet hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet to-purple flex items-center justify-center text-white shadow-md shadow-violet/30 group-hover:scale-110 transition-transform">
            <span className="text-lg">🫶</span>
          </div>
          <div>
            <p className="text-xs font-bold text-ink group-hover:text-violet transition-colors">Find Friends</p>
            <p className="text-[10px] text-violet font-medium">Genuine Bonds ✨</p>
          </div>
        </Link>

        <Link
          to="/nearby"
          className="p-4 rounded-2xl bg-gradient-to-br from-peach-light to-amber-light/50 border border-peach/20 hover:border-peach hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-peach to-amber flex items-center justify-center text-white shadow-md shadow-peach/30 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink group-hover:text-peach-dark transition-colors">Nearby Radar</p>
            <p className="text-[10px] text-peach-dark font-medium">Radius 5–50km 📍</p>
          </div>
        </Link>

        <Link
          to="/rooms"
          className="p-4 rounded-2xl bg-gradient-to-br from-cyan-light to-mint-light/50 border border-cyan/20 hover:border-cyan hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan to-mint flex items-center justify-center text-white shadow-md shadow-cyan/30 group-hover:scale-110 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink group-hover:text-cyan-dark transition-colors">Voice Rooms</p>
            <p className="text-[10px] text-cyan-dark font-medium">Live Audio 🎧</p>
          </div>
        </Link>
      </div>

      {/* Profile Completeness Bar */}
      <div className="p-5 rounded-3xl bg-white border border-borderSoft shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-violet" />
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              Profile Completeness
            </span>
          </div>
          <span className="text-xs font-bold text-violet">{completeness}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-cloud overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-coral to-violet transition-all duration-500 rounded-full"
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 80 && (
          <p className="text-[11px] text-ink-muted mt-2">
            Tip: Complete your profile prompts and upload photos to boost your match rate by 3x!{' '}
            <Link to="/profile" className="text-violet font-bold hover:underline">
              Edit profile →
            </Link>
          </p>
        )}
      </div>

      {/* New Matches Shelf */}
      {matches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-ink flex items-center gap-2">
              <Heart className="w-5 h-5 text-coral fill-coral" />
              <span>Your Matches</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-coral-light text-coral font-bold">
                {matches.length}
              </span>
            </h2>
            <Link to="/matches" className="text-xs font-bold text-violet hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {matches.map((m) => (
              <Link
                key={m.id}
                to="/messages"
                className="group p-3 rounded-2xl bg-white border border-borderSoft hover:border-violet/40 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-coral/40 group-hover:ring-coral transition-all mb-2">
                  <img
                    src={m.matchedProfile.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt={m.matchedProfile.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-success ring-2 ring-white"></span>
                </div>
                <p className="text-xs font-bold text-ink truncate">{m.matchedProfile.displayName}</p>
                <p className="text-[10px] text-ink-muted truncate">{m.matchedProfile.city}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Profiles Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-ink flex items-center gap-2">
            <Compass className="w-5 h-5 text-violet" />
            <span>Recommended for You</span>
          </h2>
          <Link to="/discover" className="text-xs font-bold text-violet hover:underline">
            Swipe Mode →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((card) => (
            <Link
              key={card.id}
              to="/discover"
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-borderSoft"
            >
              <img
                src={card.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
                alt={card.displayName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnightInk via-transparent to-transparent" />
              <div className="absolute bottom-3 inset-x-3 text-white">
                <p className="font-display font-bold text-base">
                  {card.displayName}, {card.age}
                </p>
                <p className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-peach" /> {card.city}
                </p>
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {card.interests.slice(0, 2).map((int) => (
                    <span key={int.id} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/20 font-medium">
                      {int.emoji} {int.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Voice Rooms & Activities Dual Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Rooms */}
        <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-bold text-ink flex items-center gap-2">
              <Headphones className="w-5 h-5 text-coral" />
              <span>Active Voice Hangouts</span>
            </h3>
            <Link to="/rooms" className="text-xs font-bold text-violet hover:underline">
              Join Room →
            </Link>
          </div>

          <div className="space-y-3">
            {rooms.map((room) => (
              <Link
                key={room.id}
                to="/rooms"
                className="p-3.5 rounded-2xl bg-cloud hover:bg-lavender-light border border-borderSoft hover:border-violet/30 transition-all flex items-center justify-between block"
              >
                <div>
                  <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <span>{room.emoji}</span>
                    <span>{room.title}</span>
                  </p>
                  <p className="text-[10px] text-ink-muted mt-0.5">Host: {room.hostName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-end gap-0.5 h-5 px-1 hidden sm:flex">
                    <span className="w-1 bg-coral rounded-full equalizer-bar"></span>
                    <span className="w-1 bg-violet rounded-full equalizer-bar"></span>
                    <span className="w-1 bg-peach rounded-full equalizer-bar"></span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-violet px-2.5 py-1 rounded-full bg-white shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
                    <span>{room.activeCount} live</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Social Events */}
        <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-bold text-ink flex items-center gap-2">
              <Calendar className="w-5 h-5 text-peach" />
              <span>Local Discovery Events</span>
            </h3>
            <Link to="/events" className="text-xs font-bold text-violet hover:underline">
              Browse All →
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <Link
                key={event.id}
                to="/events"
                className="p-3.5 rounded-2xl bg-cloud hover:bg-peach-light border border-borderSoft hover:border-peach/30 transition-all flex items-center justify-between block"
              >
                <div>
                  <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <span>{event.emoji}</span>
                    <span>{event.title}</span>
                  </p>
                  <p className="text-[10px] text-ink-muted mt-0.5">{event.venueName}</p>
                </div>
                <div className="text-[11px] font-bold text-peach px-2.5 py-1 rounded-full bg-white shadow-xs">
                  {event.registeredCount}/{event.capacity} Attending
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
