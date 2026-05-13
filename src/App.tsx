import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast/Toast';
import { HomePage } from './pages/HomePage';
import { LobbyPage } from './features/lobby/LobbyPage';
import { PrivacyPage } from './features/legal/PrivacyPage';
import { TermsPage } from './features/legal/TermsPage';

export default function App() {
  useTheme();
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/lobby/:id" element={<LobbyPage />} />
        <Route path="/privacy"   element={<PrivacyPage />} />
        <Route path="/terms"     element={<TermsPage />} />
      </Routes>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
}
