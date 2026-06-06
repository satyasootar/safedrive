# DriveSafe 🚗

DriveSafe is a React Native mobile application built with Expo SDK 55. It uses your device's sensors (Accelerometer, Gyroscope, DeviceMotion, Magnetometer) to analyze your driving behavior in real-time, detect unsafe events, calculate a safety score, and store your driving history.

## Important Note on Emulators (Windows)
> [!WARNING]  
> **Physical Device Required for Sensors**  
> This application relies heavily on hardware sensors (Accelerometer, Gyroscope, Magnetometer, and DeviceMotion) that are **not available** or accurately simulated in standard Android emulators on Windows.  
> To test the core functionality, you **must** use a physical Android device with the Expo Go app.

## Features
- **Real-Time Sensor Monitoring:** Samples sensors at 60Hz and throttles UI updates to 4Hz for performance.
- **Event Detection:** Detects Harsh Braking, Harsh Acceleration, Sharp Turns, Aggressive Steering, Excessive Movement, and Phone Handling.
- **Safety Scoring System:** Calculates a live driving score and final safety rating (Excellent, Good, Fair, Poor, Dangerous).
- **Session History:** Persists driving sessions locally using AsyncStorage for post-drive review.
- **Haptic Feedback:** Provides physical feedback when unsafe driving events occur.
- **Beautiful UI:** Custom animations, charting, and detailed session breakdowns.

## Tech Stack
- **React Native**
- **Expo SDK 55**
- **TypeScript**
- **React Navigation v6**
- **Expo Sensors** (Hardware access)
- **AsyncStorage** (Local persistence)
- **React Native Chart Kit** (Data visualization)

## Getting Started

### Prerequisites
- Node.js installed
- Physical Android device with Expo Go installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Metro bundler:
```bash
npx expo start -c
```

3. Open the Expo Go app on your physical device and scan the QR code to run the app.

## Project Structure
- `/src/components`: Reusable UI elements (badges, buttons, charts)
- `/src/constants`: Scoring rules, sensor thresholds, theme tokens
- `/src/hooks`: Custom hooks (`useSensors`, `useEventDetection`, `useDriveSession`)
- `/src/navigation`: React Navigation setup
- `/src/screens`: App screens (Home, ActiveDrive, DriveResult, History, DriveDetail)
- `/src/services`: Core logic (EventDetectionService, ScoreService, StorageService)
- `/src/types`: TypeScript interfaces
- `/src/utils`: Helper functions (formatters, math utils)

## Development Notes
- The app uses `Pressable` for all interactions, avoiding `TouchableOpacity` entirely per project constraints.
- Sensor processing logic is isolated from React renders using `useRef` and singleton services to ensure high performance without triggering unnecessary re-renders.
