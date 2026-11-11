import { useId, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Checklist } from '../components/Checklist';
import { CodeBlock } from '../components/CodeBlock';
import { DemoStage } from '../components/DemoStage';
import { Section } from '../components/Section';
import { AriaTable, KeyboardTable, TableShell, WcagList } from '../components/Tables';
import { withTerms } from '../components/TermTip';
import { findComponent } from '../data/components';
import { roles } from '../data/roles';
import { fieldTranslation } from '../lib/translation';
import { findPattern, patterns } from '../patterns';
import { cx } from '../ui';
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

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const th = 'px-4 py-3 text-left text-sm font-semibold';
const td = 'border-t border-gray-200 px-4 py-3 align-top text-sm leading-6 dark:border-gray-800';

export function PatternPage() {
  const { slug = '' } = useParams();
  const p = findPattern(slug);
  usePageTitle(p ? `${p.name} pattern` : 'Not found');
  const id = useId();
  if (!p) return <NotFound />;
  const { Demo } = p;
  const i = patterns.indexOf(p);
  const next = patterns[(i + 1) % patterns.length];

  return (
    <article className="max-w-4xl">
      <PageHeader eyebrow={`Pattern · ${p.category}`} title={p.name}>
        <p>{withTerms(p.summary)}</p>
      </PageHeader>

      <div className="space-y-12">
        <Section title="Live example">
          <DemoStage>
            <Demo />
          </DemoStage>
        </Section>

        <Section title="When to use it">
          <Bullets items={p.whenToUse} />
        </Section>

        <Section title="Built from" intro="The components this pattern combines. Each has its own full guidance.">
          <ul className="flex flex-wrap gap-2">
            {p.uses.map((s) => {
              const c = findComponent(s);
              return c ? (
                <li key={s}>
                  <Link to={`/components/${s}`} className="chip bg-primary-50 text-primary-800 hover:underline focus-ring dark:bg-primary-900/50 dark:text-primary-100">
                    {c.name}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </Section>

        <Section title="Structure" intro="Landmarks, headings and elements, top to bottom.">
          <TableShell caption={`${p.name} structure`}>
            <thead>
              <tr>
                <th scope="col" className={th}>Part</th>
                <th scope="col" className={th}>Element</th>
                <th scope="col" className={th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {p.structure.map((s) => (
                <tr key={s.part}>
                  <th scope="row" className={cx(td, 'font-semibold')}>{s.part}</th>
                  <td className={cx(td, 'font-mono text-xs')}>{s.element}</td>
                  <td className={td}>{withTerms(s.notes)}</td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <CodeBlock code={p.html} language="html" title="HTML skeleton" />
        </Section>

        <Section title="Keyboard">
          <KeyboardTable rows={p.keyboard} name={p.name} />
        </Section>

        <Section title="ARIA and semantics" intro="Includes which values go to translation.">
          <AriaTable rows={p.aria} name={p.name} />
        </Section>

        <Section title="Content" intro="Every string this pattern needs, including ones only screen reader users hear. Send all of them to translation.">
          <ul className="grid gap-3 sm:grid-cols-2">
            {p.content.map((c) => {
              const t = fieldTranslation(c);
              return (
                <li key={c.label} className="surface space-y-2 p-4 text-sm leading-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{c.label}</span>
                    <span className="chip bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-100">
                      {t.audience === 'Visible' ? 'Translate' : `Translate · ${t.audience.toLowerCase()}`}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted">{c.target}</p>
                  <p>{c.guidance}</p>
                  <p>
                    <span className="font-semibold">Example:</span> “{c.good}”
                  </p>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Design">
          <Bullets items={p.design} />
        </Section>

        <Section title="What a screen reader says" intro="Moving through the example with a screen reader. Exact wording varies by screen reader.">
          <ol className="list-decimal space-y-2 pl-6 leading-7">
            {p.screenReader.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </Section>

        <Section title="Who does what">
          <dl className="grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <div key={r.id} className="surface p-4">
                <dt className="font-semibold">{r.name}</dt>
                <dd className="mt-2">
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
                    {p.roles[r.id].map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Common mistakes">
          <Bullets items={p.mistakes} />
        </Section>

        <Section title="Testing">
          <Checklist scope={`pattern-${p.slug}`} items={p.testing} title={`${p.name} checks`} />
        </Section>

        <Section title="WCAG criteria">
          <WcagList refs={p.wcag} />
        </Section>

        <Section title="Sources">
          <ul className="space-y-2 leading-7">
            {p.sources.map((s) => (
              <li key={s.url}>
                <Ext href={s.url}>{s.title}</Ext>, {s.by}
                {s.note && <span className="text-muted">. {s.note}</span>}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <nav aria-labelledby={`${id}-next`} className="mt-14 border-t border-gray-200 pt-6 dark:border-gray-800">
        <h2 id={`${id}-next`} className="sr-only">
          More patterns
        </h2>
        <Link to={`/patterns/${next.slug}`} className="link">
          Next pattern: {next.name}
        </Link>
      </nav>
    </article>
  );
}
