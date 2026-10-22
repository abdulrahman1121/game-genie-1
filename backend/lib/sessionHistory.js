// Pure logic for the per-session game history that drives adaptive word choice. No Firestore
// here: the route layer loads the history array, calls these functions, and saves the result.
// The history is a queue of finished games, oldest first: { word, status: 'won'|'lost', guesses }.
const MAX_HISTORY = 15; // older games stop mattering, so the oldest entry is dropped past this
const MIN_GAMES_TO_ADAPT = 2; // fewer finished games than this is noise, not a trend

// Returns a new array (the input is never mutated) with the finished game added at the back
// and the front trimmed so at most MAX_HISTORY entries remain.
function appendGame(history, { word, status, guesses }) {
  return [...history, { word, status, guesses }].slice(-MAX_HISTORY);
}

// Everything is derived from the queue itself, so the stats describe the last MAX_HISTORY games.
// avgGuessesOnWin is null (not 0) when there are no wins, so "no data" can't read as "perfect".
function computeStats(history) {
  const gamesPlayed = history.length;
  const wins = history.filter(g => g.status === 'won');
  const winRate = gamesPlayed === 0 ? null : wins.length / gamesPlayed;
  const avgGuessesOnWin = wins.length === 0
    ? null
    : wins.reduce((sum, g) => sum + g.guesses, 0) / wins.length;

  return { gamesPlayed, wins: wins.length, winRate, avgGuessesOnWin };
}

function shouldAdapt(history) {
  return history.length >= MIN_GAMES_TO_ADAPT;
}

module.exports = { appendGame, computeStats, shouldAdapt, MAX_HISTORY, MIN_GAMES_TO_ADAPT };
