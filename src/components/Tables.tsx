import type { AriaRow, KeyBinding, WcagRef } from '../data/types';
import { wcagUrl } from '../data/wcag';
import { cx } from '../ui';

const th = 'px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200';
const td = 'px-4 py-3 align-top text-sm';

export function TableShell({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {keys.map((k, i) => (
        <span key={k + i} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-xs text-muted">or</span>}
          {k.split('+').map((part, j) => (
            <span key={part + j} className="inline-flex items-center gap-1">
              {j > 0 && <span aria-hidden="true" className="text-xs text-muted">+</span>}
              <kbd className="kbd">{part.trim()}</kbd>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function KeyboardTable({ rows, name }: { rows: KeyBinding[]; name: string }) {
  return (
    <TableShell caption={`${name} keyboard interactions`}>
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" className={cx(th, 'w-56')}>Key</th>
          <th scope="col" className={th}>Behavior</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows.map((r) => (
          <tr key={r.keys.join()}>
            <td className={td}><Keys keys={r.keys} /></td>
            <td className={td}>{r.action}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

export function AriaTable({ rows, name }: { rows: AriaRow[]; name: string }) {
  return (
    <TableShell caption={`${name} roles, states and properties`}>
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" className={th}>Attribute</th>
          <th scope="col" className={th}>Applied to</th>
          <th scope="col" className={th}>Usage</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows.map((r) => (
          <tr key={r.attr + r.where}>
            <td className={td}><code className="whitespace-nowrap font-mono text-[13px] text-primary-800 dark:text-primary-200">{r.attr}</code></td>
            <td className={cx(td, 'text-muted')}>{r.where}</td>
            <td className={td}>{r.usage}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

const levelColor: Record<WcagRef['level'], string> = {
  A: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100',
  AA: 'bg-primary-100 text-primary-900 dark:bg-primary-900/60 dark:text-primary-100',
  AAA: 'bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100',
};

export function WcagList({ refs }: { refs: WcagRef[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2" role="list">
      {refs.map((r) => (
        <li key={r.id} className="surface flex items-center gap-3 px-4 py-3">
          <span className={cx('chip', levelColor[r.level])}>
            <span className="sr-only">Level </span>
            {r.level}
          </span>
          <a className="link text-sm" href={wcagUrl(r)} target="_blank" rel="noreferrer">
            {r.id} {r.name}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
