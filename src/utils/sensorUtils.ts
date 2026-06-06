import { Vec3 } from '../types';

// Vector magnitude
export function magnitude({ x, y, z }: Vec3): number {
  return Math.sqrt(x * x + y * y + z * z);
}

// Low-pass filter to smooth noisy sensor readings
// alpha: 0.1 = very smooth (slow), 0.9 = less smooth (fast response)
export function lowPassFilter(current: Vec3, previous: Vec3, alpha: number): Vec3 {
  return {
    x: alpha * current.x + (1 - alpha) * previous.x,
    y: alpha * current.y + (1 - alpha) * previous.y,
    z: alpha * current.z + (1 - alpha) * previous.z,
  };
}

// Generate a short unique ID for events
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Generate session ID
export function generateSessionId(): string {
  return `ses_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
