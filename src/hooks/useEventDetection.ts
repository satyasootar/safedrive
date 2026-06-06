import { useRef, useCallback } from 'react';
import { SensorSnapshot, DriveEvent } from '../types';
import { EventDetectionService } from '../services/EventDetectionService';

export function useEventDetection() {
  const detectionRef = useRef(EventDetectionService.getInstance());

  const processSnapshot = useCallback((snapshot: SensorSnapshot): DriveEvent[] => {
    return detectionRef.current.processSnapshot(snapshot);
  }, []);

  const resetDetection = useCallback(() => {
    detectionRef.current.reset();
  }, []);

  return { processSnapshot, resetDetection, detectionRef };
}
