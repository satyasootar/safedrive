import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { DriveSession } from '../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { ScoreRing } from '../components/common/ScoreRing';
import { SafetyRatingBadge } from '../components/common/SafetyRatingBadge';
import { StatCard } from '../components/common/StatCard';
import { EventBarChart } from '../components/charts/EventBarChart';
import { formatDuration, getEventLabel, getEventEmoji } from '../utils/formatters';

export function DriveResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const session: DriveSession = route.params?.session;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 300,
    }).start();
  }, [fadeAnim]);

  if (!session) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No session data found.</Text>
        <Pressable style={styles.doneBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.doneText}>BACK HOME</Text>
        </Pressable>
      </View>
    );
  }

  const isExcellent = session.safetyRating === 'EXCELLENT';
  const isDangerous = session.safetyRating === 'DANGEROUS' || session.safetyRating === 'POOR';

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
      <LinearGradient
        colors={[
          isExcellent ? 'rgba(52, 208, 88, 0.15)' : isDangerous ? 'rgba(255, 75, 75, 0.15)' : COLORS.bg,
          COLORS.bg,
        ]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>DRIVE COMPLETE</Text>

        <View style={styles.scoreSection}>
          <ScoreRing score={session.finalScore} size={200} strokeWidth={18} animate={true} />
          <Animated.View style={[styles.badgeWrapper, { opacity: fadeAnim }]}>
            <SafetyRatingBadge rating={session.safetyRating} size="lg" />
          </Animated.View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Duration" value={formatDuration(session.durationMs)} />
          <StatCard label="Events" value={session.events.length} />
        </View>

        <Text style={styles.sectionTitle}>Event Breakdown</Text>
        <Animated.View style={{ opacity: fadeAnim }}>
          <EventBarChart eventCounts={session.eventCounts} />
        </Animated.View>

        <Text style={styles.sectionTitle}>Event Log</Text>
        <Animated.View style={[styles.logContainer, { opacity: fadeAnim }]}>
          {Object.keys(eventBreakdown).length === 0 ? (
            <Text style={styles.logEmpty}>Perfect drive! No deductions.</Text>
          ) : (
            Object.keys(eventBreakdown).map((type) => {
              const info = eventBreakdown[type];
              return (
                <View key={type} style={styles.logRow}>
                  <View style={styles.logLeft}>
                    <Text style={styles.logEmoji}>{getEventEmoji(type as any)}</Text>
                    <Text style={styles.logLabel}>{getEventLabel(type as any)}</Text>
                  </View>
                  <View style={styles.logRight}>
                    <Text style={styles.logCount}>× {info.count}</Text>
                    <Text style={styles.logPenalty}>-{info.totalPenalty} pts</Text>
                  </View>
                </View>
              );
            })
          )}
        </Animated.View>

        <Text style={styles.sectionTitle}>Score Breakdown</Text>
        <Animated.View style={[styles.breakdownContainer, { opacity: fadeAnim }]}>
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
        </Animated.View>

        <View style={styles.footer}>
          <Pressable style={styles.doneBtn} onPress={() => navigation.popTo('Home')}>
            <Text style={styles.doneText}>DONE</Text>
          </Pressable>
          <Pressable style={styles.historyBtn} onPress={() => navigation.navigate('History')}>
            <Text style={styles.historyText}>VIEW HISTORY</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl },
  headerTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.xl, letterSpacing: 1 },
  scoreSection: { alignItems: 'center', marginBottom: SPACING.xl },
  badgeWrapper: { marginTop: SPACING.lg },
  statsRow: { flexDirection: 'row', marginBottom: SPACING.xl, marginHorizontal: -SPACING.xs },
  sectionTitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: 'bold', marginBottom: SPACING.sm, textTransform: 'uppercase', marginTop: SPACING.md },
  logContainer: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: SPACING.xl },
  logEmpty: { color: COLORS.success, fontSize: FONTS.sizes.md, textAlign: 'center', paddingVertical: SPACING.sm },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.cardBorder },
  logLeft: { flexDirection: 'row', alignItems: 'center' },
  logEmoji: { fontSize: FONTS.sizes.md, marginRight: SPACING.sm },
  logLabel: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md },
  logRight: { flexDirection: 'row', alignItems: 'center', width: 80, justifyContent: 'space-between' },
  logCount: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  logPenalty: { color: COLORS.danger, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  breakdownContainer: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: SPACING.xl },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs },
  breakdownLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  breakdownValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: COLORS.cardBorder, marginVertical: SPACING.sm },
  breakdownTotalLabel: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  breakdownTotalValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xl },
  doneBtn: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: RADIUS.full, alignItems: 'center', marginRight: SPACING.sm },
  doneText: { color: COLORS.bg, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  historyBtn: { flex: 1, backgroundColor: COLORS.surface, paddingVertical: SPACING.md, borderRadius: RADIUS.full, alignItems: 'center', marginLeft: SPACING.sm, borderWidth: 1, borderColor: COLORS.primary },
  historyText: { color: COLORS.primary, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  errorText: { color: COLORS.danger, fontSize: FONTS.sizes.lg, marginBottom: SPACING.xl },
});
