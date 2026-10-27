import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Headphones, Heart, Home, MapPin, MessageCircle, Sparkles } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/discover', icon: Sparkles, label: 'Deck' },
    { to: '/nearby', icon: MapPin, label: 'Nearby' },
    { to: '/matches', icon: Heart, label: 'Matches' },
    { to: '/messages', icon: MessageCircle, label: 'Chat' },
    { to: '/rooms', icon: Headphones, label: 'Audio' }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-borderSoft px-2 py-2 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-all ${
                isActive ? 'text-violet font-bold scale-105' : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
