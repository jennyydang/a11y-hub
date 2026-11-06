import { createContext, useContext, type ReactNode } from 'react';
import { cx } from '../ui';

export interface View {
  annotate: boolean;
  mobile: boolean;
}
export const ViewContext = createContext<View>({ annotate: true, mobile: false });
export const useView = () => useContext(ViewContext);

/** Numbered marker that matches an entry in the notes list. Hidden from screen readers; the list is the text version. */
export function M({ n }: { n: number }) {
  const { annotate } = useView();
  if (!annotate) return null;
  return (
    <span aria-hidden="true" className="mr-1.5 inline-grid h-6 w-6 flex-none place-items-center rounded-full bg-fuchsia-700 align-middle text-xs font-bold text-white shadow ring-2 ring-white dark:bg-fuchsia-300 dark:text-gray-900 dark:ring-gray-900">
      {n}
    </span>
  );
}

/** A page region, outlined and tagged with its landmark when annotations are on. */
export function R({ tag, className, children }: { tag: string; className?: string; children: ReactNode }) {
  const { annotate } = useView();
  return (
    <div className={cx('relative', annotate && 'rounded-md outline-dashed outline-2 outline-offset-2 outline-fuchsia-600/60 dark:outline-fuchsia-300/60', className)}>
      {annotate && (
        <span aria-hidden="true" className="absolute -top-3 right-2 z-10 rounded bg-fuchsia-700 px-1.5 font-mono text-[11px] font-semibold text-white dark:bg-fuchsia-300 dark:text-gray-900">
          {tag}
        </span>
      )}
      {children}
    </div>
  );
}

/** A link inside the example that doesn't navigate away. */
export function A({ children, className, current, onClick }: { children: ReactNode; className?: string; current?: boolean; onClick?: () => void }) {
  return (
    <a
      href="#"
      aria-current={current ? 'page' : undefined}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={cx('rounded underline-offset-2 focus-ring', className ?? 'text-primary-700 underline hover:decoration-2 dark:text-primary-300')}
    >
      {children}
    </a>
  );
}

export const Logo = ({ name }: { name: string }) => (
  <span className="flex items-center gap-2 font-bold">
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-primary-700 dark:text-primary-300" fill="currentColor">
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.7 3.7L12 11.7 5.3 8 12 4.3Z" />
    </svg>
    {name}
  </span>
);

/** Skip link for the example: visible on focus, moves focus to the example's main content. */
export function SkipLink({ target }: { target: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById(target);
        el?.focus();
      }}
      className="sr-only rounded bg-white px-3 py-2 font-semibold text-primary-800 underline focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-20 focus-ring dark:bg-gray-900 dark:text-primary-200"
    >
      Skip to main content
    </a>
  );
}

export interface Note {
  n: number;
  slug: string;
  title: string;
  why: string;
}

export interface Example {
  id: string;
  name: string;
  summary: string;
  /** Components used, for the index card. */
  uses: string[];
  notes: Note[];
  Page: () => JSX.Element;
}
