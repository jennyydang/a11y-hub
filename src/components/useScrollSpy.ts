import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns the id of the section the reader is currently in: the last
 * heading that has scrolled past the top of the viewport (under the sticky header).
 *
 * `pin(id)` marks a section current straight away and holds it while a jump scrolls there,
 * so the menu doesn't flick through every section in between.
 */
export function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = useState<string | null>(null);
  const pinned = useRef(false);
  const key = ids.join('|');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned.current) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      if (atBottom) current = ids[ids.length - 1] ?? current;
      setActive(current ?? ids[0] ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset]);

  const pin = useCallback(async (id: string, travel: Promise<void>) => {
    pinned.current = true;
    setActive(id);
    await travel;
    pinned.current = false;
  }, []);

  return [active, pin] as const;
}
