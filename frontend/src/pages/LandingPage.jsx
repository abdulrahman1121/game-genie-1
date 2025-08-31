import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallScreen) {
    return <img src={`${import.meta.env.BASE_URL}error.png`} alt="error for small screens" className='error-display'/>;
  }
  
  return (
    <div className="landing-page">
      <header className="landing-header">
        <span className="game-genie-text">Game Genie</span>
        <button className='signup-button' onClick={() => navigate('/signup')}>
          <img src={`${import.meta.env.BASE_URL}signup2.png`} alt="signup" />
        </button>
      </header>
      <div className="boxes-container">
        <div className="box top-box">start your</div>
        <div className="box middle-box">
          Learning<br />Adventure
        </div>
        <div className="box bottom-box">
          Where learning math, reading and coding feels like play.✧˖°.
        </div>
      </div>
      <button className="quickplay-button" onClick={() => navigate('/select-level')}>
        <img src={`${import.meta.env.BASE_URL}quickplay.png`} alt="quickplay" />
      </button>
    </div>
  );
}

export default LandingPage;