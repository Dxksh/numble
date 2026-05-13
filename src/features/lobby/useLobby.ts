import { useEffect, useState, useRef } from 'react';
import {
  subscribeToLobby, joinLobby, transitionToPlaying,
  finishGame, resolveWinner,
} from '../../lib/lobbyUtils';
import type { Lobby, PlayerRole } from '../../lib/types';

export function useLobby(lobbyId: string, uid: string | null) {
  const [lobby, setLobby]           = useState<Lobby | null>(null);
  const [role, setRole]             = useState<PlayerRole | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [pendingGuest, setPendingGuest] = useState(false);
  const transitioned                = useRef(false);
  const finishing                   = useRef(false);

  async function joinAsGuest(name: string) {
    if (!uid) return;
    sessionStorage.setItem('numble_name', name);
    try {
      await joinLobby(lobbyId, uid, name);
    } catch {
      setError('Failed to join lobby');
    }
  }

  useEffect(() => {
    if (!uid) return;

    const unsub = subscribeToLobby(lobbyId, async data => {
      if (!data) {
        setError('Lobby not found or expired');
        setLoading(false);
        return;
      }

      // Reset game refs when a rematch brings phase back to lobby
      if (data.phase === 'lobby') {
        transitioned.current = false;
        finishing.current = false;
      }

      setLobby(data);
      setLoading(false);

      // Determine/confirm role
      if (data.hostUid === uid) {
        setRole('host');
      } else if (data.guestUid === uid) {
        setRole('guest');
        setPendingGuest(false);
      } else if (!data.guestUid) {
        // New visitor → show name entry form before joining
        setPendingGuest(true);
        return;
      } else {
        setError('Lobby is full');
        return;
      }

      // code-setting → playing (both codes submitted)
      if (data.phase === 'code-setting' && data.hostReady && data.guestReady && !transitioned.current) {
        transitioned.current = true;
        await transitionToPlaying(lobbyId).catch(() => {
          transitioned.current = false;
        });
      }

      // playing → finished (win/draw condition met)
      if (data.phase === 'playing' && !finishing.current) {
        const winner = resolveWinner(data);
        if (winner !== null) {
          finishing.current = true;
          await finishGame(lobbyId, winner).catch(() => {
            finishing.current = false;
          });
        }
      }
    });

    return () => unsub();
  }, [lobbyId, uid]);

  return { lobby, role, loading, error, pendingGuest, joinAsGuest };
}
