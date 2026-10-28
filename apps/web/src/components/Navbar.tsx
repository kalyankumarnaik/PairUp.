import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Heart,
  MessageCircle,
  Radio,
  Shield,
  Sparkles,
  User as UserIcon,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'match' | 'message' | 'surge' | 'safety' | 'superlike';
  isRead: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'n_1',
    title: 'New Match Alert! 💖',
    body: 'Ananya swiped right on you! Start the conversation before the spark cools down.',
    time: '2m ago',
    type: 'match',
    isRead: false,
    link: '/messages'
  },
  {
    id: 'n_2',
    title: '⚡ Activity Surge in your area!',
    body: '480+ active singles nearby right now in your city. Match rate is boosted 2.4x.',
    time: '18m ago',
    type: 'surge',
    isRead: false,
    link: '/nearby'
  },
  {
    id: 'n_3',
    title: 'New Voice Note 🎙️',
    body: 'Aarav sent you a 15-second voice note. Tap to listen with equalizer.',
    time: '45m ago',
    type: 'message',
    isRead: false,
    link: '/messages'
  },
  {
    id: 'n_4',
    title: 'Date Safety Reminder 🛡️',
    body: 'Planning an in-person meetup tonight? Activate your 30m safety check-in timer.',
    time: '2h ago',
    type: 'safety',
    isRead: true,
    link: '/safety'
  }
];

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (n: PushNotification) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
    );
    setShowNotificationCenter(false);
    navigate(n.link);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-borderSoft px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? '/home' : '/'} className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral via-violet to-peach flex items-center justify-center text-white shadow-md shadow-coral/25 group-hover:scale-110 active:scale-95 transition-all">
            <Heart className="w-5 h-5 fill-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-coral"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-display font-extrabold tracking-tight bg-gradient-to-r from-coral via-violet to-peach bg-clip-text text-transparent">
                PairUp
              </span>
              <span className="text-base select-none animate-bounce">✨</span>
            </div>
            <p className="text-[10px] text-ink-muted -mt-0.5 tracking-wide font-semibold hidden sm:block">
              Discover • Connect • Belong
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/discover"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-violet-light text-violet hover:bg-violet hover:text-white transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Swipe Deck</span>
              </Link>

              {/* Notification Center Bell Icon & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                  className="p-2.5 rounded-xl hover:bg-cloud text-ink-muted hover:text-ink transition-colors relative"
                  title="Notifications & Activity"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Popover */}
                {showNotificationCenter && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-borderSoft shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-borderSoft">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🔔</span>
                        <h3 className="font-display font-bold text-sm text-ink">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-coral-light text-coral font-bold text-[10px]">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[11px] text-violet hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-borderSoft/60 max-h-80 overflow-y-auto my-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 rounded-2xl cursor-pointer transition-all hover:bg-cloud flex items-start gap-3 my-1 ${
                            !n.isRead ? 'bg-lavender-light/40 border-l-4 border-coral' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm bg-white shadow-2xs border border-borderSoft">
                            {n.type === 'match' && '💖'}
                            {n.type === 'surge' && '⚡'}
                            {n.type === 'message' && '💬'}
                            {n.type === 'safety' && '🛡️'}
                            {n.type === 'superlike' && '⭐'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-ink truncate">{n.title}</p>
                              <span className="text-[10px] text-ink-muted flex-shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-ink-muted line-clamp-2 mt-0.5 leading-relaxed">
                              {n.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-borderSoft text-center">
                      <Link
                        to="/nearby"
                        onClick={() => setShowNotificationCenter(false)}
                        className="text-xs font-bold text-coral hover:underline"
                      >
                        Explore Activity Surge & Nearby Radar →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Link */}
              <Link
                to="/messages"
                className="p-2.5 rounded-xl hover:bg-muted text-ink-muted hover:text-ink transition-colors relative"
                title="Messages"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-coral ring-2 ring-white"></span>
              </Link>

              <div className="flex items-center gap-3 pl-2 border-l border-borderSoft">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-violet/20 group-hover:ring-violet transition-all">
                    {profile?.photos?.[0]?.url ? (
                      <img
                        src={profile.photos[0].url}
                        alt={profile.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-lavender flex items-center justify-center text-violet font-bold text-sm">
                        {profile?.displayName?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-ink hidden md:inline group-hover:text-violet transition-colors">
                    {profile?.displayName || 'Profile'}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="text-xs font-medium text-ink-muted hover:text-danger-red px-2 py-1 rounded-lg hover:bg-dangerRedLight/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/safety"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink transition-colors mr-2"
              >
                <Shield className="w-4 h-4 text-emerald" />
                <span>Safety First</span>
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-ink hover:text-violet transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-coral to-violet shadow-md shadow-coral/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Join PairUp
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
