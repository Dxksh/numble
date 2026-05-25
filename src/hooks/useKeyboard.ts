import { useEffect } from 'react';

interface KeyboardHandlers {
  onKey: (k: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  mode?: 'digits' | 'letters';
}

export function useKeyboard({ onKey, onBackspace, onEnter, mode = 'digits' }: KeyboardHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter')     { onEnter();    return; }
      if (e.key === 'Backspace') { onBackspace(); return; }
      if (mode === 'digits') {
        const digit = e.key.replace('Numpad', '');
        if (/^[0-9]$/.test(digit)) onKey(digit);
      } else {
        if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, onBackspace, onEnter, mode]);
}
