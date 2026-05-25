import { useState, useCallback } from 'react';
import { evaluateGuess, isSolved, getKeyboardStates } from '../../lib/gameLogic';
import { addGuess, markSolved } from '../../lib/lobbyUtils';
import { getGameModeConfig } from '../../lib/gameModes';
import type { Lobby, PlayerRole, Guess, TileState } from '../../lib/types';

export function useGame(lobby: Lobby, role: PlayerRole, lobbyId: string) {
  const [currentGuess, setCurrentGuess] = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [shakeRow, setShakeRow]         = useState(false);
  const [invalidGuess, setInvalidGuess] = useState(false);

  const config        = getGameModeConfig(lobby.gameMode);
  const myGuesses     = role === 'host' ? lobby.hostGuesses : lobby.guestGuesses;
  const opponentGuesses = role === 'host' ? lobby.guestGuesses : lobby.hostGuesses;
  const myTarget      = role === 'host' ? lobby.guestCode : lobby.hostCode;

  const isSolvedByMe       = role === 'host' ? lobby.hostSolvedAt !== null : lobby.guestSolvedAt !== null;
  const isSolvedByOpponent = role === 'host' ? lobby.guestSolvedAt !== null : lobby.hostSolvedAt !== null;

  const canGuess = lobby.phase === 'playing' && !isSolvedByMe && myGuesses.length < 6;
  const keyboardStates: Record<string, TileState> = getKeyboardStates(myGuesses);

  const addChar = useCallback((c: string) => {
    if (!canGuess || submitting) return;
    setInvalidGuess(false);
    setCurrentGuess(prev => prev.length < 5 ? prev + c : prev);
  }, [canGuess, submitting]);

  const removeChar = useCallback(() => {
    setInvalidGuess(false);
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

    if (!config.validateGuess(currentGuess)) {
      setInvalidGuess(true);
      setShakeRow(true);
      setTimeout(() => { setShakeRow(false); setInvalidGuess(false); }, 1500);
      return;
    }

    setSubmitting(true);
    const result = evaluateGuess(currentGuess, myTarget);
    const guess: Guess = { guess: currentGuess, result, createdAt: Date.now() };

    try {
      await addGuess(lobbyId, role, guess);
      if (isSolved(result)) await markSolved(lobbyId, role, Date.now());
      setCurrentGuess('');
    } finally {
      setSubmitting(false);
    }
  }, [currentGuess, canGuess, submitting, myTarget, lobbyId, role, config]);

  return {
    currentGuess,
    myGuesses,
    opponentGuesses,
    keyboardStates,
    canGuess,
    isSolvedByMe,
    isSolvedByOpponent,
    shakeRow,
    invalidGuess,
    config,
    addChar,
    removeChar,
    submitGuess,
  };
}
