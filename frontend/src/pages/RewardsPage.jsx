import { useNavigate, useLocation } from "react-router-dom";
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import Unscramble from "../components/Unscramble.jsx";
import './RewardsPage.css';
import { useState } from "react";

function RewardsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { guessCount = 0, points = 0 } = state || {};
  const [isFlipped, setIsFlipped] = useState(false);
  const [showUnscramble, setShowUnscramble] = useState(false);

  return (
    <div className="rewards-page">
      <header classname='rewards-page-header'>
        <GoBackImage onClick={() => navigate('/game')} />
        <SettingsImage />
      </header>
      <div className="rewards-container">
        <div className="genie-container2">
          <img src="/genie.png" alt="genie-image" className='genie-image2'/>
        </div>
        <div className='rewards-component'>
          {showUnscramble ? (
            <Unscramble />
          ): (
            <>
              <img src="/rewards.png" alt="rewards" className={`rewards-image ${isFlipped ? 'flip' : ''}`}/>
              <p className={`rewards-tries ${isFlipped ? 'flip' : ''}`}> {guessCount} </p>
              <p className={`rewards-points ${isFlipped ? 'flip' : ''}`}>+ {points}</p>
              <button className={`home-button ${isFlipped ? 'flip' : ''}`} onClick={() => navigate('/')}>
                <img src="/home-image.png" alt="home" className="home-image"/>
              </button>
              <button className={`reset-button ${isFlipped ? 'flip' : ''}`} onClick={() => navigate('/game')}>
                <img src="/reset.png" alt="reset" className="reset-image"/>
              </button>
              <button className={`flip-button ${isFlipped ? 'flip' : ''}`} 
                onClick={() => {
                  setIsFlipped(true);
                  setTimeout(() => {
                    setShowUnscramble(true);
                    setIsFlipped(false);
                  }, 600) // match animation duration
                }}>
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

