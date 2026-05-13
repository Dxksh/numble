import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import styles from './Legal.module.css';

export function TermsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.wordmark}>Numble</Link>
        <ThemeToggle />
      </header>
      <div className={styles.content}>
        <Link to="/" className={styles.back}>← Back to home</Link>
        <h1>Terms of Use</h1>
        <p className={styles.updated}>Last updated: May 2026</p>

        <h2>Acceptance</h2>
        <p>By accessing or playing Numble you agree to these Terms. If you do not agree, please do not use the game.</p>

        <h2>The Game</h2>
        <p>Numble is a free-to-play multiplayer browser game provided on an "as-is" basis. No purchase, subscription, or account is required to play.</p>

        <h2>Acceptable Use</h2>
        <ul>
          <li>You must not use offensive, hateful, or inappropriate display names.</li>
          <li>You must not attempt to cheat, reverse-engineer game logic, or tamper with Firestore data.</li>
          <li>You must not use the service for any unlawful purpose.</li>
        </ul>

        <h2>No Warranty</h2>
        <p>Numble is provided without warranty of any kind, express or implied. We make no guarantees regarding uptime, data integrity, or continued availability. The game may be modified, suspended, or shut down at any time without notice.</p>

        <h2>Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, the developers of Numble are not liable for any loss or damage arising from your use of the service, including loss of game data or downtime.</p>

        <h2>Changes</h2>
        <p>These Terms may be updated at any time. Continued use of the game after changes are posted constitutes acceptance of the updated Terms.</p>
      </div>
    </div>
  );
}
