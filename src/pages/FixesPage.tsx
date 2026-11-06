import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fixes } from '../data/fixes';
import { slugify } from '../components/Section';
import { TextField } from '../ui';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function FixesPage() {
  usePageTitle('Common problems and fixes');
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();
  const shown = fixes.filter((f) => !q || `${f.symptom} ${f.cause} ${f.fix} ${f.noticedBy}`.toLowerCase().includes(q));
  return (
    <article className="max-w-3xl">
      <PageHeader eyebrow="Reference" title="Common problems and fixes">
        <p>Describe what you noticed, not the technical name. Each problem has the usual cause and how to fix it.</p>
      </PageHeader>
      <div className="mb-6 max-w-md">
        <TextField label="What did you notice?" hint="For example: tab, error, emoji, zoom" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <p role="status" className="mt-1 text-sm text-muted">
          {q ? `${shown.length} ${shown.length === 1 ? 'problem matches' : 'problems match'}` : ''}
        </p>
      </div>
      <ul className="space-y-4">
        {shown.map((f) => (
          <li key={f.symptom} id={slugify(f.symptom)} className="surface scroll-mt-24 p-5">
            <h2 className="text-lg font-semibold">{f.symptom}</h2>
            <p className="text-sm text-muted">Usually found by: {f.noticedBy}</p>
            <dl className="mt-3 space-y-2 leading-7">
              <div>
                <dt className="inline font-semibold">Likely cause: </dt>
                <dd className="inline">{f.cause}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">Fix: </dt>
                <dd className="inline">{f.fix}</dd>
              </div>
            </dl>
            <p className="mt-2 text-sm">
              <Link to={f.link.to} className="link">
                {f.link.label}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
