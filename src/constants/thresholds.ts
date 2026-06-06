// THRESHOLD DOCUMENTATION
// All accelerometer values in m/s² (DeviceMotion.acceleration removes gravity)
// All gyroscope values in rad/s
// "magnitude" = sqrt(x² + y² + z²)

export const THRESHOLDS = {
  // HARSH BRAKING
  // Detected when forward deceleration exceeds threshold
  // DeviceMotion.acceleration.y < -HARSH_BRAKE_MS2 (phone face-up in landscape)
  // Uses accelerometer magnitude delta as fallback
  HARSH_BRAKE_MS2: 9.0,           // 9.0 m/s² ≈ 0.92g deceleration
  HARSH_BRAKE_DURATION_MS: 150,   // Must persist for 150ms to confirm (debounce)
  HARSH_BRAKE_COOLDOWN_MS: 2000,  // 2s between same event type

  // HARSH ACCELERATION
  HARSH_ACCEL_MS2: 8.5,           // 8.5 m/s² ≈ 0.87g acceleration
  HARSH_ACCEL_DURATION_MS: 150,
  HARSH_ACCEL_COOLDOWN_MS: 2000,

  // SHARP TURN
  // Gyroscope Z-axis (yaw rate) threshold
  SHARP_TURN_RAD_S: 1.2,          // 1.2 rad/s ≈ 69°/s lateral rotation
  SHARP_TURN_DURATION_MS: 200,
  SHARP_TURN_COOLDOWN_MS: 1500,

  // AGGRESSIVE STEERING
  // Slightly lower than sharp turn; captures sustained hard steering
  AGGRESSIVE_STEER_RAD_S: 0.8,    // 0.8 rad/s sustained steering
  AGGRESSIVE_STEER_DURATION_MS: 500,
  AGGRESSIVE_STEER_COOLDOWN_MS: 1000,

  // EXCESSIVE DEVICE MOVEMENT
  // High 3D acceleration magnitude — phone bouncing/jolting
  EXCESSIVE_MOVEMENT_MS2: 14.0,   // 14 m/s² total vector magnitude
  EXCESSIVE_MOVEMENT_DURATION_MS: 100,
  EXCESSIVE_MOVEMENT_COOLDOWN_MS: 1000,

  // PHONE HANDLING
  // Detected by: rapid multi-axis movement + gyroscope activity
  // Simulates the pattern of picking up / moving the phone
  PHONE_HANDLING_ACCEL_MS2: 6.0,       // accelerometer magnitude > 6 m/s²
  PHONE_HANDLING_GYRO_RAD_S: 0.5,      // gyroscope magnitude > 0.5 rad/s SIMULTANEOUSLY
  PHONE_HANDLING_DURATION_MS: 300,      // both conditions met for 300ms
  PHONE_HANDLING_COOLDOWN_MS: 3000,
} as const;

// Sensor update intervals (milliseconds)
export const SENSOR_INTERVALS = {
  ACCELEROMETER_MS: 16,     // ~60 Hz
  GYROSCOPE_MS: 16,         // ~60 Hz
  DEVICE_MOTION_MS: 16,     // ~60 Hz
  MAGNETOMETER_MS: 100,     // 10 Hz (lower priority)
} as const;
