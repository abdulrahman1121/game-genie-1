import { useNavigate } from "react-router-dom";
import GoBackImage from '../components/GoBackImage.jsx';
import SettingsImage from '../components/SettingsImage.jsx';
import './RewardsPage.css';

function RewardsPage() {
  const navigate = useNavigate();

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
        </div>
        <button className="home-button">
          <img src="/home-image.png" alt="home" className="home-image"/>
        </button>
        <button className="star-button">
          <img src="/star-image.png" alt="star" className="start-image"/>
        </button>
        <button className="flip-button">
          <img src="flip-image.png" alt="flip" className="flip-image"/>
        </button>
      </div>
    </div>
  );
}

export default RewardsPage;

