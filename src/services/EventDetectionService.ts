import { SensorSnapshot, DriveEvent, EventType, VehicleType } from '../types';
import { THRESHOLDS } from '../constants/thresholds';
import { SCORING } from '../constants/scoring';
import { magnitude, generateEventId } from '../utils/sensorUtils';

export class EventDetectionService {
  private static instance: EventDetectionService;

  private buffer: SensorSnapshot[] = [];
  private readonly BUFFER_SIZE = 60;

  private currentVehicleType: VehicleType = 'CAR';

  private cooldowns: Record<EventType, number> = {
    HARSH_BRAKE: 0,
    HARSH_ACCELERATION: 0,
    SHARP_TURN: 0,
    AGGRESSIVE_STEERING: 0,
    EXCESSIVE_MOVEMENT: 0,
    PHONE_HANDLING: 0,
  };

  private pendingDurations = {
    brake: 0,
    accel: 0,
    turn: 0,
    steer: 0,
    phone: 0,
  };

  private lastTimestamp = 0;

  private constructor() {}

  public static getInstance(): EventDetectionService {
    if (!EventDetectionService.instance) {
      EventDetectionService.instance = new EventDetectionService();
    }
    return EventDetectionService.instance;
  }

  public setVehicleType(type: VehicleType) {
    this.currentVehicleType = type;
  }

  public reset() {
    this.buffer = [];
    this.cooldowns = {
      HARSH_BRAKE: 0,
      HARSH_ACCELERATION: 0,
      SHARP_TURN: 0,
      AGGRESSIVE_STEERING: 0,
      EXCESSIVE_MOVEMENT: 0,
      PHONE_HANDLING: 0,
    };
    this.pendingDurations = { brake: 0, accel: 0, turn: 0, steer: 0, phone: 0 };
    this.lastTimestamp = 0;
  }

