import { aimAngle, directionOf } from './game/aim.ts';
import { gridWidth, type GridLayout, type Point } from './game/grid.ts';
import { createRandomLevel, randomColour } from './game/level.ts';
import { trackPointer } from './ui/input.ts';
import { clear, drawAimLine, drawBubble, drawGrid } from './ui/render.ts';

const LAYOUT: GridLayout = { rows: 14, cols: 12, radius: 20 };
const FILLED_ROWS = 5;
const CANVAS_HEIGHT = 720;
const AIM_LINE_LENGTH = 160;

const canvas = document.querySelector<HTMLCanvasElement>('canvas#game');
if (!canvas) throw new Error('index.html must contain <canvas id="game">');

const context = canvas.getContext('2d');
if (!context) throw new Error('2D canvas context is not supported');

canvas.width = gridWidth(LAYOUT);
canvas.height = CANVAS_HEIGHT;

const launcher: Point = { x: canvas.width / 2, y: CANVAS_HEIGHT - LAYOUT.radius * 2 };
const grid = createRandomLevel(LAYOUT, FILLED_ROWS, Math.random);
const loadedColour = randomColour(Math.random);
const pointer = trackPointer(canvas);

const frame = (): void => {
  const angle = aimAngle(launcher, pointer.position() ?? { x: launcher.x, y: 0 });

  clear(context);
  drawGrid(context, grid);
  drawAimLine(context, launcher, directionOf(angle), AIM_LINE_LENGTH);
  drawBubble(context, launcher, LAYOUT.radius, loadedColour);

  requestAnimationFrame(frame);
};

requestAnimationFrame(frame);
