import { useEffect, useState, useRef } from 'react';
import {
  subscribeToLobby, joinLobby, transitionToPlaying,
  finishGame, resolveWinner,
} from '../../lib/lobbyUtils';
import type { Lobby, PlayerRole } from '../../lib/types';

export function useLobby(lobbyId: string, uid: string | null) {
  const [lobby, setLobby]     = useState<Lobby | null>(null);
  const [role, setRole]       = useState<PlayerRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const transitioned          = useRef(false);
  const finishing             = useRef(false);

  useEffect(() => {
    if (!uid) return;

    const unsub = subscribeToLobby(lobbyId, async data => {
      if (!data) {
        setError('Lobby not found or expired');
        setLoading(false);
        return;
      }

      setLobby(data);
      setLoading(false);

      // Determine/confirm role
      if (data.hostUid === uid) {
        setRole('host');
      } else if (data.guestUid === uid) {
        setRole('guest');
      } else if (!data.guestUid) {
        // New visitor → join as guest
        const name = sessionStorage.getItem('numble_name') ?? 'Guest';
        try {
          await joinLobby(lobbyId, uid, name);
        } catch {
          setError('Failed to join lobby');
        }
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

  return { lobby, role, loading, error };
}
