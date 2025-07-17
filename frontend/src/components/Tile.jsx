import { useState, useEffect } from 'react';
import './Tile.css';

function Tile({ letter, status }) {
  const [isFlipping, setIsFlipping] = useState(false);
  useEffect(() => {
    if (status !== 'empty' && status !== 'filled') {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 300); // Match animation duration
      return () => clearTimeout(timer);
  }
}, [status]);

  return (
    <div className={`tile ${status} ${isFlipping ? 'animate-flip' : ''}`}>
      {letter}
    </div>
  );
}

export default Tile;