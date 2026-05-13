import { useEffect } from 'react';

interface KeyboardHandlers {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

export function useKeyboard({ onDigit, onBackspace, onEnter }: KeyboardHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter')     { onEnter();    return; }
      if (e.key === 'Backspace') { onBackspace(); return; }
      const digit = e.key.replace('Numpad', '');
      if (/^[0-9]$/.test(digit)) onDigit(digit);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDigit, onBackspace, onEnter]);
}
