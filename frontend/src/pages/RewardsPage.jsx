import { useNavigate, useLocation } from "react-router-dom";
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import Unscramble from "../components/Unscramble.jsx";
import { updateCoins, getCoins } from '../utils/sessionUtils.js';
import './RewardsPage.css';
import { useState, useEffect } from "react";

function RewardsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { guessCount = 0, points = 0, gameId = '', targetWord = '', totalCoins = 0 } = state || {};
  const [isFlipped, setIsFlipped] = useState(false);
  const [showUnscramble, setShowUnscramble] = useState(false);
  const [updatedPoints, setUpdatedPoints] = useState(points);
  const [totalCoinsState, setTotalCoinsState] = useState(totalCoins);
  const [genieMessage, setGenieMessage] = useState(
    'Well done! You have a chance to double your reward points, if you are interested, click on the sparkle button.'
  );

  useEffect(() => {
    setTotalCoinsState(getCoins());
  }, []);

  const handleUnscrambleResult = (isCorrect, tries, sentence) => {
    if (isCorrect) {
      const bonusPoints = updatedPoints;
      const newTotalCoins = updateCoins(bonusPoints);
      setUpdatedPoints(bonusPoints * 2);
      setTotalCoinsState(newTotalCoins);
      setGenieMessage('Awesome! You unscrambled it correctly and doubled your points! Choose what you would like to do next!');
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setShowUnscramble(false);
          setIsFlipped(false);
        }, 800);
      }, 50);
    } else if (tries >= 3) {
      setCorrectSentence(sentence);
      setGenieMessage('Unfortunately you used all 3 attempts. Returning to rewards.');
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setShowUnscramble(false);
          setIsFlipped(false);
        }, 500);
      }, 50);
    } else if ((3 - tries) === 1) {
      setGenieMessage('Incorrect! You have 1 try left.');
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
    } else if (genieMessage.startsWith('Well')) {
      return <span className="well">Good Game!</span>;
    } else {
      return <span className="maybe-next-time">Maybe Next Time!</span>;
    }
  };

  const [correctSentence, setCorrectSentence] = useState('');

  return (
    <div className="rewards-page">
      <header className='rewards-page-header'>
        <GoBackImage onClick={() => navigate('/game')} />
        <SettingsImage />
      </header>
      <div className="rewards-container">
        <div className="show-points">
          <span className="points">{totalCoinsState}</span>
          <img src={`${import.meta.env.BASE_URL}coin.png`} alt="coin" className="coin-image"/>
        </div>
        <div className="genie-container2">
          <img src={`${import.meta.env.BASE_URL}point.png`} alt="" className='point-image2'/>
          <img src={`${import.meta.env.BASE_URL}newgenie.png`} alt="genie-image" className='genie-image2'/>
          <div className="text-box2">
            <div className="genie-text3">
              {getGeniePrefix()}
              <span>{genieMessage}</span>
              {genieMessage.startsWith('Unfortunately') && (
                <div className="correct">
                  <strong>Correct: </strong>
                  <p className="correct-sentence">{correctSentence}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='rewards-component'>
          {showUnscramble ? (
            <Unscramble
              gameId={gameId}
              targetWord={targetWord}
              onResult={handleUnscrambleResult}
            />
          ) : (
            <>
              <img src={`${import.meta.env.BASE_URL}rewards.png`} alt="rewards" className={`rewards-image ${isFlipped ? 'flip' : ''}`}/>
              <p className={`rewards-tries ${isFlipped ? 'flip' : ''}`}>{guessCount}</p>
              <p className={`rewards-points ${isFlipped ? 'flip' : ''}`}>+ {updatedPoints}</p>
              <div className="reward-buttons">
                <button className={`sparkle-button ${isFlipped ? 'flip' : ''}`} onClick={() => {
                  setGenieMessage('Welcome to the Bonus Challenge, click on the word tiles to place it and click again to remove it!');
                  setIsFlipped(true);
                  setTimeout(() => {
                    setShowUnscramble(true);
                    setIsFlipped(false);
                  }, 500);
                }}>
                  <img src={`${import.meta.env.BASE_URL}sparkle.png`} alt="sparkle" className="sparkle-image"/>
                </button>
                <button className={`new-game-button ${isFlipped ? 'flip' : ''}`} onClick={() => navigate('/game')}>
                  <img src={`${import.meta.env.BASE_URL}skip-image.png`} alt="skip" className="skip-image"/>
                </button>
                <button className={`home-button ${isFlipped ? 'flip' : ''}`} onClick={() => navigate('/')}>
                  <img src={`${import.meta.env.BASE_URL}home-image.png`} alt="home" className="home-image"/>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RewardsPage;