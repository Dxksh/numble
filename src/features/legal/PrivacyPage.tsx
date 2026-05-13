import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import styles from './Legal.module.css';

export function PrivacyPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.wordmark}>Numble</Link>
        <ThemeToggle />
      </header>
      <div className={styles.content}>
        <Link to="/" className={styles.back}>← Back to home</Link>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: May 2026</p>

        <h2>Overview</h2>
        <p>Numble is a free browser-based multiplayer game. We collect the minimum data necessary to run the game. No account registration or email address is required.</p>

        <h2>What We Collect</h2>
        <ul>
          <li><strong>Player display name</strong> — entered voluntarily by you and stored only for the duration of a game session. Not linked to any real-world identity.</li>
          <li><strong>Anonymous user ID</strong> — generated automatically by Firebase Authentication when you open the app. This ID is not linked to your device, email, or any personal information.</li>
          <li><strong>Game session data</strong> — lobby state, guesses, and results stored in Firebase Firestore for the duration of an active game. Lobby documents expire and are deleted 24 hours after creation.</li>
        </ul>

        <h2>What We Do Not Collect</h2>
        <ul>
          <li>Email addresses, passwords, or account credentials</li>
          <li>IP addresses (beyond what Firebase logs at the infrastructure level)</li>
          <li>Device identifiers or advertising IDs</li>
          <li>Usage analytics, tracking pixels, or behavioural profiling</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>Numble uses <strong>Firebase</strong> (by Google) for anonymous authentication and real-time data storage. Firebase may process connection metadata in accordance with <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noreferrer">Google's Privacy Policy</a>. No other third-party services are used.</p>

        <h2>Data Retention</h2>
        <p>Game lobby documents are automatically deleted 24 hours after creation. Player names stored in your browser's session storage are cleared when you close the tab. No long-term personal data is retained.</p>

        <h2>Your Rights</h2>
        <p>Because we do not link data to any personal identity, we have no way to look up data for a specific individual. All game data expires automatically within 24 hours.</p>

        <h2>Contact</h2>
        <p>Questions about this policy can be raised via the project's GitHub repository.</p>
      </div>
    </div>
  );
}
