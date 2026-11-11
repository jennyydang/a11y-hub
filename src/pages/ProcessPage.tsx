import { useId } from 'react';
import { Link } from 'react-router-dom';
import { Checklist } from '../components/Checklist';
import { PROCESS_ROLES, definitionOfDone, sectionSteps, sourceRules, stages } from '../data/process';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

const REPO = 'https://github.com/jennyydang/a11y-hub';
const roleName = (id: string) => PROCESS_ROLES.find((r) => r.id === id)!.name;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function ProcessPage() {
  usePageTitle('How we build the hub');
  const id = useId();
  return (
    <article className="max-w-4xl">
      <PageHeader eyebrow="Contributing" title="How we build the hub">
        <p>
          How the accessibility lead and the design, content, frontend and QA SMEs add a new component or section together. Seven stages, one owner for each, and every piece of guidance backed
          by a source.
        </p>
      </PageHeader>

      <div className="surface mb-12 flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="leading-7">
          <strong>Have an idea or found a gap?</strong> Start with a request. The template asks for everything the first stage needs.
        </p>
        <Ext href={`${REPO}/issues/new?template=new-component.yml`}>Request a component or section</Ext>
      </div>

      <section aria-labelledby={`${id}-overview`} className="mb-14 space-y-4">
        <h2 id={`${id}-overview`} className="text-2xl font-semibold tracking-tight">
          The stages
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((s, i) => (
            <li key={s.id}>
              <Link to={`#${s.id}`} className="surface group flex h-full gap-3 p-4 focus-ring">
                <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white dark:bg-primary-300 dark:text-gray-950">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">{s.name}</span>
                  <span className="block text-sm text-muted">Led by {roleName(s.owner).replace(' SME', '')}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <div className="space-y-12">
        {stages.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${id}-${s.id}`} className="scroll-mt-24 space-y-4 border-t border-gray-200 pt-8 dark:border-gray-800">
            <h2 id={`${id}-${s.id}`} className="text-2xl font-semibold tracking-tight">
              <span className="text-muted">{i + 1}.</span> {s.name}
            </h2>
            <p className="text-lg leading-8">{s.goal}</p>
            <p className="text-sm">
              <span className="chip bg-primary-50 text-primary-800 dark:bg-primary-900/50 dark:text-primary-100">Led by {roleName(s.owner)}</span>
            </p>
            <h3 className="font-semibold">Steps</h3>
            <ol className="list-decimal space-y-1 pl-6 leading-7">
              {s.steps.map((st) => (
                <li key={st}>{st}</li>
              ))}
            </ol>
            <h3 className="font-semibold">Who does what</h3>
            <dl className="grid gap-2 sm:grid-cols-2">
              {PROCESS_ROLES.filter((r) => s.roles[r.id]).map((r) => (
                <div key={r.id} className="surface px-4 py-3 text-sm leading-6">
                  <dt className="font-semibold">{r.name}</dt>
                  <dd>{s.roles[r.id]}</dd>
                </div>
              ))}
            </dl>
            <p className="leading-7">
              <strong>Done when:</strong> {s.output}
            </p>
          </section>
        ))}
      </div>

      <section aria-labelledby={`${id}-matrix`} className="mt-14 space-y-4">
        <h2 id={`${id}-matrix`} className="text-2xl font-semibold tracking-tight">
          Who leads and who helps
        </h2>
        <div className="surface overflow-x-auto" role="region" aria-labelledby={`${id}-matrix-cap`} tabIndex={0}>
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption id={`${id}-matrix-cap`} className="px-4 pt-3 text-left font-semibold">
              Each role’s part in each stage
            </caption>
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th scope="col" className="px-4 py-2">
                  Stage
                </th>
                {PROCESS_ROLES.map((r) => (
                  <th key={r.id} scope="col" className="px-4 py-2">
                    {r.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stages.map((s) => (
                <tr key={s.id} className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="px-4 py-2 font-medium">
                    {s.name}
                  </th>
                  {PROCESS_ROLES.map((r) => (
                    <td key={r.id} className="px-4 py-2">
                      {s.owner === r.id ? <strong>Leads</strong> : s.roles[r.id] ? 'Helps' : <span className="text-muted">Not needed</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby={`${id}-dod`} className="mt-14 space-y-4">
        <h2 id={`${id}-dod`} className="text-2xl font-semibold tracking-tight">
          Definition of done
        </h2>
        <p className="leading-7">A new component isn’t merged until every item is checked. The same list is in the pull request template. Your ticks are saved in this browser.</p>
        <Checklist scope="process-dod" items={definitionOfDone} title="Definition of done for a new component" />
      </section>

      <section aria-labelledby={`${id}-cite`} className="mt-14 space-y-4">
        <h2 id={`${id}-cite`} className="text-2xl font-semibold tracking-tight">
          Citing sources
        </h2>
        <p className="leading-7">
          Every requirement in the hub should trace back to a source, so readers can check it and the guidance survives when people move on. Each component page lists its sources and last
          review date under <strong>Sources and review</strong>. Use the strongest source you can find:
        </p>
        <div className="surface overflow-x-auto" role="region" aria-labelledby={`${id}-cite-cap`} tabIndex={0}>
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption id={`${id}-cite-cap`} className="px-4 pt-3 text-left font-semibold">
              Kinds of sources, strongest first
            </caption>
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th scope="col" className="px-4 py-2">Kind</th>
                <th scope="col" className="px-4 py-2">Examples</th>
                <th scope="col" className="px-4 py-2">Use it for</th>
              </tr>
            </thead>
            <tbody>
              {sourceRules.map((r) => (
                <tr key={r.kind} className="border-b border-gray-200 align-top dark:border-gray-700">
                  <th scope="row" className="px-4 py-2 font-medium">{r.kind}</th>
                  <td className="px-4 py-2">{r.examples}</td>
                  <td className="px-4 py-2">{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="font-semibold">How to add one</h3>
        <ul className="list-disc space-y-1 pl-6 leading-7">
          <li>
            Add it to <code>src/data/sources.ts</code> under the component’s name, with a title, the publisher and the URL. Add a short note on what it supports.
          </li>
          <li>WCAG criteria and the APG pattern on the spec are listed automatically. Don’t repeat them.</li>
          <li>For screen reader results, record the screen reader, browser and versions, and the date you tested.</li>
          <li>
            Learning material for SMEs, rather than sources for a specific page, goes in{' '}
            <Link to="/resources" className="link">
              Keep learning
            </Link>
            .
          </li>
        </ul>
      </section>

      <section aria-labelledby={`${id}-section`} className="mt-14 space-y-4">
        <h2 id={`${id}-section`} className="text-2xl font-semibold tracking-tight">
          Adding a page or section that isn’t a component
        </h2>
        <p className="leading-7">Foundations, tools and guides follow a lighter version of the same process:</p>
        <ol className="list-decimal space-y-1 pl-6 leading-7">
          {sectionSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="leading-7">
          The technical steps are in <Ext href={`${REPO}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</Ext> in the repository.
        </p>
      </section>
    </article>
  );
}
