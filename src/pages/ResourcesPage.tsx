import { useId } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { certPaths, certifications, resources, type Resource, type ResourceKind } from '../data/resources';
import { roles, type RoleId } from '../data/roles';
import { useRole } from '../lib/useRole';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

const KINDS: { kind: ResourceKind; title: string; intro: string }[] = [
  { kind: 'Course', title: 'Courses', intro: 'Structured learning you can work through at your own pace.' },
  { kind: 'Video', title: 'Videos and talks', intro: 'Watch how real people use the web, and hear from practitioners.' },
  { kind: 'Reference', title: 'References to keep handy', intro: 'Look things up while you work.' },
  { kind: 'Tool', title: 'Tools', intro: 'Free tools for checking your work beyond the ones in A11y Hub.' },
  { kind: 'Community', title: 'Communities and events', intro: 'Ask questions and keep up with the field.' },
];

const isRole = (v: string | null): v is RoleId => roles.some((r) => r.id === v);
const forRole = (r: Resource, role: RoleId | 'all') => role === 'all' || r.roles.length === 0 || r.roles.includes(role);

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="link">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function ResourceItem({ r }: { r: Resource }) {
  return (
    <li className="surface flex flex-col gap-1 p-4">
      <p className="font-semibold">
        <ExternalLink href={r.url}>{r.title}</ExternalLink>
      </p>
      <p className="text-sm text-muted">
        {r.by} · {r.cost}
      </p>
      <p className="text-sm leading-6">{r.description}</p>
    </li>
  );
}

export function ResourcesPage() {
  usePageTitle('Keep learning');
  const id = useId();
  const [saved] = useRole();
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get('role');
  const role: RoleId | 'all' = isRole(fromUrl) ? fromUrl : fromUrl === 'all' ? 'all' : (saved ?? 'all');
  const roleName = role === 'all' ? 'everyone' : roles.find((r) => r.id === role)!.name.toLowerCase();
  const list = resources.filter((r) => forRole(r, role));
  const start = list.filter((r) => r.start);
  const path = role === 'all' ? null : certPaths[role];
  const certs = role === 'all' ? certifications : certifications.filter((c) => c.roles.includes(role));

  return (
    <article className="max-w-5xl">
      <PageHeader eyebrow="Reference" title="Keep learning">
        <p>Courses, videos, references and certifications for content, design, frontend and QA SMEs. All links go to other sites.</p>
      </PageHeader>

      <fieldset className="mb-10">
        <legend className="mb-2 text-sm font-semibold">Show resources for</legend>
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all' as const, name: 'Everyone' }, ...roles].map((r) => (
            <label
              key={r.id}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium ring-1 ring-gray-300 has-[:checked]:bg-primary-700 has-[:checked]:text-white has-[:checked]:ring-primary-700 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-600 has-[:focus-visible]:ring-offset-2 hover:bg-gray-100 has-[:checked]:hover:bg-primary-800 dark:ring-gray-600 dark:hover:bg-gray-800 dark:has-[:checked]:bg-primary-300 dark:has-[:checked]:text-gray-950"
            >
              <input
                type="radio"
                name={`${id}-role`}
                className="sr-only"
                checked={role === r.id}
                onChange={() => setParams(r.id === 'all' ? { role: 'all' } : { role: r.id }, { replace: true })}
              />
              {r.name}
            </label>
          ))}
        </div>
        <p role="status" className="mt-2 text-sm text-muted">
          Showing {list.length} resources and {certs.length} {certs.length === 1 ? 'certification' : 'certifications'} for {roleName}.
        </p>
      </fieldset>

      <section aria-labelledby={`${id}-start`} className="mb-12 space-y-4">
        <h2 id={`${id}-start`} className="text-2xl font-semibold tracking-tight">
          Start here
        </h2>
        <p className="text-muted">If you only do a few things, do these, in this order.</p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {start.map((r, i) => (
            <li key={r.title} className="surface flex gap-3 p-4">
              <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-800 dark:bg-primary-900/50 dark:text-primary-100">
                {i + 1}
              </span>
              <div className="space-y-1">
                <p className="font-semibold">
                  <ExternalLink href={r.url}>{r.title}</ExternalLink>
                </p>
                <p className="text-sm text-muted">
                  {r.by} · {r.cost}
                </p>
                <p className="text-sm leading-6">{r.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby={`${id}-certs`} className="mb-12 space-y-4">
        <h2 id={`${id}-certs`} className="text-2xl font-semibold tracking-tight">
          Certifications
        </h2>
        {path ? (
          <p className="leading-7">
            <strong>Suggested path for {roleName}:</strong> {path.join(', then ')}.
          </p>
        ) : (
          <p className="leading-7">Most people start with CPACC. Developers and testers then add WAS, and people who publish documents add ADS.</p>
        )}
        <p className="text-sm text-muted">Exam fees, formats and renewal rules change. Check the provider’s site for current details. IAAP certifications must be renewed every three years with continuing education.</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {certs.map((c) => (
            <li key={c.short} className="surface space-y-2 p-4">
              <h3 className="font-semibold">
                <ExternalLink href={c.url}>
                  {c.short}: {c.name}
                </ExternalLink>
              </h3>
              <p className="text-sm text-muted">
                {c.by} · {c.cost}
              </p>
              <p className="text-sm leading-6">{c.what}</p>
              <p className="text-sm leading-6">
                <strong>Good for:</strong> {c.goodFor}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {KINDS.map(({ kind, title, intro }) => {
        const items = list.filter((r) => r.kind === kind && !r.start);
        if (!items.length) return null;
        return (
          <section key={kind} aria-labelledby={`${id}-${kind}`} className="mb-12 space-y-4">
            <h2 id={`${id}-${kind}`} className="text-2xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="text-muted">{intro}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((r) => (
                <ResourceItem key={r.title} r={r} />
              ))}
            </ul>
          </section>
        );
      })}

      <p className="text-sm text-muted">
        Know a resource your team relies on? Add it to <code>src/data/resources.ts</code>, or tell whoever maintains A11y Hub. For quick answers inside the hub, use the{' '}
        <Link to="/glossary" className="link">
          glossary
        </Link>{' '}
        and{' '}
        <Link to="/fixes" className="link">
          common problems and fixes
        </Link>
        .
      </p>
    </article>
  );
}
