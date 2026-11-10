import { useEffect, useId, useRef, useState } from 'react';
import { WCAG } from '../data/wcag';
import { cx } from '../ui';
import type { Pattern } from './types';

const MENU = [
  { label: 'Shop', items: ['New arrivals', 'Women', 'Men', 'Kids', 'Sale'] },
  { label: 'Services', items: ['Repairs', 'Gift cards', 'Personal shopping'] },
  { label: 'About us', items: ['Our story', 'Stores', 'Careers'] },
];

const linkCls = 'block rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 focus-ring dark:text-gray-50 dark:hover:bg-gray-800';

function Demo() {
  const id = useId();
  const [open, setOpen] = useState<number | null>(null);
  const [current, setCurrent] = useState('Journal');
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Close an open submenu when focus or a click moves outside the navigation.
  useEffect(() => {
    if (open === null) return;
    const onDown = (e: PointerEvent) => !navRef.current?.contains(e.target as Node) && setOpen(null);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const go = (label: string) => {
    setCurrent(label);
    setOpen(null);
    setMenuOpen(false);
  };

  const list = (
    <ul id={`${id}-list`} className={cx(mobile ? 'mt-2 space-y-1' : 'flex items-center gap-1')}>
      {MENU.map((m, i) => (
        <li key={m.label} className="relative">
          <button
            ref={(el) => (buttons.current[i] = el)}
            type="button"
            aria-expanded={open === i}
            aria-controls={`${id}-sub-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
            className={cx(
              'flex w-full items-center justify-between gap-1 rounded px-3 py-2 text-sm font-medium focus-ring hover:bg-gray-100 dark:hover:bg-gray-800',
              m.items.includes(current) && 'text-primary-700 underline decoration-2 underline-offset-4 dark:text-primary-300',
            )}
          >
            {m.label}
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={cx('h-4 w-4 transition-transform', open === i && 'rotate-180')}>
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
          <ul
            id={`${id}-sub-${i}`}
            hidden={open !== i}
            className={cx(
              'reveal space-y-0.5 rounded-lg bg-white p-1.5 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700',
              mobile ? 'mt-1 ml-3' : 'absolute left-0 top-full z-20 mt-1 w-48 shadow-lg',
            )}
          >
            {m.items.map((it) => (
              <li key={it}>
                <a
                  href="#"
                  aria-current={current === it ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(it);
                  }}
                  className={cx(linkCls, current === it && 'font-semibold text-primary-700 dark:text-primary-300')}
                >
                  {it}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
      <li>
        <a
          href="#"
          aria-current={current === 'Journal' ? 'page' : undefined}
          onClick={(e) => {
            e.preventDefault();
            go('Journal');
          }}
          className={cx(linkCls, 'font-medium', current === 'Journal' && 'text-primary-700 underline decoration-2 underline-offset-4 dark:text-primary-300')}
        >
          Journal
        </a>
      </li>
    </ul>
  );

  return (
    <div className="space-y-4">
      <fieldset className="flex flex-wrap items-center gap-3 text-sm">
        <legend className="sr-only">Preview layout</legend>
        {(['Desktop', 'Mobile'] as const).map((l) => (
          <label key={l} className="flex items-center gap-2">
            <input
              type="radio"
              name={`${id}-layout`}
              className="h-4 w-4 accent-primary-700"
              checked={mobile === (l === 'Mobile')}
              onChange={() => {
                setMobile(l === 'Mobile');
                setOpen(null);
                setMenuOpen(false);
              }}
            />
            {l} layout
          </label>
        ))}
      </fieldset>
      <div className={cx('rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950', mobile ? 'max-w-xs' : '')}>
        <header className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go('Home');
            }}
            className="rounded font-bold focus-ring"
          >
            Northwind<span className="sr-only">, home</span>
          </a>
          <nav
            ref={navRef}
            aria-label="Main"
            className={cx(mobile && 'w-full')}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && open !== null) {
                e.stopPropagation();
                buttons.current[open]?.focus();
                setOpen(null);
              } else if (e.key === 'Escape' && mobile && menuOpen) {
                setMenuOpen(false);
                navRef.current?.querySelector<HTMLButtonElement>('[data-menu-toggle]')?.focus();
              }
            }}
            onBlur={(e) => {
              if (!navRef.current?.contains(e.relatedTarget as Node)) setOpen(null);
            }}
          >
            {mobile ? (
              <>
                <button
                  type="button"
                  data-menu-toggle
                  aria-expanded={menuOpen}
                  aria-controls={`${id}-list`}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="ml-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ring-1 ring-gray-400 focus-ring"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />
                  </svg>
                  Menu
                </button>
                <div hidden={!menuOpen}>{list}</div>
              </>
            ) : (
              list
            )}
          </nav>
        </header>
      </div>
      <p className="text-sm text-muted" role="status">
        Current page: {current}
      </p>
    </div>
  );
}

export const mainNavigation: Pattern = {
  slug: 'main-navigation',
  name: 'Main navigation',
  category: 'Navigation',
  summary:
    'The site’s primary menu: a few top-level sections, some of which open a list of links. Built as disclosure buttons and plain links, not an ARIA menu, so it works the way people expect a website to work.',
  uses: ['site-navigation', 'disclosure', 'link', 'button', 'skip-link'],
  whenToUse: [
    'For the site-wide navigation in the header, the same on every page.',
    'When top-level sections have a handful of links each. If a section needs dozens of links or rich content, link to a section landing page instead of building a mega menu.',
    'Not for app toolbars or actions like Edit and Delete. Those are a menu button or toolbar.',
  ],
  structure: [
    { part: 'Skip link', element: '<a href="#main">', notes: 'First thing on the page, before the navigation, so keyboard users can jump past it.' },
    { part: 'Header', element: '<header>', notes: 'Holds the logo, navigation, search and account links. One per page at the top level, so it becomes the banner landmark.' },
    { part: 'Logo', element: '<a href="/">', notes: 'Links home. The name includes the site name, not “logo”.' },
    { part: 'Navigation', element: '<nav aria-label="Main">', notes: 'Labelled so screen reader users can tell it from other navigation, like breadcrumbs or the footer.' },
    { part: 'Top-level list', element: '<ul> of <li>', notes: 'Screen readers announce how many items there are.' },
    { part: 'Section with sub-links', element: '<button aria-expanded aria-controls>', notes: 'A button that shows and hides its list. Not a link, because it doesn’t go anywhere.' },
    { part: 'Sub-links', element: '<ul> of <a href>', notes: 'Ordinary links, reached with Tab. The current page has aria-current="page".' },
    { part: 'Mobile menu button', element: '<button aria-expanded aria-controls>', notes: 'On small screens, one button shows and hides the whole list. Its visible text is “Menu”.' },
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through the top-level buttons and links, and into an open submenu’s links, in reading order.' },
    { keys: ['Enter', 'Space'], action: 'On a section button: opens or closes its links.' },
    { keys: ['Escape'], action: 'Closes the open submenu and returns focus to its button. On mobile, closes the menu.' },
    { keys: ['Shift + Tab'], action: 'Moves backwards. Tabbing out of the navigation closes any open submenu.' },
  ],
  aria: [
    { attr: 'aria-label', where: '<nav>', usage: 'Names the landmark, like “Main”. Don’t include the word “navigation”; screen readers already say it.' },
    { attr: 'aria-expanded', where: 'section and Menu buttons', usage: 'Says whether the list is open. Update it every time.' },
    { attr: 'aria-controls', where: 'section and Menu buttons', usage: 'Points to the list it shows and hides.' },
    { attr: 'aria-current="page"', where: 'link to the current page', usage: 'Tells screen readers which page you’re on. Pair it with a visible style that isn’t color alone.' },
    { attr: 'hidden', where: 'closed submenu list', usage: 'Removes closed links from the tab order and from screen readers.' },
    { attr: 'Visually hidden text', where: 'logo link', usage: 'Adds “home” to the logo link’s name, like “Northwind, home”.' },
    { attr: 'aria-hidden="true"', where: 'chevron and hamburger icons', usage: 'The icons are decoration; the button text and aria-expanded carry the meaning.' },
  ],
  content: [
    { label: 'Navigation label', target: 'aria-label on <nav>', guidance: 'One or two words that tell it apart from other navigation on the page.', good: 'Main' },
    { label: 'Section names', target: 'Visible text', guidance: 'Short, plain nouns people would search for. Match the landing page headings.', good: 'Shop, Services, About us' },
    { label: 'Link text', target: 'Visible text', guidance: 'Each link makes sense alone and matches the page title it goes to.', good: 'Gift cards' },
    { label: 'Logo link name', target: 'Visually hidden text', guidance: 'The site name and “home”.', good: 'Northwind, home' },
    { label: 'Mobile menu button', target: 'Visible text', guidance: 'Use a visible word, not just an icon.', good: 'Menu' },
  ],
  design: [
    'Section buttons look different from links, with a chevron that turns when open.',
    'The current page is marked with more than color: an underline, weight or indicator bar.',
    'Focus indicators are visible on every button and link, including inside open submenus, and aren’t hidden by the header.',
    'Targets are at least 24×24px, with space between them.',
    'Submenus open on click or Enter, not on hover alone. If they also open on hover, they stay open while the pointer moves into them and close with Escape.',
    'At 320px wide and 200% zoom, the menu collapses behind a “Menu” button instead of wrapping off screen.',
  ],
  screenReader: [
    '“Main, navigation landmark. List, 4 items.”',
    '“Shop, button, collapsed.” Press Enter: “Shop, button, expanded.”',
    'Tab: “List, 5 items. New arrivals, link.”',
    'On the current page’s link: “Journal, current page, link.”',
    'Press Escape: focus returns to “Shop, button, collapsed.”',
  ],
  mistakes: [
    'Using role="menu" and role="menuitem". That turns on application-style arrow-key navigation that website visitors don’t expect, and breaks Tab.',
    'Making the section name a link that also opens the submenu on hover. Keyboard and touch users can’t reach the submenu without navigating away.',
    'Submenus that only open on hover, or close as soon as the pointer moves diagonally.',
    'Hiding closed submenus with opacity or off-screen positioning, so their links are still in the tab order.',
    'An icon-only hamburger button with no name.',
    'A different navigation order or labels on different pages (WCAG 3.2.3 and 3.2.4).',
  ],
  testing: [
    'Tab through the whole navigation: every section button and link is reachable, in visual order, with a visible focus indicator.',
    'Enter and Space open and close each section; aria-expanded changes with it.',
    'Escape closes an open section and puts focus back on its button.',
    'Tabbing out of the navigation closes the open section.',
    'Closed submenu links are not reachable with Tab.',
    'A screen reader announces the navigation landmark with its label, the number of items, and “current page” on the right link.',
    'At 320px and 400% zoom the Menu button appears and everything is reachable.',
    'The navigation is in the same place, in the same order, on every page.',
  ],
  wcag: [WCAG.bypass, WCAG.infoRel, WCAG.keyboard, WCAG.focusOrder, WCAG.focusVisible, WCAG.hoverFocus, WCAG.consistentNav, WCAG.consistentId, WCAG.nameRoleValue, WCAG.reflow, WCAG.targetSize],
  sources: [
    { title: 'Example disclosure navigation menu', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/', by: 'W3C WAI ARIA Authoring Practices', note: 'The pattern this demo follows.' },
    { title: 'Menus tutorial', url: 'https://www.w3.org/WAI/tutorials/menus/', by: 'W3C WAI', note: 'Structure, fly-out behavior and application menus vs. navigation.' },
    { title: 'Header component', url: 'https://design-system.service.gov.uk/components/header/', by: 'GOV.UK Design System' },
  ],
  roles: {
    content: ['Name the navigation landmark and every section.', 'Keep labels consistent with page titles.', 'Write the logo link’s name and the Menu button text.'],
    design: ['Design open, closed, hover, focus and current states.', 'Design the mobile Menu layout at 320px.', 'Mark the current page with more than color.'],
    frontend: ['Build with <nav>, lists, disclosure buttons and links, not ARIA menus.', 'Manage aria-expanded, Escape and closing on focus out.', 'Keep closed lists hidden from the tab order.'],
    qa: ['Test Tab order, Escape and focus return.', 'Check landmark, list and current-page announcements with two screen readers.', 'Check reflow and zoom.'],
  },
  Demo,
  html: `<a class="skip-link" href="#main">Skip to main content</a>
<header>
  <a href="/">Northwind<span class="visually-hidden">, home</span></a>
  <nav aria-label="Main">
    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>
    <ul id="main-nav">
      <li>
        <button type="button" aria-expanded="false" aria-controls="nav-shop">Shop</button>
        <ul id="nav-shop" hidden>
          <li><a href="/new">New arrivals</a></li>
          <li><a href="/women">Women</a></li>
        </ul>
      </li>
      <li><a href="/journal" aria-current="page">Journal</a></li>
    </ul>
  </nav>
</header>
<main id="main" tabindex="-1">…</main>`,
};
