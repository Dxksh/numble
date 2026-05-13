import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLobby } from './useLobby';
import { usePresence } from './usePresence';
import { startGame } from '../../lib/lobbyUtils';
import { PlayerStatus } from '../../components/PlayerStatus/PlayerStatus';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import { CodeSetup } from '../game/CodeSetup';
import { GamePage } from '../game/GamePage';
import { GameOver } from '../game/GameOver';
import styles from './LobbyPage.module.css';

export function LobbyPage() {
  const { id: lobbyId = '' } = useParams();
  const { uid, loading: authLoading } = useAuth();
  const { lobby, role, loading, error, pendingGuest, joinAsGuest } = useLobby(lobbyId, uid);
  usePresence(lobbyId, role);

  const [copied, setCopied]         = useState(false);
  const [starting, setStarting]     = useState(false);
  const [guestName, setGuestName]   = useState(sessionStorage.getItem('numble_name') ?? '');
  const [joining, setJoining]       = useState(false);

  if (authLoading || loading) return null;

  if (error) {
    return (
      <div className={styles.error}>
        <span>{error}</span>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  // Guest name entry screen
  if (pendingGuest) {
    async function handleJoin(e: React.FormEvent) {
      e.preventDefault();
      const name = guestName.trim() || 'Guest';
      setJoining(true);
      await joinAsGuest(name);
      setJoining(false);
    }
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link to="/" className={styles.wordmark}>Numble</Link>
          <ThemeToggle />
        </header>
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.codeLabel} style={{ textAlign: 'center', marginBottom: 24 }}>
              Joining lobby
            </div>
            <form onSubmit={handleJoin} className={styles.nameForm}>
              <label className={styles.nameLabel} htmlFor="guestName">Your name</label>
              <input
                id="guestName"
                className={styles.nameInput}
                type="text"
                maxLength={20}
                placeholder="Enter your name"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                autoFocus
              />
              <button className={styles.startBtn} type="submit" disabled={joining}>
                {joining ? 'Joining…' : 'Join Game'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (!lobby || !role) return null;

  if (lobby.phase === 'code-setting') return <CodeSetup lobby={lobby} role={role} lobbyId={lobbyId} />;
  if (lobby.phase === 'playing')      return <GamePage  lobby={lobby} role={role} lobbyId={lobbyId} />;
  if (lobby.phase === 'finished')     return <GameOver  lobby={lobby} role={role} lobbyId={lobbyId} />;

  // Phase: lobby
  const shareUrl = `${window.location.origin}/lobby/${lobbyId}`;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleStart() {
    setStarting(true);
    try { await startGame(lobbyId); } finally { setStarting(false); }
  }

  const canStart = !!lobby.guestUid;
  const isHost   = role === 'host';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.wordmark}>Numble</Link>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.lobbyCode}>
            <div className={styles.codeLabel}>Lobby Code</div>
            <div className={styles.code}>{lobbyId}</div>
            <button className={styles.copyBtn} onClick={copyLink}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <div className={styles.players}>
            <PlayerStatus
              name={lobby.hostName}
              lastSeen={lobby.hostLastSeen}
              role="host"
              isSelf={role === 'host'}
            />
            <PlayerStatus
              name={lobby.guestName}
              lastSeen={lobby.guestLastSeen}
              role="guest"
              isSelf={role === 'guest'}
            />
          </div>

          {!canStart && (
            <p className={styles.waiting}>
              Share the lobby code or link — waiting for your opponent to join…
            </p>
          )}

          {isHost ? (
            <button
              className={styles.startBtn}
              onClick={handleStart}
              disabled={!canStart || starting}
            >
              {starting ? 'Starting…' : canStart ? 'Start Game' : 'Waiting for opponent…'}
            </button>
          ) : (
            <p className={styles.waiting}>Waiting for the host to start the game…</p>
          )}
        </div>
      </main>
    </div>
  );
}
