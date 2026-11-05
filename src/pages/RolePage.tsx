import { Link, useParams } from 'react-router-dom';
import { Checklist } from '../components/Checklist';
import { Section } from '../components/Section';
import { WcagList } from '../components/Tables';
import { byCategory, categories } from '../data/components';
import { componentRoles, findRole, roles, type RoleId } from '../data/roles';
import { worksheets } from '../data/requirements';
import { sheetProgress } from '../lib/worksheetItems';
import type { ComponentSpec } from '../data/types';
import { loadWorksheet } from '../lib/worksheetStore';
import { cx } from '../ui';
import { NotFound } from './NotFound';
import { toolPath, toolsFor } from '../data/tools';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function RolePage() {
  const { role = '' } = useParams();
  const guide = findRole(role);
  usePageTitle(guide ? `${guide.name} guide` : 'Not found');
  if (!guide) return <NotFound />;
  const sheet = guide.id;

  return (
    <article className="max-w-4xl">
      <PageHeader
        eyebrow="Role guides"
        title={`${guide.name} accessibility guide`}
        meta={
          <nav aria-label="Other role guides" className="flex flex-wrap gap-2 pt-1">
            {roles.map((r) => (
              <Link
                key={r.id}
                to={`/roles/${r.id}`}
                aria-current={r.id === guide.id ? 'page' : undefined}
                className={cx(
                  'chip px-3 py-1 text-sm focus-ring',
                  r.id === guide.id
                    ? 'bg-primary-700 text-white dark:bg-primary-300 dark:text-gray-900'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
                )}
              >
                {r.name}
              </Link>
            ))}
          </nav>
        }
      >
        <p>{guide.summary}</p>
      </PageHeader>

      <div className="space-y-12">
        <Section title="What you own">
          <ul className="grid gap-2 sm:grid-cols-2">
            {guide.owns.map((o) => (
              <li key={o} className="surface flex gap-3 p-4 text-sm leading-6">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 flex-none text-primary-600 dark:text-primary-300">
                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                </svg>
                {o}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Review checklist" intro={<p>Use this when reviewing a feature or screen. Progress is saved in this browser.</p>}>
          <Checklist scope={`role-${guide.id}`} items={guide.checklist} title={`${guide.name} review checklist`} />
        </Section>

        <Section title="Your tools" intro={<p>Tools that help with {guide.name.toLowerCase() === 'qa' ? 'QA' : guide.name.toLowerCase()} work. All tools are also listed under Tools in the menu.</p>}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {toolsFor(guide.id).map((t) => (
              <li key={t.id}>
                <Link to={toolPath(t.id)} className="surface group flex h-full flex-col p-5 transition hover:shadow-md focus-ring">
                  <span className="font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">{t.name}</span>
                  <span className="mt-1 text-sm leading-6 text-muted">{t.why[guide.id] ?? t.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Handoff notes" intro={<p>What to include when passing work to the other roles.</p>}>
          <div className="surface p-5">
            <ul className="list-disc space-y-2 pl-5 leading-7">
              {guide.handoff.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          title="Your part in each component"
          intro={
            <p>
              Each component has a handoff worksheet with a {guide.name} tab listing exactly what you need to {WORKSHEET_ASK[sheet]}. Open one when you work on that component.
            </p>
          }
        >
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">{cat}</h3>
                <ul className="surface divide-y divide-gray-100 dark:divide-gray-800">
                  {byCategory(cat).map((c) => (
                    <li key={c.slug} className="grid gap-1 p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
                      <Link to={`/components/${c.slug}`} className="link h-fit text-sm">
                        {c.name}
                      </Link>
                      <div className="space-y-1">
                        <p className="text-sm leading-6">{componentRoles[c.slug]?.[guide.id].join(' ')}</p>
                        {worksheets[c.slug] && <WorksheetLink spec={c} sheet={sheet} name={guide.name} />}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="WCAG criteria to know">
          <WcagList refs={guide.wcag} />
        </Section>
      </div>
    </article>
  );
}

const WORKSHEET_ASK: Record<RoleId, string> = {
  content: 'write, like labels, alt text and error messages',
  design: 'decide and check, like contrast, focus and target size',
  frontend: 'build, including the exact text content handed over',
  qa: 'test, with pass, fail and N/A results you can export',
};

function WorksheetLink({ spec, sheet, name }: { spec: ComponentSpec; sheet: RoleId; name: string }) {
  const { done, total, unit } = sheetProgress(spec, sheet, loadWorksheet(spec.slug));
  return (
    <p className="text-sm">
      <Link to={`/components/${spec.slug}?sheet=${sheet}`} className="link">
        {name} worksheet<span className="sr-only"> for {spec.name}</span>
      </Link>
      <span className="text-muted">
        {' '}
        · {total} {unit}
        {done > 0 && `, ${done} done`}
      </span>
    </p>
  );
}
