import { describe, it, expect } from 'vitest';
import { evaluateGuess, isSolved, getKeyboardStates, determineWinner } from './gameLogic';

describe('evaluateGuess', () => {
  it('all green for exact match', () => {
    expect(evaluateGuess('12345', '12345')).toEqual(['green','green','green','green','green']);
  });

  it('all grey for no overlap', () => {
    expect(evaluateGuess('11111', '22222')).toEqual(['grey','grey','grey','grey','grey']);
  });

  it('yellow for right digit wrong position', () => {
    expect(evaluateGuess('21000', '12000')).toEqual(['yellow','yellow','green','green','green']);
  });

  it('does not double-count yellows when target has one instance', () => {
    // target '12345' has one '1' at pos0 (green); second '1' in guess at pos1 → grey
    expect(evaluateGuess('11000', '12345')).toEqual(['green','grey','grey','grey','grey']);
  });

  it('green takes priority, remaining copies get grey', () => {
    // target: 11234, guess: 11111 → pos0 green, pos1 green, remaining target 1s: 0 → pos2-4 grey
    expect(evaluateGuess('11111', '11234')).toEqual(['green','green','grey','grey','grey']);
  });

  it('yellow consumed only once per target digit', () => {
    // target: 12345, guess: 11111 → only pos0 is green, no yellows for extra 1s
    expect(evaluateGuess('11111', '12345')).toEqual(['green','grey','grey','grey','grey']);
  });
});

describe('isSolved', () => {
  it('true for all green', () => {
    expect(isSolved(['green','green','green','green','green'])).toBe(true);
  });
  it('false if any not green', () => {
    expect(isSolved(['green','green','green','green','yellow'])).toBe(false);
  });
});

describe('getKeyboardStates', () => {
  it('records grey state', () => {
    const states = getKeyboardStates([{ guess: '12345', result: ['grey','grey','grey','grey','grey'], createdAt: 0 }]);
    expect(states['1']).toBe('grey');
  });

  it('green overrides yellow for same digit across guesses', () => {
    const states = getKeyboardStates([
      { guess: '21000', result: ['yellow','grey','grey','grey','grey'], createdAt: 0 },
      { guess: '12000', result: ['green','grey','grey','grey','grey'],  createdAt: 1 },
    ]);
    expect(states['1']).toBe('green');
  });
});

describe('determineWinner', () => {
  it('returns null when both not done', () => {
    expect(determineWinner(null, null, 3, 3)).toBe(null);
  });
  it('host wins if only host solved', () => {
    expect(determineWinner(1000, null, 3, 6)).toBe('host');
  });
  it('guest wins if only guest solved', () => {
    expect(determineWinner(null, 1000, 6, 3)).toBe('guest');
  });
  it('draw if neither solved', () => {
    expect(determineWinner(null, null, 6, 6)).toBe('draw');
  });
  it('earlier solvedAt wins', () => {
    expect(determineWinner(900, 1000, 3, 3)).toBe('host');
    expect(determineWinner(1000, 900, 3, 3)).toBe('guest');
  });
});
