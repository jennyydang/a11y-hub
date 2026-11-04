import { useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const rows = [
  { name: 'Ada Lovelace', role: 'Engineer', start: '2021-03-01' },
  { name: 'Grace Hopper', role: 'Admiral', start: '2019-07-15' },
  { name: 'Alan Turing', role: 'Researcher', start: '2020-11-30' },
];

type Key = keyof (typeof rows)[number];

function Demo() {
  const [sort, setSort] = useState<{ key: Key; dir: 'ascending' | 'descending' }>({ key: 'name', dir: 'ascending' });
  const sorted = [...rows].sort((a, b) => {
    const r = a[sort.key].localeCompare(b[sort.key]);
    return sort.dir === 'ascending' ? r : -r;
  });
  const header = (key: Key, label: string) => {
    const active = sort.key === key;
    return (
      <th scope="col" aria-sort={active ? sort.dir : undefined} className="px-4 py-2 text-left text-sm font-semibold">
        <button
          type="button"
          onClick={() => setSort({ key, dir: active && sort.dir === 'ascending' ? 'descending' : 'ascending' })}
          className="inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-gray-100 focus-visible:outline-2 dark:hover:bg-gray-700"
        >
          {label}
          <span aria-hidden="true" className="text-xs">{active ? (sort.dir === 'ascending' ? '▲' : '▼') : '↕'}</span>
        </button>
      </th>
    );
  };
  return (
    <div className="w-full max-w-xl overflow-x-auto rounded-lg ring-1 ring-gray-200 dark:ring-gray-700">
      <table className="w-full bg-white dark:bg-gray-900">
        <caption className="px-4 py-3 text-left text-sm font-semibold">
          Team members <span className="font-normal text-muted">(select a column header to sort)</span>
        </caption>
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {header('name', 'Name')}
            {header('role', 'Role')}
            {header('start', 'Start date')}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {sorted.map((r) => (
            <tr key={r.name}>
              <th scope="row" className="px-4 py-2 text-left text-sm font-medium">{r.name}</th>
              <td className="px-4 py-2 text-sm">{r.role}</td>
              <td className="px-4 py-2 text-sm">{r.start}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const table: ComponentSpec = {
  slug: 'table',
  name: 'Table',
  category: 'Content',
  summary: 'Tables present data in rows and columns so people can compare values.',
  semantics: '<table> with <caption>, <th scope>',
  whenToUse: ['Use a table for tabular data only, never for page layout.', 'For interactive grids with cell-by-cell keyboard navigation, look at the ARIA grid pattern.'],
  keyboard: [
    { keys: ['Tab'], action: 'Moves between interactive elements like sort buttons. Cells aren’t focusable.' },
    { keys: ['Enter', 'Space'], action: 'Activates a sort button.' },
  ],
  aria: [
    { attr: '<caption>', where: 'table', usage: 'Names the table. It is announced when users enter it.' },
    { attr: 'scope="col" / "row"', where: '<th>', usage: 'Links headers to their cells so each cell is read with its headers.' },
    { attr: 'aria-sort', where: 'sorted <th>', usage: 'ascending or descending. Set it on the active column only.' },
    { attr: '<button>', where: 'inside sortable <th>', usage: 'Makes the sort control focusable and gives it a clear role.' },
  ],
  focus: ['Put sort controls inside header cells as real buttons.', 'Make a scrolling table container keyboard-focusable, or ensure it doesn’t need to scroll.'],
  screenReader: ['Moving through cells: “Engineer, Role column, row 2”.', 'Sorted header: “Name, sorted ascending, button”.'],
  dos: ['Keep tables simple: one header row and, if useful, one header column.', 'Right-align numbers so they’re easy to compare.'],
  donts: ['Don’t merge cells unless you must. Complex headers are hard to follow by ear.', 'Don’t make the whole row clickable without a real link or button inside it.'],
  wcag: [WCAG.infoRel, WCAG.sequence, WCAG.reflow, WCAG.nameRoleValue],
  testing: [
    'Use table navigation keys (Ctrl+Alt+Arrows in NVDA/JAWS, VO+Arrows in VoiceOver) and confirm headers are read with each cell.',
    'Sort a column and confirm the new sort state is announced.',
    'View at 320px wide and confirm the table scrolls without the page scrolling sideways.',
  ],
  Demo,
  code: `<table>
  <caption>Team members</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending"><button>Name</button></th>
      <th scope="col"><button>Role</button></th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Ada Lovelace</th><td>Engineer</td></tr>
  </tbody>
</table>`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI has no table component. Native table markup gives screen readers header/cell relationships for free.'],
  },
};
