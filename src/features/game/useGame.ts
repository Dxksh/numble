import { useState, useCallback } from 'react';
import { evaluateGuess, isSolved, getKeyboardStates } from '../../lib/gameLogic';
import { addGuess, markSolved } from '../../lib/lobbyUtils';
import type { Lobby, PlayerRole, Guess, TileState } from '../../lib/types';

export function useGame(lobby: Lobby, role: PlayerRole, lobbyId: string) {
  const [currentGuess, setCurrentGuess] = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [shakeRow, setShakeRow]         = useState(false);

  const myGuesses       = role === 'host' ? lobby.hostGuesses : lobby.guestGuesses;
  const opponentGuesses = role === 'host' ? lobby.guestGuesses : lobby.hostGuesses;
  // Host guesses guestCode; guest guesses hostCode
  const myTarget = role === 'host' ? lobby.guestCode : lobby.hostCode;

  const isSolvedByMe       = role === 'host' ? lobby.hostSolvedAt !== null : lobby.guestSolvedAt !== null;
  const isSolvedByOpponent = role === 'host' ? lobby.guestSolvedAt !== null : lobby.hostSolvedAt !== null;

  const canGuess = lobby.phase === 'playing' && !isSolvedByMe && myGuesses.length < 6;
  const keyboardStates: Record<string, TileState> = getKeyboardStates(myGuesses);

  const addDigit = useCallback((d: string) => {
    if (!canGuess || submitting) return;
    setCurrentGuess(prev => prev.length < 5 ? prev + d : prev);
  }, [canGuess, submitting]);

  const removeDigit = useCallback(() => {
    setCurrentGuess(prev => prev.slice(0, -1));
  }, []);

  const submitGuess = useCallback(async () => {
    if (currentGuess.length !== 5) {
      if (currentGuess.length > 0) {
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 500);
      }
      return;
    }
    if (!canGuess || submitting) return;

    setSubmitting(true);
    const result = evaluateGuess(currentGuess, myTarget);
    const guess: Guess = { guess: currentGuess, result, createdAt: Date.now() };

    try {
      await addGuess(lobbyId, role, guess);
      if (isSolved(result)) {
        await markSolved(lobbyId, role, Date.now());
      }
      setCurrentGuess('');
    } finally {
      setSubmitting(false);
    }
  }, [currentGuess, canGuess, submitting, myTarget, lobbyId, role]);

  return {
    currentGuess,
    myGuesses,
    opponentGuesses,
    keyboardStates,
    canGuess,
    isSolvedByMe,
    isSolvedByOpponent,
    shakeRow,
    addDigit,
    removeDigit,
    submitGuess,
  };
}
