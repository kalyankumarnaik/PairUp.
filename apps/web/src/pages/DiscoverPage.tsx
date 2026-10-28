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
import {
  ConnectionMode,
  DiscoveryCard,
  Gender,
  RelationshipIntention,
  SwipeAction,
  VerificationStatus
} from '@pairup/domain-types';

const FALLBACK_DECK: DiscoveryCard[] = [
  {
    id: 'disc_1',
    userId: 'usr_demo_1',
    displayName: 'Ananya Verma',
    age: 26,
    bio: 'Architect, plant mom, and amateur photographer. Always up for filter coffee or art gallery walks in Bandra. Let’s talk about design, vinyl records, or the best pasta in Mumbai.',
    gender: Gender.WOMAN,
    pronouns: 'she/her',
    relationshipIntention: RelationshipIntention.DATING_TO_MARRY,
    connectionMode: ConnectionMode.DATING,
    city: 'Mumbai',
    approximateDistanceKm: 3.5,
    interests: [
      { id: '1', name: 'Coffee & Cafes', category: 'Lifestyle', emoji: '☕' },
      { id: '2', name: 'Contemporary Art', category: 'Creative', emoji: '🎨' },
      { id: '3', name: 'Street Photography', category: 'Creative', emoji: '📷' }
    ],
    photos: [
      {
        id: 'p1',
        profileId: '1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: ''
      },
      {
        id: 'p2',
        profileId: '1',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
        order: 1,
        isPrimary: false,
        isModerated: true,
        createdAt: ''
      }
    ],
    prompts: [
      {
        id: 'prm1',
        question: 'A perfect Sunday morning looks like',
        answer: 'Brewing pour-over coffee and listening to indie vinyl.'
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    id: 'disc_2',
    userId: 'usr_demo_2',
    displayName: 'Aarav Sharma',
    age: 28,
    bio: 'Fintech product designer who balances UX wireframes with weekend hiking trips and spicy street food trails. Let’s find Mumbai’s hidden sunset viewpoints.',
    gender: Gender.MAN,
    pronouns: 'he/him',
    relationshipIntention: RelationshipIntention.LONG_TERM,
    connectionMode: ConnectionMode.BOTH,
    city: 'Mumbai',
    approximateDistanceKm: 4.2,
    interests: [
      { id: '4', name: 'Hiking & Trekking', category: 'Outdoors', emoji: '🏔️' },
      { id: '5', name: 'Badminton', category: 'Sports', emoji: '🏸' },
      { id: '6', name: 'Tech & Startups', category: 'Tech', emoji: '💻' }
    ],
    photos: [
      {
        id: 'p3',
        profileId: '2',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: ''
      }
    ],
    prompts: [
      {
        id: 'prm2',
        question: 'The best way to ask me out',
        answer: 'Invite me for a badminton match or single-origin cold brew.'
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    id: 'disc_3',
    userId: 'usr_demo_3',
    displayName: 'Riya Sen',
    age: 24,
    bio: 'Software engineer at a YC startup by day, live music enthusiast by night. Looking for concert buddies and coffee debates on whether tabs beat spaces.',
    gender: Gender.WOMAN,
    pronouns: 'she/her',
    relationshipIntention: RelationshipIntention.NEW_FRIENDS,
    connectionMode: ConnectionMode.FRIENDSHIP,
    city: 'Bengaluru',
    approximateDistanceKm: 5.8,
    interests: [
      { id: '7', name: 'Indie Rock', category: 'Music', emoji: '🎵' },
      { id: '8', name: 'Board Games', category: 'Gaming', emoji: '🎲' }
    ],
    photos: [
      {
        id: 'p4',
        profileId: '3',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: ''
      }
    ],
    prompts: [],
    verificationStatus: VerificationStatus.VERIFIED
  }
];

export const DiscoverPage: React.FC = () => {
  const { profile } = useAuth();
  const [cards, setCards] = useState<DiscoveryCard[]>(FALLBACK_DECK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

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
      if (res.data && res.data.length > 0) {
        setCards(res.data);
        setCurrentIndex(0);
      } else {
        setCards(FALLBACK_DECK);
        setCurrentIndex(0);
      }
    } catch {
      setCards(FALLBACK_DECK);
      setCurrentIndex(0);
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
        setMatchId(res.data.matchId || `match_${Date.now()}`);
        setIsMatchModalOpen(true);
        return;
      }
    } catch {
      // Offline fallback
    }

    // In demo / fallback mode, simulate instant match when swiping right (LIKE)
    if (action === SwipeAction.LIKE || action === SwipeAction.SUPER_LIKE) {
      setMatchedProfile(currentCard);
      setMatchId(`match_${Date.now()}`);
      setIsMatchModalOpen(true);
    }
  };

  const handleRewind = async () => {
    try {
      await apiClient.rewind();
    } catch {
      // Offline fallback
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
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
          className="w-12 h-12 rounded-full bg-white border-2 border-amber/30 text-amber hover:bg-amber-light hover:border-amber hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-40 disabled:hover:scale-100"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Pass (Left) */}
        <button
          onClick={() => handleSwipe(SwipeAction.PASS)}
          disabled={currentIndex >= cards.length}
          title="Pass"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-rose/30 text-rose hover:bg-rose-light hover:border-rose hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-40"
        >
          <X className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
        </button>

        {/* Super Like */}
        <button
          onClick={() => handleSwipe(SwipeAction.SUPER_LIKE)}
          disabled={currentIndex >= cards.length}
          title="Super Like"
          className="w-12 h-12 rounded-full bg-white border-2 border-cyan/40 text-cyan hover:bg-cyan-light hover:border-cyan hover:scale-110 active:scale-95 transition-all shadow-md shadow-cyan/10 flex items-center justify-center disabled:opacity-40"
        >
          <Star className="w-5 h-5 fill-cyan" />
        </button>

        {/* Like (Right) */}
        <button
          onClick={() => handleSwipe(SwipeAction.LIKE)}
          disabled={currentIndex >= cards.length}
          title="Like"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-coral via-rose to-violet text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-coral/35 hover:shadow-coralGlow flex items-center justify-center disabled:opacity-40 group"
        >
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-white group-hover:scale-110 group-hover:animate-pulse transition-transform" />
        </button>

        {/* Fast Boost */}
        <button
          onClick={() => alert('Profile boosted! You are now featured at the top of nearby decks for 30 minutes 🚀')}
          title="Boost"
          className="w-12 h-12 rounded-full bg-white border-2 border-violet/30 text-violet hover:bg-violet-light hover:border-violet hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center"
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
