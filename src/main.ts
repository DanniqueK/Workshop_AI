import { gridWidth, type GridLayout } from './game/grid.ts';
import { createRandomLevel } from './game/level.ts';
import { clear, drawGrid } from './ui/render.ts';

const LAYOUT: GridLayout = { rows: 14, cols: 12, radius: 20 };
const FILLED_ROWS = 5;

const canvas = document.querySelector<HTMLCanvasElement>('canvas#game');
if (!canvas) throw new Error('index.html must contain <canvas id="game">');

const context = canvas.getContext('2d');
if (!context) throw new Error('2D canvas context is not supported');

canvas.width = gridWidth(LAYOUT);
canvas.height = 720;

const grid = createRandomLevel(LAYOUT, FILLED_ROWS, Math.random);

clear(context);
drawGrid(context, grid);
