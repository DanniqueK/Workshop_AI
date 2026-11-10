import { cellToPixel, type Colour, type Grid, type Point } from '../game/grid.ts';

const COLOUR_STYLES: Record<Colour, string> = {
  red: '#ef476f',
  yellow: '#ffd166',
  green: '#06d6a0',
  blue: '#118ab2',
  purple: '#9b5de5',
};

const BACKGROUND = '#10101e';

export const clear = (context: CanvasRenderingContext2D): void => {
  context.fillStyle = BACKGROUND;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
};

export const drawBubble = (context: CanvasRenderingContext2D, centre: Point, radius: number, colour: Colour): void => {
  context.beginPath();
  context.arc(centre.x, centre.y, radius - 1, 0, Math.PI * 2);
  context.fillStyle = COLOUR_STYLES[colour];
  context.fill();

  context.beginPath();
  context.arc(centre.x - radius / 3, centre.y - radius / 3, radius / 4, 0, Math.PI * 2);
  context.fillStyle = 'rgba(255, 255, 255, 0.35)';
  context.fill();
};

export const drawGrid = (context: CanvasRenderingContext2D, grid: Grid): void => {
  grid.cells.forEach((cells, row) => {
    cells.forEach((cell, col) => {
      if (cell !== null) drawBubble(context, cellToPixel(grid.layout, { row, col }), grid.layout.radius, cell);
    });
  });
};
