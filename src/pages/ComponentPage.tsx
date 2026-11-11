import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { Checklist } from '../components/Checklist';
import { DemoStage } from '../components/DemoStage';
import { DoDont } from '../components/DoDont';
import { GoodBad } from '../components/GoodBad';
import { RoleNotes } from '../components/RoleNotes';
import { Worksheet } from '../components/Worksheet';
import { AtAGlance } from '../components/AtAGlance';
import { PlacementGuide, WhenToUse } from '../components/PlacementGuide';
import { VariantPicker } from '../components/VariantPicker';
import { Part, Section, slugify } from '../components/Section';
import { useScrollSpy } from '../components/useScrollSpy';
import { RoleFilter } from '../components/RoleFilter';
import { withTerms } from '../components/TermTip';
import { YourPart } from '../components/YourPart';
import { Sources } from '../components/Sources';
import { showsSection, type SectionKey } from '../data/roleSections';
import { findRole } from '../data/roles';
import { useRole } from '../lib/useRole';
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { scrollToSection } from '../lib/scrollToSection';
import { cx } from '../ui';
import { AriaTable, KeyboardTable, WcagList } from '../components/Tables';
import { components, findComponent } from '../data/components';
import { htmlExamples } from '../data/html';
import { anatomy } from '../data/anatomy';
import { AnatomyTables } from '../components/AnatomyTables';
import { NotFound } from './NotFound';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 leading-7">
      {items.map((i) => (
        <li key={i}>{withTerms(i)}</li>
      ))}
    </ul>
  );
}

interface PageSection {
  key: SectionKey;
  title: string;
  intro?: ReactNode;
  node: ReactNode;
}

/** One bar that glides between items in the “On this page” menu, instead of each item's border switching on and off. */
function TocMarker({ container, active }: { container: RefObject<HTMLDivElement>; active: string | null }) {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const link = container.current?.querySelector<HTMLElement>('a[aria-current="location"]');
    const root = container.current;
    if (!link || !root) return setBox(null);
    const a = link.getBoundingClientRect();
    const r = root.getBoundingClientRect();
    setBox({ top: a.top - r.top, height: a.height });
  }, [container, active]);
  if (!box) return null;
  return (
    <span
      aria-hidden="true"
      className="toc-marker pointer-events-none absolute left-0 top-0 z-10 w-0.5 rounded-full bg-primary-700 dark:bg-primary-300"
      style={{ transform: `translateY(${box.top}px)`, height: box.height }}
    />
  );
}

