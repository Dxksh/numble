import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createLobby, getLobby } from '../lib/lobbyUtils';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import styles from './HomePage.module.css';

const LOGO_COLORS = ['green','yellow','grey','green','yellow'] as const;
const LOGO_LETTERS = ['N','U','M','B','L'];

export function HomePage() {
  const { uid, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName]       = useState(() => sessionStorage.getItem('numble_name') ?? '');
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining]   = useState(false);
  const [error, setError]       = useState('');

  async function handleCreate() {
    if (!uid) return;
    if (!name.trim()) { setError('Enter your name first'); return; }
    setCreating(true);
    setError('');
    try {
      const id = await createLobby(uid, name.trim());
      sessionStorage.setItem('numble_name', name.trim());
      navigate(`/lobby/${id}`);
    } catch {
      setError('Failed to create game. Try again.');
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin() {
    const code = joinCode.trim().toUpperCase();
    if (!code) { setError('Enter a lobby code'); return; }
    setJoining(true);
    setError('');
    try {
      const lobby = await getLobby(code);
      if (!lobby) { setError('Lobby not found'); return; }
      if (lobby.guestUid && lobby.guestUid !== uid) { setError('Lobby is full'); return; }
      sessionStorage.setItem('numble_name', name.trim() || 'Guest');
      navigate(`/lobby/${code}`);
    } catch {
      setError('Failed to join. Try again.');
    } finally {
      setJoining(false);
    }
  }

  if (loading) return null;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}><ThemeToggle /></div>

      <div className={styles.hero}>
        <div className={styles.logo}>
          {LOGO_LETTERS.map((letter, i) => (
            <div key={i} className={`${styles.logoTile} ${styles[LOGO_COLORS[i]]}`}>
              {letter}
            </div>
          ))}
        </div>
        <h1 className={styles.title}>Numble</h1>
        <p className={styles.tagline}>A number-guessing duel for two players</p>
      </div>

      <div className={styles.actions}>
        <input
          className={styles.nameInput}
          placeholder="Your name"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          maxLength={20}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />

        <button
          className={styles.btnPrimary}
          onClick={handleCreate}
          disabled={creating || !uid}
        >
          {creating ? 'Creating…' : 'Create Game'}
        </button>

        <div className={styles.divider}>or join with a code</div>

        <div className={styles.joinRow}>
          <input
            className={styles.joinInput}
            placeholder="ABC123"
            value={joinCode}
            onChange={e => { setJoinCode(e.target.value.toUpperCase().slice(0,6)); setError(''); }}
            maxLength={6}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          <button className={styles.btnSecondary} onClick={handleJoin} disabled={joining || !uid}>
            {joining ? '…' : 'Join'}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <footer className={styles.footer}>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
      </footer>
    </div>
  );
}
