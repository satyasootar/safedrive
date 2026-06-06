import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriveSession } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'drivesafe:sessions',
};

export class StorageService {
  static async saveSession(session: DriveSession): Promise<void> {
    try {
      const existing = await this.getAllSessions();
      // Keep max 50 sessions
      const updated = [session, ...existing].slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  static async getAllSessions(): Promise<DriveSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) {
        const parsed: DriveSession[] = JSON.parse(data);
        return parsed.sort((a, b) => b.startTime - a.startTime);
      }
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
    return [];
  }

  static async getSession(id: string): Promise<DriveSession | null> {
    const sessions = await this.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  }

  static async deleteSession(id: string): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const updated = sessions.filter(s => s.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch (e) {
      console.error('Failed to clear sessions:', e);
    }
  }
}
