import React, { useState, useEffect, useRef, useCallback } from 'react';

// Helpers for the 3x3 sliding puzzle
const SHUFFLED_STATE = [3, 1, 2, 6, 4, 5, 8, 7, 0]; // 0 is empty space. Hardcoded solvable shuffle.
const WIN_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const Module3Puzzle = ({ saveData, initialData, onNext }) => {
  const [tiles, setTiles] = useState(SHUFFLED_STATE);
  const [moves, setMoves] = useState(0);
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [isWon, setIsWon] = useState(false);
  
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const mousePath = useRef([]);

  // Mouse jitter tracking
  const handleMouseMove = useCallback((e) => {
    if (isWon) return;
    mousePath.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    // Keep array from growing infinitely
    if (mousePath.current.length > 500) mousePath.current.shift();
  }, [isWon]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    startRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setTimeMs(Date.now() - startRef.current);
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timerRef.current);
    };
  }, [handleMouseMove]);

  const checkWin = (currentTiles) => {
    const won = currentTiles.every((val, index) => val === WIN_STATE[index]);
    if (won) {
      setIsWon(true);
      clearInterval(timerRef.current);
    }
  };

  const handleTileClick = (index) => {
    if (isWon) return;
    
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Check if adjacent (manhattan distance === 1)
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      checkWin(newTiles);
    } else {
      setInvalidAttempts(i => i + 1);
    }
  };

  // Calculate simple jitter score: sum of direction changes
  const calculateJitter = () => {
    const path = mousePath.current;
    if (path.length < 3) return 0;
    
    let jitter = 0;
    for (let i = 2; i < path.length; i++) {
      const dx1 = path[i-1].x - path[i-2].x;
      const dy1 = path[i-1].y - path[i-2].y;
      const dx2 = path[i].x - path[i-1].x;
      const dy2 = path[i].y - path[i-1].y;
      
      const dot = (dx1 * dx2 + dy1 * dy2);
      // If dot product is negative or small, there was a sharp turn (jitter)
      if (dot <= 0) jitter++;
    }
    // Normalize 0-100 score (100 = perfectly smooth)
    let score = 100 - Math.min(jitter, 100);
    return score;
  };

  const handleFinish = () => {
    saveData({
      movesCount: moves,
      timeToComplete: Math.round(timeMs / 1000),
      invalidAttempts,
      mouseJitterScore: calculateJitter()
    });
    onNext();
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${seconds}.${tenths}s`;
  };

  return (
    <div className="module-container">
      <div className="module-header" style={{ position: 'relative' }}>
        <h2 className="module-title">Motor Coordination</h2>
        <p className="module-subtitle">Arrange the tiles in order from 1 to 8. Move as quickly and accurately as you can!</p>
        
        <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--assess-primary)' }}>
          {formatTime(timeMs)}
        </div>
      </div>

      <div className="puzzle-container" style={{
        backgroundColor: '#e0f7fa', // pale blue background
        padding: '3rem',
        borderRadius: 'var(--assess-radius)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="puzzle-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 80px)',
          gridTemplateRows: 'repeat(3, 80px)',
          gap: '8px',
          backgroundColor: 'var(--assess-bg)',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          {tiles.map((tile, index) => (
            <div 
              key={index}
              onClick={() => handleTileClick(index)}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: tile === 0 ? 'transparent' : 'var(--assess-card-bg)',
                border: tile === 0 ? 'none' : '1px solid var(--assess-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--assess-text-main)',
                cursor: tile === 0 || isWon ? 'default' : 'pointer',
                boxShadow: tile === 0 ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                transition: 'background-color 0.2s',
              }}
            >
              {tile !== 0 ? tile : ''}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', color: 'var(--assess-text-muted)', fontSize: '0.9rem' }}>
          <span>Moves: <strong>{moves}</strong></span>
          <span>Errors: <strong>{invalidAttempts}</strong></span>
        </div>
        
        {isWon && (
          <div style={{ marginTop: '1.5rem', color: '#34A853', fontWeight: 'bold', animation: 'slideInRight 0.3s ease' }}>
            Puzzle Completed!
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'right' }}>
        <button 
          className="btn-assess btn-assess-primary" 
          onClick={handleFinish} 
          disabled={!isWon && timeMs < 60000} // Allow skipping after 60s
        >
          {isWon ? 'Next Module' : 'Skip Module (After 60s)'}
        </button>
      </div>
    </div>
  );
};

export default Module3Puzzle;
