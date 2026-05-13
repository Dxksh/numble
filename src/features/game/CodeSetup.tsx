import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { NumberKeyboard } from '../../components/NumberKeyboard/NumberKeyboard';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import { useKeyboard } from '../../hooks/useKeyboard';
import { submitCode } from '../../lib/lobbyUtils';
import type { Lobby, PlayerRole } from '../../lib/types';
import styles from './CodeSetup.module.css';

interface Props {
  lobby: Lobby;
  role: PlayerRole;
  lobbyId: string;
}

export function CodeSetup({ lobby, role, lobbyId }: Props) {
  const [code, setCode]         = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted       = role === 'host' ? lobby.hostReady : lobby.guestReady;
  const opponentSubmitted = role === 'host' ? lobby.guestReady : lobby.hostReady;

  const addDigit = useCallback((d: string) => {
    if (isSubmitted) return;
    setCode(prev => prev.length < 5 ? prev + d : prev);
  }, [isSubmitted]);

  const removeDigit = useCallback(() => {
    setCode(prev => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (code.length !== 5 || isSubmitted || submitting) return;
    setSubmitting(true);
    try { await submitCode(lobbyId, role, code); }
    finally { setSubmitting(false); }
  }, [code, isSubmitted, submitting, lobbyId, role]);

  useKeyboard({ onDigit: addDigit, onBackspace: removeDigit, onEnter: handleSubmit });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.wordmark}>Numble</Link>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Set your opponent's code</h1>
          <p className={styles.subtitle}>Choose any 5-digit number for your opponent to guess</p>
        </div>

        {isSubmitted ? (
          <div className={styles.confirmed}>
            <CheckCircle size={44} />
            <span>Code locked in!</span>
            {opponentSubmitted
              ? <span>Both ready — starting…</span>
              : <span className={styles.waiting}>Waiting for your opponent to set their code…</span>}
          </div>
        ) : (
          <>
            <div className={styles.digitBoxes}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.digitBox} ${i === code.length ? styles.active : ''}`}
                >
                  {code[i] ?? ''}
                </div>
              ))}
            </div>

            <NumberKeyboard
              keyStates={{}}
              onDigit={addDigit}
              onBackspace={removeDigit}
              onEnter={handleSubmit}
              disabled={isSubmitted}
            />

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={code.length < 5 || submitting}
            >
              {submitting ? 'Locking in…' : 'Lock In Code'}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
