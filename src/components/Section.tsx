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
    <section aria-labelledby={sid} className="scroll-mt-24 space-y-4">
      <h2 id={sid} className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        {title}
      </h2>
      {intro && <div className="prose-doc text-muted">{intro}</div>}
      {children}
    </section>
  );
}
