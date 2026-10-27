import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, KeyRound, Lock, Mail, Phone, ShieldCheck, User as UserIcon } from 'lucide-react';
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const age = calculateAge(birthDate);
        if (age < 18) {
          setError('You must be at least 18 years old to join PairUp AI.');
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
          navigate('/home');
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
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 bg-cloud">
      <div className="w-full max-w-md bg-white rounded-3xl border border-borderSoft shadow-xl p-6 sm:p-8">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-coral to-violet items-center justify-center text-white shadow-md shadow-violet/20 mb-3">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-ink">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            {isSignup
              ? 'Adults 18+ only • Verified Dating & Social Discovery'
              : 'Log in to connect with your matches'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3 rounded-2xl bg-lavender-light border border-violet/20 mb-5 text-xs text-violet-dark">
          <p className="font-bold flex items-center gap-1.5 mb-1.5">
            <span>✨ Quick Demo Accounts:</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIdentifier('ananya.verma@example.com');
                setPassword('Password123!');
                setIsSignup(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-violet/20 hover:border-violet font-semibold transition-colors shadow-xs"
            >
              👩 Ananya (Mumbai)
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifier('aarav.sharma@example.com');
                setPassword('Password123!');
                setIsSignup(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-violet/20 hover:border-violet font-semibold transition-colors shadow-xs"
            >
              👨 Aarav (Mumbai)
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifier('admin@pairup.ai');
                setPassword('AdminSecurePairUp2026!');
                setIsSignup(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-midnightInk text-white font-semibold transition-colors"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-dangerRedLight/40 border border-dangerRed/30 text-dangerRed text-xs font-semibold mb-4">
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
              <p className="text-[11px] text-ink-muted mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Age verified server-side: {calculateAge(birthDate)} years old</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-coral to-violet shadow-md shadow-violet/20 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 text-sm"
          >
            {loading ? 'Processing...' : isSignup ? 'Sign Up (18+)' : 'Log In'}
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
      </div>
    </div>
  );
};
