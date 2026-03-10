export type Direction = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  hasPit: boolean;
  hasWumpus: boolean;
  hasGold: boolean;
  isRevealed: boolean;
}

export interface GameState {
  grid: Cell[][];
  agentPos: Position;
  agentDir: Direction;
  isWumpusAlive: boolean;
  isGameOver: boolean;
  message: string;
}

export const GRID_SIZE = 4;

export const createInitialGrid = (): Cell[][] => {
  const grid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      hasPit: false,
      hasWumpus: false,
      hasGold: false,
      isRevealed: false,
    }))
  );

  // Helper to get random empty cell (not [0,0])
  const getRandomCell = (): Position => {
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
    } while (x === 0 && y === 0);
    return { x, y };
  };

  // Place Wumpus
  const wumpusPos = getRandomCell();
  grid[wumpusPos.y][wumpusPos.x].hasWumpus = true;

  // Place Gold
  let goldPos;
  do {
    goldPos = getRandomCell();
  } while (goldPos.x === wumpusPos.x && goldPos.y === wumpusPos.y);
  grid[goldPos.y][goldPos.x].hasGold = true;

  // Place Pits (20% chance per cell, except [0,0])
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (x === 0 && y === 0) continue;
      if (grid[y][x].hasWumpus || grid[y][x].hasGold) continue;
      if (Math.random() < 0.2) {
        grid[y][x].hasPit = true;
      }
    }
  }

  // Reveal starting cell
  grid[0][0].isRevealed = true;

  return grid;
};

export const getSensors = (state: GameState) => {
  const { x, y } = state.agentPos;
  const { grid } = state;
  let stench = false;
  let breeze = false;
  let glitter = false;

  const neighbors = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];

  neighbors.forEach(n => {
    if (n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE) {
      if (grid[n.y][n.x].hasWumpus) stench = true;
      if (grid[n.y][n.x].hasPit) breeze = true;
      if (grid[n.y][n.x].hasGold) glitter = true;
    }
  });

  return { stench, breeze, glitter };
};
