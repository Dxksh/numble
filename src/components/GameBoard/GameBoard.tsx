import type { Guess, TileState } from '../../lib/types';
import { GuessRow } from '../GuessRow/GuessRow';
import styles from './GameBoard.module.css';

interface Props {
  guesses: Guess[];
  currentGuess?: string;
  maxGuesses?: number;
  shakeRow?: boolean;
  label?: string;
  small?: boolean;
}

export function GameBoard({
  guesses, currentGuess = '', maxGuesses = 6, shakeRow = false, label, small = false,
}: Props) {
  const emptyResult: TileState[] = ['empty', 'empty', 'empty', 'empty', 'empty'];

  const rows = Array.from({ length: maxGuesses }, (_, i) => {
    if (i < guesses.length) {
      return {
        digits:   guesses[i].guess.split(''),
        results:  guesses[i].result,
        revealed: true,
        shake:    false,
      };
    }
    if (i === guesses.length) {
      const digits = Array.from({ length: 5 }, (__, j) =>
        j < currentGuess.length ? currentGuess[j] : '',
      );
      return { digits, results: emptyResult, revealed: false, shake: shakeRow };
    }
    return { digits: ['','','','',''], results: emptyResult, revealed: false, shake: false };
  });

  return (
    <div className={styles.board}>
      {label && <div className={styles.label}>{label}</div>}
      {rows.map((row, i) => (
        <GuessRow key={i} {...row} small={small} />
      ))}
    </div>
  );
}
