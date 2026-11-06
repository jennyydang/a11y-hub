import type { Anatomy } from '../data/anatomy';

const th = 'px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200';
const td = 'px-4 py-3 align-top text-sm';

export function AnatomyTables({ name, data }: { name: string; data: Anatomy }) {
  return (
    <div className="grid gap-6">
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse">
          <caption className="border-b border-gray-100 px-4 py-3 text-left font-semibold dark:border-gray-800">Parts of a {name.toLowerCase()}</caption>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className={th}>#</th>
              <th scope="col" className={th}>Part</th>
              <th scope="col" className={th}>Needed?</th>
              <th scope="col" className={th}>Accessibility notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.parts.map((p, i) => (
              <tr key={p.name}>
                <td className={td}>
                  <span aria-hidden="true" className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white dark:bg-primary-300 dark:text-gray-900">
                    {i + 1}
                  </span>
                  <span className="sr-only">{i + 1}</span>
                </td>
                <th scope="row" className={`${td} text-left font-semibold`}>{p.name}</th>
                <td className={td}>{p.required ? 'Always' : 'Optional'}</td>
                <td className={td}>{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse">
          <caption className="border-b border-gray-100 px-4 py-3 text-left font-semibold dark:border-gray-800">{name} states</caption>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className={th}>State</th>
              <th scope="col" className={th}>How it looks</th>
              <th scope="col" className={th}>What a screen reader says</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.states.map((s) => (
              <tr key={s.state}>
                <th scope="row" className={`${td} text-left font-semibold`}>{s.state}</th>
                <td className={td}>{s.looks}</td>
                <td className={td}>{s.announced}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
