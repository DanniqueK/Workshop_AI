import { directionOf } from './aim.ts';
import type { Colour, Point } from './grid.ts';

export interface Shot {
  readonly position: Point;
  /** Pixels per second. */
  readonly velocity: Point;
  readonly colour: Colour;
}

export const launchShot = (from: Point, angle: number, speed: number, colour: Colour): Shot => {
  const direction = directionOf(angle);
  return { position: from, velocity: { x: direction.x * speed, y: direction.y * speed }, colour };
};

/** Moves the shot by the elapsed time and bounces it off the left and right walls. */
export const stepShot = (shot: Shot, seconds: number, width: number, radius: number): Shot => {
  let x = shot.position.x + shot.velocity.x * seconds;
  let velocityX = shot.velocity.x;
  const left = radius;
  const right = width - radius;

  if (x < left) {
    x = left + (left - x);
    velocityX = Math.abs(velocityX);
  } else if (x > right) {
    x = right - (x - right);
    velocityX = -Math.abs(velocityX);
  }

  return {
    ...shot,
    position: { x, y: shot.position.y + shot.velocity.y * seconds },
    velocity: { x: velocityX, y: shot.velocity.y },
  };
};
