import React from 'react';
import {
    Wind,
    Zap,
    Sparkles
} from 'lucide-react';

interface StatusPanelProps {
    sensors: {
        stench: boolean;
        breeze: boolean;
        glitter: boolean;
    };
    score: number;
    arrows: number;
    hasGold: boolean;
    message: string;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
    sensors,
    score,
    arrows,
    hasGold,
    message
}) => {
    return (
        <div className="status-container glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="message-box glass-panel">
                {message}
            </div>

            <div className="stats-box">
                <div className="stat-row">
                    <span>Score</span>
                    <span className="stat-value">{score}</span>
                </div>
                <div className="stat-row">
                    <span>Arrows</span>
                    <span className="stat-value">{arrows}</span>
                </div>
                <div className="stat-row">
                    <span>Inventory</span>
                    <span className="stat-value">{hasGold ? 'GOLD' : 'None'}</span>
                </div>
            </div>

            <div className="sensors-box">
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sensors</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: sensors.stench ? 1 : 0.3 }}>
                        <Zap size={16} color="#ef4444" />
                        <span style={{ fontSize: '0.85rem' }}>Stench</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: sensors.breeze ? 1 : 0.3 }}>
                        <Wind size={16} color="#60a5fa" />
                        <span style={{ fontSize: '0.85rem' }}>Breeze</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: sensors.glitter ? 1 : 0.3 }}>
                        <Sparkles size={16} color="#fbbf24" />
                        <span style={{ fontSize: '0.85rem' }}>Glitter</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
