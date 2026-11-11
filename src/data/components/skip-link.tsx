import { useRef } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const mainRef = useRef<HTMLElement>(null);
  return (
    <div className="w-full max-w-xl space-y-2">
      <p className="text-sm text-muted">Tab into this example from the toolbar above. The skip link appears first.</p>
      <div className="relative overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <a
          href="#demo-main"
          onClick={(e) => {
            e.preventDefault();
            mainRef.current?.focus();
          }}
          className="absolute left-2 top-2 z-10 -translate-y-16 rounded-md bg-primary-700 px-3 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 focus-ring motion-reduce:transition-none dark:bg-primary-300 dark:text-gray-900"
        >
          Skip to main content
        </a>
        <div className="flex flex-wrap gap-1 border-b border-gray-200 p-2 dark:border-gray-700">
          {['Home', 'Shop', 'Blog', 'About', 'Help'].map((l) => (
            <a key={l} href={`#${l}`} onClick={(e) => e.preventDefault()} className="rounded px-2 py-1 text-sm hover:bg-gray-100 focus-ring dark:hover:bg-gray-800">
              {l}
            </a>
          ))}
        </div>
        <section ref={mainRef} id="demo-main" tabIndex={-1} aria-label="Main content" className="p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600">
          <p className="font-semibold">Main content</p>
          <p className="text-sm text-muted">Focus lands here, skipping the five navigation links.</p>
        </section>
      </div>
    </div>
  );
}

export const skipLink: ComponentSpec = {
  slug: 'skip-link',
  name: 'Skip link',
  category: 'Navigation',
  summary: 'A skip link is the first link on the page. It lets keyboard users jump past repeated navigation straight to the main content.',
  semantics: '<a href="#main"> + <main tabindex="-1">',
  whenToUse: ['Add a skip link to every page that has navigation or other content repeated before the main content.'],
  keyboard: [
    { keys: ['Tab'], action: 'The first press on a page focuses the skip link and makes it visible.' },
    { keys: ['Enter'], action: 'Moves focus to the main content. The next Tab continues from there.' },
  ],
  aria: [
    { attr: 'href="#main"', where: 'skip link', usage: 'Points to the id of the main content.' },
    { attr: '<main id="main" tabindex="-1">', where: 'target', usage: 'tabindex="-1" makes sure focus really moves there in every browser, not just the scroll position.' },
    { attr: 'focus-visible styles', where: 'skip link', usage: 'Hidden off-screen until focused, then shown on top of the page.' },
  ],
  focus: [
    'The link must be the first focusable element in the page.',
    'Hide it by moving it off-screen or clipping it. Never use display:none or visibility:hidden, which make it unfocusable.',
    'In single-page apps, the browser’s own hash handling may conflict with the router. Move focus in script, as this site does.',
  ],
  screenReader: ['Announced as: “Skip to main content, link”.', 'Screen reader users can also jump with landmarks and headings, so the skip link mostly helps sighted keyboard users.'],
  dos: ['Make it clearly visible when focused, with strong contrast.', 'Test it on every page template.'],
  donts: ['Don’t point it at an element that isn’t focusable.', 'Don’t leave it visible but covered by a sticky header.'],
  wcag: [WCAG.bypass, WCAG.focusVisible, WCAG.focusOrder, WCAG.focusNotObscured],
  testing: [
    'Load the page and press Tab once. Confirm the skip link appears.',
    'Press Enter, then Tab again, and confirm focus continues inside the main content.',
  ],
  Demo,
};
