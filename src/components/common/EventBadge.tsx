import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EventType } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { getEventLabel, getEventEmoji } from '../../utils/formatters';

interface EventBadgeProps {
  type: EventType;
  count?: number;
  showCount?: boolean;
}

export function EventBadge({ type, count = 0, showCount = false }: EventBadgeProps) {
  const color = COLORS.eventColors[type];
  const emoji = getEventEmoji(type);
  const label = getEventLabel(type);

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.label}>{label}</Text>
        {showCount && count > 0 && (
          <View style={[styles.countPill, { backgroundColor: color }]}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs / 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emoji: {
    marginRight: 6,
    fontSize: FONTS.sizes.sm,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.sm,
  },
  countPill: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  countText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
  },
});
