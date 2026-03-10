import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Direction } from '../logic/wumpusGame';

interface ControlsProps {
    actions: {
        move: (dir: Direction) => void;
        restart: () => void;
        respawn: () => void;
    };
}

export const Controls: React.FC<ControlsProps> = ({ actions }) => {
    return (
        <div className="controls-panel">
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Movement</h4>
            <div className="dpad-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button className="btn" style={{ width: '64px', height: '64px', padding: 0, justifyContent: 'center' }} onClick={() => actions.move('NORTH')} title="Move North">
                    <ArrowUp size={28} />
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ width: '64px', height: '64px', padding: 0, justifyContent: 'center' }} onClick={() => actions.move('WEST')} title="Move West">
                        <ArrowLeft size={28} />
                    </button>
                    <button className="btn" style={{ width: '64px', height: '64px', padding: 0, justifyContent: 'center' }} onClick={() => actions.move('SOUTH')} title="Move South">
                        <ArrowDown size={28} />
                    </button>
                    <button className="btn" style={{ width: '64px', height: '64px', padding: 0, justifyContent: 'center' }} onClick={() => actions.move('EAST')} title="Move East">
                        <ArrowRight size={28} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: 'auto' }}>
                <button className="btn" onClick={actions.respawn} style={{ padding: '0.75rem', fontSize: '0.85rem' }} title="Retry the same exact cave layout.">
                    Respawn
                </button>
                <button className="btn primary" onClick={actions.restart} style={{ padding: '0.75rem', fontSize: '0.85rem' }} title="Generate a totally new cave.">
                    Restart
                </button>
            </div>
        </div>
    );
};
