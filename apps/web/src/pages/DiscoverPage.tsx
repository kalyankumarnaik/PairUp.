import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Filter,
  Heart,
  RotateCcw,
  Sparkles,
  Star,
  X,
  Zap
} from 'lucide-react';
import { SwipeCard } from '../components/SwipeCard';
import { MatchModal } from '../components/MatchModal';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { ConnectionMode, DiscoveryCard, SwipeAction } from '@pairup/domain-types';

export const DiscoverPage: React.FC = () => {
  const { profile } = useAuth();
  const [cards, setCards] = useState<DiscoveryCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [modeFilter, setModeFilter] = useState<string>('BOTH');

  // Match celebration state
  const [matchedProfile, setMatchedProfile] = useState<DiscoveryCard | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  useEffect(() => {
    loadDeck();
  }, [modeFilter]);

  const loadDeck = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getDiscoveryFeed({
        connectionMode: modeFilter as any
      });
      if (res.data) {
        setCards(res.data);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to load discovery deck:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: SwipeAction) => {
    if (currentIndex >= cards.length) return;

    const currentCard = cards[currentIndex];

    // Optimistically advance card index
    setCurrentIndex((prev) => prev + 1);

    try {
      const res = await apiClient.swipe(
        currentCard.userId,
        action,
        currentCard.connectionMode || 'DATING'
      );

      if (res.data?.isMatch) {
        setMatchedProfile(res.data.matchedProfile || currentCard);
        setMatchId(res.data.matchId || null);
        setIsMatchModalOpen(true);
      }
    } catch (err) {
      console.error('Swipe action failed:', err);
    }
  };

  const handleRewind = async () => {
    try {
      const res = await apiClient.rewind();
      if (res.data?.rewound && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    } catch (err) {
      console.error('Rewind failed:', err);
    }
  };

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-100px)] py-4 px-2 sm:px-4">
      {/* Top Discovery Mode Toggle Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-borderSoft shadow-xs">
          <button
            onClick={() => setModeFilter('BOTH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              modeFilter === 'BOTH'
                ? 'bg-violet text-white shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            All ✨
          </button>
          <button
            onClick={() => setModeFilter('DATING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              modeFilter === 'DATING'
                ? 'bg-coral text-white shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Dating 💖
          </button>
          <button
            onClick={() => setModeFilter('FRIENDSHIP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              modeFilter === 'FRIENDSHIP'
                ? 'bg-peach text-white shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Friends 🫶
          </button>
        </div>

        <button
          onClick={loadDeck}
          title="Reload Deck"
          className="p-2.5 rounded-xl bg-white border border-borderSoft text-ink-muted hover:text-ink hover:border-violet transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Card Deck Stack Area */}
      <div className="relative w-full h-[580px] sm:h-[620px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-ink-muted">
            <div className="w-12 h-12 rounded-full border-4 border-violet/20 border-t-violet animate-spin" />
            <p className="text-sm font-semibold">Finding amazing people nearby...</p>
          </div>
        ) : currentIndex < cards.length ? (
          <>
            {/* Next Card underneath for depth */}
            {nextCard && (
              <SwipeCard
                key={nextCard.id}
                card={nextCard}
                isFront={false}
                onSwipe={handleSwipe}
              />
            )}

            {/* Top Interactive Draggable Card */}
            {currentCard && (
              <SwipeCard
                key={currentCard.id}
                card={currentCard}
                isFront={true}
                onSwipe={handleSwipe}
              />
            )}
          </>
        ) : (
          /* Empty Deck State */
          <div className="w-full h-full rounded-3xl bg-white border border-borderSoft flex flex-col items-center justify-center p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-lavender flex items-center justify-center text-3xl mb-4">
              🎉
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-1">
              You've seen everyone in this radius!
            </h3>
            <p className="text-xs text-ink-muted max-w-xs mb-6">
              Check back soon for new arrivals or expand your nearby distance preferences.
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                loadDeck();
              }}
              className="px-6 py-2.5 rounded-xl bg-violet text-white text-xs font-bold hover:bg-violet-hover transition-colors shadow-md shadow-violet/20"
            >
              Reset & Explore Again
            </button>
          </div>
        )}
      </div>

      {/* Bottom Action Controls Floating Bar */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 w-full">
        {/* Rewind */}
        <button
          onClick={handleRewind}
          disabled={currentIndex === 0}
          title="Rewind"
          className="w-12 h-12 rounded-full bg-white border border-borderSoft text-warningAmber hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-40 disabled:hover:scale-100"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Pass (Left) */}
        <button
          onClick={() => handleSwipe(SwipeAction.PASS)}
          disabled={currentIndex >= cards.length}
          title="Pass"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-borderSoft text-coral hover:bg-coral-light hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-40"
        >
          <X className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>

        {/* Super Like */}
        <button
          onClick={() => handleSwipe(SwipeAction.SUPER_LIKE)}
          disabled={currentIndex >= cards.length}
          title="Super Like"
          className="w-12 h-12 rounded-full bg-white border border-borderSoft text-sky-500 hover:bg-sky-50 hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-40"
        >
          <Star className="w-5 h-5 fill-sky-500" />
        </button>

        {/* Like (Right) */}
        <button
          onClick={() => handleSwipe(SwipeAction.LIKE)}
          disabled={currentIndex >= cards.length}
          title="Like"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-coral to-violet text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-coral/30 flex items-center justify-center disabled:opacity-40"
        >
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
        </button>

        {/* Fast Boost */}
        <button
          onClick={() => alert('Profile boosted! You are now featured at the top of nearby decks for 30 minutes 🚀')}
          title="Boost"
          className="w-12 h-12 rounded-full bg-white border border-borderSoft text-violet hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center"
        >
          <Zap className="w-5 h-5 fill-violet" />
        </button>
      </div>

      {/* Match Celebration Modal */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        myProfile={profile}
        matchedProfile={matchedProfile}
        matchId={matchId}
      />
    </div>
  );
};
