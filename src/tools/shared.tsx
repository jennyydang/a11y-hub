import { useId, type ReactNode } from 'react';
import { cx } from '../ui';

export const fieldClass =
  'block w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-500 dark:focus-visible:ring-primary-300';

export function TextArea({ label, hint, value, onChange, rows = 6, mono }: { label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number; mono?: boolean }) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        rows={rows}
        value={value}
        spellCheck={!mono}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cx(fieldClass, mono && 'font-mono text-xs')}
      />
    </div>
  );
}

export type Level = 'ok' | 'warn' | 'fail';

/** One finding from a checker: a word and an icon carry the result, not color alone. */
export function Finding({ level, title, children }: { level: Level; title: string; children?: ReactNode }) {
  const label = level === 'ok' ? 'Looks good' : level === 'warn' ? 'Worth a look' : 'Fix this';
  return (
    <li
      className={cx(
        'rounded-xl border-l-4 p-4',
        level === 'ok' && 'border-emerald-700 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/30',
        level === 'warn' && 'border-amber-600 bg-amber-50 dark:border-amber-400 dark:bg-amber-950/30',
        level === 'fail' && 'border-red-700 bg-red-50 dark:border-red-400 dark:bg-red-950/30',
      )}
    >
      <p className="font-semibold">
        <span aria-hidden="true">{level === 'ok' ? '✓ ' : level === 'warn' ? '! ' : '✕ '}</span>
        <span className="sr-only">{label}: </span>
        {title}
      </p>
      {children && <div className="mt-1 text-sm leading-6">{children}</div>}
    </li>
  );
}
