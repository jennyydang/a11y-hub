import { Link, useParams } from 'react-router-dom';
import { Tab } from '@fluid-design/fluid-ui';
import { CodeBlock } from '../components/CodeBlock';
import { Checklist } from '../components/Checklist';
import { DemoStage } from '../components/DemoStage';
import { DoDont } from '../components/DoDont';
import { Section, slugify } from '../components/Section';
import { AriaTable, KeyboardTable, WcagList } from '../components/Tables';
import { components, findComponent } from '../data/components';
import { NotFound } from './NotFound';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

const TOC = ['Live example', 'Usage', 'Keyboard interactions', 'ARIA', 'Focus & screen readers', 'Best practices', 'Fluid UI notes', 'WCAG criteria', 'Testing checklist'];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 leading-7">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export function ComponentPage() {
  const { slug = '' } = useParams();
  const spec = findComponent(slug);
  usePageTitle(spec ? spec.name : 'Not found');
  if (!spec) return <NotFound />;

  const idx = components.indexOf(spec);
  const prev = components[idx - 1];
  const next = components[idx + 1];
  const { Demo } = spec;

  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-4xl flex-1">
        <PageHeader
          eyebrow={spec.category}
          title={spec.name}
          meta={
            <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
              <span className="chip bg-gray-100 font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-100">{spec.semantics}</span>
              <span className="chip bg-primary-50 text-primary-800 dark:bg-primary-900/50 dark:text-primary-100">{spec.fluid.source}</span>
              {spec.apgPattern && (
                <a className="link ml-1" href={spec.apgPattern} target="_blank" rel="noreferrer">
                  ARIA pattern<span className="sr-only"> for {spec.name} (opens in a new tab)</span>
                </a>
              )}
            </div>
          }
        >
          <p>{spec.summary}</p>
        </PageHeader>

        <div className="space-y-14">
          <Section title="Live example" intro={<p>Use the keyboard to try it. The inspector shows roughly what a screen reader would announce.</p>}>
            <DemoStage key={spec.slug}>
              <Demo />
            </DemoStage>
            <Tab
              className="mt-2"
              tabs={[
                { title: 'Code', content: <div className="pt-3"><CodeBlock code={spec.code} /></div> },
                {
                  title: 'Semantics',
                  content: (
                    <div className="surface mt-3 p-4 text-sm leading-6">
                      Built on <code className="font-mono">{spec.semantics}</code>. {spec.fluid.notes[0]}
                    </div>
                  ),
                },
              ]}
            />
          </Section>

          <Section title="Usage">
            <Bullets items={spec.whenToUse} />
          </Section>

          <Section title="Keyboard interactions">
            <KeyboardTable rows={spec.keyboard} name={spec.name} />
          </Section>

          <Section title="ARIA" intro={<p>Roles, states and properties to apply. Native elements already provide many of these.</p>}>
            <AriaTable rows={spec.aria} name={spec.name} />
          </Section>

          <Section title="Focus & screen readers">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface p-5">
                <h3 className="mb-3 font-semibold">Focus</h3>
                <Bullets items={spec.focus} />
              </div>
              <div className="surface p-5">
                <h3 className="mb-3 font-semibold">Screen readers</h3>
                <Bullets items={spec.screenReader} />
              </div>
            </div>
          </Section>

          <Section title="Best practices">
            <DoDont dos={spec.dos} donts={spec.donts} />
          </Section>

          <Section title="Fluid UI notes" intro={<p>How this component is built with Fluid UI, and any accessibility gaps we patched.</p>}>
            <div className="surface p-5">
              <Bullets items={spec.fluid.notes} />
            </div>
          </Section>

          <Section title="WCAG criteria">
            <WcagList refs={spec.wcag} />
          </Section>

          <Section title="Testing checklist" intro={<p>Your progress is saved in this browser.</p>}>
            <Checklist scope={spec.slug} items={spec.testing} title={`${spec.name} testing checklist`} />
          </Section>
        </div>

        <nav aria-label="Previous and next component" className="mt-16 grid gap-4 border-t border-gray-200/80 pt-8 sm:grid-cols-2 dark:border-gray-800">
          {prev ? (
            <Link to={`/components/${prev.slug}`} className="surface block p-4 focus-ring hover:ring-primary-300">
              <span className="block text-sm text-muted">Previous</span>
              <span className="font-semibold">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/components/${next.slug}`} className="surface block p-4 text-right focus-ring hover:ring-primary-300">
              <span className="block text-sm text-muted">Next</span>
              <span className="font-semibold">{next.name}</span>
            </Link>
          )}
        </nav>
      </article>

      <aside className="sticky top-24 hidden h-fit w-52 flex-none xl:block">
        <nav aria-label="On this page">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">On this page</h2>
          <ul className="space-y-1 text-sm">
            {TOC.map((t) => (
              <li key={t}>
                <a
                  href={`#${slugify(t)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(slugify(t));
                    el?.scrollIntoView();
                    el?.setAttribute('tabindex', '-1');
                    el?.focus({ preventScroll: true });
                  }}
                  className="block rounded px-2 py-1 text-gray-700 hover:text-gray-900 focus-ring dark:text-gray-200 dark:hover:text-white"
                >
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
