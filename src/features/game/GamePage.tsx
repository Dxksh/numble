import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import { GameBoard } from '../../components/GameBoard/GameBoard';
import { NumberKeyboard } from '../../components/NumberKeyboard/NumberKeyboard';
import { OpponentBoard } from './OpponentBoard';
import { useGame } from './useGame';
import { useKeyboard } from '../../hooks/useKeyboard';
import type { Lobby, PlayerRole } from '../../lib/types';
import styles from './GamePage.module.css';

interface Props {
  lobby: Lobby;
  role: PlayerRole;
  lobbyId: string;
}

export function GamePage({ lobby, role, lobbyId }: Props) {
  const {
    currentGuess, myGuesses, opponentGuesses, keyboardStates,
    canGuess, isSolvedByMe, isSolvedByOpponent, shakeRow,
    addDigit, removeDigit, submitGuess,
  } = useGame(lobby, role, lobbyId);

  const [tab, setTab] = useState<'mine' | 'opponent'>('mine');

  useKeyboard({ onDigit: addDigit, onBackspace: removeDigit, onEnter: submitGuess });

  const opponentName = role === 'host' ? lobby.guestName : lobby.hostName;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.wordmark}>Numble</Link>
        <div className={styles.meta}>
          <span>{myGuesses.length}/6 guesses</span>
          <ThemeToggle />
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'mine' ? styles.active : ''}`}
          onClick={() => setTab('mine')}
        >
          My Game
        </button>
        <button
          className={`${styles.tab} ${tab === 'opponent' ? styles.active : ''}`}
          onClick={() => setTab('opponent')}
        >
          Their Progress
        </button>
      </div>

      <main className={styles.main}>
        <div className={`${styles.mySection} ${tab === 'opponent' ? styles.hidden : ''}`}>
          <div className={styles.myLabel}>Your board</div>
          {isSolvedByMe && <div className={styles.solvedBadge}>Solved!</div>}
          <GameBoard
            guesses={myGuesses}
            currentGuess={canGuess ? currentGuess : ''}
            shakeRow={shakeRow}
          />
          <NumberKeyboard
            keyStates={keyboardStates}
            onDigit={addDigit}
            onBackspace={removeDigit}
            onEnter={submitGuess}
            disabled={!canGuess}
          />
        </div>

        <div className={styles.divider} />

        <div className={`${styles.oppSection} ${tab === 'opponent' ? styles.visible : ''}`}>
          <OpponentBoard
            opponentName={opponentName}
            opponentGuesses={opponentGuesses}
            isSolvedByOpponent={isSolvedByOpponent}
          />
        </div>
      </main>
    </div>
  );
}
