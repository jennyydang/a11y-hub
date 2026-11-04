import { useEffect, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';

type Mode = 'light' | 'dark';
const KEY = 'a11y-hub:theme';

function initial(): Mode {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.66 5.4a.75.75 0 0 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.46 14.6a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.6 15.66a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.4 6.46a.75.75 0 0 0 1.06-1.06L5.4 4.34a.75.75 0 0 0-1.06 1.06L5.4 6.46Z" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M7.46 1.98a.75.75 0 0 1 .1.83A6.5 6.5 0 0 0 17.2 12.44a.75.75 0 0 1 .93.93A8 8 0 1 1 6.63 1.88a.75.75 0 0 1 .83.1Z" clipRule="evenodd" />
    </svg>
  );
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(initial);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);
  const dark = mode === 'dark';
  return (
    <Button
      iconOnly
      weight="clear"
      color="gray"
      shape="pill"
      icon={dark ? SunIcon : MoonIcon}
      aria-pressed={dark}
      sr="Dark theme"
      onClick={() => setMode(dark ? 'light' : 'dark')}
    />
  );
}
