import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FluidProvider } from '@fluid-design/fluid-ui';
import { App } from './App';
import './index.css';

// Apply the saved theme before first paint to avoid a flash.
try {
  const saved = localStorage.getItem('a11y-hub:theme');
  const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluidProvider>
      <App />
    </FluidProvider>
  </StrictMode>,
);
