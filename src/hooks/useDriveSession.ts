import { useState, useRef, useCallback } from 'react';
import { LiveDriveState, DriveSession, VehicleType } from '../types';
import { useSensors } from './useSensors';
import { useEventDetection } from './useEventDetection';
import { EventDetectionService } from '../services/EventDetectionService';
import { ScoreService } from '../services/ScoreService';
import { StorageService } from '../services/StorageService';
import { generateSessionId } from '../utils/sensorUtils';
import { SCORING } from '../constants/scoring';

export function useDriveSession() {
  const [driveState, setDriveState] = useState<LiveDriveState>({
    isActive: false,
    startTime: null,
    currentScore: SCORING.INITIAL_SCORE,
    events: [],
    latestSnapshot: null,
    eventCounts: ScoreService.getEventCounts([]),
    isHalted: false,
    vehicleType: 'CAR',
  });
  
  const [elapsed, setElapsed] = useState(0);

  const { startSensors, stopSensors } = useSensors();
  const { processSnapshot, resetDetection } = useEventDetection();

  const stateRef = useRef(driveState);
  stateRef.current = driveState;
  
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sampleCountRef = useRef(0);
  
  const lastMovementTimeRef = useRef(Date.now());
  const lastAccelRef = useRef({x:0,y:0,z:0});
  
  // Throttle UI updates to 4Hz (250ms)
  const lastUiUpdateRef = useRef(0);

  const startDrive = useCallback(async (vehicleType: VehicleType = 'CAR') => {
    EventDetectionService.getInstance().setVehicleType(vehicleType);
    resetDetection();
    sampleCountRef.current = 0;
    const now = Date.now();
    
    setDriveState({
      isActive: true,
      startTime: now,
      currentScore: SCORING.INITIAL_SCORE,
      events: [],
      latestSnapshot: null,
      eventCounts: ScoreService.getEventCounts([]),
      isHalted: false,
      vehicleType,
    });
    setElapsed(0);
    lastMovementTimeRef.current = Date.now();
    lastAccelRef.current = {x:0,y:0,z:0};

    elapsedTimerRef.current = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);

    await startSensors((snapshot) => {
      sampleCountRef.current++;
      const newEvents = processSnapshot(snapshot);
      
      let needsUpdate = false;
      const currentState = stateRef.current;
      
      const updatedEvents = newEvents.length > 0 
        ? [...currentState.events, ...newEvents]
        : currentState.events;
        
      if (newEvents.length > 0) {
        needsUpdate = true;
      }
      
      const nowMs = Date.now();
      
      // Halted logic
      const accel = snapshot.accelerometer;
      const prevAccel = lastAccelRef.current;
      const deltaMag = Math.sqrt(
        Math.pow(accel.x - prevAccel.x, 2) +
        Math.pow(accel.y - prevAccel.y, 2) +
        Math.pow(accel.z - prevAccel.z, 2)
      );
      lastAccelRef.current = accel;
      
      let currentHalted = currentState.isHalted;
      if (deltaMag > 0.15) {
        lastMovementTimeRef.current = nowMs;
        if (currentHalted) {
          currentHalted = false;
          needsUpdate = true;
        }
      } else {
        if (!currentHalted && (nowMs - lastMovementTimeRef.current > 3000)) {
          currentHalted = true;
          needsUpdate = true;
        }
      }
      if (needsUpdate || nowMs - lastUiUpdateRef.current >= 250) {
        lastUiUpdateRef.current = nowMs;
        setDriveState({
          ...currentState,
          events: updatedEvents,
          currentScore: ScoreService.computeScore(updatedEvents),
          latestSnapshot: snapshot,
          eventCounts: ScoreService.getEventCounts(updatedEvents),
          isHalted: currentHalted,
        });
      }
    });
  }, [startSensors, processSnapshot, resetDetection]);

  const endDrive = useCallback(async (): Promise<DriveSession> => {
    stopSensors();
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    
    const endTime = Date.now();
    const finalState = stateRef.current;
    
    const session = ScoreService.buildSessionSummary(
      generateSessionId(),
      finalState.vehicleType,
      finalState.startTime || endTime,
      endTime,
      finalState.events,
      sampleCountRef.current
    );
    
    await StorageService.saveSession(session);
    
    setDriveState({
      isActive: false,
      startTime: null,
      currentScore: SCORING.INITIAL_SCORE,
      events: [],
      latestSnapshot: null,
      eventCounts: ScoreService.getEventCounts([]),
      isHalted: false,
      vehicleType: 'CAR',
    });
    setElapsed(0);
    
    return session;
  }, [stopSensors]);

  const cancelDrive = useCallback(() => {
    stopSensors();
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    setDriveState({
      isActive: false,
      startTime: null,
      currentScore: SCORING.INITIAL_SCORE,
      events: [],
      latestSnapshot: null,
      eventCounts: ScoreService.getEventCounts([]),
      isHalted: false,
      vehicleType: 'CAR',
    });
    setElapsed(0);
  }, [stopSensors]);

  return { driveState, elapsed, startDrive, endDrive, cancelDrive };
}
