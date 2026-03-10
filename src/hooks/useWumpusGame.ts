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
        arrows: 1,
        hasGold: false,
        isWumpusAlive: true,
        isGameOver: false,
        message: "Welcome to the Wumpus Cave. Find the gold and climb out!",
        score: 0,
        canClimb: false,
    }));

    const move = useCallback((dir: Direction) => {
        setState(prev => {
            if (prev.isGameOver) return prev;

            let { x, y } = prev.agentPos;
            const { grid } = prev;
            let message = "";
            let isGameOver = false;
            let score = prev.score - 1;

            if (dir === 'NORTH') y--;
            else if (dir === 'SOUTH') y++;
            else if (dir === 'EAST') x++;
            else if (dir === 'WEST') x--;

            // Check bounds
            if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
                return { ...prev, agentDir: dir, message: "BUMP! You hit a wall.", score };
            }

            const cell = grid[y][x];
            const newGrid = [...grid];
            newGrid[y][x] = { ...cell, isRevealed: true };

            if (cell.hasWumpus && prev.isWumpusAlive) {
                message = "OH NO! The Wumpus ate you!";
                isGameOver = true;
                score -= 1000;
            } else if (cell.hasPit) {
                message = "AAAAAAARGH! You fell into a pit!";
                isGameOver = true;
                score -= 1000;
            }

            return {
                ...prev,
                grid: newGrid,
                agentPos: { x, y },
                agentDir: dir,
                message,
                isGameOver,
                score,
                canClimb: x === 0 && y === 0,
            };
        });
    }, []);

    const grab = useCallback(() => {
        setState(prev => {
            if (prev.isGameOver) return prev;
            const { x, y } = prev.agentPos;
            if (prev.grid[y][x].hasGold) {
                const newGrid = prev.grid.map(row => row.map(cell => ({ ...cell })));
                newGrid[y][x].hasGold = false;
                return {
                    ...prev,
                    grid: newGrid,
                    hasGold: true,
                    message: "You grabbed the GOLD!",
                    score: prev.score - 1
                };
            }
            return { ...prev, message: "There is no gold here.", score: prev.score - 1 };
        });
    }, []);

    const shoot = useCallback(() => {
        setState(prev => {
            if (prev.isGameOver || prev.arrows <= 0) return prev;

            let { x, y } = prev.agentPos;
            const { agentDir, grid } = prev;
            let hit = false;
            let score = prev.score - 10;

            while (true) {
                if (agentDir === 'NORTH') y--;
                else if (agentDir === 'SOUTH') y++;
                else if (agentDir === 'EAST') x++;
                else if (agentDir === 'WEST') x--;

                if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) break;
                if (grid[y][x].hasWumpus) {
                    hit = true;
                    break;
                }
            }

            return {
                ...prev,
                arrows: 0,
                isWumpusAlive: !hit,
                message: hit ? "SCREEEEEEAM! You killed the Wumpus!" : "Your arrow missed and hit deep into the cave.",
                score,
            };
        });
    }, []);

    const climb = useCallback(() => {
        setState(prev => {
            if (prev.isGameOver) return prev;
            if (prev.agentPos.x === 0 && prev.agentPos.y === 0) {
                if (prev.hasGold) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                    return {
                        ...prev,
                        isGameOver: true,
                        message: "Victory! You climbed out with the gold!",
                        score: prev.score + 1000
                    };
                } else {
                    return {
                        ...prev,
                        isGameOver: true,
                        message: "You climbed out empty-handed.",
                        score: prev.score
                    };
                }
            }
            return prev;
        });
    }, []);

    const reset = useCallback(() => {
        setState({
            grid: createInitialGrid(),
            agentPos: { x: 0, y: 0 },
            agentDir: 'EAST',
            arrows: 1,
            hasGold: false,
            isWumpusAlive: true,
            isGameOver: false,
            message: "Welcome to the Wumpus Cave. Find the gold and climb out!",
            score: 0,
            canClimb: false,
        });
    }, []);

    const sensors = getSensors(state);

    return {
        state,
        sensors,
        actions: {
            move,
            grab,
            shoot,
            climb,
            reset
        }
    };
};
