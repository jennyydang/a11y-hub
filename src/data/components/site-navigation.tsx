import { useEffect, useRef, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';
import { cx } from '../../ui';

const menu = [
  { label: 'Products', items: ['Analytics', 'Automation', 'Integrations'] },
  { label: 'Resources', items: ['Guides', 'API reference', 'Community'] },
];

function Demo() {
  const [open, setOpen] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        buttons.current[open]?.focus();
        setOpen(null);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const top = 'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 focus-ring dark:text-gray-100 dark:hover:bg-gray-800';

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="w-full max-w-xl rounded-xl bg-white px-2 py-1 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
      }}
    >
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <a href="#home" aria-current="page" className={cx(top, 'underline decoration-2 underline-offset-4')} onClick={(e) => e.preventDefault()}>
            Home
          </a>
        </li>
        {menu.map((m, i) => (
          <li key={m.label} className="relative">
            <button
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              aria-expanded={open === i}
              aria-controls={`sitenav-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className={top}
            >
              {m.label}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', open === i && 'rotate-180')}>
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
            <ul
              id={`sitenav-${i}`}
              hidden={open !== i}
              className="popover-panel absolute left-0 top-full z-20 mt-1 w-48 p-1"
            >
              {m.items.map((it) => (
                <li key={it}>
                  <a href={`#${it}`} onClick={(e) => e.preventDefault()} className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100 focus-ring dark:hover:bg-gray-700">
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li>
          <a href="#pricing" className={top} onClick={(e) => e.preventDefault()}>
            Pricing
          </a>
        </li>
      </ul>
    </nav>
  );
}

export const siteNavigation: ComponentSpec = {
  slug: 'site-navigation',
  name: 'Site navigation',
  category: 'Navigation',
  summary: 'The main navigation links to the top sections of a site, often with dropdowns that reveal sub-pages.',
  semantics: '<nav> + list of links + disclosure buttons',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/',
  whenToUse: [
    'Use the disclosure pattern (buttons that show and hide lists of links) for dropdown navigation.',
    'Don’t use role="menu" or role="menubar" for site navigation. Those are for application commands and change how screen readers and keys behave.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through top-level links and buttons, and into an open dropdown’s links.' },
    { keys: ['Enter', 'Space'], action: 'On a dropdown button: opens or closes it.' },
    { keys: ['Escape'], action: 'Closes the open dropdown and returns focus to its button.' },
  ],
  aria: [
    { attr: '<nav aria-label="Main">', where: 'container', usage: 'A named landmark. Name each <nav> when a page has more than one.' },
    { attr: 'aria-expanded', where: 'dropdown button', usage: 'true while its list is shown.' },
    { attr: 'aria-controls', where: 'dropdown button', usage: 'Points to the list it shows.' },
    { attr: 'hidden', where: 'closed dropdown list', usage: 'Removes hidden links from the tab order and the accessibility tree.' },
    { attr: 'aria-current="page"', where: 'current section link', usage: 'Marks where the user is.' },
  ],
  focus: [
    'Close an open dropdown when focus leaves the navigation or the user clicks outside it.',
    'Open dropdowns on click or Enter, not on hover alone. If you also open on hover, add a short delay and keep it open while the pointer is inside.',
  ],
  screenReader: ['Announced as: “Main, navigation. Products, button, collapsed”.', 'The current link: “Home, current page, link”.'],
  dos: ['Keep top-level labels short and predictable.', 'Keep the same navigation in the same order on every page (WCAG 3.2.3).'],
  donts: ['Don’t make the top-level label both a link and a dropdown toggle. Use a separate button.', 'Don’t trap focus inside a dropdown.'],
  wcag: [WCAG.keyboard, WCAG.nameRoleValue, WCAG.bypass, WCAG.hoverFocus, WCAG.focusOrder],
  testing: [
    'Open each dropdown with Enter and Space.',
    'Press Escape and confirm focus returns to the button.',
    'Tab out of an open dropdown and confirm it closes.',
    'Confirm hidden links are not reachable with Tab.',
  ],
  Demo,
};
