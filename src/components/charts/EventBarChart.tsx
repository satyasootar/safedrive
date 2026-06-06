import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { EventCounts } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

interface EventBarChartProps {
  eventCounts: EventCounts;
}

const screenWidth = Dimensions.get('window').width;

export function EventBarChart({ eventCounts }: EventBarChartProps) {
  const chartConfig = {
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(79, 142, 247, ${opacity})`,
    labelColor: () => COLORS.textSecondary,
    barPercentage: 0.7,
  };

  const labels: string[] = [];
  const data: number[] = [];

  const map = [
    { key: 'HARSH_BRAKE', label: 'HB' },
    { key: 'HARSH_ACCELERATION', label: 'HA' },
    { key: 'SHARP_TURN', label: 'ST' },
    { key: 'AGGRESSIVE_STEERING', label: 'AS' },
    { key: 'EXCESSIVE_MOVEMENT', label: 'EM' },
    { key: 'PHONE_HANDLING', label: 'PH' },
  ] as const;

  let totalEvents = 0;
  map.forEach((item) => {
    const count = eventCounts[item.key];
    if (count > 0) {
      labels.push(item.label);
      data.push(count);
      totalEvents += count;
    }
  });

  if (totalEvents === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No events detected! 🎉</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarChart
        data={{
          labels,
          datasets: [
            {
              data,
            },
          ],
        }}
        width={screenWidth - SPACING.md * 2}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: RADIUS.md,
        }}
        fromZero
        showValuesOnTopOfBars
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    height: 150,
  },
  emptyText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
});
