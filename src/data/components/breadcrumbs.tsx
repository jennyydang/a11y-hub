import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const trail = [
  { label: 'Home', href: '#/' },
  { label: 'Components', href: '#/components' },
  { label: 'Navigation', href: '#/components' },
  { label: 'Breadcrumbs', href: '#/components/breadcrumbs' },
];

function Demo() {
  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-xl">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-1">
              {i > 0 && (
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500 dark:text-gray-400">
                  <path fillRule="evenodd" d="M7.2 14.8a.75.75 0 0 1 0-1.06L10.94 10 7.2 6.27a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              )}
              {last ? (
                <a href={c.href} aria-current="page" className="rounded px-1 py-0.5 font-semibold text-gray-900 no-underline focus-ring dark:text-gray-50">
                  {c.label}
                </a>
              ) : (
                <a href={c.href} className="link px-1 py-0.5">
                  {c.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export const breadcrumbs: ComponentSpec = {
  slug: 'breadcrumbs',
  name: 'Breadcrumbs',
  category: 'Navigation',
  summary: 'Breadcrumbs show where the current page sits in the site’s hierarchy and link back to each parent level.',
  semantics: '<nav aria-label="Breadcrumb"> + <ol>',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
  whenToUse: ['Use breadcrumbs on sites with three or more levels of hierarchy.', 'They show the structure of the site, not the user’s browsing history.'],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through each breadcrumb link.' },
    { keys: ['Enter'], action: 'Follows the link.' },
  ],
  aria: [
    { attr: '<nav aria-label="Breadcrumb">', where: 'container', usage: 'Creates a named navigation landmark users can jump to.' },
    { attr: '<ol>', where: 'list', usage: 'An ordered list, because the order is the hierarchy. Screen readers announce the count.' },
    { attr: 'aria-current="page"', where: 'last item', usage: 'Marks the current page.' },
    { attr: 'aria-hidden="true"', where: 'separators', usage: 'Hides the chevrons so they aren’t read between items. Drawing them with CSS works too.' },
  ],
  focus: ['Each link needs a visible focus ring.', 'Make the hit area of each link at least 24×24 CSS pixels.'],
  screenReader: ['Announced as: “Breadcrumb, navigation. List, 4 items. Home, link…”.', 'The last item: “Breadcrumbs, current page, link”.'],
  dos: ['Use short labels that match the page titles.', 'Let the trail wrap onto several lines on narrow screens rather than truncating labels.'],
  donts: ['Don’t use text separators like “>” that get read aloud.', 'Don’t make breadcrumbs the only way to navigate.'],
  wcag: [WCAG.infoRel, WCAG.linkPurpose, WCAG.nameRoleValue, WCAG.reflow],
  testing: [
    'Jump to landmarks with a screen reader and confirm “Breadcrumb navigation” is listed.',
    'Confirm the separators are not read.',
    'Confirm the current page is announced as current.',
  ],
  Demo,
};
