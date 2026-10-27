import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Plus,
  Users,
  X
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { SocialEvent } from '@pairup/domain-types';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Create event modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Social Mixer');
  const [venueName, setVenueName] = useState('');
  const [approxLocation, setApproxLocation] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [capacity, setCapacity] = useState(30);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getEvents();
      if (res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRsvp = async (eventId: string, isRegistered?: boolean) => {
    try {
      if (isRegistered) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? { ...e, isRegistered: false, registeredCount: Math.max(0, e.registeredCount - 1) }
              : e
          )
        );
      } else {
        const res = await apiClient.registerEvent(eventId);
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 }
              : e
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venueName.trim()) return;

    try {
      // In local mode, add to list
      const newEvt: SocialEvent = {
        id: `evt_${Date.now()}`,
        title,
        description,
        category,
        emoji: '🎉',
        venueName,
        approximateLocation: approxLocation || venueName,
        city,
        startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        endTime: new Date(Date.now() + 86400000 * 3 + 3600000 * 3).toISOString(),
        capacity: Number(capacity),
        registeredCount: 1,
        isRegistered: true,
        organizer: {
          id: 'usr_me',
          displayName: 'You',
          avatarUrl: null
        },
        status: 'SCHEDULED' as any,
        createdAt: new Date().toISOString()
      };

      setEvents((prev) => [newEvt, ...prev]);
      setShowModal(false);
      setTitle('');
      setDescription('');
      setVenueName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink flex items-center gap-2">
            <Calendar className="w-6 h-6 text-peach" />
            <span>Local Discovery Events</span>
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Real meetups, cafe mixers, board game nights, and indie concert hangouts.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-violet text-white text-xs font-bold shadow-md hover:bg-violet-hover transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Host an Event</span>
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-ink-muted">
          Loading events...
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const isFull = evt.registeredCount >= evt.capacity;

            return (
              <div
                key={evt.id}
                className="rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{evt.emoji}</span>
                    <span className="text-[11px] font-bold text-violet px-3 py-1 rounded-full bg-lavender">
                      {evt.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink mb-1">{evt.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-4">
                    {evt.description}
                  </p>

                  <div className="space-y-2 text-xs text-ink-muted border-t border-borderSoft pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-coral" />
                      <span className="text-ink font-medium truncate">{evt.venueName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-violet" />
                      <span>
                        {new Date(evt.startTime).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-peach" />
                      <span>
                        {evt.registeredCount} of {evt.capacity} spots filled
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cloud border-t border-borderSoft">
                  <button
                    onClick={() => handleToggleRsvp(evt.id, evt.isRegistered)}
                    disabled={isFull && !evt.isRegistered}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      evt.isRegistered
                        ? 'bg-success text-white'
                        : isFull
                        ? 'bg-ink-muted/30 text-ink-muted cursor-not-allowed'
                        : 'bg-violet text-white hover:bg-violet-hover'
                    }`}
                  >
                    {evt.isRegistered
                      ? '✓ Registered (Cancel)'
                      : isFull
                      ? 'Event Full'
                      : 'RSVP & Join Event'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-borderSoft">
          <p className="text-3xl mb-2">🎉</p>
          <h3 className="text-base font-bold text-ink">No upcoming events yet</h3>
        </div>
      )}

      {/* Host Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-ink">Host a Social Event</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-cloud text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunset Acoustic Jam & Mixer"
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Venue Name & Area
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Subko Coffee Roastery, Bandra"
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Capacity Limit
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people what to expect, what to bring..."
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-coral to-violet text-xs shadow-md mt-2"
              >
                Publish Event 🎉
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
