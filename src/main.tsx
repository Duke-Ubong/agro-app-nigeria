import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { AppProvider } from './context/AppContext.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

// Safely suppress external browser extension unhandled rejections (e.g. MetaMask / Web3 injected wallet errors)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (
      reason.toLowerCase().includes('metamask') ||
      reason.toLowerCase().includes('ethereum') ||
      reason.toLowerCase().includes('extension') ||
      reason.toLowerCase().includes('wallet')
    ) {
      event.preventDefault();
      console.warn('Handled external extension event safely:', reason);
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.toLowerCase().includes('metamask') ||
      msg.toLowerCase().includes('ethereum') ||
      msg.toLowerCase().includes('extension')
    ) {
      event.preventDefault();
      console.warn('Handled external extension error safely:', msg);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);


