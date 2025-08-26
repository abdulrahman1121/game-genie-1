import './WelcomeModal.css';

function WelcomeModal({ onClose, buttonType }) { // + Add buttonType prop
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={`${import.meta.env.BASE_URL}guide.png`} alt="guide-image" className="guide-img" />
        {buttonType === 'start' ? (
          <button className="start-button" onClick={onClose}>
            <img src={`${import.meta.env.BASE_URL}start-button.png`} alt="start-button" className="start-btn" />
          </button>
        ) : (
          <button className="close-button" onClick={onClose}>
            <img src={`${import.meta.env.BASE_URL}close-all.png`} alt="close" className="close-btn" />
          </button>
        )}
      </div>
    </div>
  );
}

export default WelcomeModal;