import React, { useEffect, useState } from 'react';
import {
  Hand,
  Headphones,
  Mic,
  MicOff,
  Plus,
  Radio,
  Sparkles,
  Users,
  Volume2,
  X
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { VoiceRoom, VoiceRoomMember } from '@pairup/domain-types';
import { MOCK_ROOMS } from '../lib/mockData';

export const RoomsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [rooms, setRooms] = useState<VoiceRoom[]>(MOCK_ROOMS);
  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);

  // Create room modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Music & Chai');
  const [newEmoji, setNewEmoji] = useState('🎧');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const res = await apiClient.getVoiceRooms();
      if (res.data && res.data.length > 0) {
        setRooms(res.data);
      }
    } catch {
      // Keep MOCK_ROOMS
    }
  };

  const handleJoinRoom = async (room: VoiceRoom) => {
    try {
      const res = await apiClient.createVoiceRoom({
        title: room.title,
        category: room.category,
        emoji: room.emoji
      });
      setActiveRoom(room);
    } catch {
      setActiveRoom(room);
    }
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setHasRaisedHand(false);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await apiClient.createVoiceRoom({
        title: newTitle.trim(),
        category: newCategory,
        emoji: newEmoji
      });

      if (res.data) {
        setRooms((prev) => [res.data!, ...prev]);
        setActiveRoom(res.data);
        setShowCreateModal(false);
        setNewTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink flex items-center gap-2">
            <Headphones className="w-6 h-6 text-coral" />
            <span>Live Voice Rooms</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-coral-light text-coral font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping"></span>
              <span>Audio Stage</span>
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Drop into live audio conversations. Listen in, raise your hand, and make friends.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Room</span>
        </button>
      </div>

      {/* Active Room Stage Overlay Banner */}
      {activeRoom && (
        <div className="p-6 rounded-3xl bg-midnightInk text-white shadow-xl border border-violet/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{activeRoom.emoji}</span>
              <div>
                <h2 className="text-lg font-display font-bold leading-tight">{activeRoom.title}</h2>
                <p className="text-xs text-white/70">Category: {activeRoom.category}</p>
              </div>
            </div>

            <button
              onClick={handleLeaveRoom}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              Leave Quietly ✌️
            </button>
          </div>

          {/* Speakers Stage */}
          <div className="mb-8">
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">
              Speakers On Stage 🎙️
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              {activeRoom.speakers.map((sp) => (
                <div key={sp.userId} className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-violet shadow-lg mb-2">
                    <img
                      src={sp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 p-1 rounded-full bg-violet text-white">
                      <Mic className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white">{sp.displayName}</p>
                  <span className="text-[10px] text-violet-light font-semibold uppercase">
                    {sp.role}
                  </span>
                </div>
              ))}

              {/* Current user seat if listener */}
              <div className="flex flex-col items-center opacity-85">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/30 flex items-center justify-center bg-white/10 mb-2">
                  <img
                    src={profile?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-bold text-white">You</p>
                <span className="text-[10px] text-white/60">Listener</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all ${
                  isMuted ? 'bg-dangerRed text-white' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMuted ? 'Muted' : 'Mic Active'}</span>
              </button>

              <button
                onClick={() => setHasRaisedHand(!hasRaisedHand)}
                className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all ${
                  hasRaisedHand
                    ? 'bg-peach text-white shadow-md'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{hasRaisedHand ? 'Hand Raised ✋' : 'Raise Hand'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/70">
              <Users className="w-4 h-4 text-coral" />
              <span>{activeRoom.activeCount} members listening</span>
            </div>
          </div>
        </div>
      )}

      {/* Voice Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-5 rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{room.emoji}</span>
                <span className="text-xs font-bold text-violet px-2.5 py-1 rounded-full bg-violet-light flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                  <span>{room.activeCount} live</span>
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-ink mb-1">{room.title}</h3>
              <p className="text-xs text-ink-muted mb-4">{room.category}</p>

              {/* Host Snippet */}
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-cloud mb-4">
                <div className="w-8 h-8 rounded-full bg-lavender flex items-center justify-center font-bold text-violet text-xs">
                  {room.hostName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-ink truncate">Host: {room.hostName}</p>
                  <p className="text-[10px] text-ink-muted">Public community room</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleJoinRoom(room)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-violet-light text-violet hover:bg-violet hover:text-white transition-all shadow-xs"
            >
              Join Audio Stage 🎧
            </button>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-ink">Start a Voice Room</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-cloud text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Room Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Filter Coffee & Indie Jam ☕"
                  className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-sm font-medium"
                >
                  <option value="Music & Chai">Music & Chai</option>
                  <option value="Travel & Outdoors">Travel & Outdoors</option>
                  <option value="Tech & Startups">Tech & Startups</option>
                  <option value="Dating & Advice">Dating & Advice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Room Emoji
                </label>
                <div className="flex gap-2">
                  {['🎧', '☕', '🎸', '💬', '🚀', '🌟'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewEmoji(em)}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        newEmoji === em ? 'bg-violet-light ring-2 ring-violet' : 'bg-cloud'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-coral to-violet text-sm shadow-md hover:opacity-95 transition-all"
              >
                Go Live Now 🎙️
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
