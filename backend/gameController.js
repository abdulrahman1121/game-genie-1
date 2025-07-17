const admin = require('firebase-admin');
const db = admin.firestore();

// Sample 6-letter word list (replace with Firebase collection later)
const wordList = ['puzzle', 'random', 'secret', 'answer', 'winner', 'genius'];

const startGame = async (req, res) => {
  try {
    const targetWord = wordList[Math.floor(Math.random() * wordList.length)];
    const gameId = db.collection('games').doc().id;
    const gameData = {
      gameId,
      targetWord,
      guesses: [],
      status: 'active',
      createdAt: admin.firestore.Timestamp.now(),
    };

    await db.collection('games').doc(gameId).set(gameData);
    res.status(201).json({ gameId, status: 'active' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start game' });
  }
};

const submitGuess = async (req, res) => {
  const { gameId, guess } = req.body;
  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();
    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const gameData = gameDoc.data();
    if (gameData.status !== 'active') {
      return res.status(400).json({ error: 'Game is not active' });
    }

    if (!wordList.includes(guess.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid word' });
    }

    const feedback = evaluateGuess(guess.toLowerCase(), gameData.targetWord);
    gameData.guesses.push({ guess, feedback });

    if (guess.toLowerCase() === gameData.targetWord || gameData.guesses.length >= 6) {
      gameData.status = guess.toLowerCase() === gameData.targetWord ? 'won' : 'lost';
    }

    await gameRef.update(gameData);
    res.status(200).json({ feedback, status: gameData.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process guess' });
  }
};

const getGameState = async (req, res) => {
  const { gameId } = req.params;
  try {
    const gameDoc = await db.collection('games').doc(gameId).get();
    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(gameDoc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve game state' });
  }
};

const evaluateGuess = (guess, target) => {
  const feedback = [];
  const targetLetters = target.split('');
  const guessLetters = guess.split('');

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      feedback.push('correct');
      targetLetters[i] = null; // Mark as used
    } else if (targetLetters.includes(guessLetters[i])) {
      feedback.push('present');
      targetLetters[targetLetters.indexOf(guessLetters[i])] = null; // Mark as used
    } else {
      feedback.push('incorrect');
    }
  }
  return feedback;
};

module.exports = { startGame, submitGuess, getGameState };