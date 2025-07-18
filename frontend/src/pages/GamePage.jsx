import { use, useState } from 'react';
import Grid from '../components/Grid.jsx';
import Keyboard from '../components/Keyboard.jsx';
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import { useNavigate } from 'react-router-dom';

function GamePage({ onKeyPress, keyStatuses, resetKeyStatuses }) {
  const navigate = useNavigate();

  const handleGoSelectLevel = () => {
    resetKeyStatuses(); // Reset key statuses when going home
    navigate('/select-level');
  };

  const handleGoHome = () => {
    resetKeyStatuses(); // Reset key statuses when going home
    navigate('/');
  };

  const resetKeyBoard = () => {
    resetKeyStatuses(); // Call the prop to reset keyStatuses in App.jsx
  };


  return (
    <div className="game-page">
      <header className="game-page-header">
        <GoBackImage onClick={handleGoSelectLevel}/>
        <SettingsImage />
      </header>
      <div className='grid-and-keyboard'>
        <Grid onKeyPress={onKeyPress} onGoHome={handleGoHome} resetKeyBoard={resetKeyBoard} />
        <Keyboard keyStatuses={keyStatuses} />
      </div>
    </div>
  );
}

export default GamePage;