export function ComponentPage() {
  const { slug = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const [role] = useRole();
  const tocRef = useRef<HTMLDivElement>(null);
  const spec = findComponent(slug);
  usePageTitle(spec ? spec.name : 'Not found');

  const show = (k: SectionKey) => showsSection(role, k);
  const variants = spec?.variants;
  const variant = variants?.find((v) => v.id === params.get('variant')) ?? variants?.[0];
  const setVariant = (id: string) => {
    const next = new URLSearchParams(params);
    if (id === variants?.[0].id) next.delete('variant');
    else next.set('variant', id);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const parts: { title: string; description: string; sections: PageSection[] }[] = [];
  if (spec) {
    const Demo = variant?.Demo ?? spec.Demo;
    const html = variant?.html ?? htmlExamples[spec.slug] ?? '';
    const codeTabs = (
      <div className="space-y-2">
        <p className="text-sm text-muted">Plain HTML with the ARIA it needs, plus the minimum JavaScript where behavior requires it. Works with any framework or design system.</p>
        <CodeBlock code={html} language="html" title={variant ? `HTML · ${variant.label}` : 'HTML'} />
      </div>
    );

    parts.push(
      {
        title: 'Try it',
        description: 'Interact with the component using a keyboard, and see what assistive technology gets.',
        sections: [
          {
            key: 'live',
            title: 'Live example',
            intro: <p>The inspector shows roughly what a screen reader would announce.{variants ? ' Switch variations to see how the markup changes.' : ''}</p>,
            node: (
              <>
                {variants && variant && <VariantPicker variants={variants} value={variant.id} onChange={setVariant} />}
                <DemoStage key={spec.slug}>
                  <Demo key={variant?.id} />
                </DemoStage>
                {show('code') ? (
                  codeTabs
                ) : (
                  <details className="group mt-2 rounded-lg ring-1 ring-gray-200 dark:ring-gray-700">
                    <summary className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium focus-ring">Show the code (HTML and React)</summary>
                    <div className="px-4 pb-4">{codeTabs}</div>
                  </details>
                )}
              </>
            ),
          },
        ],
      },
      {
        title: 'How it works',
        description: 'When to use it, and the keyboard, ARIA and focus behavior it needs.',
        sections: [
          { key: 'when', title: 'When to use', node: <WhenToUse slug={spec.slug} use={spec.whenToUse} /> },
          ...(anatomy[spec.slug]
            ? [
                {
                  key: 'anatomy' as const,
                  title: 'Anatomy & states',
                  intro: <p>The parts that make up the component, and how each state looks and sounds.</p>,
                  node: <AnatomyTables name={spec.name} data={anatomy[spec.slug]} />,
                },
              ]
            : []),
          { key: 'keyboard', title: 'Keyboard interactions', node: <KeyboardTable rows={spec.keyboard} name={spec.name} /> },
          {
            key: 'aria',
            title: 'ARIA',
            intro: <p>Roles, states and properties to apply. Native elements already provide many of these.</p>,
            node: <AriaTable rows={spec.aria} name={spec.name} />,
          },
          {
            key: 'focus',
            title: 'Focus & screen readers',
            node: (
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
            ),
          },
        ],
      },
      {
        title: 'Guidance',
        description: 'Where it goes, what good looks like, the standards it must meet.',
        sections: [
          {
            key: 'placement',
            title: 'Placement & UX',
            intro: <p>Where it belongs on the page, and the user experience research behind that advice.</p>,
            node: <PlacementGuide slug={spec.slug} name={spec.name} />,
          },
          { key: 'practices', title: 'Best practices', node: <DoDont dos={spec.dos} donts={spec.donts} /> },
          {
            key: 'goodbad',
            title: 'Good and bad examples',
            intro: (
              <p>
                The same thing built two ways, and what people actually experience with each: what a screen reader says, what happens with a keyboard, and what people see.
              </p>
            ),
            node: <GoodBad slug={spec.slug} />,
          },
          ...(spec.tool ? [{ key: 'tool' as const, title: spec.tool.title, intro: <p>{spec.tool.intro}</p>, node: <spec.tool.Tool /> }] : []),
          { key: 'wcag', title: 'WCAG criteria', node: <WcagList refs={spec.wcag} /> },
        ],
      },
      {
        title: 'Team handoff',
        description: 'What each role owns, a shared worksheet to fill in, and the final tests.',
        sections: [
          {
            key: 'owners',
            title: 'Who owns what',
            intro: <p>What your content, design, frontend and QA specialists each need to get right.</p>,
            node: <RoleNotes slug={spec.slug} />,
          },
          {
            key: 'worksheet',
            title: 'Handoff worksheet',
            intro: (
              <p>
                One shared worksheet per component. Content writes the words it needs, design checks its requirements, frontend builds from both, and QA tests the result. Copy the
                whole handoff into your ticket.
              </p>
            ),
            node: <Worksheet spec={spec} variant={variant} defaultSheet={role ?? undefined} />,
          },
          {
            key: 'testing',
            title: 'Testing checklist',
            intro: <p>Your progress is saved in this browser.</p>,
            node: <Checklist scope={spec.slug} items={spec.testing} title={`${spec.name} testing checklist`} />,
          },
          {
            key: 'sources',
            title: 'Sources and review',
            intro: <p>Where this guidance comes from, so you can check it and go deeper.</p>,
            node: <Sources spec={spec} />,
          },
        ],
      },
    );
  }

  const allCount = parts.reduce((n, p) => n + p.sections.length, 0);
  const visible = parts.map((p) => ({ ...p, sections: p.sections.filter((s) => show(s.key)) })).filter((p) => p.sections.length > 0);
  const shownCount = visible.reduce((n, p) => n + p.sections.length, 0);
  const sections: [string, string[]][] = [
    ['Overview', ['At a glance', ...(role ? ['Your part'] : [])]],
    ...visible.map((p) => [p.title, p.sections.map((s) => s.title)] as [string, string[]]),
  ];
  const [active, pin] = useScrollSpy(sections.flatMap(([, items]) => items.map(slugify)));
  if (!spec) return <NotFound />;

  const idx = components.indexOf(spec);
  const prev = components[idx - 1];
  const next = components[idx + 1];
  const roleName = role ? findRole(role)?.name : '';
  const filterStatus = role
    ? `Showing ${shownCount} of ${allCount} sections: the ones ${roleName === 'QA' ? 'QA' : roleName?.toLowerCase()} specialists need. Choose Everyone to see them all.`
    : `Showing all ${allCount} sections. Choose your role to see only what you need.`;

  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-4xl flex-1">
        <PageHeader
          eyebrow={spec.category}
          title={spec.name}
          meta={
            <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
              <span className="chip bg-gray-100 font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-100">{spec.semantics}</span>
              {spec.apgPattern && (
                <a className="link ml-1" href={spec.apgPattern} target="_blank" rel="noreferrer">
                  ARIA pattern<span className="sr-only"> for {spec.name} (opens in a new tab)</span>
                </a>
              )}
            </div>
          }
        >
          <p>{withTerms(spec.summary)}</p>
        </PageHeader>

        <div className="-mt-4 mb-8">
          <RoleFilter status={filterStatus} />
        </div>

        <AtAGlance spec={spec} />

        {role && <YourPart spec={spec} role={role} />}

        <div className="space-y-16">
          {visible.map((part, i) => (
            <Part key={part.title} n={i + 1} title={part.title} description={part.description}>
              {part.sections.map((s) => (
                <Section key={s.key} title={s.title} intro={s.intro}>
                  {s.node}
                </Section>
              ))}
            </Part>
          ))}
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
          <div ref={tocRef} className="relative space-y-4 text-sm">
            <TocMarker container={tocRef} active={active} />
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
                          const target = slugify(t);
                          pin(target, scrollToSection(target));
                        }}
                        aria-current={slugify(t) === active ? 'location' : undefined}
                        className={cx(
                          '-ml-px block rounded-r-md border-l-2 border-transparent py-1 pl-3 pr-2 transition-colors duration-200 focus-ring',
                          slugify(t) === active
                            ? 'bg-primary-50 font-semibold text-primary-800 dark:bg-primary-900/30 dark:text-primary-100'
                            : 'text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white',
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
