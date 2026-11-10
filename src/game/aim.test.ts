import { describe, expect, it } from 'vitest';
import { aimAngle, directionOf, MAX_AIM_ANGLE, MIN_AIM_ANGLE } from './aim.ts';

const launcher = { x: 200, y: 600 };

describe('aimAngle', () => {
  it('points straight up when the pointer is right above', () => {
    expect(aimAngle(launcher, { x: 200, y: 100 })).toBeCloseTo(Math.PI / 2);
  });

  it('follows the pointer to the upper left and right', () => {
    expect(aimAngle(launcher, { x: 300, y: 500 })).toBeCloseTo(Math.PI / 4);
    expect(aimAngle(launcher, { x: 100, y: 500 })).toBeCloseTo((3 * Math.PI) / 4);
  });

  it('clamps flat angles to 10 and 170 degrees', () => {
    expect(aimAngle(launcher, { x: 400, y: 599 })).toBe(MIN_AIM_ANGLE);
    expect(aimAngle(launcher, { x: 0, y: 599 })).toBe(MAX_AIM_ANGLE);
  });

  it('never aims down, even when the pointer is below the launcher', () => {
    expect(aimAngle(launcher, { x: 250, y: 700 })).toBe(MIN_AIM_ANGLE);
    expect(aimAngle(launcher, { x: 150, y: 700 })).toBe(MAX_AIM_ANGLE);
  });
});

describe('directionOf', () => {
  it('turns an angle into a unit vector in canvas coordinates', () => {
    const up = directionOf(Math.PI / 2);
    expect(up.x).toBeCloseTo(0);
    expect(up.y).toBeCloseTo(-1);
  });
});
