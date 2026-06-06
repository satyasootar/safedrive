export const COLORS = {
  // Backgrounds
  bg:          '#F3F4F6',
  surface:     '#FFFFFF',
  card:        '#FFFFFF',
  cardBorder:  '#E5E7EB',

  // Brand
  primary:     '#4F8EF7',
  primaryDim:  '#2A5BBF',

  // Semantic
  success:     '#34D058',
  warning:     '#F0A202',
  danger:      '#FF4B4B',
  info:        '#38BDF8',

  // Text
  textPrimary:   '#111827',
  textSecondary: '#4B5563',
  textMuted:     '#9CA3AF',

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
    EXCELLENT:  '#16A34A',
    GOOD:       '#22C55E',
    FAIR:       '#EAB308',
    POOR:       '#EF4444',
    DANGEROUS:  '#B91C1C',
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
