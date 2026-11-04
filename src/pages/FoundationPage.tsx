import { useParams } from 'react-router-dom';
import { Section } from '../components/Section';
import { WcagList } from '../components/Tables';
import { findFoundation } from '../data/foundations';
import { NotFound } from './NotFound';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function FoundationPage() {
  const { slug = '' } = useParams();
  const spec = findFoundation(slug);
  usePageTitle(spec ? spec.name : 'Not found');
  if (!spec) return <NotFound />;
  const { Tool } = spec;
  return (
    <article className="max-w-4xl">
      <PageHeader eyebrow="Foundations" title={spec.name}>
        <p>{spec.summary}</p>
      </PageHeader>
      <div className="space-y-12">
        {Tool && <Tool />}
        {spec.sections.map((s) => (
          <Section key={s.heading} title={s.heading}>
            <div className="prose-doc space-y-4">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.bullets && (
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </Section>
        ))}
        <Section title="Related WCAG criteria">
          <WcagList refs={spec.wcag} />
        </Section>
      </div>
    </article>
  );
}
