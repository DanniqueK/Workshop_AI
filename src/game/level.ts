import { COLOURS, createEmptyGrid, setCell, type Colour, type Grid, type GridLayout } from './grid.ts';

/** Returns a number in [0, 1), like Math.random. Injected so levels are reproducible in tests. */
export type RandomSource = () => number;

export const randomColour = (random: RandomSource, palette: readonly Colour[] = COLOURS): Colour => {
  const colour = palette[Math.floor(random() * palette.length)];
  if (colour === undefined) throw new RangeError('The palette is empty or random() returned a value outside [0, 1)');
  return colour;
};

export const createRandomLevel = (layout: GridLayout, filledRows: number, random: RandomSource): Grid => {
  let grid = createEmptyGrid(layout);
  grid.cells.slice(0, filledRows).forEach((cells, row) => {
    cells.forEach((_, col) => {
      grid = setCell(grid, { row, col }, randomColour(random));
    });
  });
  return grid;
};
