import { useNavigate } from "react-router-dom";
import GoBackImage from "../components/GoBackImage";
import SettingsImage from "../components/SettingsImage";
import './SelectLevelPage.css';

function SelectLevelPage() {
  const navigate = useNavigate();

  return (
    <div className="select-level-page">
      <header className="select-level-header">
        <GoBackImage onClick={() => navigate('/')} />
        <SettingsImage />
      </header>
      <div className="text-and-buttons">
        <div className="select-text">Select</div>
        <div className="grade-text">Grade</div>
        <button className='beginner' onClick={() => navigate('/game', { state: { level: 'beginner' } })}>
          <img src={`${import.meta.env.BASE_URL}beginner.png`} alt="beginner-image" />
        </button>
        <button className='intermediate' onClick={() => navigate('/game', { state: { level: 'intermediate' } })}>
          <img src={`${import.meta.env.BASE_URL}intermediate.png`} alt="intermediate-image" />
        </button>
        <button className='advanced' onClick={() => navigate('/game', { state: { level: 'advanced' } })}>
          <img src={`${import.meta.env.BASE_URL}advanced.png`} alt="advanced-image" />
        </button>
      </div>
    </div>
  );
}

export default SelectLevelPage;