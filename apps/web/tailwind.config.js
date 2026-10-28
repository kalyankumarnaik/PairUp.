/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#FF4F81',
          hover: '#E63D6D',
          light: '#FFE8EF',
          dark: '#B8224B'
        },
        violet: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          light: '#F3E8FF',
          dark: '#4C1D95'
        },
        peach: {
          DEFAULT: '#FF8A5B',
          hover: '#E76F3D',
          light: '#FFF0EA',
          dark: '#C74A1B'
        },
        lavender: {
          DEFAULT: '#E9D5FF',
          hover: '#D8B4FE',
          light: '#FAF5FF'
        },
        cyan: {
          DEFAULT: '#06B6D4',
          hover: '#0891B2',
          light: '#ECFEFF',
          dark: '#0E7490'
        },
        amber: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FEF3C7',
          dark: '#B45309'
        },
        mint: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#ECFDF5',
          dark: '#047857'
        },
        rose: {
          DEFAULT: '#F43F5E',
          hover: '#E11D48',
          light: '#FFF1F2',
          dark: '#BE123C'
        },
        cloud: '#F8F7FF',
        ink: {
          DEFAULT: '#242039',
          light: '#393358',
          muted: '#6B6684'
        },
        success: {
          DEFAULT: '#16845B',
          light: '#E8F5EE'
        },
        borderSoft: '#E8E7EF'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      },
      borderRadius: {
        card: '1.5rem',
        button: '1rem'
      },
      boxShadow: {
        cardHover: '0 20px 35px -8px rgba(124, 58, 237, 0.15)',
        coralGlow: '0 0 25px rgba(255, 79, 129, 0.45)',
        violetGlow: '0 0 25px rgba(124, 58, 237, 0.45)',
        cyanGlow: '0 0 25px rgba(6, 182, 212, 0.45)',
        peachGlow: '0 0 25px rgba(255, 138, 91, 0.45)',
        multiGlow: '0 10px 40px -10px rgba(255, 79, 129, 0.3), 0 20px 40px -15px rgba(124, 58, 237, 0.3)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(4deg)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' }
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        float: 'float 3.5s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        heartbeat: 'heartbeat 2s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite linear',
        'gradient-xy': 'gradient-xy 8s ease infinite'
      }
    }
  },
  plugins: []
};
