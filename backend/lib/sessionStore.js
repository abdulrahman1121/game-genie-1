// Firestore persistence for the per-session game history: one doc per session token at
// sessions/{nonce} holding { history, expiresAt }. The pure queue/stats logic lives in
// sessionHistory.js; this file only loads and saves. `db` is passed in (not required here) so
// the functions can be tested with a fake instead of a live Firestore connection.
//
// `expiresAt` is stored as a Date, which Firestore saves as a timestamp. Enable a TTL policy
// on sessions.expiresAt in the Firebase console and Firestore deletes each doc after its
// session ends. TTL deletion can lag by hours, so reads also check expiresAt themselves.
const { appendGame } = require('./sessionHistory');

const COLLECTION = 'sessions';

function isExpired(data) {
  return data.expiresAt.toMillis() <= Date.now();
}

// Missing or expired docs both count as "no history yet".
function historyFromSnapshot(snap) {
  if (!snap.exists) return [];
  const data = snap.data();
  return isExpired(data) ? [] : data.history;
}

async function getHistory(db, nonce) {
  const snap = await db.collection(COLLECTION).doc(nonce).get();
  return historyFromSnapshot(snap);
}

// Read-modify-write inside a transaction: if two requests finish a game for the same session
// at the same moment, Firestore retries one so neither append overwrites the other.
async function recordFinishedGame(db, { nonce, exp }, game) {
  const ref = db.collection(COLLECTION).doc(nonce);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const history = appendGame(historyFromSnapshot(snap), game);
    tx.set(ref, { history, expiresAt: new Date(exp) });
  });
}

module.exports = { getHistory, recordFinishedGame };
