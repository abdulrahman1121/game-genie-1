import { useState, useEffect } from 'react';
import Tile from './Tile.jsx';
import './Grid.css';

function Grid({ onKeyPress, onGoHome, resetKeyBoard }) {
  const wordList = [
    'CAKE', 'APPLE', 'CRANE', 'LARGE', 'MOIST', 'PINE', 'LAME', 'RANT', 'FROG', 'SHARK',
    'RIVER', 'UNITY', 'TIGER', 'PLANT', 'BRAVE', 'SNAKE', 'CLOUD', 'FRESH', 'GRAPE', 'HAPPY',
  ].filter(word => word.length >= 4 && word.length <= 5);

  const getRandomWord = () => wordList[Math.floor(Math.random() * wordList.length)];
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const wordLength = targetWord.length;
  const initialGrid = Array(6).fill().map(() => Array(wordLength).fill({ letter: '', status: 'empty' }));
  const [grid, setGrid] = useState(initialGrid);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('active');
  const [showModal, setShowModal] = useState(false);

  const handleGuess = () => {
    const guess = currentGuess.toUpperCase();
    if (
      guess.length !== wordLength ||
      currentRow >= 6 ||
      gameStatus !== 'active'
    ) return;

    const feedback = Array(wordLength).fill('incorrect');
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    // First pass: correct positions
    guessLetters.forEach((letter, index) => {
      if (letter === targetLetters[index]) {
        feedback[index] = 'correct';
        targetLetters[index] = null;
      }
    });

    // Second pass: present letters
    guessLetters.forEach((letter, index) => {
      if (feedback[index] === 'incorrect') {
        const targetIndex = targetLetters.indexOf(letter);
        if (targetIndex !== -1) {
          feedback[index] = 'present';
          targetLetters[targetIndex] = null;
        }
      }
    });

    const newGrid = [...grid];
    newGrid[currentRow] = guessLetters.map((letter, i) => ({
      letter,
      status: feedback[i]
    }));
    setGrid(newGrid);

    const nextStatus =
      guess === targetWord
        ? 'won'
        : currentRow + 1 === 6
        ? 'lost'
        : 'active';

    setGameStatus(nextStatus);
    setCurrentRow(currentRow + 1);
    setCurrentGuess('');

    feedback.forEach((status, i) => {
      onKeyPress(guessLetters[i], status);
    });

    if (nextStatus !== 'active') {
      setTimeout(() => {
        setShowModal(true);
      }, 200); // Delay to allow grid update
    }
  };

  const handleKeyPress = (e) => {
    if (gameStatus !== 'active') return;
    const key = e.key.toUpperCase();
    if ((key === 'ENTER' || key === 'RETURN') && currentGuess.length === wordLength) {
      handleGuess();
    } else if (
      key.match(/^[A-Z]$/) &&
      currentGuess.length < wordLength &&
      currentRow < 6
    ) {
      setCurrentGuess((prev) => prev + key);
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

  const resetGame = () => {
    const newTargetWord = getRandomWord();
    setTargetWord(newTargetWord);
    setGrid(Array(6).fill().map(() => Array(newTargetWord.length).fill({ letter: '', status: 'empty' })));
    setCurrentRow(0);
    setCurrentGuess('');
    setGameStatus('active');
    setShowModal(false);
    resetKeyBoard();
  };


  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, currentRow, gameStatus, targetWord]);

  return (
    <>
      <div className={`grid grid-cols-${wordLength}`}>
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} letter={tile.letter} status={tile.status} />
          ))
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {gameStatus === 'won'
                ? '🎉 Congratulations! You got it'
                : `Nice try! The word was ${targetWord}.`}
            </h2>
            <div className="modal-buttons">
              <button className="play-button" onClick={resetGame}>Play Again</button>
              <button className="play-button" onClick={onGoHome}>Home</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Grid;