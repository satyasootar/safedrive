import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventType } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { getEventLabel, getEventIconName } from '../../utils/formatters';

interface EventBadgeProps {
  type: EventType;
  count?: number;
  showCount?: boolean;
}

export function EventBadge({ type, count = 0, showCount = false }: EventBadgeProps) {
  const color = COLORS.eventColors[type];
  const label = getEventLabel(type);
  const iconName = getEventIconName(type);

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
        <Ionicons name={iconName} size={14} color={color} style={styles.icon} />
        <Text style={[styles.text, { color }]}>{label}</Text>
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
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
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
