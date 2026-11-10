import { describe, expect, it } from 'vitest';
import {
  cellToPixel,
  columnsInRow,
  createEmptyGrid,
  getCell,
  neighbours,
  pixelToCell,
  setCell,
  type GridLayout,
} from './grid.ts';

const layout: GridLayout = { rows: 6, cols: 8, radius: 20 };

const sorted = (positions: { row: number; col: number }[]) =>
  [...positions].sort((a, b) => a.row - b.row || a.col - b.col);

describe('grid', () => {
  it('gives odd rows one bubble less', () => {
    const grid = createEmptyGrid(layout);
    expect(grid.cells[0]).toHaveLength(8);
    expect(grid.cells[1]).toHaveLength(7);
    expect(columnsInRow(layout, 2)).toBe(8);
  });

  it('starts empty and sets a cell without changing the original', () => {
    const empty = createEmptyGrid(layout);
    const filled = setCell(empty, { row: 1, col: 3 }, 'red');
    expect(getCell(empty, { row: 1, col: 3 })).toBeNull();
    expect(getCell(filled, { row: 1, col: 3 })).toBe('red');
  });

  it('refuses to set a cell outside the grid', () => {
    expect(() => setCell(createEmptyGrid(layout), { row: 1, col: 7 }, 'red')).toThrow(RangeError);
  });
});

describe('neighbours', () => {
  it('finds six neighbours in an even row', () => {
    expect(sorted(neighbours(layout, { row: 2, col: 3 }))).toEqual([
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 2 },
      { row: 2, col: 4 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
    ]);
  });

  it('finds six neighbours in an odd row, shifted to the right', () => {
    expect(sorted(neighbours(layout, { row: 3, col: 3 }))).toEqual([
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 3, col: 2 },
      { row: 3, col: 4 },
      { row: 4, col: 3 },
      { row: 4, col: 4 },
    ]);
  });

  it('leaves out cells beyond the edges', () => {
    expect(sorted(neighbours(layout, { row: 0, col: 0 }))).toEqual([
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ]);
    expect(sorted(neighbours(layout, { row: 1, col: 6 }))).toEqual([
      { row: 0, col: 6 },
      { row: 0, col: 7 },
      { row: 1, col: 5 },
      { row: 2, col: 6 },
      { row: 2, col: 7 },
    ]);
  });

  it('only returns cells that touch: centres one diameter apart', () => {
    const centre = cellToPixel(layout, { row: 3, col: 3 });
    for (const neighbour of neighbours(layout, { row: 3, col: 3 })) {
      const point = cellToPixel(layout, neighbour);
      expect(Math.hypot(point.x - centre.x, point.y - centre.y)).toBeCloseTo(40);
    }
  });
});

describe('cellToPixel and pixelToCell', () => {
  it('shifts odd rows by one radius', () => {
    expect(cellToPixel(layout, { row: 0, col: 0 })).toEqual({ x: 20, y: 20 });
    expect(cellToPixel(layout, { row: 1, col: 0 }).x).toBe(40);
  });

  it('round-trips every cell', () => {
    const grid = createEmptyGrid(layout);
    grid.cells.forEach((cells, row) => {
      cells.forEach((_, col) => {
        expect(pixelToCell(layout, cellToPixel(layout, { row, col }))).toEqual({ row, col });
      });
    });
  });

  it('picks the closest cell for a point between centres', () => {
    const centre = cellToPixel(layout, { row: 2, col: 4 });
    expect(pixelToCell(layout, { x: centre.x + 8, y: centre.y - 6 })).toEqual({ row: 2, col: 4 });
  });

  it('returns null far outside the grid', () => {
    expect(pixelToCell(layout, { x: 100, y: 1000 })).toBeNull();
  });
});
