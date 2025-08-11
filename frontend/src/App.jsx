import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import GamePage from './pages/GamePage.jsx';
import Signup from './pages/Signup.jsx';
import SelectLevelPage from './pages/SelectLevelPage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';
import { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import './index.css';

function App() {
  const [keyStatuses, setKeyStatuses] = useState({});
  const [gameId, setGameId] = useState(null);
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  const [gameStatus, setGameStatus] = useState('active');
  const [wordLength, setWordLength] = useState('');
  const gridKeyPressRef = useRef(null);

  const resetKeyStatuses = () => {
    setKeyStatuses({});
  };

  const handleKeyPress = (key, status) => {
    if (status !== 'empty') {
      setKeyStatuses(prev => {
        const newStatuses = { ...prev };
        const currentStatus = newStatuses[key] || 'empty';
        const priority = { correct: 3, present: 2, absent: 1, empty: 0 };
        // Update if current is empty, or status is absent and current is not correct/present, or new status has higher priority
        if (currentStatus === 'empty' || (status === 'absent' && !['correct', 'present'].includes(currentStatus)) || priority[status] > priority[currentStatus]) {
          newStatuses[key] = status;
        }
        return newStatuses;
      });
    }
  };

  useEffect(() => {
    if (gameId) {
      const unsubscribe = onSnapshot(doc(db, 'games', gameId), (doc) => {
        const data = doc.data();
        if (data) {
          setHint(data.hints?.[data.hints.length - 1]?.hint || hint);
          setGameStatus(data.status);
          setWordLength(data.word.length);
        }
      });
      return () => unsubscribe();
    }
  }, [gameId]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/game"
            element={
              <GamePage
                onKeyPress={handleKeyPress}
                keyStatuses={keyStatuses}
                resetKeyStatuses={resetKeyStatuses}
                gameId={gameId}
                setGameId={setGameId}
                setGameStatus={setGameStatus}
                setHint={setHint}
                setExplanation={setExplanation}
                wordLength={wordLength}
                setWordLength={setWordLength}
                gameStatus={gameStatus}
                setKeyStatuses={setKeyStatuses}
                gridKeyPressRef={gridKeyPressRef}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/select-level" element={<SelectLevelPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;