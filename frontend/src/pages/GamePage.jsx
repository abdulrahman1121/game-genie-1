import { useState, useEffect } from 'react';
import Grid from '../components/Grid.jsx';
import Keyboard from '../components/Keyboard.jsx';
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../lib/apiBase.js';
import './GamePage.css';

function GamePage({ onKeyPress, keyStatuses, resetKeyStatuses, gameId, setGameId, setGameStatus, setHint, setExplanation, wordLength, setWordLength, gameStatus, setKeyStatuses, gridKeyPressRef }) {
  const navigate = useNavigate();
  const [hint, setLocalHint] = useState('');
  const [hints, setHints] = useState({ 1: '', 2: '' });
  const [explanation, setLocalExplanation] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [isGameReady, setIsGameReady] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [isActualHint, setIsActualHint] = useState(false);

  useEffect(() => {
    if (!API_BASE) return;
    fetch(`${API_BASE}/openai/start`, { method: "POST" })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        return res.json();
      })
      .then(async data => {
        setGameId(data.gameId);
        setWordLength(data.wordLength);
        setGameStatus("active");
        resetKeyStatuses();
        setLocalExplanation(data.explanation);
        setExplanation(data.explanation);
        setGameMessage("");
        setLocalHint("");
        setGuessCount(0);
        setTargetWord(data.word);
        setIsActualHint(false);

        // Fetch hints for levels 1 and 2
        const hint1Res = await fetch(`${API_BASE}/openai/hint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: data.gameId, hintLevel: 1 })
        });
        const hint1Data = await hint1Res.json();

        const hint2Res = await fetch(`${API_BASE}/openai/hint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: data.gameId, hintLevel: 2 })
        });
        const hint2Data = await hint2Res.json();

        setHints({ 1: hint1Data.hint, 2: hint2Data.hint });
        setIsGameReady(true);
      })
      .catch(err => console.error("Error starting game or fetching hints:", err));
  }, []);

  const handleGoSelectLevel = () => {
    resetKeyStatuses();
    navigate('/select-level');
  };

  const handleGoHome = () => {
    resetKeyStatuses();
    navigate('/');
  };

  if (!isGameReady) {
    return (
      <div className="loading-container">
        <h1 className="loading-text">Game Loading...</h1>
      </div>
    );
  }

  const [definition, example] = explanation ? explanation.split('\n') : ['', ''];

  return (
    <div className="game-page">
      <header className="game-page-header">
        <GoBackImage onClick={handleGoSelectLevel} />
        <SettingsImage />
      </header>
      <div className="game-container">
        <Grid
          onKeyPress={onKeyPress}
          onGoHome={handleGoHome}
          resetKeyBoard={resetKeyStatuses}
          gameId={gameId}
          setGameId={setGameId}
          setGameStatus={setGameStatus}
          setHint={setLocalHint}
          setExplanation={setLocalExplanation}
          wordLength={wordLength}
          setKeyStatuses={setKeyStatuses}
          explanation={explanation}
          gridKeyPressRef={gridKeyPressRef}
          setGameMessage={setGameMessage}
          setGuessCount={setGuessCount}
          targetWord={targetWord}
          setIsActualHint={setIsActualHint}
          hints={hints}
        />
        <div className={`genie-container ${isActualHint ? '' : 'hidden'}`}>
          <img src={`${import.meta.env.BASE_URL}genie3.png`} alt="genie" className="genie-image" />
          <div className="text-box">
            <span className="genie-text">
              {isActualHint && hint && (
                <div className="hint-container">
                  <span className="hint-prefix">Hint...</span>
                  <span>{hint}</span>
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
      {gameStatus !== 'active' && (
        <div className="modal-overlay">
          <div className="modal-text-box">
            <p className="game-message">{gameMessage || 'Game over!'}</p>
            <p className="genie-definition"><strong>Definition:</strong> {definition || 'No definition available'}</p>
            <p className="genie-example"><strong>Example:</strong> {example || 'No example available'}</p>
            <button
              className="next-button"
              onClick={() => {
                navigate('/rewards', {
                  state: {
                    guessCount,
                    points: gameMessage.startsWith('Nice') ? 0 : guessCount <= 3 ? 30 : guessCount <= 5 ? 20 : 10,
                    gameId,
                    targetWord,
                  },
                });
              }}
            >
              <img src={`${import.meta.env.BASE_URL}next-button.png`} alt="next" className="next-image" />
            </button>
          </div>
        </div>
      )}
      <div className="keyboard-container">
        <Keyboard keyStatuses={keyStatuses} onKeyPress={onKeyPress} />
      </div>
    </div>
  );
}

export default GamePage;