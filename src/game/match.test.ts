import { describe, expect, it } from 'vitest';
import { createEmptyGrid, getCell, neighbours, setCell, type Cell, type CellPosition, type GridLayout } from './grid.ts';
import { connectedGroup, popGroup } from './match.ts';

const layout: GridLayout = { rows: 8, cols: 8, radius: 20 };

const gridWith = (cells: readonly (readonly [CellPosition, Cell])[]) =>
  cells.reduce((grid, [position, cell]) => setCell(grid, position, cell), createEmptyGrid(layout));

const sorted = (positions: CellPosition[]) => [...positions].sort((a, b) => a.row - b.row || a.col - b.col);

const centre: CellPosition = { row: 3, col: 3 };
/** Six red bubbles in a closed ring around a blue one. */
const ring = neighbours(layout, centre);
const ringGrid = gridWith([[centre, 'blue'], ...ring.map((cell): [CellPosition, Cell] => [cell, 'red'])]);
const [ringStart] = ring;
if (ringStart === undefined) throw new Error('the centre cell must have neighbours');

describe('connectedGroup', () => {
  it('finds the connected cells of the same colour and skips other colours', () => {
    const grid = gridWith([
      [{ row: 0, col: 0 }, 'red'],
      [{ row: 0, col: 1 }, 'red'],
      [{ row: 1, col: 0 }, 'red'],
      [{ row: 0, col: 2 }, 'blue'],
      [{ row: 0, col: 3 }, 'red'],
    ]);
    expect(sorted(connectedGroup(grid, { row: 0, col: 0 }))).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ]);
  });

  it('is empty for an empty cell', () => {
    expect(connectedGroup(createEmptyGrid(layout), centre)).toEqual([]);
  });

  it('follows a group that wraps around another bubble and visits each cell once', () => {
    expect(sorted(connectedGroup(ringGrid, ringStart))).toEqual(sorted(ring));
  });
});

describe('popGroup', () => {
  it('removes a group of three', () => {
    const group: CellPosition[] = [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 3, col: 2 },
    ];
    const grid = gridWith([...group.map((cell): [CellPosition, Cell] => [cell, 'green']), [{ row: 2, col: 4 }, 'red']]);
    const popped = popGroup(grid, { row: 2, col: 3 });
    for (const cell of group) expect(getCell(popped, cell)).toBeNull();
    expect(getCell(popped, { row: 2, col: 4 })).toBe('red');
  });

  it('keeps groups of one and two', () => {
    const single = gridWith([[centre, 'yellow']]);
    expect(popGroup(single, centre)).toBe(single);

    const pair = gridWith([
      [centre, 'yellow'],
      [{ row: 3, col: 4 }, 'yellow'],
    ]);
    expect(popGroup(pair, centre)).toBe(pair);
  });

  it('removes a whole group that wraps around another bubble', () => {
    const popped = popGroup(ringGrid, ringStart);
    for (const cell of ring) expect(getCell(popped, cell)).toBeNull();
    expect(getCell(popped, centre)).toBe('blue');
  });
});
