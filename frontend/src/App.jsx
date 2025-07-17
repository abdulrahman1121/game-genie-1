import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import GamePage from './pages/GamePage.jsx';
import Signup from './pages/Signup.jsx';
import SelectLevelPage from './pages/SelectLevelPage.jsx';
import { useState } from 'react';
import './index.css';

function App() {
  const [keyStatuses, setKeyStatuses] = useState({});

  const handleKeyPress = (key, status) => {
    if (['Enter', 'Backspace'].includes(key)) return;
    setKeyStatuses((prev) => ({ ...prev, [key]: status || prev[key] || 'unused' }));
  };

  const resetKeyStatuses = () => {
    setKeyStatuses({});
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage onKeyPress={handleKeyPress} keyStatuses={keyStatuses} resetKeyStatuses={resetKeyStatuses} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/select-level" element={<SelectLevelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;