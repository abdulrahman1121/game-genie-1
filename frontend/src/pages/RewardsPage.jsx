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
        <button className="home-button"></button>
        <button className="star-button"></button>
        <button className="flip-button"></button>
      </div>
    </div>
  );
}

export default RewardsPage;

