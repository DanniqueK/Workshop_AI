export const COLOURS = ['red', 'yellow', 'green', 'blue', 'purple'] as const;
export type Colour = (typeof COLOURS)[number];
export type Cell = Colour | null;

export interface CellPosition {
  readonly row: number;
  readonly col: number;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * Offset hex grid: odd rows are shifted half a bubble to the right
 * and hold one bubble less, so every row fits the same width.
 */
export interface GridLayout {
  readonly rows: number;
  readonly cols: number;
  readonly radius: number;
}

export interface Grid {
  readonly layout: GridLayout;
  readonly cells: readonly (readonly Cell[])[];
}

export const columnsInRow = (layout: GridLayout, row: number): number =>
  row % 2 === 0 ? layout.cols : layout.cols - 1;

export const isInside = (layout: GridLayout, { row, col }: CellPosition): boolean =>
  row >= 0 && row < layout.rows && col >= 0 && col < columnsInRow(layout, row);

export const rowHeight = (layout: GridLayout): number => layout.radius * Math.sqrt(3);

export const gridWidth = (layout: GridLayout): number => layout.cols * layout.radius * 2;

export const createEmptyGrid = (layout: GridLayout): Grid => ({
  layout,
  cells: Array.from({ length: layout.rows }, (_, row) =>
    Array.from({ length: columnsInRow(layout, row) }, (): Cell => null),
  ),
});

export const getCell = (grid: Grid, position: CellPosition): Cell =>
  isInside(grid.layout, position) ? (grid.cells[position.row]?.[position.col] ?? null) : null;

export const setCell = (grid: Grid, position: CellPosition, cell: Cell): Grid => {
  if (!isInside(grid.layout, position)) {
    throw new RangeError(`Cell ${String(position.row)},${String(position.col)} is outside the grid`);
  }
  return {
    layout: grid.layout,
    cells: grid.cells.map((cells, row) =>
      row === position.row ? cells.map((existing, col) => (col === position.col ? cell : existing)) : cells,
    ),
  };
};

export const neighbours = (layout: GridLayout, { row, col }: CellPosition): CellPosition[] => {
  // An odd row sits half a bubble to the right, so its diagonal neighbours are at col and col + 1.
  const diagonalStart = row % 2 === 0 ? col - 1 : col;
  const candidates: CellPosition[] = [
    { row, col: col - 1 },
    { row, col: col + 1 },
    { row: row - 1, col: diagonalStart },
    { row: row - 1, col: diagonalStart + 1 },
    { row: row + 1, col: diagonalStart },
    { row: row + 1, col: diagonalStart + 1 },
  ];
  return candidates.filter((candidate) => isInside(layout, candidate));
};

export const cellToPixel = (layout: GridLayout, { row, col }: CellPosition): Point => ({
  x: layout.radius + col * layout.radius * 2 + (row % 2 === 0 ? 0 : layout.radius),
  y: layout.radius + row * rowHeight(layout),
});

const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

/** The cell whose centre is closest to the point, or null when the point is outside the grid area. */
export const pixelToCell = (layout: GridLayout, point: Point): CellPosition | null => {
  const approximateRow = Math.round((point.y - layout.radius) / rowHeight(layout));
  let closest: CellPosition | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  for (let row = approximateRow - 1; row <= approximateRow + 1; row++) {
    for (let col = 0; col < columnsInRow(layout, row); col++) {
      const candidate = { row, col };
      if (!isInside(layout, candidate)) continue;
      const candidateDistance = distance(point, cellToPixel(layout, candidate));
      if (candidateDistance < closestDistance) {
        closest = candidate;
        closestDistance = candidateDistance;
      }
    }
  }
  return closest !== null && closestDistance <= layout.radius * 2 ? closest : null;
};
