import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { examples, findExample } from '../examples';
import { ViewContext } from '../examples/kit';
import { findComponent } from '../data/components';
import { Section } from '../components/Section';
import { cx } from '../ui';
import { NotFound } from './NotFound';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

/** Browser-window chrome around an example. Purely decorative. */
function Frame({ url, mobile, children }: { url: string; mobile: boolean; children: ReactNode }) {
  return (
    <div className={cx('mx-auto overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-300 transition-[max-width] dark:bg-gray-950 dark:ring-gray-700', mobile ? 'max-w-[375px]' : 'max-w-none')}>
      <div aria-hidden="true" className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
        <span className="h-3 w-3 rounded-full bg-gray-400" />
        <span className="h-3 w-3 rounded-full bg-gray-400" />
        <span className="h-3 w-3 rounded-full bg-gray-400" />
        <span className="ml-2 flex-1 truncate rounded bg-white px-2 py-0.5 font-mono text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-200">{url}</span>
      </div>
      <div className="py-4">{children}</div>
    </div>
  );
}

/** A small, non-interactive picture of an example for the index. */
function Thumbnail({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.setAttribute('inert', ''), []);
  const ex = findExample(id)!;
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none h-48 overflow-hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="w-[250%] origin-top-left scale-[0.4] py-4">
        <ViewContext.Provider value={{ annotate: false, mobile: false }}>
          <ex.Page />
        </ViewContext.Provider>
      </div>
    </div>
  );
}

export function ExamplesIndex() {
  usePageTitle('Page examples');
  return (
    <div className="max-w-5xl">
      <PageHeader eyebrow="Overview" title="Page examples">
        <p>
          Whole pages built from the components on this site, with numbered notes on where each one sits and why. Use them to start a design, brief a
          team, or check your own layouts. See also <Link className="link" to="/foundations/layout">Page layout and placement</Link>.
        </p>
      </PageHeader>
      <ul className="grid gap-5 sm:grid-cols-2">
        {examples.map((e) => (
          <li key={e.id} className="min-w-0">
            <Link to={`/examples/${e.id}`} className="surface group flex h-full flex-col overflow-hidden focus-ring">
              <Thumbnail id={e.id} />
              <span className="flex flex-1 flex-col p-5">
                <span className="text-lg font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">{e.name}</span>
                <span className="mt-1 flex-1 text-sm leading-6 text-muted">{e.summary}</span>
                <span className="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  Uses {e.uses.map((s) => findComponent(s)?.name.toLowerCase()).filter(Boolean).join(', ')}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const toggle = (on: boolean) =>
  cx(
    'rounded-md px-3 py-1.5 text-sm font-medium focus-ring',
    on ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-300 dark:bg-gray-900 dark:text-gray-50 dark:ring-gray-600' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700',
  );

export function ExamplePage() {
  const { id = '' } = useParams();
  const ex = findExample(id);
  usePageTitle(ex ? `${ex.name} example` : 'Not found');
  const [annotate, setAnnotate] = useState(true);
  const [mobile, setMobile] = useState(false);
  if (!ex) return <NotFound />;
  const i = examples.indexOf(ex);
  const prev = examples[i - 1];
  const next = examples[i + 1];

  return (
    <article className="max-w-5xl">
      <PageHeader eyebrow="Page examples" title={ex.name}>
        <p>{ex.summary} Everything in the example works with a keyboard and a screen reader.</p>
      </PageHeader>

      <div className="space-y-12">
        <Section title="The page" intro={<p>Pink numbers match the notes below. Dashed outlines show the landmark each area should be in a real page.</p>}>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Viewport" className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)} className={toggle(!mobile)}>
                Desktop
              </button>
              <button type="button" aria-pressed={mobile} onClick={() => setMobile(true)} className={toggle(mobile)}>
                Mobile
              </button>
            </div>
            <button type="button" aria-pressed={annotate} onClick={() => setAnnotate((a) => !a)} className={cx(toggle(annotate), 'bg-gray-100 dark:bg-gray-800')}>
              Show notes on the page
            </button>
          </div>
          <ViewContext.Provider value={{ annotate, mobile }}>
            <Frame url={`trailmate.example/${ex.id}`} mobile={mobile}>
              <ex.Page />
            </Frame>
          </ViewContext.Provider>
        </Section>

        <Section title="What’s on this page" intro={<p>Each note says where the component sits and the reason. Follow the link for full guidance.</p>}>
          <ol className="space-y-3">
            {ex.notes.map((n) => {
              const c = findComponent(n.slug);
              return (
                <li key={n.n} className="surface flex gap-4 p-4">
                  <span aria-hidden="true" className="grid h-8 w-8 flex-none place-items-center rounded-full bg-fuchsia-700 text-sm font-bold text-white dark:bg-fuchsia-300 dark:text-gray-900">
                    {n.n}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      <span className="sr-only">Note {n.n}: </span>
                      {n.title}
                    </h3>
                    <p className="leading-7">{n.why}</p>
                    {c && (
                      <Link className="link text-sm" to={`/components/${c.slug}#placement-ux`}>
                        {c.name} placement and UX
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        <Section title="Check it yourself">
          <ul className="list-disc space-y-2 pl-5 leading-7">
            <li>Click just above the example and press Tab. The first stop should be the example’s skip link.</li>
            <li>Switch to Mobile and confirm nothing is cut off and the order still makes sense.</li>
            <li>Turn off the notes and look at it in grayscale with the Simulate menu on any component page.</li>
          </ul>
        </Section>
      </div>

      <nav aria-label="More examples" className="mt-12 flex justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
        {prev ? (
          <Link to={`/examples/${prev.id}`} className="link">
            <span aria-hidden="true">← </span>
            {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/examples/${next.id}`} className="link">
            {next.name}
            <span aria-hidden="true" className="nudge inline-block">&nbsp;→</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
