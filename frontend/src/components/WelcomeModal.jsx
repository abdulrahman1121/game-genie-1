import './WelcomeModal.css';

function WelcomeModal({ onClose }) {
  return (
    <div className="modal-overlay">
        <div className='modal-content'>
        <img src={`${import.meta.env.BASE_URL}guide.png`} alt="guide-image" className='guide-img'/>
        <button className="start-button" onClick={onClose}>
          <img src={`${import.meta.env.BASE_URL}start-button.png`} alt="start-button" className='start-btn'/>
        </button>
        </div>
    </div>
  );
}

export default WelcomeModal;