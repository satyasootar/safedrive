import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DriveSession } from '../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { ScoreRing } from '../components/common/ScoreRing';
import { SafetyRatingBadge } from '../components/common/SafetyRatingBadge';
import { StatCard } from '../components/common/StatCard';
import { EventBarChart } from '../components/charts/EventBarChart';
import { formatDuration, getEventLabel, formatRelativeTimestamp, formatDate } from '../utils/formatters';

export function DriveDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const session: DriveSession = route.params?.session;

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>◀ Back</Text>
          </Pressable>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Aggregate events for breakdown
  const eventBreakdown: Record<string, { count: number; totalPenalty: number }> = {};
  session.events.forEach((e) => {
    if (!eventBreakdown[e.type]) {
      eventBreakdown[e.type] = { count: 0, totalPenalty: 0 };
    }
    eventBreakdown[e.type].count += 1;
    eventBreakdown[e.type].totalPenalty += e.penaltyApplied;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>◀ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{formatDate(session.startTime)}</Text>
        <View style={{ width: 60 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreSection}>
          <ScoreRing score={session.finalScore} size={160} strokeWidth={14} animate={false} />
          <View style={styles.badgeWrapper}>
            <SafetyRatingBadge rating={session.safetyRating} size="lg" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Duration" value={formatDuration(session.durationMs)} />
          <StatCard label="Events" value={session.events.length} />
        </View>

        <Text style={styles.sectionTitle}>Event Breakdown</Text>
        <EventBarChart eventCounts={session.eventCounts} />

        <Text style={styles.sectionTitle}>Event Timeline</Text>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />
          
          <View style={styles.timelineEvent}>
            <Text style={styles.timelineTime}>00:00:00</Text>
            <View style={[styles.timelineDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.timelineLabel}>─── Drive Start</Text>
          </View>

          {session.events.map((event) => (
            <View key={event.id} style={styles.timelineEvent}>
              <Text style={styles.timelineTime}>{formatRelativeTimestamp(event.timestamp, session.startTime)}</Text>
              <View style={[styles.timelineDot, { backgroundColor: COLORS.eventColors[event.type] }]} />
              <Text style={styles.timelineLabel}>● {getEventLabel(event.type)}</Text>
            </View>
          ))}

          <View style={styles.timelineEvent}>
            <Text style={styles.timelineTime}>{formatDuration(session.durationMs)}</Text>
            <View style={[styles.timelineDot, { backgroundColor: COLORS.textMuted }]} />
            <Text style={styles.timelineLabel}>─── Drive End</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Score Breakdown</Text>
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Starting Score</Text>
            <Text style={styles.breakdownValue}>100</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Deductions</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.danger }]}>
              -{100 - session.finalScore}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownTotalLabel}>Final Score</Text>
            <Text style={styles.breakdownTotalValue}>{session.finalScore}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  backBtn: { padding: SPACING.xs },
  backText: { color: COLORS.primary, fontSize: FONTS.sizes.md },
  headerTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl },
  scoreSection: { alignItems: 'center', marginBottom: SPACING.xl },
  badgeWrapper: { marginTop: SPACING.md },
  statsRow: { flexDirection: 'row', marginBottom: SPACING.xl, marginHorizontal: -SPACING.xs },
  sectionTitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: 'bold', marginBottom: SPACING.sm, textTransform: 'uppercase', marginTop: SPACING.md },
  breakdownContainer: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: SPACING.xl },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs },
  breakdownLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  breakdownValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: COLORS.cardBorder, marginVertical: SPACING.sm },
  breakdownTotalLabel: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  breakdownTotalValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: FONTS.sizes.md },
  timelineContainer: { marginVertical: SPACING.md, paddingHorizontal: SPACING.sm },
  timelineLine: { position: 'absolute', top: 10, bottom: 10, left: 74, width: 2, backgroundColor: COLORS.cardBorder },
  timelineEvent: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  timelineTime: { width: 60, color: COLORS.textMuted, fontSize: FONTS.sizes.xs, fontVariant: ['tabular-nums'] },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 10, zIndex: 1, borderWidth: 2, borderColor: COLORS.bg },
  timelineLabel: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, flex: 1 },
});
