import React from 'react';
import type { GameState, Direction } from '../logic/wumpusGame';
import {
    Skull,
    Flame,
    Coins,
    ArrowUp,
    Mountain,
    Zap,
    Wind,
    Sparkles
} from 'lucide-react';

interface GridProps {
    state: GameState;
}

const getAgentRotation = (dir: Direction) => {
    switch (dir) {
        case 'NORTH': return '0deg';
        case 'EAST': return '90deg';
        case 'SOUTH': return '180deg';
        case 'WEST': return '270deg';
        default: return '0deg';
    }
};

export const Grid: React.FC<GridProps> = ({ state }) => {
    const { grid, agentPos, agentDir, isWumpusAlive } = state;

    return (
        <div className="grid-board glass-panel">
            {grid.map((row, y) => (
                row.map((cell, x) => {
                    const isAgentHere = agentPos.x === x && agentPos.y === y;
                    const neighbors = [
                        { nx: x + 1, ny: y },
                        { nx: x - 1, ny: y },
                        { nx: x, ny: y + 1 },
                        { nx: x, ny: y - 1 },
                    ];

                    let hasStench = false;
                    let hasBreeze = false;

                    neighbors.forEach(({ nx, ny }) => {
                        if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4) {
                            if (grid[ny][nx].hasWumpus) hasStench = true;
                            if (grid[ny][nx].hasPit) hasBreeze = true;
                        }
                    });

                    return (
                        <div
                            key={`${x}-${y}`}
                            className={`cell ${cell.isRevealed ? 'revealed' : ''} ${isAgentHere ? 'current' : ''}`}
                        >
                            <div className="hidden-overlay">
                                <Mountain size={20} opacity={0.3} />
                            </div>

                            <div className="cell-content">
                                {isAgentHere && (
                                    <div className="agent" style={{ transform: `rotate(${getAgentRotation(agentDir)})` }}>
                                        <ArrowUp size={32} strokeWidth={2.5} />
                                    </div>
                                )}

                                {cell.isRevealed && !isAgentHere && (
                                    <>
                                        {cell.hasWumpus && isWumpusAlive && <Skull size={28} color="#ef4444" />}
                                        {cell.hasPit && <Flame size={28} color="#94a3b8" />}
                                        {cell.hasGold && <Coins size={28} color="#f59e0b" className="glitter-pulse" />}
                                    </>
                                )}

                                {cell.isRevealed && (
                                    <div className="indicator-grid">
                                        {hasStench && isWumpusAlive && <span title="Stench" className="indicator"><Zap size={14} color="#f87171" /></span>}
                                        {hasBreeze && <span title="Breeze" className="indicator"><Wind size={14} color="#60a5fa" /></span>}
                                        {cell.hasGold && <span title="Glitter" className="indicator"><Sparkles size={14} color="#fbbf24" /></span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ))}
        </div>
    );
};
