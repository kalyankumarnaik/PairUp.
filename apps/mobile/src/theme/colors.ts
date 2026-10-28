export const Colors = {
  // Brand Primary & Accents
  passionCoral: '#FF4F81',
  electricViolet: '#7C3AED',
  sunsetPeach: '#FF8A5B',
  dreamLavender: '#E9D5FF',
  cloudWhite: '#F8F7FF',
  midnightInk: '#242039',
  successGreen: '#16845B',
  softBorder: '#E8E7EF',
  warningAmber: '#F59E0B',
  dangerRed: '#EF4444',

  // Gradients
  primaryGradient: ['#FF4F81', '#7C3AED'],
  coralPeachGradient: ['#FF4F81', '#FF8A5B'],
  violetIndigoGradient: ['#7C3AED', '#4F46E5'],
  goldGradient: ['#F59E0B', '#D97706'],

  // Backgrounds & Neutrals
  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F0FA',
  card: '#FFFFFF',
  modal: '#FFFFFF',

  // Text Colors
  textPrimary: '#242039',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border & Dividers
  border: '#E8E7EF',
  borderStrong: '#CBD5E1',

  // Semantic
  online: '#10B981',
  offline: '#9CA3AF',
  verified: '#7C3AED',
  superLike: '#3B82F6',
  pass: '#9CA3AF',
  like: '#FF4F81'
} as const;

export const Typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: Colors.midnightInk },
  h2: { fontSize: 22, fontWeight: '700' as const, color: Colors.midnightInk },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.midnightInk },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.textPrimary },
  bodyBold: { fontSize: 15, fontWeight: '600' as const, color: Colors.textPrimary },
  caption: { fontSize: 12, fontWeight: '500' as const, color: Colors.textSecondary },
  button: { fontSize: 16, fontWeight: '700' as const, color: Colors.textInverse }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999
};
