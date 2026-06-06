import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useNavigation, useRoute, usePreventRemove } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useDriveSession } from '../hooks/useDriveSession';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { ScoreRing } from '../components/common/ScoreRing';
import { SensorReadingCard } from '../components/drive/SensorReadingCard';
import { LiveEventFeed } from '../components/drive/LiveEventFeed';
import { DriveControlButton } from '../components/drive/DriveControlButton';
import { VehicleAnimation } from '../components/drive/VehicleAnimation';
import { formatDuration } from '../utils/formatters';
import { ScoreService } from '../services/ScoreService';

export function ActiveDriveScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const vehicleType = route.params?.vehicleType || 'CAR';
  
  const { driveState, elapsed, startDrive, endDrive, cancelDrive } = useDriveSession();
  
  const [shouldPreventRemove, setShouldPreventRemove] = useState(true);
  const previousEventsLength = useRef(0);

  usePreventRemove(shouldPreventRemove, ({ data }) => {
    Alert.alert(
      'End Drive?',
      'Are you sure you want to end this drive?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {} },
        {
          text: 'End Drive',
          style: 'destructive',
          onPress: () => {
            setShouldPreventRemove(false);
            handleEndDrive();
          },
        },
      ]
    );
  });

  useEffect(() => {
    startDrive(vehicleType);
    return () => cancelDrive();
  }, [vehicleType]);

  useEffect(() => {
    if (driveState.events.length > previousEventsLength.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    previousEventsLength.current = driveState.events.length;
  }, [driveState.events.length]);

  const handleEndDrive = async () => {
    setShouldPreventRemove(false);
    const session = await endDrive();
    navigation.replace('DriveResult', { session });
  };

  const handleBackPress = () => {
    navigation.goBack(); // Will trigger preventRemove if active
  };

  const getAccelValues = () => {
    const accel = driveState.latestSnapshot?.deviceMotion?.acceleration || { x: 0, y: 0, z: 0 };
    return [
      { label: 'x', value: accel.x },
      { label: 'y', value: accel.y },
      { label: 'z', value: accel.z },
    ];
  };

  const getGyroValues = () => {
    const gyro = driveState.latestSnapshot?.gyroscope || { x: 0, y: 0, z: 0 };
    return [
      { label: 'x', value: gyro.x },
      { label: 'y', value: gyro.y },
      { label: 'z', value: gyro.z, unit: '(yaw)' },
    ];
  };

  const currentRating = ScoreService.getSafetyRating(driveState.currentScore);
  const ratingColor = COLORS.ratingColors[currentRating];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backBtn}>
          <Text style={styles.backText}>◀ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>DRIVING...</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.animationContainer}>
        <VehicleAnimation vehicleType={vehicleType} isHalted={driveState.isHalted} />
        {driveState.isHalted && (
          <View style={styles.haltedOverlay}>
            <Text style={styles.haltedText}>VEHICLE HALTED</Text>
          </View>
        )}
      </View>

      <View style={styles.mainContent}>
        <View style={styles.scoreContainer}>
          <Text style={styles.timer}>{formatDuration(elapsed * 1000)}</Text>
          <View style={styles.ringWrapper}>
            <ScoreRing score={driveState.currentScore} />
          </View>
          <View style={styles.ratingContainer}>
            <Text style={[styles.ratingDot, { color: ratingColor }]}>● </Text>
            <Text style={styles.ratingText}>{currentRating}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Live Sensor Readings</Text>
        <View style={styles.sensorsRow}>
          <SensorReadingCard title="ACCEL (m/s²)" values={getAccelValues()} />
          <SensorReadingCard title="GYRO (rad/s)" values={getGyroValues()} />
        </View>

        <Text style={styles.sectionTitle}>Events</Text>
        <View style={styles.feedWrapper}>
          <LiveEventFeed events={driveState.events} driveStartTime={driveState.startTime} />
        </View>
      </View>

      <View style={styles.footer}>
        <DriveControlButton isActive={true} onPress={handleBackPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  backText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  headerTitle: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  placeholder: {
    width: 60,
  },
  animationContainer: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  haltedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  haltedText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  timer: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: SPACING.lg,
  },
  ringWrapper: {
    marginBottom: SPACING.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingDot: {
    fontSize: FONTS.sizes.md,
  },
  ratingText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  sensorsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    marginHorizontal: -SPACING.xs,
  },
  feedWrapper: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  footer: {
    width: '100%',
  },
});
