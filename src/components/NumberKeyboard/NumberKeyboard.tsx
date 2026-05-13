import { useState, useCallback } from 'react';
import type { TileState } from '../../lib/types';
import styles from './NumberKeyboard.module.css';

interface Props {
  keyStates: Record<string, TileState>;
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

const ROWS = [['1','2','3'],['4','5','6'],['7','8','9'],['⌫','0','↵']];

export function NumberKeyboard({ keyStates, onDigit, onBackspace, onEnter, disabled = false }: Props) {
  const [pulsed, setPulsed] = useState<string | null>(null);

  const handleKey = useCallback((key: string) => {
    if (disabled) return;
    setPulsed(key);
    setTimeout(() => setPulsed(null), 150);
    if (key === '⌫')      onBackspace();
    else if (key === '↵') onEnter();
    else                  onDigit(key);
  }, [disabled, onDigit, onBackspace, onEnter]);

  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {row.map(key => {
            const isSpecial = key === '⌫' || key === '↵';
            const state = isSpecial ? undefined : keyStates[key];
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
