import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { NumberKeyboard } from '../../components/NumberKeyboard/NumberKeyboard';
import { LetterKeyboard } from '../../components/LetterKeyboard/LetterKeyboard';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import { useKeyboard } from '../../hooks/useKeyboard';
import { submitCode } from '../../lib/lobbyUtils';
import { getGameModeConfig } from '../../lib/gameModes';
import type { Lobby, PlayerRole } from '../../lib/types';
import styles from './CodeSetup.module.css';

interface Props {
  lobby: Lobby;
  role: PlayerRole;
  lobbyId: string;
}

export function CodeSetup({ lobby, role, lobbyId }: Props) {
  const [code, setCode]             = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [codeError, setCodeError]   = useState('');

  const config        = getGameModeConfig(lobby.gameMode);
  const isSubmitted   = role === 'host' ? lobby.hostReady : lobby.guestReady;
  const opponentDone  = role === 'host' ? lobby.guestReady : lobby.hostReady;

  const addChar = useCallback((c: string) => {
    if (isSubmitted) return;
    setCodeError('');
    setCode(prev => prev.length < 5 ? prev + c : prev);
  }, [isSubmitted]);

  const removeChar = useCallback(() => {
    setCodeError('');
    setCode(prev => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (code.length !== 5 || isSubmitted || submitting) return;
    if (!config.validateCode(code)) {
      setCodeError(`Not a valid ${config.codeLabel} — try another`);
      return;
    }
    setSubmitting(true);
    try { await submitCode(lobbyId, role, code); }
    finally { setSubmitting(false); }
  }, [code, isSubmitted, submitting, lobbyId, role, config]);

  useKeyboard({
    onKey: addChar,
    onBackspace: removeChar,
    onEnter: handleSubmit,
    mode: config.keyboard,
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.wordmark}>{config.label}</Link>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{"Set your opponent's"} {config.codeLabel}</h1>
          <p className={styles.subtitle}>
            Choose any 5-{config.keyboard === 'letters' ? 'letter' : 'digit'} {config.codeLabel} for
            your opponent to guess
          </p>
        </div>

        {isSubmitted ? (
          <div className={styles.confirmed}>
            <CheckCircle size={44} />
            <span>{config.codeLabel.charAt(0).toUpperCase() + config.codeLabel.slice(1)} locked in!</span>
            {opponentDone
              ? <span>Both ready — starting…</span>
              : <span className={styles.waiting}>Waiting for your opponent to set their {config.codeLabel}…</span>}
          </div>
        ) : (
          <>
            <div className={styles.digitBoxes}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.digitBox} ${i === code.length ? styles.active : ''}`}
                >
                  {config.displayCode(code[i] ?? '')}
                </div>
              ))}
            </div>

            {config.keyboard === 'letters' ? (
              <LetterKeyboard
                keyStates={{}}
                onLetter={addChar}
                onBackspace={removeChar}
                onEnter={handleSubmit}
                disabled={isSubmitted}
              />
            ) : (
              <NumberKeyboard
                keyStates={{}}
                onDigit={addChar}
                onBackspace={removeChar}
                onEnter={handleSubmit}
                disabled={isSubmitted}
              />
            )}

            {codeError && <p className={styles.wordError}>{codeError}</p>}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={code.length < 5 || submitting}
            >
              {submitting
                ? 'Locking in…'
                : `Lock In ${config.codeLabel.charAt(0).toUpperCase() + config.codeLabel.slice(1)}`}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
