import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Compass,
  Headphones,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  Users
} from 'lucide-react';
import { emojis } from '@pairup/design-tokens';

export const LandingPage: React.FC = () => {
  const categories = [
    { title: 'Dating', emoji: '💖', desc: 'Find romantic partners & true chemistry' },
    { title: 'Friendship', emoji: '🫶', desc: 'Make genuine lifelong friends' },
    { title: 'Nearby People', emoji: '📍', desc: 'Connect with people right around you' },
    { title: 'Voice Rooms', emoji: '🎧', desc: 'Drop-in audio community hangouts' },
    { title: 'Social Events', emoji: '🎉', desc: 'Weekend activities & cafe mixers' },
    { title: 'Art & Design', emoji: '🎨', desc: 'Creative minds & museum partners' },
    { title: 'Gaming', emoji: '🎮', desc: 'Squad up for gaming sessions' },
    { title: 'Food & Cafes', emoji: '☕', desc: 'Explore city coffee trails together' }
  ];

  return (
    <div className="min-h-screen bg-cloud text-ink overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background Glowing Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-coral/15 to-violet/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-light border border-violet/20 text-violet text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-coral" />
              <span>Next-Gen Discovery • Dating & Friendship Reimagined</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-ink tracking-tight leading-[1.1]">
              Find your person.{' '}
              <span className="bg-gradient-to-r from-coral via-violet to-peach bg-clip-text text-transparent">
                Or your next best friend.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              PairUp AI connects adults for dating, genuine friendships, nearby hangouts, live voice rooms, and local activities. Tailored for India with verified profiles and smart privacy controls.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-coral via-violet to-violet shadow-xl shadow-violet/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Get Started (18+)</span>
              </Link>
              <Link
                to="/discover"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-ink bg-white border border-borderSoft hover:border-violet shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5 text-violet" />
                <span>Explore Deck</span>
              </Link>
            </div>

            {/* Safety & Trust badging */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-ink-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>100% 18+ Age Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-violet" />
                <span>Approximate Distance Only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-coral" />
                <span>Zero Harassment Policy</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Interactive Demo Card */}
            <div className="relative w-full max-w-sm h-[480px] rounded-3xl overflow-hidden shadow-2xl bg-midnightInk border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
                alt="Demo Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnightInk via-transparent to-transparent" />

              {/* Match Overlay Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-coral/90 backdrop-blur-md text-white font-extrabold text-xs shadow-md">
                94% Match 💖
              </div>

              {/* Profile Details */}
              <div className="absolute bottom-4 inset-x-4 text-white">
                <h3 className="text-xl font-display font-extrabold">Ananya, 26</h3>
                <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-peach" /> Bandra West, Mumbai • ~3.5 km
                </p>
                <p className="text-xs text-white/90 mt-2 line-clamp-2">
                  Urban architect & filter coffee lover. Looking for genuine conversations and sunset cafe walks.
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] font-semibold">☕ Cafes</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] font-semibold">🎨 Art</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] font-semibold">🎵 Indie</span>
                </div>
              </div>
            </div>

            {/* Floating Match Bubble */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-borderSoft flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-coral-light flex items-center justify-center text-coral">
                <Heart className="w-5 h-5 fill-coral" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-ink">New Match!</p>
                <p className="text-[10px] text-ink-muted">Aarav sent a message</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Discovery Categories Grid */}
      <section className="py-16 bg-white border-y border-borderSoft px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-black text-ink">
              Discover people by what you actually love
            </h2>
            <p className="text-sm text-ink-muted mt-2">
              Separate discovery tracks for dating, friendship, and hobby communities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.title}
                to="/discover"
                className="p-5 rounded-2xl bg-cloud hover:bg-lavender-light border border-borderSoft hover:border-violet/30 transition-all text-left group"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                  {c.emoji}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-ink group-hover:text-violet transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-coral-light text-coral flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-2">Smart Matching</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Transparent, explainable compatibility matching based on interests, relationship intentions, and distance.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-violet-light text-violet flex items-center justify-center mb-6">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-2">Live Voice Rooms</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Drop into real-time audio rooms inspired by FRND. Chat live, raise your hand to speak, and build community.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-peach-light text-peach flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-2">Privacy & Location Masking</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Exact coordinates are never returned to anyone. Proximity is masked to approximate radii, protecting your safety.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-midnightInk text-white text-center px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-4xl">💖 🫶 📍</span>
          <h2 className="text-3xl font-display font-bold">Ready to meet your people?</h2>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            Join verified members across Mumbai, Bengaluru, Delhi, and beyond. Free to join for adults aged 18 and above.
          </p>
          <div className="pt-2">
            <Link
              to="/auth?mode=signup"
              className="inline-block px-8 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-coral to-violet text-white shadow-xl shadow-coral/20 hover:scale-105 active:scale-95 transition-all"
            >
              Create Your Free Profile
            </Link>
          </div>
          <p className="text-[11px] text-white/50 pt-4">
            PairUp AI Platform © 2026. Strictly 18+. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};
