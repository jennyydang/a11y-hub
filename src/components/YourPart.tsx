import { Link } from 'react-router-dom';
import type { ComponentSpec } from '../data/types';
import { componentRoles, findRole, type RoleId } from '../data/roles';
import { worksheets } from '../data/requirements';
import { sheetProgress } from '../lib/worksheetItems';
import { loadWorksheet } from '../lib/worksheetStore';

/** Shown near the top of a component page once the reader has picked a role: just their part, and where to do it. */
export function YourPart({ spec, role }: { spec: ComponentSpec; role: RoleId }) {
  const guide = findRole(role);
  const notes = componentRoles[spec.slug]?.[role];
  if (!guide || !notes?.length) return null;
  const progress = worksheets[spec.slug] ? sheetProgress(spec, role, loadWorksheet(spec.slug)) : null;

  return (
    <section aria-labelledby="your-part" className="mb-12 scroll-mt-24 rounded-2xl bg-primary-50 p-5 ring-1 ring-primary-200 dark:bg-primary-900/20 dark:ring-primary-800/60">
      <h2 id="your-part" className="text-lg font-semibold tracking-tight">
        Your part as {guide.name === 'QA' ? 'QA' : `the ${guide.name.toLowerCase()} specialist`}
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {progress && (
          <Link to={`/components/${spec.slug}?sheet=${role}#handoff-worksheet`} className="link font-semibold">
            Open your {guide.name} worksheet
            <span className="font-normal text-muted">
              {' '}
              ({progress.total} {progress.unit}
              {progress.done > 0 ? `, ${progress.done} done` : ''})
            </span>
          </Link>
        )}
        <Link to={`/roles/${role}`} className="link">
          {guide.name} guide
        </Link>
      </div>
    </section>
  );
}
