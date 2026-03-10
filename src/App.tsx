import React, { useEffect } from 'react';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { StatusPanel } from './components/StatusPanel';
import { useWumpusGame } from './hooks/useWumpusGame';
import { Trophy, Skull, CircleDashed } from 'lucide-react';

const App: React.FC = () => {
  const { state, sensors, actions } = useWumpusGame();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          actions.move('NORTH');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          actions.move('SOUTH');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          actions.move('WEST');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          actions.move('EAST');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, state.isGameOver]);

  return (
    <div className="game-container">
      <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '0.25rem' }}>
        <h1 className="title" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>WUMPUS WORLD</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Navigate: WASD/Arrows</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0, minWidth: 0 }}>
        <Grid state={state} />
      </div>

      <div className="controls-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
        <StatusPanel
          sensors={sensors}
          message={state.message}
        />

        {state.isGameOver ? (
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', borderColor: state.message.includes('Victory') ? 'rgba(245, 158, 11, 0.5)' : 'rgba(239, 68, 68, 0.5)' }}>
            {state.message.includes('Victory') ? (
              <Trophy size={48} color="#fbbf24" style={{ margin: '0 auto 1rem' }} />
            ) : state.message.includes('pit') ? (
              <CircleDashed size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            ) : (
              <Skull size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            )}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: state.message.includes('Victory') ? '#fbbf24' : '#ef4444' }}>
              {state.message.includes('Victory') ? 'Victory!' : state.message.includes('pit') ? 'Fell into a Pit!' : 'Eaten by Wumpus!'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn" onClick={actions.respawn} style={{ padding: '0.75rem', fontSize: '1rem' }} title="Retry the same exact cave layout.">
                Respawn
              </button>
              <button className="btn primary" onClick={actions.restart} style={{ padding: '0.75rem', fontSize: '1rem' }} title="Generate a totally new cave.">
                Restart
              </button>
            </div>
          </div>
        ) : (
          <Controls
            actions={actions}
          />
        )}
      </div>
    </div>
  );
};

export default App;
