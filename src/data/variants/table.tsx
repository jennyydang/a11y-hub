import type { Variant } from '../types';
import { table } from '../components/table';
import { htmlExamples } from '../html';

const rows = [
  ['Ada Lovelace', 'Engineer', '2021-03-01'],
  ['Alan Turing', 'Researcher', '2020-11-30'],
  ['Grace Hopper', 'Admiral', '2019-07-15'],
];

function Simple() {
  return (
    <div className="w-full max-w-xl overflow-x-auto rounded-lg ring-1 ring-gray-200 dark:ring-gray-700">
      <table className="w-full bg-white dark:bg-gray-900">
        <caption className="px-4 py-3 text-left text-sm font-semibold">Team members</caption>
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {['Name', 'Role', 'Start date'].map((h) => (
              <th key={h} scope="col" className="px-4 py-2 text-left text-sm font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {rows.map(([n, r, d]) => (
            <tr key={n}>
              <th scope="row" className="px-4 py-2 text-left text-sm font-medium">{n}</th>
              <td className="px-4 py-2 text-sm">{r}</td>
              <td className="px-4 py-2 text-sm">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const tableVariants: Variant[] = [
  {
    id: 'simple',
    label: 'Simple',
    description: 'A caption and header cells with scope. No JavaScript needed.',
    Demo: Simple,
    html: `<table>
  <caption>Team members</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
      <th scope="col">Start date</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Ada Lovelace</th><td>Engineer</td><td>2021-03-01</td></tr>
    <tr><th scope="row">Alan Turing</th><td>Researcher</td><td>2020-11-30</td></tr>
  </tbody>
</table>`,
    code: `<table>
  <caption>Team members</caption>
  <thead>
    <tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Start date</th></tr>
  </thead>
  <tbody>
    {rows.map((r) => (
      <tr key={r.name}><th scope="row">{r.name}</th><td>{r.role}</td><td>{r.start}</td></tr>
    ))}
  </tbody>
</table>`,
  },
  {
    id: 'sortable',
    label: 'Sortable',
    description: 'Each header holds a button, and aria-sort on the active column announces the sort direction.',
    Demo: table.Demo,
    html: htmlExamples.table,
    code: table.code,
  },
];
