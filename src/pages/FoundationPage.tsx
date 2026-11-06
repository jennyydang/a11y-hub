import { useParams } from 'react-router-dom';
import { Section } from '../components/Section';
import { WcagList } from '../components/Tables';
import { findFoundation } from '../data/foundations';
import { NotFound } from './NotFound';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';
import { withTerms } from '../components/TermTip';

/** The three rules that matter most on each foundation page. */
const TLDR: Record<string, string[]> = {
  keyboard: [
    'Everything you can click must work with a keyboard: Tab to move, Enter or Space to act, Escape to close.',
    'Tab order follows the visual reading order.',
    'Widgets like tabs and menus are one Tab stop, and arrow keys move inside them.',
  ],
  focus: [
    'Every focusable element shows a focus indicator at least 2px thick, with 3:1 contrast.',
    'Move focus only on purpose: into a dialog when it opens, and back when it closes.',
    'Never move focus while someone is typing or reading.',
  ],
  color: [
    'Body text needs 4.5:1 contrast. Large text, icons and borders need 3:1.',
    'Never use color alone to show meaning.',
    'Check every state, including hover, focus, error and disabled.',
  ],
  semantics: [
    'Use the native HTML element first: button, a, input, nav.',
    'Add ARIA only when HTML can’t say it, and keep its states in sync.',
    'Every control needs an accessible name.',
  ],
  motion: [
    'Respect reduced motion: swap movement for a fade, or nothing.',
    'Nothing flashes more than three times a second.',
    'Anything that moves for more than five seconds can be paused.',
  ],
  text: [
    'Text can be resized to 200% without losing content.',
    'Content reflows at 320px wide with no sideways scrolling.',
    'The layout survives wider letter, word, line and paragraph spacing.',
  ],
  layout: [
    'Use landmarks: header, nav, main and footer.',
    'Put things where people expect them: logo top left, search and account top right.',
    'Breadcrumbs go first inside main, above the page heading.',
  ],
};

export function FoundationPage() {
  const { slug = '' } = useParams();
  const spec = findFoundation(slug);
  usePageTitle(spec ? spec.name : 'Not found');
  if (!spec) return <NotFound />;
  const { Tool } = spec;
  return (
    <article className="max-w-4xl">
      <PageHeader eyebrow="Foundations" title={spec.name}>
        <p>{withTerms(spec.summary)}</p>
      </PageHeader>
      {TLDR[spec.slug] && (
        <section aria-labelledby="short-version" className="mb-12 rounded-2xl bg-primary-50 p-5 ring-1 ring-primary-200 dark:bg-primary-900/20 dark:ring-primary-800/60">
          <h2 id="short-version" className="font-semibold">
            The short version
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 leading-7">
            {TLDR[spec.slug].map((t) => (
              <li key={t}>{withTerms(t)}</li>
            ))}
          </ol>
        </section>
      )}
      <div className="space-y-12">
        {Tool && <Tool />}
        {spec.sections.map((s) => (
          <Section key={s.heading} title={s.heading}>
            <div className="prose-doc space-y-4">
              {s.body.map((p) => (
                <p key={p}>{withTerms(p)}</p>
              ))}
              {s.bullets && (
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {s.bullets.map((b) => (
                    <li key={b}>{withTerms(b)}</li>
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
