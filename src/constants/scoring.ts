export const SCORING = {
  INITIAL_SCORE: 100,

  // Point deductions per event
  PENALTIES: {
    HARSH_BRAKE: 5,
    HARSH_ACCELERATION: 5,
    SHARP_TURN: 3,
    AGGRESSIVE_STEERING: 2,
    EXCESSIVE_MOVEMENT: 2,
    PHONE_HANDLING: 10,
  },

  // Extra penalty for HIGH severity events
  SEVERITY_MULTIPLIER: {
    LOW: 1.0,
    MEDIUM: 1.0,
    HIGH: 1.5,       // HIGH severity events cost 1.5× the base penalty
  },

  // Score → Safety Rating mapping
  RATINGS: [
    { min: 90, max: 100, rating: 'EXCELLENT' },
    { min: 75, max: 89,  rating: 'GOOD'      },
    { min: 55, max: 74,  rating: 'FAIR'      },
    { min: 35, max: 54,  rating: 'POOR'      },
    { min: 0,  max: 34,  rating: 'DANGEROUS' },
  ],

  MINIMUM_SCORE: 0,
} as const;
