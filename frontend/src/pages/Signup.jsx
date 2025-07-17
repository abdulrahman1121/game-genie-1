import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <header className="header">
        <div className="header-placeholder" />
        <h1 className="header-title">Signup</h1>
        <div className="header-buttons">
          <button className="header-button2" title="Back" onClick={() => navigate('/')} >
            ⟵
          </button>
        </div>
      </header>
      <h1>Signup Page</h1>
      <p>This is where the signup form will go.</p>
      {/* Add your signup form here */}
    </div>
  );
}

export default Signup;