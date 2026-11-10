import { getCell, neighbours, setCell, type CellPosition, type Grid } from './grid.ts';

export const MIN_GROUP_SIZE = 3;

const key = ({ row, col }: CellPosition): string => `${String(row)},${String(col)}`;

/** Flood fill: every cell of the same colour connected to the start cell, the start included. */
export const connectedGroup = (grid: Grid, start: CellPosition): CellPosition[] => {
  const colour = getCell(grid, start);
  if (colour === null) return [];

  const visited = new Set([key(start)]);
  const group: CellPosition[] = [];
  const toVisit: CellPosition[] = [start];
  for (let cell = toVisit.pop(); cell !== undefined; cell = toVisit.pop()) {
    group.push(cell);
    for (const neighbour of neighbours(grid.layout, cell)) {
      if (visited.has(key(neighbour)) || getCell(grid, neighbour) !== colour) continue;
      visited.add(key(neighbour));
      toVisit.push(neighbour);
    }
  }
  return group;
};

/** Removes the group the landed bubble belongs to when it is big enough. */
export const popGroup = (grid: Grid, landed: CellPosition): Grid => {
  const group = connectedGroup(grid, landed);
  if (group.length < MIN_GROUP_SIZE) return grid;
  return group.reduce((remaining, cell) => setCell(remaining, cell, null), grid);
};
