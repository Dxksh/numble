import { useState, useCallback } from 'react';
import type { TileState } from '../../lib/types';
import styles from './LetterKeyboard.module.css';

interface Props {
  keyStates: Record<string, TileState>;
  onLetter: (l: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['⌫','Z','X','C','V','B','N','M','↵'],
];

export function LetterKeyboard({ keyStates, onLetter, onBackspace, onEnter, disabled = false }: Props) {
  const [pulsed, setPulsed] = useState<string | null>(null);

  const handleKey = useCallback((key: string) => {
    if (disabled) return;
    setPulsed(key);
    setTimeout(() => setPulsed(null), 150);
    if (key === '⌫')      onBackspace();
    else if (key === '↵') onEnter();
    else                  onLetter(key.toLowerCase());
  }, [disabled, onLetter, onBackspace, onEnter]);

  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {row.map(key => {
            const isSpecial = key === '⌫' || key === '↵';
            const state = isSpecial ? undefined : keyStates[key.toLowerCase()];
            return (
              <button
                key={key}
                className={`${styles.key} ${isSpecial ? styles.wide : ''} ${pulsed === key ? styles.pulsed : ''}`}
                data-state={state}
                onClick={() => handleKey(key)}
                aria-label={key === '⌫' ? 'Backspace' : key === '↵' ? 'Enter' : key}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
