import type { ReactNode } from 'react';
import { cx } from './cx';

type Intent = 'info' | 'success' | 'warning' | 'error';

const styles: Record<Intent, string> = {
  info: 'bg-primary-50 text-primary-900 ring-primary-200 dark:bg-primary-900/40 dark:text-primary-100 dark:ring-primary-700',
  success: 'bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:ring-emerald-700',
  warning: 'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:ring-amber-700',
  error: 'bg-red-50 text-red-900 ring-red-200 dark:bg-red-900/40 dark:text-red-100 dark:ring-red-700',
};

const icons: Record<Intent, ReactNode> = {
  info: <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.25v3.25c0 .41.34.75.75.75h1a.75.75 0 0 0 0-1.5h-.25V9.75A.75.75 0 0 0 10 9H9Z" clipRule="evenodd" />,
  success: <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.72a.75.75 0 0 0-1.22-.87l-3.24 4.53-1.62-1.62a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.1l3.75-5.25Z" clipRule="evenodd" />,
  warning: <path fillRule="evenodd" d="M8.49 2.87c.67-1.17 2.35-1.17 3.02 0l6.28 10.9c.67 1.16-.17 2.6-1.51 2.6H3.72c-1.34 0-2.18-1.44-1.51-2.6L8.49 2.87ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />,
  error: <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />,
};

const intentLabel: Record<Intent, string> = { info: 'Info', success: 'Success', warning: 'Warning', error: 'Error' };

export interface AlertProps {
  intent?: Intent;
  title?: string;
  children: ReactNode;
  /** Live alerts are announced when inserted. Use for messages that appear after page load. */
  live?: boolean;
  className?: string;
}

export function Alert({ intent = 'info', title, children, live = false, className }: AlertProps) {
  const role = live ? (intent === 'error' ? 'alert' : 'status') : undefined;
  return (
    <div role={role} className={cx('flex gap-3 rounded-lg p-4 ring-1', styles[intent], className)}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true">
        {icons[intent]}
      </svg>
      <div className="text-sm">
        <p className="font-semibold">
          <span className="sr-only">{intentLabel[intent]}: </span>
          {title ?? intentLabel[intent]}
        </p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
