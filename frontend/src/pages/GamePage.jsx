import { useState } from 'react';
import Grid from '../components/Grid.jsx';
import Keyboard from '../components/Keyboard.jsx';
import { useNavigate } from 'react-router-dom';

function GamePage({ onKeyPress, keyStatuses, resetKeyStatuses }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetKeyStatuses(); // Reset key statuses when going home
    navigate('/');
  };

  const resetKeyBoard = () => {
    resetKeyStatuses(); // Call the prop to reset keyStatuses in App.jsx
  };

  return (
    <div className="game-page">
      <header className="header">
        <div className="header-buttons">
          <button className="header-button" title="Back" onClick={handleGoHome} />
        </div>
      </header>
      <Grid onKeyPress={onKeyPress} onGoHome={handleGoHome} resetKeyBoard={resetKeyBoard} />
      <Keyboard keyStatuses={keyStatuses} />
    </div>
  );
}

export default GamePage;