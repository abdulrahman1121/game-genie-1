import { useNavigate } from "react-router-dom";
import './RewardsPage.css';

function RewardsPage() {
  const navigate = useNavigate();

  return (
    <div className="rewards-page">
      <h1>Rewards Page</h1>
      <p>Congratulations on completing the game!</p>
      <button onClick={() => navigate('/game')}>Go Back to Game</button>
    </div>
  );
}

export default RewardsPage;

