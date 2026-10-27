import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiscoveryCard, UserProfile } from '@pairup/domain-types';
import { apiClient } from '../lib/api';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  myProfile: UserProfile | null;
  matchedProfile: DiscoveryCard | null;
  matchId?: string | null;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  myProfile,
  matchedProfile,
  matchId
}) => {
  const [firstMessage, setFirstMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Fire celebration confetti cannon
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4F81', '#7C3AED', '#FF8A5B', '#E9D5FF']
      });
    }
  }, [isOpen]);

  if (!isOpen || !matchedProfile) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstMessage.trim()) return;

    setIsSending(true);
    try {
      // Find or navigate to conversation
      const convId = `conv_${matchId}`;
      await apiClient.sendMessage(convId, firstMessage.trim());
      onClose();
      navigate('/messages');
    } catch {
      onClose();
      navigate('/messages');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/20 p-6 sm:p-8 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-cloud transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-coral to-violet text-white text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-coral/30 mb-4"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>It's a Match!</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mb-2">
            You and {matchedProfile.displayName} liked each other!
          </h2>
          <p className="text-sm text-ink-muted mb-6">
            Say hello before the spark fades ✨
          </p>

          {/* Side by side avatar bubbles */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-coral shadow-xl shadow-coral/20"
            >
              <img
                src={myProfile?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt="You"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-coral z-10"
            >
              <Heart className="w-6 h-6 fill-coral" />
            </motion.div>

            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-violet shadow-xl shadow-violet/20"
            >
              <img
                src={matchedProfile.photos?.[0]?.url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'}
                alt={matchedProfile.displayName}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Quick Message Input Form */}
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder={`Say something nice to ${matchedProfile.displayName}...`}
                className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 text-sm font-medium transition-all"
              />
              <button
                type="submit"
                disabled={!firstMessage.trim() || isSending}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-violet text-white hover:bg-violet-hover disabled:opacity-40 disabled:hover:bg-violet transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-ink-muted hover:bg-cloud transition-colors"
              >
                Keep Swiping
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/messages');
                }}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-violet text-white hover:bg-violet-hover shadow-md shadow-violet/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Go to Chat</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
