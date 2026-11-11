import { useId } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const LINKS = ['Trails', 'Guides', 'Community'];

/**
 * A site header. On a real page it's a top-level <header>, which becomes the banner landmark.
 * Here it sits inside the documentation, so browsers treat it as a plain header.
 */
function Demo() {
  const id = useId();
  const go = (e: React.MouseEvent) => e.preventDefault();
  return (
    <header className="rounded-xl bg-white ring-1 ring-gray-300 dark:bg-gray-900 dark:ring-gray-700">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <a href="#" onClick={go} className="flex items-center gap-2 rounded font-bold focus-ring">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-emerald-700 dark:text-emerald-300">
            <path d="M10 2 2 16h16L10 2Zm0 5 3.5 6h-7L10 7Z" />
          </svg>
          Trailmate<span className="sr-only"> home</span>
        </a>
        <nav aria-labelledby={`${id}-nav`} className="order-last w-full sm:order-none sm:w-auto">
          <span id={`${id}-nav`} hidden>
            Trailmate example
          </span>
          <ul className="flex flex-wrap gap-1">
            {LINKS.map((l, i) => (
              <li key={l}>
                <a
                  href="#"
                  onClick={go}
                  aria-current={i === 0 ? 'page' : undefined}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus-ring aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8 dark:hover:bg-gray-800"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#" onClick={go} className="ml-auto rounded-md px-3 py-2 text-sm font-medium ring-1 ring-gray-500 hover:bg-gray-100 focus-ring dark:ring-gray-400 dark:hover:bg-gray-800">
          Sign in
        </a>
      </div>
    </header>
  );
}


export const pageHeader: ComponentSpec = {
  slug: 'header',
  name: 'Header',
  category: 'Navigation',
  summary: 'The site header holds the logo, main navigation and global actions like search and sign in. It’s the same on every page and becomes the banner landmark.',
  semantics: 'Top-level <header> (banner landmark) with a labelled <nav>',
  whenToUse: [
    'Use one site header on every page, in the same place and order.',
    'Keep it to what people need everywhere: home, main sections, search, account.',
    'Use a page heading (h1) in main for the page’s own title, not the header.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through the logo, navigation links and actions, in visual order.' },
    { keys: ['Enter'], action: 'Follows a link or activates a button.' },
  ],
  aria: [
    { attr: '<header>', where: 'page top level', usage: 'Becomes the banner landmark only when it isn’t inside main, article, aside, nav or section.' },
    { attr: 'aria-label="Main"', where: '<nav>', usage: 'Names the navigation so people can tell it apart from the footer navigation.' },
    { attr: 'aria-current="page"', where: 'current link', usage: 'Says which section people are in.' },
    { attr: 'Visually hidden “home”', where: 'logo link', usage: '“Trailmate home, link” tells people where it goes.' },
  ],
  focus: ['The skip link comes before the header, so keyboard users can jump past it.', 'A sticky header must not cover the focused element when people tab down the page.'],
  screenReader: ['“Banner landmark.” People can jump to it, or past it, with landmark navigation.', '“Main navigation, list, 3 items. Trails, current page, link.”'],
  dos: ['Keep the same order on every page.', 'Collapse navigation into a labelled menu button on small screens.', 'Leave room for text to grow at 200% zoom.'],
  donts: ['Don’t put more than one banner landmark on a page.', 'Don’t make a sticky header taller than about a fifth of the screen.', 'Don’t use an image of text for the logo without alt text.'],
  wcag: [WCAG.bypass, WCAG.consistentNav, WCAG.consistentId, WCAG.infoRel, WCAG.focusNotObscured, WCAG.reflow],
  testing: [
    'List landmarks with a screen reader and confirm one banner and a named navigation.',
    'Tab through and confirm the order matches what you see.',
    'Zoom to 400% (or 320px wide) and confirm nothing is cut off or overlaps.',
    'With a sticky header, tab down the page and confirm focus is never hidden under it.',
  ],
  Demo,
};
