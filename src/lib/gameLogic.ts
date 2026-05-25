import type { TileState, Guess, Winner } from './types';

export function evaluateGuess(guess: string, target: string): TileState[] {
  const result: TileState[] = new Array(5).fill('grey');
  const remaining: Record<string, number> = {};

  // First pass: mark greens, count remaining target digits
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'green';
    } else {
      remaining[target[i]] = (remaining[target[i]] ?? 0) + 1;
    }
  }

  // Second pass: mark yellows from remaining
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'green') continue;
    const d = guess[i];
    if ((remaining[d] ?? 0) > 0) {
      result[i] = 'yellow';
      remaining[d]--;
    }
  }

  return result;
}

export function isSolved(result: TileState[]): boolean {
  return result.length === 5 && result.every(s => s === 'green');
}

export function getKeyboardStates(guesses: Guess[]): Record<string, TileState> {
  const priority: Record<TileState, number> = {
    green: 4, yellow: 3, grey: 2, active: 1, empty: 0,
  };
  const states: Record<string, TileState> = {};

  for (const { guess, result } of guesses) {
    for (let i = 0; i < 5; i++) {
      const digit = guess[i];
      const state = result[i];
      if (states[digit] === undefined || priority[state] > priority[states[digit]]) {
        states[digit] = state;
      }
    }
  }

  return states;
}

export function determineWinner(
  hostSolvedAt: number | null,
  guestSolvedAt: number | null,
  hostGuessCount: number,
  guestGuessCount: number,
): Winner {
  const hostDone  = hostSolvedAt  !== null || hostGuessCount  >= 6;
  const guestDone = guestSolvedAt !== null || guestGuessCount >= 6;

  if (!hostDone || !guestDone) return null;

  if (hostSolvedAt !== null && guestSolvedAt === null) return 'host';
  if (guestSolvedAt !== null && hostSolvedAt === null) return 'guest';
  if (hostSolvedAt === null && guestSolvedAt === null) return 'draw';

  // Both solved — fewer guesses wins; time only breaks a tie
  if (hostGuessCount < guestGuessCount) return 'host';
  if (guestGuessCount < hostGuessCount) return 'guest';
  if (hostSolvedAt! < guestSolvedAt!) return 'host';
  if (guestSolvedAt! < hostSolvedAt!) return 'guest';
  return 'draw';
}
