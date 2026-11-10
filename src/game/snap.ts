import { cellToPixel, getCell, neighbours, type CellPosition, type Grid, type Point } from './grid.ts';

/** Bubbles count as touching a bit before their edges meet, which feels fairer to the player. */
const TOUCH_FACTOR = 0.85;

const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

const allCells = (grid: Grid): CellPosition[] =>
  grid.cells.flatMap((cells, row) => cells.map((_, col) => ({ row, col })));

export const hitsGrid = (grid: Grid, position: Point): boolean => {
  const { radius } = grid.layout;
  if (position.y - radius <= 0) return true;
  return allCells(grid).some(
    (cell) =>
      getCell(grid, cell) !== null && distance(position, cellToPixel(grid.layout, cell)) < radius * 2 * TOUCH_FACTOR,
  );
};

/** The closest empty cell that hangs from the ceiling or from another bubble. */
export const landingCell = (grid: Grid, position: Point): CellPosition | null => {
  const isAttached = (cell: CellPosition): boolean =>
    cell.row === 0 || neighbours(grid.layout, cell).some((neighbour) => getCell(grid, neighbour) !== null);

  let closest: CellPosition | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  for (const cell of allCells(grid)) {
    if (getCell(grid, cell) !== null || !isAttached(cell)) continue;
    const cellDistance = distance(position, cellToPixel(grid.layout, cell));
    if (cellDistance < closestDistance) {
      closest = cell;
      closestDistance = cellDistance;
    }
  }
  return closest;
};
