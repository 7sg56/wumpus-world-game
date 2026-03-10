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

const getCellBackground = (
    cell: any,
    hasStench: boolean,
    hasBreeze: boolean,
    hasGlitter: boolean,
    renderRevealed: boolean
) => {
    if (!renderRevealed) return undefined;
    if (cell.hasWumpus) return 'rgba(239, 68, 68, 0.4)';
    if (cell.hasPit) return 'rgba(15, 23, 42, 0.8)';
    if (cell.hasGold) return 'rgba(245, 158, 11, 0.4)';

    const colors = [];
    if (hasStench) colors.push('rgba(239, 68, 68, 0.2)');
    if (hasBreeze) colors.push('rgba(96, 165, 250, 0.2)');
    if (hasGlitter) colors.push('rgba(245, 158, 11, 0.2)');

    if (colors.length === 1) return colors[0];
    if (colors.length > 1) {
        const step = 100 / (colors.length - 1);
        const stops = colors.map((c, i) => `${c} ${i * step}%`).join(', ');
        return `linear-gradient(135deg, ${stops})`;
    }

    return undefined;
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
                    let hasGlitter = false;

                    neighbors.forEach(({ nx, ny }) => {
                        if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4) {
                            if (grid[ny][nx].hasWumpus) hasStench = true;
                            if (grid[ny][nx].hasPit) hasBreeze = true;
                            if (grid[ny][nx].hasGold) hasGlitter = true;
                        }
                    });

                    const renderRevealed = cell.isRevealed || (state.isGameOver && state.message.includes('Victory'));

                    return (
                        <div
                            key={`${x}-${y}`}
                            className={`cell ${renderRevealed ? 'revealed' : ''} ${isAgentHere ? 'current' : ''}`}
                            style={{ background: getCellBackground(cell, hasStench, hasBreeze, hasGlitter, renderRevealed) }}
                        >
                            <div className="hidden-overlay">
                                <Mountain size={24} opacity={0.2} />
                            </div>

                            <div className="cell-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute' }}>
                                    {isAgentHere && (
                                        <div className="agent" style={{ transform: `rotate(${getAgentRotation(agentDir)})`, zIndex: 10 }}>
                                            <ArrowUp size={40} strokeWidth={2.5} />
                                        </div>
                                    )}

                                    {renderRevealed && !isAgentHere && (
                                        <>
                                            {cell.hasWumpus && <Skull size={40} color={isWumpusAlive ? "#ef4444" : "#7f1d1d"} />}
                                            {cell.hasPit && <Flame size={40} color="#94a3b8" />}
                                            {cell.hasGold && <Coins size={40} color="#f59e0b" className="glitter-pulse" />}
                                        </>
                                    )}
                                </div>

                                {renderRevealed && (hasStench || hasBreeze || hasGlitter) && (
                                    <div className="indicator-grid" style={{ zIndex: 5 }}>
                                        {hasStench && <span title="Stench" className="indicator"><Zap size={22} color="#f87171" className="glitter-pulse" /></span>}
                                        {hasBreeze && <span title="Breeze" className="indicator"><Wind size={22} color="#60a5fa" className="glitter-pulse" /></span>}
                                        {hasGlitter && <span title="Glitter" className="indicator"><Sparkles size={22} color="#fbbf24" className="glitter-pulse" /></span>}
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
