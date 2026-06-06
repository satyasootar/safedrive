import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafetyRating } from '../../types';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';

interface SafetyRatingBadgeProps {
  rating: SafetyRating;
  size?: 'sm' | 'md' | 'lg';
}

export function SafetyRatingBadge({ rating, size = 'md' }: SafetyRatingBadgeProps) {
  const color = COLORS.ratingColors[rating];
  
  let paddingVertical: number = 4;
  let paddingHorizontal: number = 12;
  let fontSize: number = FONTS.sizes.sm;
  
  if (size === 'sm') {
    paddingVertical = 2;
    paddingHorizontal = 8;
    fontSize = FONTS.sizes.xs;
  } else if (size === 'lg') {
    paddingVertical = 6;
    paddingHorizontal = 16;
    fontSize = FONTS.sizes.md;
  }

  return (
    <View style={[styles.badge, { backgroundColor: color, paddingVertical, paddingHorizontal }]}>
      <Text style={[styles.text, { fontSize }]}>
        {rating === 'EXCELLENT' ? '★ ' : '● '}{rating}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    color: COLORS.bg,
    fontWeight: 'bold',
  },
});
