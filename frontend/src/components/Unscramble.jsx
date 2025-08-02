import { useState, useEffect } from 'react';
import './Unscramble.css';

function Unscramble({ gameId, targetWord, onResult }) {
  const [scrambledWords, setScrambledWords] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [correctSentence, setCorrectSentence] = useState('');
  const [tries, setTries] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/api/openai/unscramble', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setScrambledWords(data.scrambled.split(' '));
        setUserOrder(data.scrambled.split(' '));
        setCorrectSentence(data.sentence);
      })
      .catch(err => console.error('Error fetching sentence:', err));
  }, [gameId]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    const newOrder = [...userOrder];
    const [draggedWord] = newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedWord);
    setUserOrder(newOrder);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleCheck = () => {
    const isCorrect = userOrder.join(' ') === correctSentence;
    setTries(tries + 1);
    onResult(isCorrect, tries + 1);
    if (!isCorrect && tries < 2) {
      setUserOrder(scrambledWords); // Reset on incorrect, unless last try
    }
  };

  return (
    <div className="unscramble-comp">
      <img src="/unscramble-image.png" alt="unscramble" className="unscramble-img" />
      <div className="words-container">
        {userOrder.map((word, index) => (
          <span
            key={index}
            className="word"
            draggable
            onDragStart={e => handleDragStart(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            {word}
          </span>
        ))}
      </div>
      <button className="check-button" onClick={handleCheck}>
        <img src="/check.png" alt="" />
      </button>
    </div>
  );
}

export default Unscramble;