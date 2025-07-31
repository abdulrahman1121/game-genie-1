import { useNavigate, useLocation } from "react-router-dom";
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import './RewardsPage.css';

function RewardsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { guessCount = 0, points = 0 } = state || {};

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
        <div className="rewards-component">
          <img src="/rewards.png" alt="rewards" className="rewards-image" />
          <p className="rewards-tries"> {guessCount} </p>
          <p className="rewards-points">+ {points}</p>
        </div>
        <button className="home-button" onClick={() => navigate('/')}>
          <img src="/home-image.png" alt="home" className="home-image"/>
        </button>
        <button className="reset-button" onClick={() => navigate('/game')}>
          <img src="/reset.png" alt="reset" className="reset-image"/>
        </button>
        <button className="flip-button">
          <img src="flip-image.png" alt="flip" className="flip-image"/>
        </button>
      </div>
    </div>
  );
}

export default RewardsPage;

