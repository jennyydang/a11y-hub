import { useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';
import { cx } from '../../ui';

const TOTAL = 8;

function pages(current: number): (number | 'gap')[] {
  const set = new Set([1, TOTAL, current - 1, current, current + 1].filter((p) => p >= 1 && p <= TOTAL));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

function Demo() {
  const [page, setPage] = useState(3);
  const item = 'inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-md px-3 text-sm font-medium focus-ring';
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="text-sm text-muted" aria-live="polite">
        Showing results {(page - 1) * 10 + 1}–{page * 10} of {TOTAL * 10}
      </p>
      <nav aria-label="Search results pages">
        <ul className="flex flex-wrap items-center gap-1">
          <li>
            {page > 1 ? (
              <a href="#prev" onClick={(e) => { e.preventDefault(); setPage(page - 1); }} className={cx(item, 'hover:bg-gray-100 dark:hover:bg-gray-800')}>
                <span aria-hidden="true">‹</span>&nbsp;Previous<span className="sr-only"> page</span>
              </a>
            ) : (
              <span className={cx(item, 'text-gray-500 dark:text-gray-400')} aria-hidden="true">‹ Previous</span>
            )}
          </li>
          {pages(page).map((p, i) =>
            p === 'gap' ? (
              <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">…</li>
            ) : (
              <li key={p}>
                <a
                  href={`#page-${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  onClick={(e) => { e.preventDefault(); setPage(p); }}
                  className={cx(item, p === page ? 'bg-primary-700 text-white dark:bg-primary-300 dark:text-gray-900' : 'ring-1 ring-gray-300 hover:bg-gray-100 dark:ring-gray-600 dark:hover:bg-gray-800')}
                >
                  <span className="sr-only">Page </span>{p}
                </a>
              </li>
            ),
          )}
          <li>
            {page < TOTAL ? (
              <a href="#next" onClick={(e) => { e.preventDefault(); setPage(page + 1); }} className={cx(item, 'hover:bg-gray-100 dark:hover:bg-gray-800')}>
                Next<span className="sr-only"> page</span>&nbsp;<span aria-hidden="true">›</span>
              </a>
            ) : (
              <span className={cx(item, 'text-gray-500 dark:text-gray-400')} aria-hidden="true">Next ›</span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export const pagination: ComponentSpec = {
  slug: 'pagination',
  name: 'Pagination',
  category: 'Navigation',
  summary: 'Pagination splits long lists of results across pages and lets people move between them.',
  semantics: '<nav aria-label> + list of links',
  whenToUse: [
    'Use pagination for long result lists where people may want to return to a specific page.',
    'It’s often more accessible than infinite scroll, which can make the footer unreachable and loses the user’s place.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through Previous, each page number and Next.' },
    { keys: ['Enter'], action: 'Goes to that page.' },
  ],
  aria: [
    { attr: '<nav aria-label="…pages">', where: 'container', usage: 'A named landmark. Name it after what is paged, especially if there are several on the page.' },
    { attr: 'aria-current="page"', where: 'current page link', usage: 'Marks the page being shown.' },
    { attr: 'visually hidden “Page”', where: 'number links', usage: 'Turns “3” into “Page 3” for screen reader users.' },
    { attr: 'aria-hidden="true"', where: 'ellipsis and arrows', usage: 'Hides decorative characters.' },
  ],
  focus: [
    'When results load without a full page reload, move focus to the results heading, so people don’t have to tab back up.',
    'Hide or disable Previous on the first page and Next on the last.',
  ],
  screenReader: ['Announced as: “Search results pages, navigation. Page 3, current page, link”.'],
  dos: ['Show the current range, like “Showing results 21–30 of 80”.', 'Keep page links at least 24×24 CSS pixels, ideally 40px or more.'],
  donts: ['Don’t use only arrows or chevrons for Previous and Next.', 'Don’t mark the current page with color alone. This example uses a filled background plus aria-current.'],
  wcag: [WCAG.linkPurpose, WCAG.nameRoleValue, WCAG.useOfColor, WCAG.targetSize, WCAG.focusOrder],
  testing: [
    'Tab through the links and confirm each is read as “Page N”.',
    'Confirm the current page is announced as current.',
    'Change pages and confirm focus goes somewhere sensible.',
  ],
  Demo,
};
