import { describe, expect, it } from 'vitest';
import { cellToPixel, createEmptyGrid, setCell, type GridLayout } from './grid.ts';
import { hitsGrid, landingCell } from './snap.ts';

const layout: GridLayout = { rows: 8, cols: 8, radius: 20 };
const empty = createEmptyGrid(layout);
const withBubble = setCell(empty, { row: 2, col: 3 }, 'red');
const below = (row: number, col: number, offsetY: number) => {
  const centre = cellToPixel(layout, { row, col });
  return { x: centre.x, y: centre.y + offsetY };
};

describe('hitsGrid', () => {
  it('hits the ceiling', () => {
    expect(hitsGrid(empty, { x: 100, y: 20 })).toBe(true);
    expect(hitsGrid(empty, { x: 100, y: 60 })).toBe(false);
  });

  it('hits a bubble it touches', () => {
    expect(hitsGrid(withBubble, below(2, 3, 30))).toBe(true);
  });

  it('flies past a bubble it does not touch', () => {
    expect(hitsGrid(withBubble, below(2, 3, 40))).toBe(false);
  });
});

describe('landingCell', () => {
  it('lands in the top row when it hits the ceiling', () => {
    expect(landingCell(empty, cellToPixel(layout, { row: 0, col: 5 }))).toEqual({ row: 0, col: 5 });
  });

  it('lands in the empty cell next to the bubble it hit', () => {
    const landed = landingCell(withBubble, below(2, 3, 30));
    expect(landed?.row).toBe(3);
    expect([2, 3]).toContain(landed?.col);
  });

  it('never lands on an occupied cell', () => {
    expect(landingCell(withBubble, cellToPixel(layout, { row: 2, col: 3 }))).not.toEqual({ row: 2, col: 3 });
  });

  it('never lands in a cell that hangs from nothing', () => {
    const floating = landingCell(withBubble, below(6, 3, 0));
    expect(floating).not.toEqual({ row: 6, col: 3 });
  });
});
