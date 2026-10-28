import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle,
  Compass,
  Headphones,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Radio,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [passed, setPassed] = useState(false);

  const categories = [
    { title: 'Dating', emoji: '💖', desc: 'Find romantic partners & chemistry', gradient: 'from-coral to-rose', bg: 'bg-coral-light/60', text: 'text-coral-dark' },
    { title: 'Friendship', emoji: '🫶', desc: 'Make genuine lifelong friends', gradient: 'from-violet to-purple', bg: 'bg-violet-light/60', text: 'text-violet-dark' },
    { title: 'Nearby People', emoji: '📍', desc: 'Connect with people right around you', gradient: 'from-peach to-amber', bg: 'bg-peach-light/60', text: 'text-peach-dark' },
    { title: 'Voice Rooms', emoji: '🎧', desc: 'Drop-in audio community hangouts', gradient: 'from-cyan to-violet', bg: 'bg-cyan-light/60', text: 'text-cyan-dark' },
    { title: 'Social Events', emoji: '🎉', desc: 'Weekend cycling, board games & mixers', gradient: 'from-mint to-cyan', bg: 'bg-mint-light/60', text: 'text-mint-dark' },
    { title: 'Art & Design', emoji: '🎨', desc: 'Creative minds & museum partners', gradient: 'from-rose to-peach', bg: 'bg-rose-light/60', text: 'text-rose-dark' },
    { title: 'Gaming & Anime', emoji: '🎮', desc: 'Squad up for gaming & debates', gradient: 'from-violet to-cyan', bg: 'bg-violet-light/60', text: 'text-violet-dark' },
    { title: 'Coffee & Cafes', emoji: '☕', desc: 'Explore city coffee trails together', gradient: 'from-amber to-peach', bg: 'bg-amber-light/60', text: 'text-amber-dark' }
  ];

  const floatingEmojis = [
    { emoji: '💖', top: '12%', left: '8%', delay: 0, duration: 4 },
    { emoji: '✨', top: '22%', right: '12%', delay: 0.5, duration: 3.5 },
    { emoji: '☕', top: '65%', left: '6%', delay: 1, duration: 4.5 },
    { emoji: '🎧', top: '75%', right: '10%', delay: 1.5, duration: 5 },
    { emoji: '🫶', top: '35%', left: '46%', delay: 0.8, duration: 4.2 },
    { emoji: '🌈', top: '80%', left: '42%', delay: 1.2, duration: 3.8 }
  ];

  const handleInteractiveLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(true);
    setPassed(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF4F81', '#7C3AED', '#FF8A5B', '#06B6D4', '#F59E0B']
    });
    setTimeout(() => setLiked(false), 2000);
  };

  const handleInteractivePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPassed(true);
    setLiked(false);
    setTimeout(() => setPassed(false), 1200);
  };

  return (
    <div className="min-h-screen bg-cloud text-ink overflow-hidden selection:bg-coral-light selection:text-coral">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Animated Multi-Color Ambient Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-coral/25 via-rose/20 to-peach/25 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-violet/25 via-cyan/20 to-lavender/30 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-gradient-to-r from-amber/20 to-mint/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Floating Background Emojis */}
        {floatingEmojis.map((item, idx) => (
          <motion.div
            key={idx}
            style={{ top: item.top, left: item.left, right: item.right }}
            animate={{
              y: [0, -18, 0],
              rotate: [-4, 6, -4],
              scale: [1, 1.08, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: item.duration,
              delay: item.delay,
              ease: 'easeInOut'
            }}
            className="absolute text-2xl sm:text-3xl select-none pointer-events-none opacity-80 z-0 hidden sm:block"
          >
            {item.emoji}
          </motion.div>
        ))}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-light via-coral-light to-peach-light border border-violet/20 text-violet-dark text-xs sm:text-sm font-bold shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
              </span>
              <Sparkles className="w-4 h-4 text-coral animate-spin" style={{ animationDuration: '6s' }} />
              <span className="bg-gradient-to-r from-violet to-coral bg-clip-text text-transparent font-extrabold">
                Next-Gen Discovery • Dating & Friendship Reimagined
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-ink tracking-tight leading-[1.08]">
              Find your person.{' '}
              <span className="bg-gradient-to-r from-coral via-violet to-peach bg-clip-text text-transparent block sm:inline">
                Or your next best friend.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              PairUp connects adults for real dating, genuine friendships, nearby city hangouts, live audio community rooms, and weekend social events. Built for India with 18+ verified profiles and smart privacy controls.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-coral via-rose to-violet shadow-xl shadow-coral/30 hover:opacity-95 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
              >
                <Heart className="w-5 h-5 fill-white group-hover:animate-pulse" />
                <span>Get Started (18+)</span>
                <span className="text-white/80 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/discover"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-ink bg-white/90 backdrop-blur-md border border-borderSoft hover:border-violet shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5 text-violet" />
                <span>Explore Swipe Deck</span>
              </Link>
            </div>

            {/* Safety & Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-ink-muted font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-light/80 text-success font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>100% 18+ Verified</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-light/80 text-violet font-bold">
                <Lock className="w-4 h-4" />
                <span>Approximate Distance Only</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-light/80 text-coral font-bold">
                <Shield className="w-4 h-4" />
                <span>Safe Community</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Demo Card Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Card Outer Glow Border */}
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-coral via-violet to-cyan rounded-[2rem] blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 animate-pulse-glow" />

              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-midnightInk border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
                  alt="Demo Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnightInk via-midnightInk/30 to-transparent" />

                {/* Compatibility Badge */}
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-coral to-rose backdrop-blur-md text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 animate-bounce">
                  <span>94% Match</span>
                  <span>💖</span>
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                  ✨ Verified 18+
                </div>

                {/* Like / Pass Feedback Alerts */}
                <AnimatePresence>
                  {liked && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                      <div className="p-4 rounded-3xl bg-coral/90 text-white font-display font-extrabold text-2xl flex items-center gap-2 shadow-2xl rotate-[-8deg] border-4 border-white">
                        <Heart className="w-8 h-8 fill-white animate-pulse" />
                        <span>LIKED! 💖</span>
                      </div>
                    </motion.div>
                  )}

                  {passed && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                      <div className="p-4 rounded-3xl bg-ink/90 text-white font-display font-extrabold text-2xl flex items-center gap-2 shadow-2xl rotate-[8deg] border-4 border-white">
                        <X className="w-8 h-8 text-rose" />
                        <span>PASSED</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Profile Details */}
                <div className="absolute bottom-20 inset-x-5 text-white">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-display font-extrabold">Ananya Verma, 26</h3>
                    <span className="text-sm">✨</span>
                  </div>
                  <p className="text-xs text-white/90 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-peach" /> Bandra West, Mumbai • ~3.5 km away
                  </p>
                  <p className="text-xs text-white/80 mt-2 line-clamp-2 leading-relaxed">
                    Lead urban architect, filter coffee nerd, and vinyl record collector. Looking for weekend cafe walks & museum dates.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-md text-[11px] font-bold">☕ Cafes</span>
                    <span className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-md text-[11px] font-bold">🎨 Art</span>
                    <span className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-md text-[11px] font-bold">🎵 Indie Rock</span>
                  </div>
                </div>

                {/* Interactive Action Bar on Card */}
                <div className="absolute bottom-4 inset-x-5 flex items-center justify-center gap-4 z-10">
                  <button
                    onClick={handleInteractivePass}
                    className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-rose flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                    title="Pass"
                  >
                    <X className="w-6 h-6 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={handleInteractiveLike}
                    className="w-11 h-11 rounded-full bg-cyan hover:bg-cyan-hover text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                    title="Super Like"
                  >
                    <Star className="w-5 h-5 fill-white stroke-[2]" />
                  </button>

                  <button
                    onClick={handleInteractiveLike}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-coral to-rose text-white flex items-center justify-center shadow-xl shadow-coral/40 hover:scale-110 active:scale-95 transition-all"
                    title="Like & Connect"
                  >
                    <Heart className="w-7 h-7 fill-white" />
                  </button>
                </div>
              </div>

              {/* Floating Match Bubble */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-violet/20 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral to-violet flex items-center justify-center text-white shadow-md shadow-coral/20">
                  <Heart className="w-5 h-5 fill-white animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-ink">New Match!</p>
                  <p className="text-[10px] text-coral font-semibold">Aarav liked you back 💌</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Statistics Ticker */}
      <section className="py-8 bg-gradient-to-r from-violet via-coral to-peach text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">50,000+</h3>
            <p className="text-xs sm:text-sm text-white/90 font-medium">Verified Active Members</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">120,000+</h3>
            <p className="text-xs sm:text-sm text-white/90 font-medium">Genuine Matches Made</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">24/7</h3>
            <p className="text-xs sm:text-sm text-white/90 font-medium">Live Voice Community Rooms</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">100%</h3>
            <p className="text-xs sm:text-sm text-white/90 font-medium">Privacy Masked & 18+ Safe</p>
          </div>
        </div>
      </section>

      {/* Discovery Categories Grid */}
      <section className="py-20 bg-white border-y border-borderSoft px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-light text-peach-dark text-xs font-bold uppercase tracking-wider mb-3">
              <span>🌈 Multi-Mode Discovery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-ink">
              Discover people by what you actually love
            </h2>
            <p className="text-sm text-ink-muted mt-2">
              Toggle effortlessly between romantic dating, genuine friendships, and localized hobby communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <Link
                key={c.title}
                to="/discover"
                className="group relative p-6 rounded-3xl bg-cloud hover:bg-white border border-borderSoft hover:border-violet/40 hover:shadow-xl transition-all duration-300 text-left overflow-hidden flex flex-col justify-between"
              >
                <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xs`}>
                  {c.emoji}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-ink group-hover:text-violet transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-violet opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore {c.title}</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase: 3 Key Pillars */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-ink">
            Designed for genuine human connection
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            No bots, no fake profiles, and no awkward small talk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="relative p-8 rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-coral/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-coral to-rose text-white flex items-center justify-center mb-6 shadow-md shadow-coral/30 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-2">Intent-Driven Matching</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Match with people whose intentions match yours — whether you want to date to marry, make new friends in a new city, or find weekend activity buddies.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative p-8 rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet to-cyan text-white flex items-center justify-center mb-6 shadow-md shadow-violet/30 group-hover:scale-110 transition-transform">
              <Headphones className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-2">Live Voice Rooms</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Drop into interactive audio stages inspired by FRND. Chat about indie music, tech startups, or late-night chai debates. Raise your hand to speak anytime!
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative p-8 rounded-3xl bg-white border border-borderSoft shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-peach/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-peach to-amber text-white flex items-center justify-center mb-6 shadow-md shadow-peach/30 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-ink mb-2">Privacy & Location Masking</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Your safety comes first. Raw coordinates are never shared or returned via APIs. Nearby matches only show masked approximate distances.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-20 bg-gradient-to-b from-midnightInk to-[#151226] text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet/25 via-coral/15 to-transparent pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-4xl animate-bounce">
            <span>💖</span>
            <span>🫶</span>
            <span>📍</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
            Ready to meet your people?
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-md mx-auto leading-relaxed">
            Join verified members across Mumbai, Bengaluru, Delhi, Hyderabad, and beyond. Free to join for adults aged 18 and above.
          </p>
          <div className="pt-4">
            <Link
              to="/auth?mode=signup"
              className="inline-block px-9 py-4 rounded-2xl font-bold bg-gradient-to-r from-coral via-violet to-peach text-white shadow-2xl shadow-coral/30 hover:scale-105 active:scale-95 transition-all text-base"
            >
              Create Your Free Profile (18+)
            </Link>
          </div>
          <p className="text-xs text-white/50 pt-4">
            PairUp Platform © 2026. Strictly 18+. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};
