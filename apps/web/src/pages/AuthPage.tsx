import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, KeyRound, Lock, Mail, Phone, ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateAge } from '@pairup/validation';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('mode') === 'signup');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // OTP flow
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setIsSignup(false);
    setError('');
    setLoading(true);
    try {
      const res = await login(email, pass);
      if (res.success) {
        if (email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const age = calculateAge(birthDate);
        if (age < 18) {
          setError('You must be at least 18 years old to join PairUp.');
          setLoading(false);
          return;
        }

        const isPhone = identifier.startsWith('+') || /^\d{10}$/.test(identifier);
        const res = await signup({
          email: isPhone ? '' : identifier,
          phone: isPhone ? identifier : '',
          password,
          displayName,
          birthDate,
          acceptedTerms
        });

        if (res.success) {
          navigate('/home');
        } else {
          setError(res.message || 'Signup failed');
        }
      } else {
        const res = await login(identifier, password);
        if (res.success) {
          if (identifier.toLowerCase().includes('admin')) {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } else {
          setError(res.message || 'Invalid credentials');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(identifier, otpCode);
      if (res.success) {
        navigate('/home');
      } else {
        setError(res.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 bg-cloud overflow-hidden">
      {/* Animated Vibrant Background Glow Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-coral/25 to-peach/25 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-bl from-violet/25 to-cyan/25 blur-3xl pointer-events-none animate-float" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-amber/15 via-rose/15 to-violet/15 blur-3xl pointer-events-none" />

      {/* Floating Sparkle Emojis */}
      <span className="absolute top-16 right-1/4 text-2xl animate-float select-none pointer-events-none opacity-80">
        💖
      </span>
      <span className="absolute bottom-20 left-1/4 text-2xl animate-float-slow select-none pointer-events-none opacity-80">
        ✨
      </span>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-violet/15 p-6 sm:p-8 z-10"
      >
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="relative inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-coral via-violet to-peach items-center justify-center text-white shadow-lg shadow-coral/30 mb-3 group hover:scale-110 transition-transform">
            <Heart className="w-7 h-7 fill-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-coral"></span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-ink">
            {isSignup ? 'Create Your Account' : 'Welcome to PairUp'}
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-medium">
            {isSignup
              ? 'Adults 18+ only • Real Dating & Genuine Social Discovery'
              : 'Log in to connect with your matches and friends'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-lavender-light via-peach-light/30 to-cyan-light/40 border border-violet/20 mb-5 text-xs text-violet-dark">
          <p className="font-bold flex items-center gap-1.5 mb-2 text-ink">
            <Sparkles className="w-3.5 h-3.5 text-coral" />
            <span>✨ 1-Click Demo Accounts:</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('ananya.verma@example.com', 'Password123!')}
              className="px-2 py-1.5 rounded-xl bg-white/90 border border-coral/30 hover:border-coral text-ink hover:text-coral font-bold transition-all shadow-xs text-center hover:scale-105 active:scale-95"
            >
              👩 Ananya
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('aarav.sharma@example.com', 'Password123!')}
              className="px-2 py-1.5 rounded-xl bg-white/90 border border-violet/30 hover:border-violet text-ink hover:text-violet font-bold transition-all shadow-xs text-center hover:scale-105 active:scale-95"
            >
              👨 Aarav
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@pairup.ai', 'AdminSecurePairUp2026!')}
              className="px-2 py-1.5 rounded-xl bg-midnightInk text-white border border-amber/40 hover:border-amber font-bold transition-all shadow-xs text-center hover:scale-105 active:scale-95"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-dangerRedLight/60 border border-dangerRed/30 text-dangerRed text-xs font-semibold mb-4 animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Riya Sen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-sm font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or +919876543210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-sm font-medium"
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                Birth Date (Must be 18+)
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max="2008-01-01"
                className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-sm font-medium"
              />
              <p className="text-[11px] text-ink-muted mt-1 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Verified: {calculateAge(birthDate)} years old</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-coral via-violet to-peach shadow-lg shadow-coral/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Connecting...' : isSignup ? 'Join PairUp (18+)' : 'Log In to PairUp'}</span>
          </button>
        </form>

        {/* Switch Mode Toggle */}
        <div className="text-center pt-5 mt-5 border-t border-borderSoft">
          <p className="text-xs text-ink-muted">
            {isSignup ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-violet font-bold hover:underline"
            >
              {isSignup ? 'Log in here' : 'Sign up for free'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
