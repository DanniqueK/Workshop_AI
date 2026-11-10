import { describe, expect, it } from 'vitest';
import { COLOURS, type GridLayout } from './grid.ts';
import { createRandomLevel, randomColour } from './level.ts';

const layout: GridLayout = { rows: 6, cols: 8, radius: 20 };

const sequence = (...values: number[]) => {
  let index = 0;
  return () => values[index++ % values.length] ?? 0;
};

describe('randomColour', () => {
  it('maps the random value onto the palette', () => {
    expect(randomColour(() => 0)).toBe(COLOURS[0]);
    expect(randomColour(() => 0.999)).toBe(COLOURS[COLOURS.length - 1]);
  });

  it('only picks from the given palette', () => {
    expect(randomColour(() => 0.7, ['blue', 'green'])).toBe('green');
  });

  it('refuses an empty palette', () => {
    expect(() => randomColour(() => 0, [])).toThrow(RangeError);
  });
});

describe('createRandomLevel', () => {
  it('fills the first rows and leaves the rest empty', () => {
    const grid = createRandomLevel(layout, 3, sequence(0.1, 0.5, 0.9));
    expect(grid.cells.slice(0, 3).flat().every((cell) => cell !== null)).toBe(true);
    expect(grid.cells.slice(3).flat().every((cell) => cell === null)).toBe(true);
  });

  it('is reproducible with the same random source', () => {
    expect(createRandomLevel(layout, 3, sequence(0.2, 0.4))).toEqual(createRandomLevel(layout, 3, sequence(0.2, 0.4)));
  });
});
