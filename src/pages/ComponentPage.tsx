import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Tab } from '@fluid-design/fluid-ui';
import { CodeBlock } from '../components/CodeBlock';
import { Checklist } from '../components/Checklist';
import { DemoStage } from '../components/DemoStage';
import { DoDont } from '../components/DoDont';
import { RoleNotes } from '../components/RoleNotes';
import { Worksheet } from '../components/Worksheet';
import { VariantPicker } from '../components/VariantPicker';
import { Part, Section, slugify } from '../components/Section';
import { useScrollSpy } from '../components/useScrollSpy';
import { cx } from '../ui';
import { AriaTable, KeyboardTable, WcagList } from '../components/Tables';
import { components, findComponent } from '../data/components';
import { htmlExamples } from '../data/html';
import { NotFound } from './NotFound';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

const toc = (tool?: string): [string, string[]][] => [
  ['Try it', ['Live example']],
  ['How it works', ['Usage', 'Keyboard interactions', 'ARIA', 'Focus & screen readers']],
  ['Guidance', ['Best practices', ...(tool ? [tool] : []), 'WCAG criteria', 'Fluid UI notes']],
  ['Team handoff', ['Who owns what', 'Handoff worksheet', 'Testing checklist']],
];

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
  const [params, setParams] = useSearchParams();
  const spec = findComponent(slug);
  usePageTitle(spec ? spec.name : 'Not found');
  const sections = toc(spec?.tool?.title);
  const active = useScrollSpy(sections.flatMap(([, items]) => items.map(slugify)));
  if (!spec) return <NotFound />;

  const idx = components.indexOf(spec);
  const prev = components[idx - 1];
  const next = components[idx + 1];
  const variants = spec.variants;
  const variant = variants?.find((v) => v.id === params.get('variant')) ?? variants?.[0];
  const Demo = variant?.Demo ?? spec.Demo;
  const html = variant?.html ?? htmlExamples[spec.slug] ?? '';
  const code = variant?.code ?? spec.code;
  const setVariant = (id: string) =>
    {
    const next = new URLSearchParams(params);
    if (id === variants?.[0].id) next.delete('variant');
    else next.set('variant', id);
    setParams(next, { replace: true, preventScrollReset: true });
  };

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

        <div className="space-y-16">
          <Part n={1} title="Try it" description="Interact with the component using a keyboard, and see what assistive technology gets.">
            <Section title="Live example" intro={<p>The inspector shows roughly what a screen reader would announce.{variants ? ' Switch variations to see how the markup changes.' : ''}</p>}>
              {variants && variant && <VariantPicker variants={variants} value={variant.id} onChange={setVariant} />}
              <DemoStage key={spec.slug}>
                <Demo key={variant?.id} />
              </DemoStage>
              <Tab
                className="mt-2"
                tabs={[
                  {
                    title: 'HTML',
                    content: (
                      <div className="space-y-2 pt-3">
                        <p className="text-sm text-muted">
                          Plain HTML with the ARIA it needs, plus the minimum JavaScript where behavior requires it. No framework needed.
                        </p>
                        <CodeBlock code={html} language="html" title={variant ? `HTML · ${variant.label}` : 'HTML'} />
                      </div>
                    ),
                  },
                  {
                    title: 'React + Fluid UI',
                    content: (
                      <div className="pt-3">
                        <CodeBlock code={code} title={variant ? `React · ${variant.label}` : 'React (tsx)'} />
                      </div>
                    ),
                  },
                ]}
              />
            </Section>
          </Part>

          <Part n={2} title="How it works" description="When to use it, and the keyboard, ARIA and focus behavior it needs.">
            <Section title="Usage">
              <div className="surface p-5">
                <Bullets items={spec.whenToUse} />
              </div>
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
          </Part>

          <Part n={3} title="Guidance" description="What good looks like, the standards it must meet, and how it’s built with Fluid UI.">
            <Section title="Best practices">
              <DoDont dos={spec.dos} donts={spec.donts} />
            </Section>

            {spec.tool && (
              <Section title={spec.tool.title} intro={<p>{spec.tool.intro}</p>}>
                <spec.tool.Tool />
              </Section>
            )}

            <Section title="WCAG criteria">
              <WcagList refs={spec.wcag} />
            </Section>

            <Section title="Fluid UI notes" intro={<p>How this component is built with Fluid UI, and any accessibility gaps we patched.</p>}>
              <div className="surface p-5">
                <Bullets items={spec.fluid.notes} />
              </div>
            </Section>
          </Part>

          <Part n={4} title="Team handoff" description="What each role owns, a shared worksheet to fill in, and the final tests.">
            <Section title="Who owns what" intro={<p>What your content, design, frontend and QA specialists each need to get right.</p>}>
              <RoleNotes slug={spec.slug} />
            </Section>

            <Section
              title="Handoff worksheet"
              intro={<p>One shared worksheet per component. Content writes the words it needs, design checks its requirements, frontend builds from both, and QA tests the result. Copy the whole handoff into your ticket.</p>}
            >
              <Worksheet spec={spec} variant={variant} />
            </Section>

            <Section title="Testing checklist" intro={<p>Your progress is saved in this browser.</p>}>
              <Checklist scope={spec.slug} items={spec.testing} title={`${spec.name} testing checklist`} />
            </Section>
          </Part>
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
          <div className="space-y-4 text-sm">
            {sections.map(([part, items]) => (
              <div key={part}>
                <p
                  className={cx(
                    'mb-1 px-2 text-xs font-semibold',
                    items.some((t) => slugify(t) === active) ? 'text-primary-800 dark:text-primary-200' : 'text-gray-600 dark:text-gray-300',
                  )}
                >
                  {part}
                </p>
                <ul className="space-y-0.5 border-l border-gray-200 dark:border-gray-700">
                  {items.map((t) => (
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
                        aria-current={slugify(t) === active ? 'location' : undefined}
                        className={cx(
                          '-ml-px block border-l-2 py-1 pl-3 pr-2 transition-colors focus-ring',
                          slugify(t) === active
                            ? 'border-primary-700 bg-primary-50 font-semibold text-primary-800 dark:border-primary-300 dark:bg-primary-900/30 dark:text-primary-100'
                            : 'border-transparent text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white',
                        )}
                      >
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </div>
  );
}
