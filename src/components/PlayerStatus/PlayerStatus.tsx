import styles from './PlayerStatus.module.css';

interface Props {
  name: string | null;
  lastSeen: number;
  role: 'host' | 'guest';
  isSelf?: boolean;
}

export function PlayerStatus({ name, lastSeen, role, isSelf = false }: Props) {
  const online = name !== null && (Date.now() - lastSeen < 90_000);
  return (
    <div className={styles.player}>
      <div className={`${styles.dot} ${name ? (online ? styles.online : styles.offline) : ''}`} />
      <div className={styles.info}>
        {name
          ? <span className={styles.name}>{name}{isSelf ? ' (you)' : ''}</span>
          : <span className={styles.empty}>Waiting…</span>}
        <span className={styles.role}>{role}</span>
      </div>
    </div>
  );
}
