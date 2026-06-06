import { format } from 'date-fns';
import { EventType } from '../types';

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatRelativeTimestamp(eventMs: number, startMs: number): string {
  const diff = Math.max(0, eventMs - startMs);
  const totalSeconds = Math.floor(diff / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatDate(ms: number): string {
  return format(ms, 'MMM d, yyyy  hh:mm a');
}

export function getEventLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    HARSH_BRAKE: 'Harsh Brake',
    HARSH_ACCELERATION: 'Harsh Acceleration',
    SHARP_TURN: 'Sharp Turn',
    AGGRESSIVE_STEERING: 'Aggressive Steering',
    EXCESSIVE_MOVEMENT: 'Excess Movement',
    PHONE_HANDLING: 'Phone Handling',
  };
  return labels[type];
}

export function getEventIconName(type: EventType): any {
  const icons: Record<EventType, any> = {
    HARSH_BRAKE: 'alert-circle',
    HARSH_ACCELERATION: 'speedometer',
    SHARP_TURN: 'swap-horizontal',
    AGGRESSIVE_STEERING: 'git-branch',
    EXCESSIVE_MOVEMENT: 'warning',
    PHONE_HANDLING: 'phone-portrait',
  };
  return icons[type];
}
