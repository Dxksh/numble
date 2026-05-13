import type { Guess } from '../../lib/types';
import { GameBoard } from '../../components/GameBoard/GameBoard';
import styles from './OpponentBoard.module.css';

interface Props {
  opponentName: string | null;
  opponentGuesses: Guess[];
  isSolvedByOpponent: boolean;
}

export function OpponentBoard({ opponentName, opponentGuesses, isSolvedByOpponent }: Props) {
  const exhausted = opponentGuesses.length >= 6 && !isSolvedByOpponent;
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.name}>{opponentName ?? 'Opponent'}</span>
        <span className={styles.progress}>{opponentGuesses.length}/6</span>
      </div>

      {isSolvedByOpponent && <div className={`${styles.badge} ${styles.solved}`}>Solved!</div>}
      {exhausted           && <div className={`${styles.badge} ${styles.failed}`}>Out of guesses</div>}

      <GameBoard guesses={opponentGuesses} maxGuesses={6} small />
    </div>
  );
}
