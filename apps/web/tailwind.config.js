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
        violetGlow: '0 0 25px rgba(124, 58, 237, 0.45)'
      }
    }
  },
  plugins: []
};
