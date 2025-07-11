import { useState } from 'react';
import Grid from './components/Grid.jsx';
import Keyboard from './components/Keyboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import './index.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [keyStatuses, setKeyStatuses] = useState({});

  const handleKeyPress = (key) => {
    if (['Enter', 'Backspace'].includes(key)) return;
    setKeyStatuses((prev) => ({ ...prev, [key]: prev[key] || 'unused' }));
  };

  return (
    <div className="app">
      {isPlaying ? (
        <>
          <header className="header">
            <div className="header-placeholder" />
            <h1 className="header-title">Tech Tykes Wordle</h1>
            <div className="header-buttons">
              <button className="header-button" title="Stats" />
              <button className="header-button" title="Settings" />
            </div>
          </header>
          <Grid onKeyPress={handleKeyPress} />
          <Keyboard keyStatuses={keyStatuses} />
        </>
      ) : (
        <LandingPage onPlay={() => setIsPlaying(true)} />
      )}
    </div>
  );
}

export default App;