const { evaluateGuess } = require('./openaiRoutes');

describe('evaluateGuess', () => {
  it('marks every letter correct when the guess matches the target', () => {
    expect(evaluateGuess('HAPPY', 'HAPPY')).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  it('marks every letter incorrect when no letters overlap', () => {
    expect(evaluateGuess('CRISP', 'MOUTH')).toEqual(['incorrect', 'incorrect', 'incorrect', 'incorrect', 'incorrect']);
  });

  it('marks a single out-of-place letter present while others resolve independently', () => {
    // target ABCDE, guess AXCYB: A and C stay put (correct), X and Y match nothing (incorrect),
    // guess's trailing B is target's leftover letter at index 1 (present).
    expect(evaluateGuess('AXCYB', 'ABCDE')).toEqual(['correct', 'incorrect', 'correct', 'incorrect', 'present']);
  });

  it('handles duplicate letters in the guess against a single occurrence in the target (EATEN vs MONEY)', () => {
    // MONEY has one E, at index 3, which EATEN's index-3 E matches exactly (correct).
    // EATEN's other E (index 0) has nothing left to match (incorrect).
    // MONEY's N (index 2) is still unclaimed, so EATEN's N (index 4) is present, not correct.
    expect(evaluateGuess('EATEN', 'MONEY')).toEqual(['incorrect', 'incorrect', 'incorrect', 'correct', 'present']);
  });

  it('awards present only once when the guess repeats a letter the target has only once, in the wrong spot', () => {
    // target ZAC has a single Z at index 0; guess DZZ has two Zs (index 1, 2), neither matching.
    // Only the first Z (index 1) can claim the target's lone Z; the second (index 2) is incorrect.
    expect(evaluateGuess('DZZ', 'ZAC')).toEqual(['incorrect', 'present', 'incorrect']);
  });

  it('awards present once when the target has duplicate letters but the guess has only one in the wrong spot', () => {
    // target ZAZ has two Zs (index 0, 2); guess BZC has a single Z (index 1), matching neither position.
    expect(evaluateGuess('BZC', 'ZAZ')).toEqual(['incorrect', 'present', 'incorrect']);
  });
});
