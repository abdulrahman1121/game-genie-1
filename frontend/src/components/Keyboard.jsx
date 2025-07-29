import './Keyboard.css';

function Keyboard({ keyStatuses, onKeyPress }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];

  const getKeyStatus = (key) => {
  return keyStatuses[key.toUpperCase()] || 'unused';
};

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`keyboard-key ${key.toLowerCase()} ${getKeyStatus(key)}`}
              onClick={() => onKeyPress(key === 'Enter' || key === 'Backspace' ? key : key.toUpperCase(), 'empty')}
            >
              {key === 'Backspace' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;