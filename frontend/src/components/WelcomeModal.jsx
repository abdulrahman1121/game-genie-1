import './WelcomeModal.css';

function WelcomeModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-text-box">
        <p className="welcome-message">Welcome to Game Genie!</p>
        <div className="tutorial-tiles">
          <div className="tutorial-tile">
            <img src={`${import.meta.env.BASE_URL}blue-t.png`} alt="Correct Tile" className="tile-image" />
            <p>Correct letter and position</p>
          </div>
          <div className="tutorial-tile">
            <img src={`${import.meta.env.BASE_URL}yellow-t.png`} alt="Present Tile" className="tile-image" />
            <p>Correct letter, wrong position</p>
          </div>
          <div className="tutorial-tile">
            <img src={`${import.meta.env.BASE_URL}grey-t.png`} alt="Incorrect Tile" className="tile-image" />
            <p>Letter not in word</p>
          </div>
        </div>
        <button className="start-button" onClick={onClose}>
          Start Game
        </button>
      </div>
    </div>
  );
}

export default WelcomeModal;