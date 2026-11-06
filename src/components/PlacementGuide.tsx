import { Link } from 'react-router-dom';
import { placement, type Region } from '../data/placement';
import { slugify } from './Section';

export const regionHref = (r: Region) => `/foundations/layout#region-${slugify(r)}`;

/** Use / don't use, side by side. */
export function WhenToUse({ slug, use }: { slug: string; use: string[] }) {
  const dont = placement[slug]?.dontUse ?? [];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="surface border-t-4 border-t-emerald-600 p-5 dark:border-t-emerald-400">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-700 dark:text-emerald-300">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
          </svg>
          Use it when
        </h3>
        <ul className="list-disc space-y-2 pl-5 leading-7">
          {use.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
      {dont.length > 0 && (
        <div className="surface border-t-4 border-t-red-600 p-5 dark:border-t-red-400">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-700 dark:text-red-300">
              <path d="M6.3 5.2a.8.8 0 0 0-1.1 1.1L8.9 10l-3.7 3.7a.8.8 0 1 0 1.1 1.1L10 11.1l3.7 3.7a.8.8 0 0 0 1.1-1.1L11.1 10l3.7-3.7a.8.8 0 0 0-1.1-1.1L10 8.9 6.3 5.2Z" />
            </svg>
            Don’t use it when
          </h3>
          <ul className="list-disc space-y-2 pl-5 leading-7">
            {dont.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Where it goes on the page and the UX evidence behind it. */
export function PlacementGuide({ slug, name }: { slug: string; name: string }) {
  const p = placement[slug];
  if (!p) return null;
  return (
    <div className="space-y-6">
      <div className="surface space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Page regions</h3>
          <ul className="flex flex-wrap gap-2" aria-label={`Page regions where a ${name.toLowerCase()} belongs`}>
            {p.regions.map((r) => (
              <li key={r}>
                <Link to={regionHref(r)} className="chip bg-primary-50 text-primary-800 hover:underline focus-ring dark:bg-primary-900/50 dark:text-primary-100">
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Where it goes</h3>
          <ul className="list-disc space-y-2 pl-5 leading-7">
            {p.where.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-semibold">Why it works for people</h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {p.why.map((e) => (
            <li key={e.point} className="surface flex flex-col gap-2 p-4 text-sm leading-6">
              <p className="text-base leading-7">{e.point}</p>
              <p className="mt-auto text-muted">
                Source:{' '}
                <a className="link" href={e.source.url} target="_blank" rel="noreferrer">
                  {e.source.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
