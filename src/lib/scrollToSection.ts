const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * Scrolls a section heading into place under the sticky header, moves focus to it for keyboard and
 * screen reader users, and briefly highlights it so the eye finds where it landed.
 * Smooth unless the reader prefers reduced motion. Returns once scrolling has settled.
 */
export function scrollToSection(id: string): Promise<void> {
  const el = document.getElementById(id);
  if (!el) return Promise.resolve();
  const smooth = !reducedMotion();
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');

  return new Promise((resolve) => {
    let idle = 0;
    const done = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', done);
      window.clearTimeout(idle);
      window.clearTimeout(cap);
      el.focus({ preventScroll: true });
      // Restart the highlight even if this heading was just highlighted.
      el.classList.remove('section-arrive');
      void el.offsetWidth;
      el.classList.add('section-arrive');
      window.setTimeout(() => el.classList.remove('section-arrive'), 1200);
      resolve();
    };
    // scrollend isn't in every browser, so also finish after scrolling goes quiet, or after 1.2s at most.
    const onScroll = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(done, 120);
    };
    const cap = window.setTimeout(done, 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', done, { once: true });
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    // Already in place: nothing will scroll.
    onScroll();
  });
}
