// Sensor raw data snapshots
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SensorSnapshot {
  timestamp: number;
  accelerometer: Vec3;       // g-force units; 1g ≈ 9.81 m/s²
  gyroscope: Vec3;           // rad/s
  deviceMotion: {
    acceleration: Vec3;      // m/s², gravity removed
    rotationRate: Vec3;      // rad/s (alpha, beta, gamma → mapped to x,y,z)
    orientation: Vec3;       // euler angles in degrees
  };
  magnetometer?: Vec3;       // μT (microtesla), optional
}

// Vehicle profiling
export type VehicleType = 'CAR' | 'MOTORCYCLE' | 'BICYCLE';

// Detected driving events
export type EventType =
  | 'HARSH_BRAKE'
  | 'HARSH_ACCELERATION'
  | 'SHARP_TURN'
  | 'AGGRESSIVE_STEERING'
  | 'EXCESSIVE_MOVEMENT'
  | 'PHONE_HANDLING';

export interface DriveEvent {
  id: string;
  type: EventType;
  timestamp: number;          // Unix ms
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  sensorSnapshot: Partial<SensorSnapshot>;
  penaltyApplied: number;     // points deducted
}

// Driving session
export interface DriveSession {
  id: string;
  vehicleType: VehicleType;
  startTime: number;          // Unix ms
  endTime: number;            // Unix ms
  durationMs: number;
  events: DriveEvent[];
  finalScore: number;         // 0–100
  safetyRating: SafetyRating;
  eventCounts: EventCounts;
  sensorSampleCount: number;
}

export type SafetyRating = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DANGEROUS';

export interface EventCounts {
  HARSH_BRAKE: number;
  HARSH_ACCELERATION: number;
  SHARP_TURN: number;
  AGGRESSIVE_STEERING: number;
  EXCESSIVE_MOVEMENT: number;
  PHONE_HANDLING: number;
}

// Live drive state (used during active session)
export interface LiveDriveState {
  isActive: boolean;
  vehicleType: VehicleType;
  startTime: number | null;
  currentScore: number;
  events: DriveEvent[];
  latestSnapshot: SensorSnapshot | null;
  eventCounts: EventCounts;
  isHalted: boolean;
}
