import React, { useEffect } from 'react';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { StatusPanel } from './components/StatusPanel';
import { useWumpusGame } from './hooks/useWumpusGame';
import { Trophy, Skull } from 'lucide-react';

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
        case 'g':
        case 'G':
          actions.grab();
          break;
        case 'f':
        case 'F':
        case ' ': // spacebar
          e.preventDefault(); // Prevent scrolling when shooting with space
          actions.shoot();
          break;
        case 'c':
        case 'C':
          actions.climb();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, state.isGameOver]);

  return (
    <div className="game-container">
      <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="title">WUMPUS WORLD</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Navigate: WASD/Arrows | Shoot: Space/F | Grab: G | Climb: C</p>
      </div>

      <Grid state={state} />

      <div className="controls-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <StatusPanel
          sensors={sensors}
          score={state.score}
          arrows={state.arrows}
          hasGold={state.hasGold}
          message={state.message}
        />

        <Controls
          actions={actions}
          disabled={state.isGameOver}
          canClimb={state.canClimb}
          arrows={state.arrows}
        />
      </div>

      {state.isGameOver && (
        <div className="game-over-overlay">
          {state.hasGold && state.canClimb ? (
            <Trophy size={80} color="#fbbf24" style={{ marginBottom: '1rem' }} />
          ) : (
            <Skull size={80} color="#ef4444" style={{ marginBottom: '1rem' }} />
          )}
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Game Over</h2>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>{state.message}</p>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2.5rem' }}>
            Final Score: <span style={{ color: '#f59e0b' }}>{state.score}</span>
          </div>
          <button className="btn primary" onClick={actions.reset} style={{ padding: '1rem 3rem', fontSize: '1rem' }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
