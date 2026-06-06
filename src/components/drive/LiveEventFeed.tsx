import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DriveEvent } from '../../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { getEventLabel, getEventIconName, formatRelativeTimestamp } from '../../utils/formatters';

interface LiveEventFeedProps {
  events: DriveEvent[];
  driveStartTime: number | null;
}

export function LiveEventFeed({ events, driveStartTime }: LiveEventFeedProps) {
  const previousEventsLength = useRef(events.length);

  useEffect(() => {
    previousEventsLength.current = events.length;
  }, [events.length]);

  const reversedEvents = [...events].reverse();

  const renderItem = ({ item }: { item: DriveEvent }) => {
    const timeStr = driveStartTime ? formatRelativeTimestamp(item.timestamp, driveStartTime) : '00:00:00';
    return (
      <View style={styles.row}>
        <View style={styles.left}>
          <Ionicons name={getEventIconName(item.type)} size={16} color={COLORS.eventColors[item.type]} style={styles.icon} />
          <Text style={styles.label}>{getEventLabel(item.type)}</Text>
        </View>
        <Text style={styles.time}>{timeStr}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events detected. Safe driving!</Text>
        </View>
      ) : (
        <FlatList
          data={reversedEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  list: {
    padding: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.cardBorder,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.sm,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    fontVariant: ['tabular-nums'],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
});
