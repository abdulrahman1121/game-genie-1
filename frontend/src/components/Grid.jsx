import { useState, useEffect } from 'react';
import Tile from './Tile.jsx';
import { API_BASE } from '../lib/apiBase.js';
import './Grid.css';

function Grid({ gameId, setGameId, setGameStatus, setHint, setExplanation, wordLength, onKeyPress, onGoHome, resetKeyBoard, setKeyStatuses, explanation, gridKeyPressRef, setGameMessage, setGuessCount, targetWord, setIsActualHint, hints }) {
  const [grid, setGrid] = useState(() => {
    return wordLength ? Array(6).fill().map(() => Array(wordLength).fill({ letter: '', status: 'empty' })) : [];
  });
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [localGameStatus, setLocalGameStatus] = useState('active');
  const [shakeRow, setShakeRow] = useState(false); // Add shakeRow state

  useEffect(() => {
    if (wordLength) {
      setGrid(Array(6).fill().map(() => Array(wordLength).fill({ letter: '', status: 'empty' })));
    }
  }, [wordLength]);

  const handleKeyPress = (key, status) => {
    if (localGameStatus !== 'active') return;
    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[currentRow] = [...newGrid[currentRow]];
        const lastFilledIndex = prev[currentRow].findLastIndex(t => t.letter !== '');
        newGrid[currentRow][lastFilledIndex >= 0 ? lastFilledIndex : 0] = { letter: '', status: 'empty' };
        return newGrid;
      });
      onKeyPress(key, 'empty');
      return;
    }
    if (key === 'ENTER') {
      handleGuess();
      return;
    }
    if (currentGuess.length < wordLength && /^[A-Za-z]$/.test(key)) {
      setCurrentGuess(prev => prev + key.toUpperCase());
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[currentRow] = [...newGrid[currentRow]];
        newGrid[currentRow][currentGuess.length] = { letter: key.toUpperCase(), status: 'empty' };
        return newGrid;
      });
      onKeyPress(key.toUpperCase(), 'empty');
    }
  };

  useEffect(() => {
    gridKeyPressRef.current = handleKeyPress;
    return () => { gridKeyPressRef.current = null; };
  }, [gridKeyPressRef, handleKeyPress]);

  // Validate guess against WordsAPI with caching
  const isValidWord = async (word) => {
    const cache = JSON.parse(sessionStorage.getItem('wordCache') || '{}');
    const lowerWord = word.toLowerCase();
    if (cache[lowerWord] !== undefined) {
      return cache[lowerWord];
    }

    try {
      const res = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${lowerWord}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_WORDS_API_KEY,
          'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
      });
      const isValid = res.status === 200;
      cache[lowerWord] = isValid;
      sessionStorage.setItem('wordCache', JSON.stringify(cache));
      return isValid;
    } catch (err) {
      console.error('WordsAPI validation error:', err);
      setGameMessage('Error validating word. Please try again.');
      return false; // Fallback to invalid on error
    }
  };

  const handleGuess = async () => {
    if (currentGuess.length !== wordLength || localGameStatus !== 'active') return;

    // Check if guess is a valid dictionary word
    const isValid = await isValidWord(currentGuess);
    if (!isValid) {
      setGameMessage('Invalid word! Please enter a valid English word.');
      setShakeRow(true); // Trigger shake animation
      setTimeout(() => {
        setShakeRow(false);
        // Clear the current row's tiles after shake
        setGrid(prev => {
          const newGrid = [...prev];
          newGrid[currentRow] = Array(wordLength).fill({ letter: '', status: 'empty' });
          return newGrid;
        });
        setCurrentGuess('');
      }, 400); // Match animation duration
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/openai/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, guess: currentGuess })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGuessCount(currentRow + 1);

      const newGrid = [...grid];
      newGrid[currentRow] = currentGuess.split('').map((letter, i) => ({
        letter,
        status: data.feedback[i]
      }));
      setGrid(newGrid);
      setCurrentRow(currentRow + 1);
      setCurrentGuess('');
      setLocalGameStatus(data.status);
      setGameStatus(data.status);

      currentGuess.split('').forEach((letter, i) => {
        onKeyPress(letter.toUpperCase(), data.feedback[i]);
      });

      if (data.status !== 'active') {
        setGameMessage(
          data.status === 'won'
            ? `🎉 Congratulations! You guessed "${targetWord}"!`
            : `Nice try! The word was "${targetWord}".`
        );
        setIsActualHint(false);
      } else if (currentRow === 2 && hints[1]) {
        setHint(hints[1]);
        setIsActualHint(true);
      } else if (currentRow === 4 && hints[2]) {
        setHint(hints[2]);
        setIsActualHint(true);
      } else {
        setHint('');
        setIsActualHint(false);
      }
    } catch (err) {
      console.error('Error submitting guess:', err);
      setGameMessage('Error submitting guess. Please try again.');
    }
  };

  const resetGame = () => {
    fetch(`${API_BASE}/openai/start`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setGrid(Array(6).fill().map(() => Array(data.wordLength).fill({ letter: '', status: 'empty' })));
        setCurrentRow(0);
        setCurrentGuess('');
        setLocalGameStatus('active');
        setHint('');
        setGameStatus('active');
        setExplanation('');
        setGameMessage('');
        setGameId(data.gameId);
        setKeyStatuses({});
        resetKeyBoard();
        setGuessCount(0);
        setIsActualHint(false);
      })
      .catch(err => console.error('Error starting new game:', err));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE', 'empty');
      } else if (e.key === 'Enter') {
        handleKeyPress('ENTER', 'empty');
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase(), 'empty');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className={`grid grid-cols-${wordLength}`}>
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} letter={tile.letter} status={tile.status} />
        ))
      )}
    </div>
  );
}

export default Grid;