const { getHistory, recordFinishedGame } = require('./sessionStore');

// Minimal in-memory stand-in for the slice of Firestore the store uses. Stored dates are
// returned with toMillis(), like a real Firestore Timestamp.
function fakeDb() {
  const docs = new Map();
  const ref = (path) => ({ path });
  const snapshot = (path) => ({
    exists: docs.has(path),
    data: () => {
      const stored = docs.get(path);
      return { ...stored, expiresAt: { toMillis: () => stored.expiresAt.getTime() } };
    },
  });
  return {
    docs,
    collection: (name) => ({
      doc: (id) => ({ ...ref(`${name}/${id}`), get: async () => snapshot(`${name}/${id}`) }),
    }),
    runTransaction: async (fn) => fn({
      get: async (r) => snapshot(r.path),
      set: (r, data) => docs.set(r.path, data),
    }),
  };
}

const won = (word, guesses) => ({ word, status: 'won', guesses });
const IN_AN_HOUR = () => Date.now() + 60 * 60 * 1000;

describe('sessionStore', () => {
  it('returns an empty history for a session with no doc', async () => {
    expect(await getHistory(fakeDb(), 'abc')).toEqual([]);
  });

  it('appends finished games for the same session in order', async () => {
    const db = fakeDb();
    const session = { nonce: 'abc', exp: IN_AN_HOUR() };
    await recordFinishedGame(db, session, won('FROG', 3));
    await recordFinishedGame(db, session, won('LAMP', 4));
    expect((await getHistory(db, 'abc')).map(g => g.word)).toEqual(['FROG', 'LAMP']);
  });

  it('keeps different sessions separate', async () => {
    const db = fakeDb();
    await recordFinishedGame(db, { nonce: 'a', exp: IN_AN_HOUR() }, won('FROG', 3));
    expect(await getHistory(db, 'b')).toEqual([]);
  });

  it('stores the token expiry on the doc so a TTL policy can delete it', async () => {
    const db = fakeDb();
    const exp = IN_AN_HOUR();
    await recordFinishedGame(db, { nonce: 'abc', exp }, won('FROG', 3));
    expect(db.docs.get('sessions/abc').expiresAt).toEqual(new Date(exp));
  });

  it('treats an expired doc as empty and starts fresh on the next record', async () => {
    const db = fakeDb();
    db.docs.set('sessions/abc', { history: [won('OLD', 2)], expiresAt: new Date(Date.now() - 1000) });
    expect(await getHistory(db, 'abc')).toEqual([]);
    await recordFinishedGame(db, { nonce: 'abc', exp: IN_AN_HOUR() }, won('NEW', 3));
    expect((await getHistory(db, 'abc')).map(g => g.word)).toEqual(['NEW']);
  });
});
