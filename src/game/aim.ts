import type { Point } from './grid.ts';

const degrees = (value: number): number => (value * Math.PI) / 180;

export const MIN_AIM_ANGLE = degrees(10);
export const MAX_AIM_ANGLE = degrees(170);

/**
 * Angle from the launcher to the pointer in radians, counter-clockwise from pointing right,
 * so straight up is PI / 2. Canvas y grows downwards, hence the flipped y.
 * Clamped so the player can't shoot sideways or down.
 */
export const aimAngle = (launcher: Point, pointer: Point): number => {
  const angle = Math.atan2(launcher.y - pointer.y, pointer.x - launcher.x);
  if (angle < 0) return pointer.x >= launcher.x ? MIN_AIM_ANGLE : MAX_AIM_ANGLE;
  return Math.min(MAX_AIM_ANGLE, Math.max(MIN_AIM_ANGLE, angle));
};

export const directionOf = (angle: number): Point => ({ x: Math.cos(angle), y: -Math.sin(angle) });
