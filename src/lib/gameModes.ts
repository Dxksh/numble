import type { GameMode } from './types';
import { isValidWord } from './wordList';

export interface GameModeConfig {
  id: GameMode;
  label: string;
  tagline: string;
  /** Singular label for what the player sets, e.g. "code", "word" */
  codeLabel: string;
  /** Physical/on-screen keyboard to show */
  keyboard: 'digits' | 'letters';
  /** Validate the value a player locks in as their opponent's target */
  validateCode: (s: string) => boolean;
  /** Validate a guess before submitting it */
  validateGuess: (s: string) => boolean;
  /** Message shown when validateGuess returns false */
  invalidGuessMessage: string;
  /** How to display a stored code/guess string in UI labels */
  displayCode: (s: string) => string;
  /** Decorative tiles shown on the home screen card and game header */
  logoTiles: readonly { char: string; color: 'green' | 'yellow' | 'grey' }[];
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  numble: {
    id: 'numble',
    label: 'Numble Duel',
    tagline: 'A number-guessing duel for two players',
    codeLabel: 'code',
    keyboard: 'digits',
    validateCode: () => true,
    validateGuess: () => true,
    invalidGuessMessage: '',
    displayCode: s => s,
    logoTiles: [
      { char: 'N', color: 'green' },
      { char: 'U', color: 'yellow' },
      { char: 'M', color: 'grey' },
      { char: 'B', color: 'green' },
      { char: 'L', color: 'yellow' },
    ],
  },
  wordle: {
    id: 'wordle',
    label: 'Wordle Duel',
    tagline: 'A word-guessing duel for two players',
    codeLabel: 'word',
    keyboard: 'letters',
    validateCode: isValidWord,
    validateGuess: isValidWord,
    invalidGuessMessage: 'Not in word list',
    displayCode: s => s.toUpperCase(),
    logoTiles: [
      { char: 'W', color: 'yellow' },
      { char: 'O', color: 'green' },
      { char: 'R', color: 'grey' },
      { char: 'D', color: 'green' },
      { char: 'L', color: 'yellow' },
    ],
  },
};

/** Ordered list for rendering the mode picker */
export const GAME_MODE_LIST: GameModeConfig[] = Object.values(GAME_MODES);

/** Safe getter — falls back to numble for legacy lobby docs without gameMode */
export function getGameModeConfig(mode: GameMode | undefined): GameModeConfig {
  return (mode && GAME_MODES[mode]) ? GAME_MODES[mode] : GAME_MODES.numble;
}
