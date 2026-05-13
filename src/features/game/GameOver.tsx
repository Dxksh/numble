import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import { GameBoard } from '../../components/GameBoard/GameBoard';
import { rematch } from '../../lib/lobbyUtils';
import type { Lobby, PlayerRole } from '../../lib/types';
import styles from './GameOver.module.css';

interface Props {
  lobby: Lobby;
  role: PlayerRole;
  lobbyId: string;
}

export function GameOver({ lobby, role, lobbyId }: Props) {
  const navigate     = useNavigate();
  const firedRef     = useRef(false);
  const [rematching, setRematching] = useState(false);

  const iWon   = lobby.winner === role;
  const isDraw = lobby.winner === 'draw';

  const myGuesses       = role === 'host' ? lobby.hostGuesses : lobby.guestGuesses;
  const opponentGuesses = role === 'host' ? lobby.guestGuesses : lobby.hostGuesses;
  const myCode          = role === 'host' ? lobby.hostCode : lobby.guestCode;
  const opponentCode    = role === 'host' ? lobby.guestCode : lobby.hostCode;
  const opponentName    = role === 'host' ? lobby.guestName : lobby.hostName;

  useEffect(() => {
    if (iWon && !firedRef.current) {
      firedRef.current = true;
      confetti({ particleCount: 180, spread: 80, origin: { y: 0.55 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.25 } }), 300);
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.75 } }), 500);
    }
  }, [iWon]);

  const resultLabel = iWon ? 'You won! 🎉' : isDraw ? "It's a draw!" : 'You lost';
  const resultClass = iWon ? styles.win : isDraw ? styles.draw : styles.lose;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.wordmark}>Numble</Link>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <div className={styles.banner}>
          <div className={`${styles.result} ${resultClass}`}>{resultLabel}</div>
          <div className={styles.sub}>
            {iWon
              ? 'Great work — you cracked it!'
              : isDraw
              ? 'So close — neither of you cracked it!'
              : `${opponentName ?? 'Opponent'} got there first.`}
          </div>
        </div>

        <div className={styles.boards}>
          <div className={styles.boardSection}>
            <div className={styles.boardLabel}>Your board</div>
            <div className={styles.codeReveal}>
              Code to guess: <span className={styles.codeValue}>{opponentCode}</span>
            </div>
            <GameBoard guesses={myGuesses} />
          </div>

          <div className={styles.boardSection}>
            <div className={styles.boardLabel}>{opponentName ?? 'Opponent'}'s board</div>
            <div className={styles.codeReveal}>
              Code to guess: <span className={styles.codeValue}>{myCode}</span>
            </div>
            <GameBoard guesses={opponentGuesses} />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={async () => {
              setRematching(true);
              try { await rematch(lobbyId); } finally { setRematching(false); }
            }}
            disabled={rematching}
          >
            {rematching ? 'Setting up…' : 'Rematch'}
          </button>
          <button className={styles.btnSecondary} onClick={() => navigate('/')}>
            New Game
          </button>
        </div>
      </main>
    </div>
  );
}
