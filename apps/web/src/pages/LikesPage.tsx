import React, { useState } from 'react';
import {
  Check,
  Crown,
  Eye,
  Filter,
  Flame,
  Heart,
  Lock,
  MapPin,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LikeReceived {
  id: string;
  name: string;
  age: number;
  city: string;
  distanceKm: number;
  photoUrl: string;
  isSuperLike: boolean;
  timeAgo: string;
  interests: string[];
}

const MOCK_LIKES: LikeReceived[] = [
  {
    id: 'like_1',
    name: 'Ananya Verma',
    age: 26,
    city: 'Mumbai',
    distanceKm: 2.8,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    isSuperLike: true,
    timeAgo: '12m ago',
    interests: ['☕ Coffee', '🎨 Art', '📷 Photography']
  },
  {
    id: 'like_2',
    name: 'Diya Sen',
    age: 24,
    city: 'Mumbai',
    distanceKm: 4.5,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
    isSuperLike: false,
    timeAgo: '1h ago',
    interests: ['📚 Reading', '🎬 Indie Cinema']
  },
  {
    id: 'like_3',
    name: 'Priya Patel',
    age: 25,
    city: 'Bengaluru',
    distanceKm: 6.2,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    isSuperLike: false,
    timeAgo: '3h ago',
    interests: ['🧘 Yoga', '🍳 Cooking']
  },
  {
    id: 'like_4',
    name: 'Rhea Kapoor',
    age: 27,
    city: 'Mumbai',
    distanceKm: 8.1,
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600',
    isSuperLike: true,
    timeAgo: 'Yesterday',
    interests: ['🎸 Live Music', '🏔️ Trekking']
  }
];

export const LikesPage: React.FC = () => {
  const [likes, setLikes] = useState<LikeReceived[]>(MOCK_LIKES);
  const [filterType, setFilterType] = useState<'ALL' | 'SUPER' | 'NEARBY'>('ALL');
  const [unlockedGold, setUnlockedGold] = useState(false);
  const [matchedIds, setMatchedIds] = useState<Record<string, boolean>>({});
  const [celebrationMatch, setCelebrationMatch] = useState<LikeReceived | null>(null);

  const filteredLikes = likes.filter((l) => {
    if (filterType === 'SUPER') return l.isSuperLike;
    if (filterType === 'NEARBY') return l.distanceKm <= 5.0;
    return true;
  });

  const handleMatchInstantly = (like: LikeReceived) => {
    setMatchedIds((prev) => ({ ...prev, [like.id]: true }));
    setCelebrationMatch(like);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber via-coral to-violet text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-200" />
            <span>PairUp Gold Pass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
            Who Liked You ({likes.length})
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-lg leading-relaxed">
            Skip the deck queue! These members swiped right on you. Tap "Match Back" to start chatting immediately.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={() => setUnlockedGold(!unlockedGold)}
            className="px-5 py-3 rounded-2xl bg-white text-midnightInk hover:text-coral font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
          >
            <Sparkles className="w-4 h-4 text-amber fill-current" />
            <span>{unlockedGold ? 'Gold Mode Enabled ✓' : 'Simulate Gold Unlock'}</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-borderSoft">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">Filter:</span>
          <div className="flex items-center gap-1.5">
            {(['ALL', 'SUPER', 'NEARBY'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === t
                    ? 'bg-violet text-white shadow-xs'
                    : 'bg-cloud text-ink-muted hover:text-ink'
                }`}
              >
                {t === 'ALL' ? 'All Likes (4)' : t === 'SUPER' ? '⭐ Super Likes (2)' : '📍 Nearby <5km (2)'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-ink-muted font-medium">
          {unlockedGold ? '🔓 Photos fully revealed' : '🔒 Photos blurred (Simulate Gold to reveal)'}
        </div>
      </div>

      {/* Likes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredLikes.map((item) => {
          const isMatched = matchedIds[item.id];

          return (
            <div
              key={item.id}
              className="group rounded-3xl overflow-hidden bg-white border border-borderSoft shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-72 overflow-hidden bg-midnightInk">
                <img
                  src={item.photoUrl}
                  alt=""
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    !unlockedGold && !isMatched ? 'blur-md scale-110' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnightInk via-transparent to-transparent" />

                {/* Super Like Badge */}
                {item.isSuperLike && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan text-white text-[10px] font-black flex items-center gap-1 shadow-md animate-pulse">
                    <Star className="w-3 h-3 fill-white" />
                    <span>SUPER LIKE</span>
                  </div>
                )}

                {/* Distance Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-midnightInk/70 text-white text-[10px] font-bold backdrop-blur-md">
                  ~{item.distanceKm} km
                </div>

                {/* Locked Blur Prompt */}
                {!unlockedGold && !isMatched && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
                      <Lock className="w-5 h-5 text-amber" />
                    </div>
                    <p className="text-xs font-bold text-white">Liked You {item.timeAgo}</p>
                    <p className="text-[10px] text-white/80 mt-0.5">Match back to reveal profile</p>
                  </div>
                )}

                {/* Name Overlay */}
                <div className="absolute bottom-3 inset-x-3 text-white">
                  <h3 className="font-display font-bold text-lg leading-tight">
                    {unlockedGold || isMatched ? `${item.name}, ${item.age}` : `${item.name[0]}***, ${item.age}`}
                  </h3>
                  <p className="text-xs text-white/80">{item.city} • Liked {item.timeAgo}</p>
                </div>
              </div>

              {/* Actions Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-1 flex-wrap mb-4">
                  {item.interests.map((int, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-cloud text-[10px] font-bold text-ink"
                    >
                      {int}
                    </span>
                  ))}
                </div>

                {isMatched ? (
                  <Link
                    to="/messages"
                    className="w-full py-2.5 rounded-xl bg-emerald text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Matched! Open Chat 💬</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleMatchInstantly(item)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-coral to-violet hover:opacity-95 text-white text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Match Back Instantly</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Celebration Dialog */}
      {celebrationMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-midnightInk text-white p-7 text-center shadow-2xl border border-coral/40">
            <span className="text-4xl animate-bounce">🎉</span>
            <h3 className="text-xl font-display font-black text-coral mt-2">IT'S A MATCH!</h3>
            <p className="text-xs text-white/80 mt-1">
              You and <strong className="text-white">{celebrationMatch.name}</strong> liked each other!
            </p>

            <div className="flex items-center justify-center gap-3 my-6">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-coral">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-coral flex items-center justify-center font-bold text-sm shadow-md">
                💖
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-violet">
                <img src={celebrationMatch.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/messages"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md block text-center"
              >
                Send Message 💬
              </Link>
              <button
                onClick={() => setCelebrationMatch(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 text-white/80 text-xs font-bold"
              >
                Keep Exploring Likes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
