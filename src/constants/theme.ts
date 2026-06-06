export const COLORS = {
  // Backgrounds
  bg:          '#0A0F1E',
  surface:     '#131A2E',
  card:        '#1B2540',
  cardBorder:  '#2A3A5C',

  // Brand
  primary:     '#4F8EF7',
  primaryDim:  '#2A5BBF',

  // Semantic
  success:     '#34D058',
  warning:     '#F0A202',
  danger:      '#FF4B4B',
  info:        '#38BDF8',

  // Text
  textPrimary:   '#FFFFFF',
  textSecondary: '#8B9DC3',
  textMuted:     '#4B5E8A',

  // Events (for badges and charts)
  eventColors: {
    HARSH_BRAKE:        '#FF4B4B',
    HARSH_ACCELERATION: '#F97316',
    SHARP_TURN:         '#F0A202',
    AGGRESSIVE_STEERING:'#FACC15',
    EXCESSIVE_MOVEMENT: '#A78BFA',
    PHONE_HANDLING:     '#EC4899',
  },

  // Safety rating colors
  ratingColors: {
    EXCELLENT:  '#34D058',
    GOOD:       '#86EFAC',
    FAIR:       '#F0A202',
    POOR:       '#FF4B4B',
    DANGEROUS:  '#9F1239',
  },
} as const;

export const FONTS = {
  regular: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 32,
    hero: 48,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
