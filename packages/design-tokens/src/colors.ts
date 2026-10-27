/**
 * PairUp AI - Core Brand Colors & Theme Palettes
 * Primary Palette:
 * - Passion Coral (#FF4F81) - Romantic actions, heart pulses, match alerts
 * - Electric Violet (#7C3AED) - Primary buttons, brand identity, navigation highlights
 * - Sunset Peach (#FF8A5B) - Secondary actions, warm badges, friendship highlights
 * - Dream Lavender (#E9D5FF) - Soft card accents, light backgrounds, pill tags
 * - Cloud White (#F8F7FF) - Clean page background, canvas cards
 * - Midnight Ink (#242039) - High contrast typography, dark surfaces
 * - Success Green (#16845B) - Verification badges, online presence, success states
 * - Soft Border (#E8E7EF) - Subtle dividers, inactive input borders
 */

export const colors = {
  brand: {
    passionCoral: '#FF4F81',
    passionCoralHover: '#E63D6D',
    passionCoralLight: '#FFE8EF',
    passionCoralDark: '#B8224B',

    electricViolet: '#7C3AED',
    electricVioletHover: '#6D28D9',
    electricVioletLight: '#F3E8FF',
    electricVioletDark: '#4C1D95',

    sunsetPeach: '#FF8A5B',
    sunsetPeachHover: '#E76F3D',
    sunsetPeachLight: '#FFF0EA',
    sunsetPeachDark: '#C74A1B',

    dreamLavender: '#E9D5FF',
    dreamLavenderHover: '#D8B4FE',
    dreamLavenderLight: '#FAF5FF',

    cloudWhite: '#F8F7FF',
    midnightInk: '#242039',
    midnightInkLight: '#393358',
    midnightInkMuted: '#6B6684',

    successGreen: '#16845B',
    successGreenLight: '#E8F5EE',

    warningAmber: '#F59E0B',
    warningAmberLight: '#FEF3C7',

    dangerRed: '#EF4444',
    dangerRedLight: '#FEE2E2',

    softBorder: '#E8E7EF',
    softBorderHover: '#D2D0DE'
  },

  // Gradients for cards, hero headers, and celebratory overlays
  gradients: {
    passionViolet: 'linear-gradient(135deg, #FF4F81 0%, #7C3AED 100%)',
    sunsetCoral: 'linear-gradient(135deg, #FF8A5B 0%, #FF4F81 100%)',
    dreamGlow: 'linear-gradient(180deg, #F8F7FF 0%, #E9D5FF 100%)',
    midnightDark: 'linear-gradient(180deg, #242039 0%, #151322 100%)',
    cardOverlay: 'linear-gradient(180deg, rgba(36, 32, 57, 0) 40%, rgba(36, 32, 57, 0.85) 90%)',
    superLike: 'linear-gradient(135deg, #38BDF8 0%, #7C3AED 100%)'
  },

  // Light theme default tokens
  light: {
    background: '#F8F7FF',
    foreground: '#242039',
    card: '#FFFFFF',
    cardForeground: '#242039',
    primary: '#7C3AED',
    primaryForeground: '#FFFFFF',
    secondary: '#FF4F81',
    secondaryForeground: '#FFFFFF',
    accent: '#FF8A5B',
    accentForeground: '#FFFFFF',
    muted: '#F1F0F7',
    mutedForeground: '#6B6684',
    border: '#E8E7EF',
    input: '#FFFFFF',
    ring: '#7C3AED'
  },

  // Dark theme tokens
  dark: {
    background: '#151322',
    foreground: '#F8F7FF',
    card: '#242039',
    cardForeground: '#F8F7FF',
    primary: '#9055FF',
    primaryForeground: '#FFFFFF',
    secondary: '#FF6592',
    secondaryForeground: '#FFFFFF',
    accent: '#FFA07A',
    accentForeground: '#151322',
    muted: '#2D2847',
    mutedForeground: '#A5A0C2',
    border: '#393358',
    input: '#242039',
    ring: '#9055FF'
  }
} as const;
