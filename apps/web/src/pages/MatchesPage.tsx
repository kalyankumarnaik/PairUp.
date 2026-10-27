import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Sparkles, UserCheck } from 'lucide-react';
import { apiClient } from '../lib/api';
import { MatchSummary } from '@pairup/domain-types';

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getMatches();
      if (res.data) {
        setMatches(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink flex items-center gap-2">
            <Heart className="w-6 h-6 text-coral fill-coral" />
            <span>Mutual Matches</span>
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            People who liked you back! Start a conversation or pick up where you left off.
          </p>
        </div>

        <Link
          to="/discover"
          className="px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold hover:bg-violet-hover transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Keep Swiping</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-ink-muted">
          Loading your matches...
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m) => (
            <Link
              key={m.id}
              to="/messages"
              className="p-4 rounded-3xl bg-white border border-borderSoft hover:border-violet/40 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-coral/30 group-hover:ring-coral transition-all flex-shrink-0">
                <img
                  src={m.matchedProfile.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={m.matchedProfile.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-success ring-2 ring-white"></span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-sm text-ink truncate group-hover:text-violet transition-colors">
                    {m.matchedProfile.displayName}, {m.matchedProfile.age}
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-lavender text-violet-dark">
                    {m.connectionMode}
                  </span>
                </div>
                <p className="text-xs text-ink-muted truncate mt-1">
                  {m.lastMessageSnippet || 'New match! Say hello ✨'}
                </p>
                <p className="text-[10px] text-ink-muted/70 mt-1">
                  {m.matchedProfile.city || 'Nearby'}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-cloud group-hover:bg-violet group-hover:text-white text-ink-muted transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-borderSoft">
          <p className="text-4xl mb-3">💌</p>
          <h3 className="text-base font-bold text-ink">No matches yet</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1 mb-6">
            Swipe right on profiles you like. When they like you back, they will appear here!
          </p>
          <Link
            to="/discover"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Start Swiping
          </Link>
        </div>
      )}
    </div>
  );
};
