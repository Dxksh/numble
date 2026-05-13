import { useEffect } from 'react';
import { updateLastSeen } from '../../lib/lobbyUtils';
import type { PlayerRole } from '../../lib/types';

export function usePresence(lobbyId: string, role: PlayerRole | null) {
  useEffect(() => {
    if (!role) return;
    updateLastSeen(lobbyId, role);
    const interval = setInterval(() => updateLastSeen(lobbyId, role), 30_000);
    return () => clearInterval(interval);
  }, [lobbyId, role]);
}
