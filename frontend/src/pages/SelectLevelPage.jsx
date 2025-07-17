import { useNavigate } from "react-router-dom";
import './SelectLevelPage.css';

// This page allows users to select a level before starting the game
function SelectLevelPage() {
  const navigate = useNavigate();

  return (
    <div className="select-level-page">
        <header className="header">
    </header>
    <h1>Select <br />Grade</h1>
    <button className='beginner' onClick={() => navigate('/game')}>Beginner(1st-2nd)</button>
    <button className='intermediate' onClick={() => navigate('/game')}>Intermediate(3rd-4th)</button>
    <button className='advanced' onClick={() => navigate('/game')}>Advanced(5th-6th)</button>
    </div>
  )

}

export default SelectLevelPage;