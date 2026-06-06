import { useEffect, useRef, useState } from 'react';
import { Accelerometer, Gyroscope, DeviceMotion, Magnetometer } from 'expo-sensors';
import { SensorSnapshot } from '../types';
import { SENSOR_INTERVALS } from '../constants/thresholds';

interface UseSensorsReturn {
  startSensors: (callback: (snapshot: SensorSnapshot) => void) => Promise<void>;
  stopSensors: () => void;
  isAvailable: {
    accelerometer: boolean;
    gyroscope: boolean;
    deviceMotion: boolean;
    magnetometer: boolean;
  };
  permissionError: string | null;
}

export function useSensors(): UseSensorsReturn {
  const subsRef = useRef<{ remove: () => void }[]>([]);
  const accelRef = useRef({ x: 0, y: 0, z: 0 });
  const gyroRef = useRef({ x: 0, y: 0, z: 0 });
  const magRef = useRef({ x: 0, y: 0, z: 0 });

  const [isAvailable, setIsAvailable] = useState({
    accelerometer: false,
    gyroscope: false,
    deviceMotion: false,
    magnetometer: false,
  });
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      setIsAvailable({
        accelerometer: await Accelerometer.isAvailableAsync(),
        gyroscope: await Gyroscope.isAvailableAsync(),
        deviceMotion: await DeviceMotion.isAvailableAsync(),
        magnetometer: await Magnetometer.isAvailableAsync(),
      });
    };
    checkAvailability();
    return stopSensors;
  }, []);

  const stopSensors = () => {
    subsRef.current.forEach(sub => sub.remove());
    subsRef.current = [];
  };

  const startSensors = async (callback: (snapshot: SensorSnapshot) => void) => {
    stopSensors();
    setPermissionError(null);

    try {
      const { status } = await Accelerometer.requestPermissionsAsync();
      if (status !== 'granted') {
        setPermissionError('Accelerometer permission denied');
      }
    } catch (e) {
      // Ignored for now
    }

    Accelerometer.setUpdateInterval(SENSOR_INTERVALS.ACCELEROMETER_MS);
    Gyroscope.setUpdateInterval(SENSOR_INTERVALS.GYROSCOPE_MS);
    DeviceMotion.setUpdateInterval(SENSOR_INTERVALS.DEVICE_MOTION_MS);
    Magnetometer.setUpdateInterval(SENSOR_INTERVALS.MAGNETOMETER_MS);

    if (isAvailable.accelerometer) {
      subsRef.current.push(
        Accelerometer.addListener(data => {
          accelRef.current = { x: data.x, y: data.y, z: data.z };
        })
      );
    }

    if (isAvailable.gyroscope) {
      subsRef.current.push(
        Gyroscope.addListener(data => {
          gyroRef.current = { x: data.x, y: data.y, z: data.z };
        })
      );
    }

    if (isAvailable.magnetometer) {
      subsRef.current.push(
        Magnetometer.addListener(data => {
          magRef.current = { x: data.x, y: data.y, z: data.z };
        })
      );
    }

    if (isAvailable.deviceMotion) {
      subsRef.current.push(
        DeviceMotion.addListener(data => {
          const snapshot: SensorSnapshot = {
            timestamp: Date.now(),
            accelerometer: accelRef.current,
            gyroscope: gyroRef.current,
            deviceMotion: {
              acceleration: data.acceleration || { x: 0, y: 0, z: 0 },
              rotationRate: data.rotationRate 
                ? { x: data.rotationRate.alpha, y: data.rotationRate.beta, z: data.rotationRate.gamma } 
                : { x: 0, y: 0, z: 0 },
              orientation: data.rotation 
                ? { x: data.rotation.alpha, y: data.rotation.beta, z: data.rotation.gamma } 
                : { x: 0, y: 0, z: 0 }
            },
            magnetometer: magRef.current
          };
          callback(snapshot);
        })
      );
    }
  };

  return { startSensors, stopSensors, isAvailable, permissionError };
}
