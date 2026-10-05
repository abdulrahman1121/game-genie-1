const { pickFallbackEntry } = require('./fallbackSelector');

const POOL = [
  { word: 'FROG', wordLength: 4 },
  { word: 'LAMP', wordLength: 4 },
  { word: 'STAR', wordLength: 4 },
  { word: 'HAPPY', wordLength: 5 },
  { word: 'OCEAN', wordLength: 5 },
];

describe('pickFallbackEntry', () => {
  it('only returns entries matching the requested wordLength', () => {
    for (let i = 0; i < 20; i++) {
      const entry = pickFallbackEntry(POOL, { wordLength: 4, recentWords: [] });
      expect(entry.wordLength).toBe(4);
    }
    for (let i = 0; i < 20; i++) {
      const entry = pickFallbackEntry(POOL, { wordLength: 5, recentWords: [] });
      expect(entry.wordLength).toBe(5);
    }
  });

  it('excludes entries whose word is in recentWords', () => {
    for (let i = 0; i < 20; i++) {
      const entry = pickFallbackEntry(POOL, { wordLength: 4, recentWords: ['FROG', 'LAMP'] });
      expect(entry.word).toBe('STAR');
    }
  });

  it('degrades gracefully to the full same-length pool when all same-length entries are recent', () => {
    const entry = pickFallbackEntry(POOL, { wordLength: 4, recentWords: ['FROG', 'LAMP', 'STAR'] });
    expect(['FROG', 'LAMP', 'STAR']).toContain(entry.word);
  });

  it('throws when no entries exist at all for the requested wordLength', () => {
    expect(() => pickFallbackEntry(POOL, { wordLength: 6, recentWords: [] })).toThrow(
      /No fallback entries for wordLength 6/
    );
  });
});
