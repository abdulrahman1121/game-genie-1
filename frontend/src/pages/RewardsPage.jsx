import { useNavigate, useLocation } from "react-router-dom";
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import Unscramble from "../components/Unscramble.jsx";
import { updateCoins, getCoins, initSession, SESSION_KEY, BONUS_SESSION_KEY } from '../utils/sessionUtils.js';
import './RewardsPage.css';
import { useState, useEffect } from "react";

function RewardsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { guessCount = 0, points = 0, gameId = '', targetWord = '', totalCoins = 0, level = 'intermediate' } = state || {};
  const [isFlipped, setIsFlipped] = useState(false);
  const [showUnscramble, setShowUnscramble] = useState(false);
  const [updatedPoints, setUpdatedPoints] = useState(points);
  const [totalCoinsState, setTotalCoinsState] = useState(totalCoins);
  const [genieMessage, setGenieMessage] = useState(
    'Well done! to double your points, click on the sparkle button.'
  );
  const [showBonus, setShowBonus] = useState(false);
  const [correctSentence, setCorrectSentence] = useState('');

  useEffect(() => {
    const bonusSession = initSession(BONUS_SESSION_KEY); // Use bonus session key
    setTotalCoinsState(getCoins());
    if (bonusSession.isNewSession) {
      setShowBonus(true);
    }
    console.log('RewardsPage Bonus Session:', { isNewSession: bonusSession.isNewSession, bonusSession }); // Debug
  }, []);

  // Check bonus session every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const bonusSession = initSession(BONUS_SESSION_KEY);
      if (bonusSession.isNewSession) {
        setShowBonus(true);
      }
    }, 2 * 60 * 1000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  const handleUnscrambleResult = (isCorrect, tries, sentence) => {
    if (isCorrect) {
      const bonusPoints = updatedPoints;
      const newTotalCoins = updateCoins(bonusPoints);
      setUpdatedPoints(bonusPoints * 2);
      setTotalCoinsState(newTotalCoins);
      setGenieMessage('Awesome! You got it right and doubled your points! what next!');
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setShowUnscramble(false);
          setIsFlipped(false);
        }, 800);
      }, 50);
    } else if (tries >= 3) {
      setCorrectSentence(sentence);
      setGenieMessage('You used all 3 attempts.');
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

  return (
    <div className="rewards-page">
      <header className='rewards-page-header'>
        <GoBackImage onClick={() => navigate('/select-level')} />
        <SettingsImage />
      </header>
      <div className="rewards-container">
        <div className="show-points">
          <span className="points">{totalCoinsState}</span>
          <img src={`${import.meta.env.BASE_URL}coin.png`} alt="coin" className="coin-image"/>
        </div>
        <div className="genie-container2">
          <img src={`${import.meta.env.BASE_URL}newgenie.png`} alt="genie-image" className='genie-image2'/>
          {(genieMessage.startsWith('Awesome') || genieMessage.startsWith('You')) && (
            <>
              <img src={`${import.meta.env.BASE_URL}point.png`} alt="" className='point-image2'/>
              <div className="text-box2">
                <div className="genie-text3">
                  {getGeniePrefix()}
                  <span>{genieMessage}</span>
                  {genieMessage.startsWith('You') && (
                    <div className="correct">
                      <strong>Correct: </strong>
                      <p className="correct-sentence">{correctSentence}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
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
                  setShowBonus(false); // Hide bonus on click
                  setGenieMessage('Welcome to the Bonus Challenge, click on the word tiles to place it and click again to remove it!');
                  setIsFlipped(true);
                  setTimeout(() => {
                    setShowUnscramble(true);
                    setIsFlipped(false);
                  }, 500);
                }}>
                  <img src={`${import.meta.env.BASE_URL}bonus.png`} alt="sparkle" className="sparkle-image"/>
                </button>
                <button className={`new-game-button ${isFlipped ? 'flip' : ''}`} onClick={() => {
                  setShowBonus(false); // Hide bonus on click
                  navigate('/game', { state: { level } });
                }}>
                  <img src={`${import.meta.env.BASE_URL}new-next.png`} alt="skip" className="skip-image"/>
                </button>
              </div>
              {showBonus && (
                <>
                  <img src={`${import.meta.env.BASE_URL}bonus-bubble.png`} alt="bonus-text-bubble" className="bonus-img"/>
                  <p className="bonus-text">bonus</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RewardsPage;