import './Keyboard.css';


function Keyboard({ keyStatuses }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];

  const handleClick = (key) => {
    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);
  };

  const getKeyStatus = (key) => {
    const statuses = Object.entries(keyStatuses).filter(([k]) => k === key);
    return statuses.length ? statuses[0][1] : 'unused';
  };

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`keyboard-key ${key.toLowerCase()} ${getKeyStatus(key)}`}
              onClick={() => handleClick(key)}
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