import type { Toast as ToastType } from '../../hooks/useToast';
import styles from './Toast.module.css';

interface Props {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <div
          key={t.id}
          className={styles.toast}
          data-type={t.type}
          onClick={() => onDismiss(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
