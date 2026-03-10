import React from 'react';
import {
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Hand,
    Crosshair,
    Mountain
} from 'lucide-react';
import type { Direction } from '../logic/wumpusGame';

interface ControlsProps {
    actions: {
        move: (dir: Direction) => void;
        grab: () => void;
        shoot: () => void;
        climb: () => void;
        reset: () => void;
    };
    disabled: boolean;
    canClimb: boolean;
    arrows: number;
}

export const Controls: React.FC<ControlsProps> = ({ actions, disabled, canClimb, arrows }) => {
    return (
        <div className="controls-panel">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                <button className="btn primary" style={{ width: '80px' }} onClick={() => actions.move('NORTH')} disabled={disabled} title="Move North">
                    <ArrowUp size={20} />
                    <span>Up</span>
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn" style={{ width: '80px' }} onClick={() => actions.move('WEST')} disabled={disabled} title="Move West">
                        <ArrowLeft size={20} />
                        <span>Left</span>
                    </button>
                    <button className="btn" style={{ width: '80px' }} onClick={() => actions.move('SOUTH')} disabled={disabled} title="Move South">
                        <ArrowDown size={20} />
                        <span>Down</span>
                    </button>
                    <button className="btn" style={{ width: '80px' }} onClick={() => actions.move('EAST')} disabled={disabled} title="Move East">
                        <ArrowRight size={20} />
                        <span>Right</span>
                    </button>
                </div>
            </div>

            <div className="action-grid">
                <button className="btn" onClick={actions.grab} disabled={disabled} title="Grab Gold">
                    <Hand size={20} />
                    <span>Grab</span>
                </button>
                <button className="btn" onClick={actions.shoot} disabled={disabled || arrows <= 0} title="Shoot Arrow">
                    <Crosshair size={20} />
                    <span>Shoot</span>
                </button>
                <button className="btn" onClick={actions.climb} disabled={disabled || !canClimb} title="Climb Out">
                    <Mountain size={20} />
                    <span>Climb</span>
                </button>
            </div>

            <button className="btn" onClick={actions.reset} style={{ width: '100%', marginTop: 'auto' }}>
                Reset Game
            </button>
        </div>
    );
};
