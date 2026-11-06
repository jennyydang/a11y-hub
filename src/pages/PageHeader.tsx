import type { ReactNode } from 'react';

export function PageHeader({ eyebrow, title, children, meta }: { eyebrow?: string; title: string; children?: ReactNode; meta?: ReactNode }) {
  return (
    <header className="mb-10 space-y-3 border-b border-gray-200/80 pb-8 dark:border-gray-800">
      {eyebrow && <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight outline-none sm:text-4xl">{title}</h1>
      {children && <div className="max-w-3xl text-lg leading-8 text-muted">{children}</div>}
      {meta}
    </header>
  );
}
