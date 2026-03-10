import { useState, useCallback } from 'react';
import type {
    GameState,
    Direction
} from '../logic/wumpusGame';
import {
    GRID_SIZE,
    createInitialGrid,
    getSensors
} from '../logic/wumpusGame';
import confetti from 'canvas-confetti';

export const useWumpusGame = () => {
    const [state, setState] = useState<GameState>(() => ({
        grid: createInitialGrid(),
        agentPos: { x: 0, y: 0 },
        agentDir: 'EAST',
        isWumpusAlive: true,
        isGameOver: false,
        message: "Welcome to the Wumpus Cave. Find the gold to win!"
    }));

    const move = useCallback((dir: Direction) => {
        setState(prev => {
            if (prev.isGameOver) return prev;

            let { x, y } = prev.agentPos;
            const { grid } = prev;
            let message = "";
            let isGameOver = false;

            if (dir === 'NORTH') y--;
            else if (dir === 'SOUTH') y++;
            else if (dir === 'EAST') x++;
            else if (dir === 'WEST') x--;

            // Check bounds
            if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
                return { ...prev, agentDir: dir, message: "BUMP! You hit a wall." };
            }

            const cell = grid[y][x];
            const newGrid = [...grid];
            newGrid[y][x] = { ...cell, isRevealed: true };

            if (cell.hasGold) {
                message = "Victory! You found the gold!";
                isGameOver = true;
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else if (cell.hasWumpus && prev.isWumpusAlive) {
                message = "OH NO! The Wumpus ate you!";
                isGameOver = true;
            } else if (cell.hasPit) {
                message = "AAAAAAARGH! You fell into a pit!";
                isGameOver = true;
            }

            return {
                ...prev,
                grid: newGrid,
                agentPos: { x, y },
                agentDir: dir,
                message,
                isGameOver,
            };
        });
    }, []);

    const restart = useCallback(() => {
        setState({
            grid: createInitialGrid(),
            agentPos: { x: 0, y: 0 },
            agentDir: 'EAST',
            isWumpusAlive: true,
            isGameOver: false,
            message: "Welcome to the Wumpus Cave. Find the gold to win!",
        });
    }, []);

    const respawn = useCallback(() => {
        setState(prev => ({
            grid: prev.grid.map((row, y) => row.map((cell, x) => ({
                ...cell,
                isRevealed: x === 0 && y === 0
            }))),
            agentPos: { x: 0, y: 0 },
            agentDir: 'EAST',
            isWumpusAlive: true,
            isGameOver: false,
            message: "Respawned in the same cave.",
        }));
    }, []);

    const sensors = getSensors(state);

    return {
        state,
        sensors,
        actions: {
            move,
            restart,
            respawn
        }
    };
};
