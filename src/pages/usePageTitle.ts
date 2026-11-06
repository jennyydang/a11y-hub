import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · A11y Hub` : 'A11y Hub';
  }, [title]);
}
