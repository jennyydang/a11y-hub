import { useId } from 'react';
import { cx } from './cx';

export function ProgressBar({ label, value, max = 100, className }: { label: string; value?: number; max?: number; className?: string }) {
  const id = useId();
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.round((value / max) * 100);
  return (
    <div className={cx('space-y-1.5', className)}>
      <div className="flex justify-between text-sm">
        <span id={id} className="font-medium">
          {label}
        </span>
        {!indeterminate && <span className="text-muted" aria-hidden="true">{pct}%</span>}
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : value}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
      >
        <div
          className={cx(
            'h-full rounded-full bg-primary-600 dark:bg-primary-300',
            indeterminate ? 'w-1/3 animate-pulse' : 'transition-[width] motion-reduce:transition-none',
          )}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 animate-spin text-primary-600 motion-reduce:animate-none dark:text-primary-300">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <span>{label}…</span>
    </span>
  );
}
