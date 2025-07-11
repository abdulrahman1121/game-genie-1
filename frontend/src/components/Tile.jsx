function Tile({ letter, status }) {
  return (
    <div className={`tile ${status}`}>
      {letter}
    </div>
  );
}

export default Tile;