  public processSnapshot(snapshot: SensorSnapshot): DriveEvent[] {
    const events: DriveEvent[] = [];
    const now = snapshot.timestamp;
    const T = THRESHOLDS[this.currentVehicleType];

    const dt = this.lastTimestamp ? now - this.lastTimestamp : 16;
    this.lastTimestamp = now;

    this.buffer.push(snapshot);
    if (this.buffer.length > this.BUFFER_SIZE) {
      this.buffer.shift();
    }

    const { deviceMotion, gyroscope, accelerometer } = snapshot;

    // 1. HARSH_BRAKE
    const accelMag = magnitude(deviceMotion.acceleration);
    if (accelMag > T.HARSH_BRAKE_MS2 && (deviceMotion.acceleration.y < 0 || deviceMotion.acceleration.z < 0)) {
      this.pendingDurations.brake += dt;
      if (this.pendingDurations.brake >= T.HARSH_BRAKE_DURATION_MS && now - this.cooldowns.HARSH_BRAKE > T.HARSH_BRAKE_COOLDOWN_MS) {
        events.push(this.createEvent('HARSH_BRAKE', now, snapshot, this.getSeverity(accelMag, T.HARSH_BRAKE_MS2)));
        this.cooldowns.HARSH_BRAKE = now;
        this.pendingDurations.brake = 0;
      }
    } else {
      this.pendingDurations.brake = 0;
    }

    // 2. HARSH_ACCELERATION
    if (accelMag > T.HARSH_ACCEL_MS2 && (deviceMotion.acceleration.y > 0 || deviceMotion.acceleration.z > 0)) {
      this.pendingDurations.accel += dt;
      if (this.pendingDurations.accel >= T.HARSH_ACCEL_DURATION_MS && now - this.cooldowns.HARSH_ACCELERATION > T.HARSH_ACCEL_COOLDOWN_MS) {
        events.push(this.createEvent('HARSH_ACCELERATION', now, snapshot, this.getSeverity(accelMag, T.HARSH_ACCEL_MS2)));
        this.cooldowns.HARSH_ACCELERATION = now;
        this.pendingDurations.accel = 0;
      }
    } else {
      this.pendingDurations.accel = 0;
    }

    // 3. SHARP_TURN
    const gyroZ = Math.abs(gyroscope.z);
    let inSharpTurn = false;
    if (gyroZ > T.SHARP_TURN_RAD_S) {
      this.pendingDurations.turn += dt;
      if (this.pendingDurations.turn >= T.SHARP_TURN_DURATION_MS && now - this.cooldowns.SHARP_TURN > T.SHARP_TURN_COOLDOWN_MS) {
        events.push(this.createEvent('SHARP_TURN', now, snapshot, this.getSeverity(gyroZ, T.SHARP_TURN_RAD_S)));
        this.cooldowns.SHARP_TURN = now;
        this.pendingDurations.turn = 0;
        inSharpTurn = true;
      }
    } else {
      this.pendingDurations.turn = 0;
    }

    // 4. AGGRESSIVE_STEERING
    const gyroMag = magnitude(gyroscope);
    if (gyroMag > T.AGGRESSIVE_STEER_RAD_S && !inSharpTurn) {
      this.pendingDurations.steer += dt;
      if (this.pendingDurations.steer >= T.AGGRESSIVE_STEER_DURATION_MS && now - this.cooldowns.AGGRESSIVE_STEERING > T.AGGRESSIVE_STEER_COOLDOWN_MS) {
        events.push(this.createEvent('AGGRESSIVE_STEERING', now, snapshot, this.getSeverity(gyroMag, T.AGGRESSIVE_STEER_RAD_S)));
        this.cooldowns.AGGRESSIVE_STEERING = now;
        this.pendingDurations.steer = 0;
      }
    } else {
      this.pendingDurations.steer = 0;
    }

    // 5. EXCESSIVE_MOVEMENT
    const totalAccelMag = magnitude(accelerometer);
    if (totalAccelMag > T.EXCESSIVE_MOVEMENT_MS2) {
      if (now - this.cooldowns.EXCESSIVE_MOVEMENT > T.EXCESSIVE_MOVEMENT_COOLDOWN_MS) {
        events.push(this.createEvent('EXCESSIVE_MOVEMENT', now, snapshot, 'MEDIUM'));
        this.cooldowns.EXCESSIVE_MOVEMENT = now;
      }
    }

    // 6. PHONE_HANDLING
    if (totalAccelMag > T.PHONE_HANDLING_ACCEL_MS2 && gyroMag > T.PHONE_HANDLING_GYRO_RAD_S) {
      this.pendingDurations.phone += dt;
      if (this.pendingDurations.phone >= T.PHONE_HANDLING_DURATION_MS && now - this.cooldowns.PHONE_HANDLING > T.PHONE_HANDLING_COOLDOWN_MS) {
        events.push(this.createEvent('PHONE_HANDLING', now, snapshot, 'HIGH'));
        this.cooldowns.PHONE_HANDLING = now;
        this.pendingDurations.phone = 0;
      }
    } else {
      this.pendingDurations.phone = 0;
    }

    return events;
  }

  private getSeverity(value: number, threshold: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    const ratio = value / threshold;
    if (ratio >= 2.0) return 'HIGH';
    if (ratio >= 1.5) return 'MEDIUM';
    return 'LOW';
  }

  private createEvent(type: EventType, timestamp: number, snapshot: SensorSnapshot, severity: 'LOW' | 'MEDIUM' | 'HIGH'): DriveEvent {
    const penalty = SCORING.PENALTIES[type] * SCORING.SEVERITY_MULTIPLIER[severity];
    return {
      id: generateEventId(),
      type,
      timestamp,
      severity,
      sensorSnapshot: {
        accelerometer: snapshot.accelerometer,
        gyroscope: snapshot.gyroscope,
      },
      penaltyApplied: penalty,
    };
  }
}
