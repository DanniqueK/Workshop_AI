import { aimAngle, directionOf } from './game/aim.ts';
import { gridWidth, type Colour, type GridLayout, type Point } from './game/grid.ts';
import { createRandomLevel, randomColour } from './game/level.ts';
import { launchShot, stepShot, type Shot } from './game/shot.ts';
import { trackPointer } from './ui/input.ts';
import { clear, drawAimLine, drawBubble, drawGrid } from './ui/render.ts';

const LAYOUT: GridLayout = { rows: 14, cols: 12, radius: 20 };
const FILLED_ROWS = 5;
const CANVAS_HEIGHT = 720;
const AIM_LINE_LENGTH = 160;
const SHOT_SPEED = 900;
/** Long frames (a background tab) would make the shot jump, so cap the step. */
const MAX_FRAME_SECONDS = 0.05;

const canvas = document.querySelector<HTMLCanvasElement>('canvas#game');
if (!canvas) throw new Error('index.html must contain <canvas id="game">');

const context = canvas.getContext('2d');
if (!context) throw new Error('2D canvas context is not supported');

canvas.width = gridWidth(LAYOUT);
canvas.height = CANVAS_HEIGHT;

const launcher: Point = { x: canvas.width / 2, y: CANVAS_HEIGHT - LAYOUT.radius * 2 };
const grid = createRandomLevel(LAYOUT, FILLED_ROWS, Math.random);
let loadedColour: Colour = randomColour(Math.random);
let shot: Shot | null = null;

const currentAngle = (): number => aimAngle(launcher, pointer.position() ?? { x: launcher.x, y: 0 });

const pointer = trackPointer(canvas, () => {
  if (shot !== null) return;
  shot = launchShot(launcher, currentAngle(), SHOT_SPEED, loadedColour);
  loadedColour = randomColour(Math.random);
});

const update = (seconds: number): void => {
  if (shot === null) return;
  shot = stepShot(shot, seconds, canvas.width, LAYOUT.radius);
  if (shot.position.y < -LAYOUT.radius) shot = null;
};

const draw = (): void => {
  clear(context);
  drawGrid(context, grid);
  drawAimLine(context, launcher, directionOf(currentAngle()), AIM_LINE_LENGTH);
  drawBubble(context, launcher, LAYOUT.radius, loadedColour);
  if (shot !== null) drawBubble(context, shot.position, LAYOUT.radius, shot.colour);
};

let previousTime: number | null = null;
const frame = (time: number): void => {
  const seconds = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, MAX_FRAME_SECONDS);
  previousTime = time;
  update(seconds);
  draw();
  requestAnimationFrame(frame);
};

requestAnimationFrame(frame);
