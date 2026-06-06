import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert, RefreshControl, InteractionManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { DriveSession } from '../types';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { formatDate, formatDuration } from '../utils/formatters';

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const [sessions, setSessions] = useState<DriveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSessions = useCallback(async () => {
    const data = await StorageService.getAllSessions();
    setSessions(data);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      InteractionManager.runAfterInteractions(() => {
        loadSessions().finally(() => setLoading(false));
      });
    });
    return unsubscribe;
  }, [navigation, loadSessions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all driving history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            setSessions([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DriveSession }) => {
    const ratingColor = COLORS.ratingColors[item.safetyRating];
    return (
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('DriveDetail', { session: item })}
      >
        <Text style={styles.dateText}>{formatDate(item.startTime)}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>Score: {item.finalScore}</Text>
          <View style={[styles.ratingBadge, { backgroundColor: ratingColor }]}>
            <Text style={styles.ratingText}>{item.safetyRating}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Duration: {formatDuration(item.durationMs)}</Text>
          <Text style={styles.statText}>Events: {item.events.length}</Text>
        </View>
      </Pressable>
    );
  };

  const totalDrives = sessions.length;
  const avgScore = totalDrives > 0
    ? (sessions.reduce((acc, s) => acc + s.finalScore, 0) / totalDrives).toFixed(1)
    : '0';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>◀</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Drive History</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Total: {totalDrives} drives</Text>
        <Text style={styles.summaryText}>Avg: {avgScore}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
      ) : sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No drives recorded yet</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {sessions.length > 0 && (
        <View style={styles.footer}>
          <Pressable style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearBtnText}>Clear All History</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  backBtn: { padding: SPACING.xs },
  backText: { color: COLORS.primary, fontSize: FONTS.sizes.xl },
  headerTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder },
  summaryText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  list: { padding: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.cardBorder },
  dateText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginBottom: SPACING.xs },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  scoreText: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: 'bold', marginRight: SPACING.sm },
  ratingBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  ratingText: { color: COLORS.bg, fontSize: FONTS.sizes.xs, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: FONTS.sizes.md },
  footer: { padding: SPACING.md },
  clearBtn: { backgroundColor: 'rgba(255, 75, 75, 0.1)', paddingVertical: SPACING.md, borderRadius: RADIUS.full, alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger },
  clearBtnText: { color: COLORS.danger, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
});
