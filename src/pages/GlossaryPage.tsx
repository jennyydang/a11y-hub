import { useState } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../components/Section';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';
import { TextField } from '../ui';
import { TERMS } from '../data/glossary';


export function GlossaryPage() {
  usePageTitle('Glossary');
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();
  const shown = TERMS.filter((t) => !q || `${t.term} ${t.plain}`.toLowerCase().includes(q));

  return (
    <article className="max-w-3xl">
      <PageHeader eyebrow="Reference" title="Glossary">
        <p>Plain-language definitions of the terms used across A11y Hub, and why each one matters.</p>
      </PageHeader>
      <div className="mb-6 max-w-md">
        <TextField label="Filter terms" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <p role="status" className="mt-1 text-sm text-muted">
          {q ? `${shown.length} ${shown.length === 1 ? 'term' : 'terms'} match` : ''}
        </p>
      </div>
      <dl className="divide-y divide-gray-200 dark:divide-gray-800">
        {shown.map((t) => (
          <div key={t.term} id={slugify(t.term)} className="scroll-mt-24 py-5">
            <dt className="text-lg font-semibold">{t.term}</dt>
            <dd className="mt-1 space-y-1 leading-7">
              <p>{t.plain}</p>
              <p className="text-muted">
                <strong className="text-gray-900 dark:text-gray-50">Why it matters:</strong> {t.why}
              </p>
              {t.see && (
                <p className="text-sm">
                  See{' '}
                  <Link to={t.see.to} className="link">
                    {t.see.label}
                  </Link>
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
