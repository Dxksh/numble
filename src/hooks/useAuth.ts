import { useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('numble_uid');
    if (stored) {
      setUid(stored);
      setLoading(false);
      return;
    }
    signInAnonymously(auth)
      .then(cred => {
        sessionStorage.setItem('numble_uid', cred.user.uid);
        setUid(cred.user.uid);
      })
      .finally(() => setLoading(false));
  }, []);

  return { uid, loading };
}
