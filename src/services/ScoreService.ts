import { DriveEvent, EventCounts, SafetyRating, DriveSession, VehicleType } from '../types';
import { SCORING } from '../constants/scoring';

export class ScoreService {
  public static computeScore(events: DriveEvent[], initialScore: number = SCORING.INITIAL_SCORE): number {
    const totalDeductions = events.reduce((sum, event) => sum + event.penaltyApplied, 0);
    return Math.max(SCORING.MINIMUM_SCORE, Math.round(initialScore - totalDeductions));
  }

  public static getSafetyRating(score: number): SafetyRating {
    const found = SCORING.RATINGS.find((r) => score >= r.min && score <= r.max);
    return found ? found.rating : 'DANGEROUS';
  }

  public static getEventCounts(events: DriveEvent[]): EventCounts {
    const counts: EventCounts = {
      HARSH_BRAKE: 0,
      HARSH_ACCELERATION: 0,
      SHARP_TURN: 0,
      AGGRESSIVE_STEERING: 0,
      EXCESSIVE_MOVEMENT: 0,
      PHONE_HANDLING: 0,
    };
    events.forEach((e) => {
      if (counts[e.type] !== undefined) {
        counts[e.type]++;
      }
    });
    return counts;
  }

  public static buildSessionSummary(
    sessionId: string,
    vehicleType: VehicleType,
    startTime: number,
    endTime: number,
    events: DriveEvent[],
    sampleCount: number
  ): DriveSession {
    const finalScore = this.computeScore(events);
    return {
      id: sessionId,
      vehicleType,
      startTime,
      endTime,
      durationMs: endTime - startTime,
      events,
      finalScore,
      safetyRating: this.getSafetyRating(finalScore),
      eventCounts: this.getEventCounts(events),
      sensorSampleCount: sampleCount,
    };
  }
}
