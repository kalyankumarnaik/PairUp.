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

export const HomePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [recommendations, setRecommendations] = useState<DiscoveryCard[]>([]);
  const [rooms, setRooms] = useState<VoiceRoom[]>([]);
  const [events, setEvents] = useState<SocialEvent[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [matchesRes, feedRes, roomsRes, eventsRes] = await Promise.all([
        apiClient.getMatches(),
        apiClient.getDiscoveryFeed(),
        apiClient.getVoiceRooms(),
        apiClient.getEvents()
      ]);

      if (matchesRes.data) setMatches(matchesRes.data);
      if (feedRes.data) setRecommendations(feedRes.data.slice(0, 4));
      if (roomsRes.data) setRooms(roomsRes.data.slice(0, 2));
      if (eventsRes.data) setEvents(eventsRes.data.slice(0, 2));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  const completeness = profile?.completenessScore || 40;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet via-coral to-peach text-white shadow-xl shadow-violet/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <span>✨ Welcome back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold">
            Hello, {profile?.displayName || 'Explorer'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
            {matches.length} active matches and new members waiting to meet you in {profile?.city || 'your area'}.
          </p>
        </div>

        <Link
          to="/discover"
          className="px-6 py-3 rounded-2xl bg-white text-violet font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 self-stretch sm:self-auto justify-center"
        >
          <Sparkles className="w-4 h-4 text-coral" />
          <span>Launch Swipe Deck</span>
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
                <div className="flex items-center gap-1 text-[11px] font-bold text-violet px-2.5 py-1 rounded-full bg-white shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
                  <span>{room.activeCount} live</span>
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
