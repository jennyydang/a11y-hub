import { useEffect, useId, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { Alert, cx } from '../ui';
import { A, Logo, M, R, SkipLink, useView, type Example } from './kit';

const face =
  'data:image/svg+xml,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#ddd6fe"/><circle cx="32" cy="26" r="12" fill="#c68642"/><path d="M10 64a22 22 0 0 1 44 0Z" fill="#c68642"/></svg>');

const ROWS = [
  { id: 'INV-1042', client: 'Harbour Café', amount: '£240.00', status: 'Paid' },
  { id: 'INV-1043', client: 'North Studio', amount: '£95.50', status: 'Due soon' },
  { id: 'INV-1044', client: 'Greenway Ltd', amount: '£1,120.00', status: 'Overdue' },
];
const tone: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-50',
  'Due soon': 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-50',
  Overdue: 'bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-50',
};

function Page() {
  const { mobile } = useView();
  const id = useId();
  const [toast, setToast] = useState('');
  const [current, setCurrent] = useState('Invoices');
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 6000);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="relative space-y-5 pb-2">
      <SkipLink target={`${id}-main`} />
      <R tag="<header>">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <Logo name="Ledgerly" />
          <span className="flex items-center gap-2">
            <M n={1} />
            <button type="button" className="flex items-center gap-2 rounded-full p-0.5 pr-3 text-sm font-medium ring-1 ring-gray-300 hover:bg-gray-100 focus-ring dark:ring-gray-600 dark:hover:bg-gray-800">
              <img src={face} alt="" className="h-7 w-7 rounded-full" />
              Sam Patel
              <span className="sr-only">, account menu</span>
            </button>
          </span>
        </div>
      </R>
      <div className={cx('gap-6 px-4', mobile ? 'space-y-5' : 'grid grid-cols-[10rem_1fr]')}>
        <R tag="<nav>">
          <div className={cx('flex items-start', mobile && 'items-center')}>
            <M n={2} />
            <ul className={cx('text-sm', mobile ? 'flex flex-wrap gap-1' : 'space-y-1')}>
              {['Overview', 'Invoices', 'Clients', 'Settings'].map((l) => (
                <li key={l}>
                  <A
                    current={current === l}
                    onClick={() => setCurrent(l)}
                    className={cx('block rounded-md px-3 py-1.5', current === l ? 'bg-primary-100 font-semibold text-primary-900 dark:bg-primary-900 dark:text-primary-50' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}
                  >
                    {l}
                  </A>
                </li>
              ))}
            </ul>
          </div>
        </R>
        <R tag="<main>">
          <div id={`${id}-main`} tabIndex={-1} className="min-w-0 space-y-4 rounded p-1 outline-none">
            <h3 className="text-2xl font-bold">Invoices</h3>
            <div className="flex items-start">
              <M n={3} />
              <Alert intent="warning" title="1 invoice is overdue" className="flex-1">
                Greenway Ltd owes £1,120.00. It was due on 28 October.
              </Alert>
            </div>
            <div className="flex items-start">
              <M n={4} />
              <div className="min-w-0 flex-1 overflow-x-auto" tabIndex={0} role="region" aria-labelledby={`${id}-cap`}>
                <table className="w-full text-left text-sm">
                  <caption id={`${id}-cap`} className="mb-2 text-left font-semibold">
                    Recent invoices
                  </caption>
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th scope="col" className="py-2 pr-3">Invoice</th>
                      <th scope="col" className="py-2 pr-3">Client</th>
                      <th scope="col" className="py-2 pr-3 text-right">Amount</th>
                      <th scope="col" className="py-2 pr-3">Status</th>
                      <th scope="col" className="py-2">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                        <th scope="row" className="py-2 pr-3 font-medium">{r.id}</th>
                        <td className="py-2 pr-3">{r.client}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{r.amount}</td>
                        <td className="whitespace-nowrap py-2 pr-3">
                          {i === 2 && <M n={5} />}
                          <span className={cx('rounded-full px-2 py-0.5 text-xs font-semibold', tone[r.status])}>{r.status}</span>
                        </td>
                        <td className="whitespace-nowrap py-2">
                          {r.status !== 'Paid' && (
                            <span className="inline-flex items-center">
                              {i === 2 && <M n={6} />}
                              <Button size="sm" weight="light" color="gray" onClick={() => setToast(`Reminder sent to ${r.client}`)}>
                                Send reminder<span className="sr-only"> for {r.id}</span>
                              </Button>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </R>
      </div>
      {/* The live region is always in the page, so messages added to it are announced */}
      <div role="status" className="pointer-events-none sticky bottom-2 flex justify-start px-4">
        {toast && (
          <p className="pointer-events-auto flex items-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-gray-50 dark:text-gray-900">
            <M n={7} />
            {toast}
          </p>
        )}
      </div>
    </div>
  );
}

export const dashboard: Example = {
  id: 'dashboard',
  name: 'Dashboard',
  summary: 'An app screen with side navigation, a warning and a data table. Press Send reminder to see a toast.',
  uses: ['avatar', 'menu', 'site-navigation', 'alert', 'table', 'badge', 'button', 'toast'],
  notes: [
    { n: 1, slug: 'avatar', title: 'Account button with avatar, top right', why: 'Where people look for their account. The photo is decorative because the name is shown.' },
    { n: 2, slug: 'site-navigation', title: 'Side navigation on the left', why: 'App navigation down the left is a familiar pattern. The current page is marked with aria-current and a bolder style, not just color.' },
    { n: 3, slug: 'alert', title: 'Warning below the heading', why: 'Seen before people start working with the table. It says what’s wrong and what it’s about.' },
    { n: 4, slug: 'table', title: 'Table with a caption, numbers right-aligned', why: 'Right-aligned amounts line up for comparison. It scrolls in its own box on narrow screens instead of the whole page.' },
    { n: 5, slug: 'badge', title: 'Status in its own column', why: 'Words plus color, so the status is clear in grayscale and announced with the row.' },
    { n: 6, slug: 'button', title: 'Row action at the end of the row', why: 'Next to the data it acts on. Hidden text adds the invoice number so each button has a unique name.' },
    { n: 7, slug: 'toast', title: 'Toast bottom left', why: 'Confirms the reminder without moving focus or covering the table’s actions. It’s announced as a status.' },
  ],
  Page,
};
