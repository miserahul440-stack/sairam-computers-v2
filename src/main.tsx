import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register service worker for Progressive Web App (PWA) mobile installation
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Sairam Computers PWA Service Worker registered:', reg.scope))
      .catch((err) => console.error('Service Worker registration failed:', err));
  });
} else if ('serviceWorker' in navigator) {
  // Also register in dev mode if supported for testability
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Sairam PWA Service Worker Registered (Dev Range):', reg.scope))
      .catch((err) => console.log('Service worker dev caution:', err));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
