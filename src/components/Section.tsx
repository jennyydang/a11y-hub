import type { ReactNode } from 'react';

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function Section({ title, id, children, intro }: { title: string; id?: string; intro?: ReactNode; children: ReactNode }) {
  const sid = id ?? slugify(title);
  return (
    <section aria-labelledby={sid} className="scroll-mt-24 space-y-4 border-t border-gray-200 pt-10 first:border-0 first:pt-0 dark:border-gray-800">
      <h2 id={sid} className="flex items-center gap-3 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-50">
        <span aria-hidden="true" className="h-6 w-1.5 flex-none rounded-full bg-primary-600 dark:bg-primary-300" />
        {title}
      </h2>
      {intro && <div className="prose-doc text-muted">{intro}</div>}
      {children}
    </section>
  );
}

/** A visual band that groups related sections, like "How it works". */
export function Part({ n, title, description, children }: { n: number; title: string; description: string; children: ReactNode }) {
  return (
    <div className="space-y-10">
      <div className="flex items-start gap-4 rounded-2xl bg-primary-50 px-5 py-4 ring-1 ring-primary-100 dark:bg-primary-900/20 dark:ring-primary-800/60">
        <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white dark:bg-primary-300 dark:text-gray-900">
          {n}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-800 dark:text-primary-200">
            <span className="sr-only">Part {n}: </span>
            {title}
          </p>
          <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-200">{description}</p>
        </div>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}
