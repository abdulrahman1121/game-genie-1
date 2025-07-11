import React from 'react';

function LandingPage({ onPlay }) {
  return (
    <div className="landing-page">
      <button className="play-button" onClick={onPlay}>Play</button>
    </div>
  );
}

export default LandingPage;