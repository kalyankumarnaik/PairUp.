export const spacing = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem'
} as const;

export const radii = {
  none: '0px',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
  card: '1.5rem',
  button: '1rem'
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(36, 32, 57, 0.05)',
  base: '0 1px 3px 0 rgba(36, 32, 57, 0.1), 0 1px 2px -1px rgba(36, 32, 57, 0.1)',
  md: '0 4px 6px -1px rgba(36, 32, 57, 0.1), 0 2px 4px -2px rgba(36, 32, 57, 0.1)',
  lg: '0 10px 15px -3px rgba(36, 32, 57, 0.1), 0 4px 6px -4px rgba(36, 32, 57, 0.1)',
  xl: '0 20px 25px -5px rgba(36, 32, 57, 0.1), 0 8px 10px -6px rgba(36, 32, 57, 0.1)',
  cardHover: '0 22px 35px -8px rgba(124, 58, 237, 0.15)',
  coralGlow: '0 0 25px rgba(255, 79, 129, 0.45)',
  violetGlow: '0 0 25px rgba(124, 58, 237, 0.45)'
} as const;

export const animationTokens = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    celebration: 800
  },
  easings: {
    spring: [0.175, 0.885, 0.32, 1.275],
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55]
  }
} as const;
