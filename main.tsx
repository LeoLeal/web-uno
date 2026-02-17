import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/app/AppRoutes';
import '@/app/globals.css';

// GitHub Pages SPA redirect: restore path from 404.html fallback
const spaRedirect = sessionStorage.getItem('spa-redirect');
if (spaRedirect) {
  sessionStorage.removeItem('spa-redirect');
  window.history.replaceState(null, '', spaRedirect);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);
