const { appendGame, computeStats, shouldAdapt, MAX_HISTORY } = require('./sessionHistory');

const won = (word, guesses) => ({ word, status: 'won', guesses });
const lost = (word) => ({ word, status: 'lost', guesses: 6 });

describe('appendGame', () => {
  it('adds the finished game at the back without mutating the input', () => {
    const history = [won('FROG', 3)];
    const next = appendGame(history, lost('LAMP'));
    expect(next).toEqual([won('FROG', 3), lost('LAMP')]);
    expect(history).toHaveLength(1);
  });

  it('drops the oldest entry once the queue passes MAX_HISTORY', () => {
    let history = [];
    for (let i = 0; i < MAX_HISTORY + 1; i++) history = appendGame(history, won(`W${i}`, 3));
    expect(history).toHaveLength(MAX_HISTORY);
    expect(history[0].word).toBe('W1');
    expect(history[history.length - 1].word).toBe(`W${MAX_HISTORY}`);
  });
});

describe('computeStats', () => {
  it('returns null rates for an empty history', () => {
    expect(computeStats([])).toEqual({ gamesPlayed: 0, wins: 0, winRate: null, avgGuessesOnWin: null });
  });

  it('averages guesses over wins only, ignoring losses', () => {
    const stats = computeStats([won('FROG', 2), won('LAMP', 4), lost('STAR')]);
    expect(stats.gamesPlayed).toBe(3);
    expect(stats.wins).toBe(2);
    expect(stats.winRate).toBeCloseTo(2 / 3);
    expect(stats.avgGuessesOnWin).toBe(3);
  });

  it('has a null average when every game was lost', () => {
    const stats = computeStats([lost('FROG'), lost('LAMP')]);
    expect(stats.winRate).toBe(0);
    expect(stats.avgGuessesOnWin).toBeNull();
  });
});

describe('shouldAdapt', () => {
  it('needs at least 2 finished games', () => {
    expect(shouldAdapt([])).toBe(false);
    expect(shouldAdapt([won('FROG', 3)])).toBe(false);
    expect(shouldAdapt([won('FROG', 3), lost('LAMP')])).toBe(true);
  });
});
