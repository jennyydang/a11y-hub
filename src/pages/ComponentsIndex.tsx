import { Link } from 'react-router-dom';
import { byCategory, categories, components } from '../data/components';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function ComponentsIndex() {
  usePageTitle('Components');
  return (
    <div className="max-w-6xl">
      <PageHeader eyebrow="Components" title="Component accessibility specs">
        <p>
          {components.length} components, each with a live example, keyboard map, ARIA reference, WCAG criteria and a testing checklist.
        </p>
        <p className="mt-2 text-base">
          Not sure which one you need?{' '}
          <Link to="/tools/component-picker" className="link">
            Answer a few questions to find out
          </Link>
          .
        </p>
      </PageHeader>
      <div className="space-y-12">
        {categories.map((cat) => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <h2 id={`cat-${cat}`} className="mb-4 text-xl font-semibold">
              {cat}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {byCategory(cat).map((c) => (
                <li key={c.slug}>
                  <Link to={`/components/${c.slug}`} className="surface group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-ring motion-reduce:transform-none">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-base font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">{c.name}</span>
                      <span className="chip flex-none bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">{c.keyboard.length} keys</span>
                    </span>
                    <span className="mt-2 text-sm leading-6 text-muted">{c.summary}</span>
                    <span className="mt-auto pt-4 font-mono text-xs text-gray-700 dark:text-gray-300">{c.semantics}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
