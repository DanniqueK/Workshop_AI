import { describe, expect, it } from 'vitest';
import { launchShot, stepShot, type Shot } from './shot.ts';

const WIDTH = 480;
const RADIUS = 20;

const shotAt = (x: number, y: number, velocityX: number, velocityY: number): Shot => ({
  position: { x, y },
  velocity: { x: velocityX, y: velocityY },
  colour: 'red',
});

describe('launchShot', () => {
  it('moves at the given speed in the aim direction', () => {
    const shot = launchShot({ x: 240, y: 680 }, Math.PI / 2, 900, 'blue');
    expect(shot.velocity.x).toBeCloseTo(0);
    expect(shot.velocity.y).toBeCloseTo(-900);
    expect(shot.colour).toBe('blue');
  });
});

describe('stepShot', () => {
  it('moves by velocity times the elapsed time', () => {
    const moved = stepShot(shotAt(240, 600, 100, -200), 0.5, WIDTH, RADIUS);
    expect(moved.position).toEqual({ x: 290, y: 500 });
  });

  it('covers the same distance in one big step as in two small ones', () => {
    const once = stepShot(shotAt(240, 600, 100, -200), 0.2, WIDTH, RADIUS);
    const twice = stepShot(stepShot(shotAt(240, 600, 100, -200), 0.1, WIDTH, RADIUS), 0.1, WIDTH, RADIUS);
    expect(twice.position.x).toBeCloseTo(once.position.x);
    expect(twice.position.y).toBeCloseTo(once.position.y);
  });

  it('bounces off the right wall', () => {
    const bounced = stepShot(shotAt(450, 400, 100, -100), 0.2, WIDTH, RADIUS);
    expect(bounced.position.x).toBe(450);
    expect(bounced.velocity.x).toBe(-100);
    expect(bounced.velocity.y).toBe(-100);
  });

  it('bounces off the left wall', () => {
    const bounced = stepShot(shotAt(30, 400, -100, -100), 0.2, WIDTH, RADIUS);
    expect(bounced.position.x).toBe(30);
    expect(bounced.velocity.x).toBe(100);
  });
});
