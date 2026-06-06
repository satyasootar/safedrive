import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

interface SensorReadingCardProps {
  title: string;
  values: Array<{ label: string; value: number; unit?: string }>;
}

export function SensorReadingCard({ title, values }: SensorReadingCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {values.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>{item.label}:</Text>
          <Text style={styles.value}>
            {item.value >= 0 ? ' ' : ''}{item.value.toFixed(2)}{item.unit ? ` ${item.unit}` : ''}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    flex: 1,
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    width: 24,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xs,
    fontVariant: ['tabular-nums'],
  },
});
