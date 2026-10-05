// Pure selection logic, kept free of Firestore/OpenAI/HTTP so it's trivially unit-testable.
function pickFallbackEntry(pool, { wordLength, recentWords = [] }) {
  const byLength = pool.filter(entry => entry.wordLength === wordLength);
  if (byLength.length === 0) {
    throw new Error(`No fallback entries for wordLength ${wordLength}`);
  }

  const notRecent = byLength.filter(entry => !recentWords.includes(entry.word));
  const candidates = notRecent.length > 0 ? notRecent : byLength; // degrade gracefully if all are "recent"

  return candidates[Math.floor(Math.random() * candidates.length)];
}

module.exports = { pickFallbackEntry };
