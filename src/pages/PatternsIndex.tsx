import { useId } from 'react';
import { Link } from 'react-router-dom';
import { patterns } from '../patterns';
import type { PatternCategory } from '../patterns/types';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

const CATEGORIES: PatternCategory[] = ['Navigation', 'Marketing', 'Commerce'];

export function PatternsIndex() {
  usePageTitle('Patterns');
  const id = useId();
  return (
    <article className="max-w-5xl">
      <PageHeader eyebrow="Sections and templates" title="Patterns">
        <p>
          Whole sections of a page, built from several components working together: a site’s main navigation, a product gallery, a buy box. Each has a live example, the landmark and heading
          structure, every string to write and translate, and who does what.
        </p>
      </PageHeader>
      <div className="space-y-10">
        {CATEGORIES.map((c) => {
          const items = patterns.filter((p) => p.category === c);
          if (!items.length) return null;
          return (
            <section key={c} aria-labelledby={`${id}-${c}`} className="space-y-4">
              <h2 id={`${id}-${c}`} className="text-xl font-semibold tracking-tight">
                {c}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((p) => (
                  <li key={p.slug} className="min-w-0">
                    <Link to={`/patterns/${p.slug}`} className="surface group block h-full p-5 focus-ring">
                      <span className="block font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">{p.name}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted">{p.summary}</span>
                      <span className="mt-2 block text-xs text-muted">Built from {p.uses.length} components</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
