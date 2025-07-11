import { useState, useEffect } from 'react';
import Tile from './Tile.jsx';

function Grid({ onKeyPress }) {
  const initialGrid = Array(6).fill().map(() => Array(6).fill({ letter: '', status: 'empty' }));
  const [grid, setGrid] = useState(initialGrid);
  const [gameId, setGameId] = useState(null);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('active');

  useEffect(() => {
    fetch('http://localhost:5000/api/game/start', { method: 'POST' })
      .then(res => res.json())
      .then(data => setGameId(data.gameId))
      .catch(err => console.error('Error starting game:', err));
  }, []);

  const handleGuess = async () => {
    if (currentGuess.length !== 6 || currentRow >= 6 || gameStatus !== 'active') return;

    try {
      const res = await fetch('http://localhost:5000/api/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, guess: currentGuess })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      const newGrid = [...grid];
      newGrid[currentRow] = currentGuess.split('').map((letter, i) => ({
        letter,
        status: data.feedback[i]
      }));
      setGrid(newGrid);
      setCurrentRow(currentRow + 1);
      setCurrentGuess('');
      setGameStatus(data.status);
      data.feedback.forEach((status, i) => {
        onKeyPress(currentGuess[i].toUpperCase(), status);
      });
      if (data.status !== 'active') {
        alert(data.status === 'won' ? 'You won!' : `Game over! The word was ${data.targetWord}`);
      }
    } catch (err) {
      console.error('Error submitting guess:', err);
    }
  };

  const handleKeyPress = (e) => {
    const key = e.key.toUpperCase();
    if (key === 'ENTER') {
      handleGuess();
    } else if (key.match(/^[A-Z]$/) && currentGuess.length < 6 && currentRow < 6 && gameStatus === 'active') {
      setCurrentGuess(currentGuess + key);
      const newGrid = [...grid];
      newGrid[currentRow][currentGuess.length] = { letter: key, status: 'filled' };
      setGrid(newGrid);
    } else if (key === 'BACKSPACE' && currentGuess.length > 0) {
      const newGrid = [...grid];
      newGrid[currentRow][currentGuess.length - 1] = { letter: '', status: 'empty' };
      setGrid(newGrid);
      setCurrentGuess(currentGuess.slice(0, -1));
    }
    onKeyPress(key);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, currentRow, gameId, gameStatus]);

  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} letter={tile.letter} status={tile.status} />
        ))
      )}
    </div>
  );
}

export default Grid;