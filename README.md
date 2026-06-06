# Safe Driving Telemetry App

A mobile application built with React Native and Expo that monitors, analyzes, and scores driving behavior in real-time. By leveraging native device sensors at high frequencies, the app detects dangerous driving patterns, provides a live telemetry dashboard, and stores detailed historical session data to help users improve their driving habits.

## Features

- **Real-Time Telemetry**: Captures high-frequency data (60Hz) from the device's Accelerometer, Gyroscope, and Device Motion sensors.
- **Dynamic Vehicle Profiles**: Custom-tuned algorithms with adaptive thresholds based on the selected vehicle:
  - **Car**: Strict acceleration, braking, and steering tolerances.
  - **Motorcycle**: Increased tolerances for acceleration/braking and modified yaw settings for leaning through corners.
  - **Bicycle**: Lower acceleration limits but highly resistant to false-positive "excessive movement" from bumpy roads without suspension.
- **Event Detection Algorithm**: Instantly recognizes and logs:
  - Harsh Braking
  - Harsh Acceleration
  - Sharp Turns
  - Aggressive Steering
  - Excessive Device Movement
  - Distracted Phone Handling
- **Halted Vehicle Detection**: Automatically pauses UI animations and sensor tracking when the vehicle is stopped at a light or parked.
- **Advanced Scoring Engine**: Starts every drive at a perfect 100 points, deducting weighted penalties based on the severity and duration of detected events. Calculates a final Safety Rating (Excellent, Good, Fair, Poor, Dangerous).
- **Immersive Vector Animations**: Uses `@expo/vector-icons` and the React Native `Animated` API to generate a dynamic, seamlessly looping vehicle side-profile that mimics road driving and pauses when halted.
- **Local Storage & History**: Stores all completed drives, allowing users to review event timelines, sensor penalty breakdowns, and long-term driving statistics.

---

## Screenshots

<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px;">
  <img src="path/to/screenshot1.png" width="18%" />
  <img src="path/to/screenshot2.png" width="18%" />
  <img src="path/to/screenshot3.png" width="18%" />
  <img src="path/to/screenshot4.png" width="18%" />
  <img src="path/to/screenshot5.png" width="18%" />
</div>

---

## Tech Stack

- **Framework**: React Native with Expo (SDK 54+)
- **Language**: TypeScript
- **Sensors**: `expo-sensors` (Accelerometer, Gyroscope, DeviceMotion)
- **Navigation**: React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`)
- **Storage**: AsyncStorage (`@react-native-async-storage/async-storage`)
- **UI & Animations**: Custom React Native `Animated` components, `@expo/vector-icons`
- **Haptics**: `expo-haptics` for tactile feedback during critical events

## Running Locally

### Prerequisites

- Node.js
- Expo CLI
- Expo Go app on a physical iOS or Android device (Required for sensor access; simulators do not provide accurate 60Hz telemetry data).

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Metro bundler:
   ```bash
   npm run start
   ```

3. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android) to launch the app.

## Architecture

The sensor tracking logic relies on a dual-loop architecture to maintain extreme precision without blocking the UI thread:
1. **Background Sensor Buffer (16ms / 60Hz)**: Subscribes directly to native sensors, storing vector magnitudes and delta rotations in an internal memory array.
2. **UI Throttling (250ms / 4Hz)**: The React state only consumes the sensor buffer 4 times a second, preventing UI jitter and React re-render bottlenecks while maintaining 100% accuracy of the raw mathematical physics algorithm.
