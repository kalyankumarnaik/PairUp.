import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Compass,
  Crown,
  Headphones,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Shield,
  ShieldAlert,
  Sliders,
  Sparkles,
  User,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, profile } = useAuth();

  const links = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/discover', label: 'Swipe Discover', icon: Sparkles, badge: 'Deck' },
    { to: '/nearby', label: 'Nearby Radar', icon: MapPin },
    { to: '/likes', label: 'Likes Received', icon: Crown, badge: 'Gold' },
    { to: '/matches', label: 'Matches', icon: Heart },
    { to: '/messages', label: 'Messages', icon: MessageCircle },
    { to: '/rooms', label: 'Voice Rooms', icon: Headphones, badge: 'Live' },
    { to: '/communities', label: 'Communities', icon: Users },
    { to: '/events', label: 'Social Events', icon: Calendar },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/safety', label: 'Safety Center', icon: Shield },
    { to: '/subscription', label: 'Subscription', icon: Crown },
    { to: '/settings', label: 'Settings', icon: Sliders }
  ];

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR';

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-borderSoft min-h-[calc(100vh-65px)] p-4 sticky top-[65px] self-start">
      {/* Profile quick widget */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-cloud border border-borderSoft mb-5">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-violet/20 flex-shrink-0">
          {profile?.photos?.[0]?.url ? (
            <img src={profile.photos[0].url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-lavender flex items-center justify-center font-bold text-violet">
              {profile?.displayName?.[0] || 'U'}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink truncate">{profile?.displayName || 'My Account'}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-xs text-ink-muted">Online & Discoverable</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-violet text-white font-semibold shadow-md shadow-violet/20'
                    : 'text-ink-muted hover:bg-cloud hover:text-ink'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-coral text-white">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Admin Link if privileged */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-borderSoft">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">
              Staff Portal
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-midnightInk text-white font-semibold shadow-md'
                    : 'text-coral hover:bg-coral-light'
                }`
              }
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>Admin Console</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Bottom verified banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-light to-lavender-light border border-violet/15 text-xs text-violet-dark mt-auto">
        <p className="font-bold flex items-center gap-1.5">
          <span>🛡️ Safety Shield</span>
        </p>
        <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
          Adult-verified 18+ community with zero tolerance for harassment.
        </p>
      </div>
    </aside>
  );
};
