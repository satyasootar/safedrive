import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { DriveSession } from '../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { useSensors } from '../hooks/useSensors';
import { StatCard } from '../components/common/StatCard';
import { formatDuration } from '../utils/formatters';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { isAvailable } = useSensors();
  const [lastDrive, setLastDrive] = useState<DriveSession | null>(null);
  const [stats, setStats] = useState({ totalDrives: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    loadData();
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setLoading(true);
    const sessions = await StorageService.getAllSessions();
    if (sessions.length > 0) {
      setLastDrive(sessions[0]);
      const totalScore = sessions.reduce((acc, s) => acc + s.finalScore, 0);
      setStats({
        totalDrives: sessions.length,
        avgScore: totalScore / sessions.length,
      });
    } else {
      setLastDrive(null);
      setStats({ totalDrives: 0, avgScore: 0 });
    }
    setLoading(false);
  };

  const renderSensorPill = (name: string, available: boolean) => (
    <View style={[styles.sensorPill, { borderColor: available ? COLORS.success : COLORS.danger }]}>
      <Text style={styles.sensorText}>{name}</Text>
      <Text style={[styles.sensorIcon, { color: available ? COLORS.success : COLORS.danger }]}>
        {available ? '✓' : '✗'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🚗 DriveSafe</Text>
          <Pressable onPress={() => navigation.navigate('History')} style={styles.historyBtn}>
            <Text style={styles.historyText}>History</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: SPACING.xl }} />
        ) : (
          <>
            <Pressable
              style={styles.lastDriveCard}
              onPress={() => lastDrive && navigation.navigate('DriveDetail', { session: lastDrive })}
            >
              <Text style={styles.sectionTitle}>LAST DRIVE</Text>
              {lastDrive ? (
                <>
                  <Text style={styles.scoreText}>Score: {lastDrive.finalScore}  ●  {lastDrive.safetyRating}</Text>
                  <Text style={styles.detailText}>Duration: {formatDuration(lastDrive.durationMs)}</Text>
                  <Text style={styles.detailText}>Events: {lastDrive.events.length} total</Text>
                </>
              ) : (
                <Text style={styles.detailText}>No drives yet</Text>
              )}
            </Pressable>

            <View style={styles.statsRow}>
              <StatCard label="Total Drives" value={stats.totalDrives} />
              <StatCard label="Avg Score" value={stats.avgScore.toFixed(1)} />
            </View>

            <Animated.View style={[styles.startBtnContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Pressable
                style={({ pressed }) => [styles.startBtn, pressed && styles.startBtnPressed]}
                onPress={() => navigation.navigate('ActiveDrive')}
              >
                <Text style={styles.startBtnText}>START DRIVE</Text>
              </Pressable>
            </Animated.View>

            <View style={styles.sensorsContainer}>
              <Text style={styles.sectionTitle}>Sensor Status</Text>
              <View style={styles.pillsRow}>
                {renderSensorPill('Accelerometer', isAvailable.accelerometer)}
                {renderSensorPill('Gyroscope', isAvailable.gyroscope)}
              </View>
              <View style={styles.pillsRow}>
                {renderSensorPill('Device Motion', isAvailable.deviceMotion)}
                {renderSensorPill('Magnetometer', isAvailable.magnetometer)}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  historyBtn: {
    padding: SPACING.xs,
  },
  historyText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  lastDriveCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  scoreText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  detailText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
    marginHorizontal: -SPACING.xs,
  },
  startBtnContainer: {
    marginVertical: SPACING.xl,
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl * 2,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  startBtnPressed: {
    opacity: 0.8,
  },
  startBtnText: {
    color: COLORS.bg,
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sensorsContainer: {
    marginTop: SPACING.lg,
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sensorPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginHorizontal: 4,
    backgroundColor: COLORS.surface,
  },
  sensorText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
  },
  sensorIcon: {
    fontWeight: 'bold',
  },
});
