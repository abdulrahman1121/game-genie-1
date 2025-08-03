import { useNavigate, useLocation } from "react-router-dom";
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import Unscramble from "../components/Unscramble.jsx";
import './RewardsPage.css';
import { useState } from "react";

function RewardsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { guessCount = 0, points = 0, gameId = '', targetWord = '' } = state || {};
  const [isFlipped, setIsFlipped] = useState(false);
  const [showUnscramble, setShowUnscramble] = useState(false);
  const [updatedPoints, setUpdatedPoints] = useState(points);
  const [genieMessage, setGenieMessage] = useState(
    'Welcome to the Bonus Challenge, test your luck and practice your vocabulary!'
  );

  const handleUnscrambleResult = (isCorrect, tries) => {
    if (isCorrect) {
      setUpdatedPoints(points * 2);
      setGenieMessage('Awesome! You unscrambled it correctly and doubled your points!');
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setShowUnscramble(false);
          setIsFlipped(false);
        }, 600);
      }, 1000);
    } else if (tries >= 3) {
      setGenieMessage('You used all 3 attempts. Returning to rewards.');
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setShowUnscramble(false);
          setIsFlipped(false);
        }, 600);
      }, 1000);
    } else {
      setGenieMessage(`Incorrect! You have ${3 - tries} tries left.`);
    }
  };

  const getGeniePrefix = () => {
  if (genieMessage.startsWith('Welcome')) {
    return <span className="bonus">Bonus Challenge!</span>;
  } else if (genieMessage.startsWith('Awesome')) {
    return <span className="good-job">Good Job!</span>;
  } else if (genieMessage.startsWith('Incorrect')) {
    return <span className="try-again">Try Again!</span>;
  } else {
    return <span className="maybe-next-time">Maybe Next Time!</span>; // No prefix for other cases (e.g., "Nice try!")
  }
};

  return (
    <div className="rewards-page">
      <header classname='rewards-page-header'>
        <GoBackImage onClick={() => navigate('/game')} />
        <SettingsImage />
      </header>
      <div className="rewards-container">
        <div className="genie-container2">
          <img src="/genie3.png" alt="genie-image" className='genie-image2'/>
          <div className="genie-text3">
            {getGeniePrefix()}
            <span>{genieMessage}</span>
          </div>
        </div>
        <div className='rewards-component'>
          {showUnscramble ? (
            <Unscramble
              gameId={gameId}
              targetWord={targetWord}
              onResult={handleUnscrambleResult} />
          ): (
            <>
              <img src="/rewards.png" alt="rewards" className={`rewards-image ${isFlipped ? 'flip' : ''}`}/>
              <p className={`rewards-tries ${isFlipped ? 'flip' : ''}`}> {guessCount} </p>
              <p className={`rewards-points ${isFlipped ? 'flip' : ''}`}>+ {updatedPoints}</p>
              <button className={`home-button ${isFlipped ? 'flip' : ''}`} onClick={() => navigate('/')}>
                <img src="/home-image.png" alt="home" className="home-image"/>
              </button>
              <button className={`sparkle-button ${isFlipped ? 'flip' : ''}`} onClick={() => {
                  setIsFlipped(true);
                  setTimeout(() => {
                    setShowUnscramble(true);
                    setIsFlipped(false);
                  }, 600) // match animation duration
                }}>
                <img src="/sparkle.png" alt="sparkle" className="sparkle-image"/>
              </button>
              <button className={`flip-button ${isFlipped ? 'flip' : ''}`} onClick={() => navigate('/game')}>
                <img src="flip-image.png" alt="flip" className="flip-image"/>
              </button>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default RewardsPage;

