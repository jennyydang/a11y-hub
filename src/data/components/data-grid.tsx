import { useRef, useState, type KeyboardEvent } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

interface Row {
  id: string;
  client: string;
  due: string;
  amount: number;
}
const ROWS: Row[] = [
  { id: 'INV-1042', client: 'Harbour Café', due: '2026-10-12', amount: 240 },
  { id: 'INV-1043', client: 'North Studio', due: '2026-11-08', amount: 95.5 },
  { id: 'INV-1044', client: 'Greenway Ltd', due: '2026-10-28', amount: 1120 },
  { id: 'INV-1045', client: 'Apex Print', due: '2026-11-20', amount: 410 },
];
const COLS: { key: keyof Row; label: string; numeric?: boolean }[] = [
  { key: 'id', label: 'Invoice' },
  { key: 'client', label: 'Client' },
  { key: 'due', label: 'Due date' },
  { key: 'amount', label: 'Amount', numeric: true },
];
const money = (n: number) => `£${n.toFixed(2)}`;
const date = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * A data grid following the WAI-ARIA grid pattern: one tab stop, arrow keys move
 * between cells (roving tabindex), and column headers hold sort buttons.
 */
function Demo() {
  const [sort, setSort] = useState<{ key: keyof Row; dir: 'ascending' | 'descending' }>({ key: 'due', dir: 'ascending' });
  const [pos, setPos] = useState({ r: 0, c: 0 }); // r = 0 is the header row
  const gridRef = useRef<HTMLTableElement>(null);
  const rows = [...ROWS].sort((a, b) => {
    const x = a[sort.key];
    const y = b[sort.key];
    const d = typeof x === 'number' ? x - (y as number) : String(x).localeCompare(String(y));
    return sort.dir === 'ascending' ? d : -d;
  });
  const lastRow = rows.length;
  const lastCol = COLS.length - 1;

  const focusCell = (r: number, c: number) => {
    setPos({ r, c });
    requestAnimationFrame(() => {
      const cell = gridRef.current?.querySelector<HTMLElement>(`[data-cell="${r}-${c}"]`);
      // Header cells hold a button; focus that instead of the cell
      (cell?.querySelector<HTMLElement>('button') ?? cell)?.focus();
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const { r, c } = pos;
    const moves: Record<string, [number, number]> = {
      ArrowRight: [r, Math.min(lastCol, c + 1)],
      ArrowLeft: [r, Math.max(0, c - 1)],
      ArrowDown: [Math.min(lastRow, r + 1), c],
      ArrowUp: [Math.max(0, r - 1), c],
      Home: e.ctrlKey ? [0, 0] : [r, 0],
      End: e.ctrlKey ? [lastRow, lastCol] : [r, lastCol],
      PageDown: [lastRow, c],
      PageUp: [0, c],
    };
    const next = moves[e.key];
    if (!next) return;
    e.preventDefault();
    focusCell(next[0], next[1]);
  };

  const toggleSort = (key: keyof Row) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'ascending' ? 'descending' : 'ascending' }));

  const tab = (r: number, c: number) => (pos.r === r && pos.c === c ? 0 : -1);
  const cellCls = 'px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300';

  return (
    <div className="w-full max-w-xl space-y-2">
      <p id="grid-help" className="text-sm text-muted">
        Tab into the grid, then use the arrow keys. Press Enter or Space on a column header to sort.
      </p>
      <div className="overflow-x-auto rounded-lg ring-1 ring-gray-200 dark:ring-gray-700">
        <table ref={gridRef} role="grid" aria-labelledby="grid-cap" aria-describedby="grid-help" aria-rowcount={rows.length + 1} onKeyDown={onKeyDown} className="w-full text-left text-sm">
          <caption id="grid-cap" className="sr-only">
            Invoices
          </caption>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr aria-rowindex={1}>
              {COLS.map((col, c) => (
                <th
                  key={col.key}
                  scope="col"
                  data-cell={`0-${c}`}
                  aria-sort={sort.key === col.key ? sort.dir : undefined}
                  className={col.numeric ? 'text-right' : ''}
                >
                  <button
                    type="button"
                    tabIndex={tab(0, c)}
                    onFocus={() => setPos({ r: 0, c })}
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex w-full items-center gap-1 font-semibold ${col.numeric ? 'justify-end' : ''} ${cellCls}`}
                  >
                    {col.label}
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 ${sort.key === col.key ? '' : 'opacity-30'}`}>
                      <path d={sort.key === col.key && sort.dir === 'descending' ? 'M10 14 5 8h10Z' : 'M10 6l5 6H5Z'} />
                    </svg>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} aria-rowindex={i + 2} className="border-t border-gray-100 dark:border-gray-800">
                {COLS.map((col, c) => (
                  <td
                    key={col.key}
                    role="gridcell"
                    data-cell={`${i + 1}-${c}`}
                    tabIndex={tab(i + 1, c)}
                    onFocus={() => setPos({ r: i + 1, c })}
                    className={`${cellCls} ${col.numeric ? 'text-right tabular-nums' : ''}`}
                  >
                    {col.key === 'amount' ? money(row.amount) : col.key === 'due' ? date(row.due) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p role="status" className="sr-only">
        Sorted by {COLS.find((c) => c.key === sort.key)?.label}, {sort.dir}
      </p>
    </div>
  );
}

const code = `const [pos, setPos] = useState({ r: 0, c: 0 });

const onKeyDown = (e) => {
  const moves = {
    ArrowRight: [r, c + 1], ArrowLeft: [r, c - 1],
    ArrowDown: [r + 1, c],  ArrowUp: [r - 1, c],
    Home: e.ctrlKey ? [0, 0] : [r, 0],
    End: e.ctrlKey ? [lastRow, lastCol] : [r, lastCol],
  };
  if (moves[e.key]) { e.preventDefault(); focusCell(...clamp(moves[e.key])); }
};

<table role="grid" aria-labelledby="grid-cap" onKeyDown={onKeyDown}>
  <caption id="grid-cap">Invoices</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort={sortKey === 'due' ? sortDir : undefined}>
        {/* Only the active cell has tabIndex 0: one tab stop for the whole grid */}
        <button tabIndex={isActive(0, 2) ? 0 : -1} onClick={() => toggleSort('due')}>Due date</button>
      </th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row, i) => (
      <tr key={row.id}>
        <td role="gridcell" tabIndex={isActive(i + 1, 0) ? 0 : -1}>{row.id}</td>
        …
      </tr>
    ))}
  </tbody>
</table>`;

export const dataGrid: ComponentSpec = {
  slug: 'data-grid',
  name: 'Data grid',
  category: 'Data',
  summary: 'A data grid is an interactive table people move around cell by cell with arrow keys, like a spreadsheet. It’s one tab stop, so the rest of the page stays quick to reach.',
  semantics: '<table role="grid"> with gridcell cells and roving tabindex',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
  whenToUse: [
    'Use a data grid when people work inside the table: sorting, selecting, editing or acting on many cells.',
    'Use a plain table for data people only read. Screen readers already have table reading commands.',
    'Don’t use a grid just to make rows clickable; put a link in the first cell instead.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves into the grid (to the last focused cell) and out again. The grid is one tab stop.' },
    { keys: ['←', '→', '↑', '↓'], action: 'Moves one cell in that direction.' },
    { keys: ['Home', 'End'], action: 'First or last cell in the row.' },
    { keys: ['Ctrl+Home', 'Ctrl+End'], action: 'First or last cell in the grid.' },
    { keys: ['Page Up', 'Page Down'], action: 'Moves up or down several rows (here, to the top or bottom).' },
    { keys: ['Enter', 'Space'], action: 'Activates the control in the cell, like a sort button.' },
  ],
  aria: [
    { attr: 'role="grid"', where: '<table>', usage: 'Tells screen readers to pass arrow keys to the grid.' },
    { attr: 'role="gridcell"', where: '<td>', usage: 'An interactive cell.' },
    { attr: 'aria-labelledby', where: 'grid', usage: 'Names the grid, usually from its caption.' },
    { attr: 'aria-sort', where: 'sorted <th>', usage: '"ascending" or "descending" on the sorted column only.' },
    { attr: 'tabindex="0" / "-1"', where: 'cells', usage: 'Only the active cell is 0 (roving tabindex).' },
    { attr: 'aria-rowcount / aria-rowindex', where: 'grid and rows', usage: 'Needed when not all rows are in the DOM, like virtual scrolling.' },
  ],
  focus: [
    'Only one cell is in the tab order. Tab leaves the grid; arrow keys move within it.',
    'Remember the last focused cell, so Tab back in returns to it.',
    'If a cell holds a control, focus the control rather than the cell.',
    'Make the focused cell obvious with an inset ring, so it isn’t clipped by the table border.',
  ],
  screenReader: [
    'Entering: “Invoices, grid, 5 rows, 4 columns”, then the cell.',
    'Moving: “North Studio, row 3, Client, column 2”.',
    'Sort button: “Due date, sorted ascending, button”.',
  ],
  dos: ['Explain the keyboard model in a short hint linked with aria-describedby.', 'Keep a plain table option for read-only data.', 'Announce sort changes with a status message.'],
  donts: ['Don’t make every cell a tab stop.', 'Don’t use role="grid" on a read-only table.', 'Don’t hide actions on hover only; show them on focus too.'],
  wcag: [WCAG.infoRel, WCAG.keyboard, WCAG.focusOrder, WCAG.focusVisible, WCAG.nameRoleValue, WCAG.statusMessages],
  testing: [
    'Tab into the grid once, then out again with one more Tab.',
    'Use all four arrow keys, Home, End, Ctrl+Home and Ctrl+End.',
    'Sort a column and confirm the change is announced and aria-sort updates.',
    'With a screen reader, confirm row and column headers are read as you move.',
    'Zoom to 400% and confirm the grid scrolls in its own box.',
  ],
  Demo,
  code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI doesn’t ship a data grid. This uses a native <table> with role="grid" so headers and cells stay associated.',
      'Focus rings are inset (ring-inset) so the table’s rounded border doesn’t clip them.',
    ],
  },
};
