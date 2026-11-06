import { useId, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { Checkbox, cx } from '../ui';
import { A, Logo, M, R, SkipLink, useView, type Example } from './kit';

const thumb = (sky: string, ground: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60"><rect width="80" height="60" fill="${sky}"/><path d="M0 60 25 25l15 18 12-10 28 27Z" fill="${ground}"/></svg>`);

const TRAILS = [
  { name: 'Riverside loop', km: 4, stepFree: true, status: 'Open', img: thumb('#bae6fd', '#15803d') },
  { name: 'Beacon hill climb', km: 9, stepFree: false, status: 'Open', img: thumb('#fde68a', '#78716c') },
  { name: 'Old railway path', km: 12, stepFree: true, status: 'Partly closed', img: thumb('#ddd6fe', '#4d7c0f') },
  { name: 'Harbour walk', km: 3, stepFree: true, status: 'Open', img: thumb('#a5f3fc', '#0369a1') },
];

const badge = (s: string) =>
  s === 'Open'
    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-50'
    : 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-50';

function Page() {
  const { mobile } = useView();
  const id = useId();
  const [q, setQ] = useState('');
  const [stepFree, setStepFree] = useState(false);
  const [short, setShort] = useState(false);
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const results = TRAILS.filter((t) => t.name.toLowerCase().includes(q.trim().toLowerCase()) && (!stepFree || t.stepFree) && (!short || t.km <= 5));
  const clear = () => {
    setQ('');
    setStepFree(false);
    setShort(false);
    searchRef.current?.focus();
  };

  return (
    <div className="space-y-5">
      <SkipLink target={`${id}-main`} />
      <R tag="<header>">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <Logo name="Trailmate" />
          <div role="search" className="flex items-center">
            <M n={1} />
            <label htmlFor={`${id}-q`} className="sr-only">
              Search trails
            </label>
            <input
              ref={searchRef}
              id={`${id}-q`}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search trails"
              className="w-48 rounded-lg bg-white px-3 py-1.5 text-sm ring-1 ring-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-900 dark:ring-gray-400"
            />
          </div>
        </div>
      </R>
      <div className={cx('gap-6 px-4', mobile ? 'space-y-5' : 'grid grid-cols-[11rem_1fr]')}>
        {/* Filters come before results in both the HTML and the layout, so reading order matches what people see */}
        <R tag="<aside> filters">
          <fieldset className="space-y-3 p-1">
            <legend className="mb-2 flex items-center font-semibold">
              <M n={2} />
              Filters
            </legend>
            <Checkbox label="Step-free only" checked={stepFree} onChange={(e) => setStepFree(e.target.checked)} />
            <Checkbox label="Under 5 km" checked={short} onChange={(e) => setShort(e.target.checked)} />
          </fieldset>
        </R>
        <R tag="<main>">
          <div id={`${id}-main`} tabIndex={-1} className="space-y-4 rounded p-1 outline-none">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-2xl font-bold">Trails</h3>
              <p role="status" className="flex items-center text-sm text-muted">
                <M n={3} />
                {results.length} {results.length === 1 ? 'trail' : 'trails'} found
              </p>
            </div>
            {results.length ? (
              <ul className="space-y-3">
                {results.map((t, i) => (
                  <li key={t.name} className="flex gap-3 rounded-lg p-3 ring-1 ring-gray-200 dark:ring-gray-700">
                    {i === 0 && <M n={4} />}
                    <img src={t.img} alt="" className="h-14 w-20 flex-none rounded object-cover" />
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-semibold">
                        <A>{t.name}</A>
                      </h4>
                      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
                        {t.km} km{t.stepFree ? ', step-free' : ''}
                        {i === 0 && <M n={5} />}
                        <span className={cx('rounded-full px-2 text-xs font-semibold', badge(t.status))}>{t.status}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2 rounded-xl p-4 ring-1 ring-gray-300 dark:ring-gray-600">
                <p className="flex items-center font-semibold">
                  <M n={6} />
                  No trails match your search
                </p>
                <p className="text-sm text-muted">Try fewer filters or a shorter search term.</p>
                <Button size="sm" weight="light" color="gray" onClick={clear}>
                  Clear search and filters
                </Button>
              </div>
            )}
            <div className="flex items-center">
              <M n={7} />
              <ul aria-label="Pages" className="flex items-center gap-1 text-sm">
                {[1, 2, 3].map((n) => (
                  <li key={n}>
                    <A
                      current={page === n}
                      onClick={() => setPage(n)}
                      className={cx('grid h-9 min-w-9 place-items-center rounded-md px-2', page === n ? 'bg-primary-700 font-semibold text-white dark:bg-primary-300 dark:text-gray-900' : 'text-primary-700 underline dark:text-primary-300')}
                    >
                      <span className="sr-only">Page </span>
                      {n}
                    </A>
                  </li>
                ))}
                <li>
                  <A onClick={() => setPage((p) => Math.min(3, p + 1))} className="grid h-9 place-items-center rounded-md px-2 text-primary-700 underline dark:text-primary-300">
                    Next<span className="sr-only"> page</span>
                  </A>
                </li>
              </ul>
            </div>
          </div>
        </R>
      </div>
    </div>
  );
}

export const search: Example = {
  id: 'search-results',
  name: 'Search results',
  summary: 'A results list with filters beside it. Try “zebra” in the search box, or switch to mobile to see the layout stack.',
  uses: ['text-input', 'checkbox', 'badge', 'image', 'empty-state', 'pagination'],
  notes: [
    { n: 1, slug: 'combobox', title: 'Search in the header, top right', why: 'Where people look for search first. It sits in a search landmark and has a label, even though it’s visually hidden.' },
    { n: 2, slug: 'drawer', title: 'Filters beside the results', why: 'On wide screens people filter and see results change side by side. On mobile they stack above the results; on a real site, put them behind a Filters button that opens a drawer.' },
    { n: 3, slug: 'empty-state', title: 'Result count as a status', why: 'Updates are announced as people filter, without moving focus away from the filter they just changed.' },
    { n: 4, slug: 'image', title: 'Thumbnails are decorative', why: 'The trail name says it all, so images have alt="" and aren’t read for every result.' },
    { n: 5, slug: 'badge', title: 'Status badge after the details', why: 'Right next to what it describes, with the word “Open” or “Partly closed”, not only a color.' },
    { n: 6, slug: 'empty-state', title: 'No-results message in place of the list', why: 'It sits where the results would be and offers one way back. The count above is announced.' },
    { n: 7, slug: 'pagination', title: 'Pagination after the list', why: 'People reach the end of the list and look for what’s next there. The current page is marked.' },
  ],
  Page,
};
