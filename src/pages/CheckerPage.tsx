import { useId, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { AxeResults, Result } from 'axe-core';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';
import { cx } from '../ui';

const EXAMPLES: { label: string; html: string }[] = [
  {
    label: 'Form with problems',
    html: `<form>
  <span>Email</span> <input type="email">
  <button><svg viewBox="0 0 20 20" width="20"><path d="M2 10h16"/></svg></button>
  <img src="banner.png">
  <a href="/report">Click here</a>
</form>`,
  },
  {
    label: 'Fixed version',
    html: `<form>
  <label for="email">Email address</label>
  <input id="email" type="email" autocomplete="email">
  <button type="submit">Subscribe</button>
  <img src="banner.png" alt="">
  <a href="/report">Read the 2026 accessibility report</a>
</form>`,
  },
  {
    label: 'Custom widget without ARIA',
    html: `<div class="tabs">
  <div onclick="show(1)">Profile</div>
  <div onclick="show(2)">Security</div>
</div>
<div role="tab">Orphan tab</div>
<ul><div>Not a list item</div></ul>`,
  },
];

/** Rules about whole pages that don't apply to a pasted snippet. */
const PAGE_RULES = ['region', 'landmark-one-main', 'page-has-heading-one', 'html-has-lang', 'document-title', 'bypass', 'landmark-complementary-is-top-level', 'landmark-no-duplicate-main'];

const IMPACT_STYLE: Record<string, string> = {
  critical: 'bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-50',
  serious: 'bg-orange-100 text-orange-900 dark:bg-orange-900/60 dark:text-orange-50',
  moderate: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-50',
  minor: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50',
};

/** Parse the snippet without running anything: drop scripts, event handlers and javascript: URLs. */
function sanitize(html: string) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  doc.querySelectorAll('script, iframe, object, embed, link, meta, base').forEach((n) => n.remove());
  doc.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((a) => {
      if (a.name.startsWith('on') || /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
    });
  });
  return doc.body.innerHTML;
}

export function CheckerPage() {
  usePageTitle('Markup checker');
  const id = useId();
  const [html, setHtml] = useState(EXAMPLES[0].html);
  const [results, setResults] = useState<AxeResults | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);

  const run = async () => {
    const box = previewRef.current;
    if (!box) return;
    setRunning(true);
    setError('');
    try {
      box.innerHTML = sanitize(html);
      const axe = (await import('axe-core')).default;
      const res = await axe.run(box, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        rules: Object.fromEntries(PAGE_RULES.map((r) => [r, { enabled: false }])),
      });
      setResults(res);
      requestAnimationFrame(() => resultsRef.current?.focus());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The check couldn’t run.');
    } finally {
      setRunning(false);
    }
  };

  const violations = results?.violations ?? [];
  const nodeCount = violations.reduce((n, v) => n + v.nodes.length, 0);

  return (
    <article className="max-w-5xl">
      <PageHeader eyebrow="Tools" title="Markup checker">
        <p>
          Paste a piece of HTML to check it against WCAG 2.2 AA with axe-core. Automated checks find roughly a third of issues, so follow up with
          keyboard and screen reader testing.
        </p>
      </PageHeader>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Try an example:</span>
          {EXAMPLES.map((ex) => (
            <Button key={ex.label} size="sm" weight="light" color="gray" onClick={() => setHtml(ex.html)}>
              {ex.label}
            </Button>
          ))}
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-html`} className="block text-sm font-semibold">
            HTML to check
          </label>
          <p id={`${id}-hint`} className="text-sm text-muted">
            Scripts and event handlers are removed before checking. Nothing leaves your browser.
          </p>
          <textarea
            id={`${id}-html`}
            aria-describedby={`${id}-hint`}
            rows={10}
            spellCheck={false}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="block w-full rounded-lg bg-gray-900 p-3 font-mono text-[13px] leading-6 text-gray-50 outline-none ring-1 ring-gray-700 focus-visible:ring-2 focus-visible:ring-primary-300"
          />
        </div>
        <Button className="btn-bold-primary" onClick={run} isLoading={running} disabled={!html.trim()}>
          Check markup
        </Button>
        {error && (
          <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        )}

        <section aria-labelledby={`${id}-preview`} className="surface overflow-hidden">
          <h2 id={`${id}-preview`} className="border-b border-gray-100 px-4 py-2 text-sm font-semibold dark:border-gray-800">
            Rendered preview
          </h2>
          <div ref={previewRef} className="prose-doc min-h-[4rem] space-y-2 p-4 [&_button]:rounded [&_button]:px-2 [&_button]:ring-1 [&_button]:ring-gray-400 [&_input]:rounded [&_input]:px-2 [&_input]:ring-1 [&_input]:ring-gray-400 [&_a]:underline" />
        </section>

        {results && (
          <section aria-labelledby={`${id}-results`} className="space-y-3">
            <h2 ref={resultsRef} tabIndex={-1} id={`${id}-results`} className="rounded text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
              {violations.length ? `${violations.length} ${violations.length === 1 ? 'issue' : 'issues'} in ${nodeCount} ${nodeCount === 1 ? 'place' : 'places'}` : 'No automated issues found'}
            </h2>
            <p className="text-sm text-muted">
              {results.passes.length} checks passed. {results.incomplete.length ? `${results.incomplete.length} need a manual look.` : ''}
            </p>
            <ul className="space-y-3">
              {violations.map((v: Result) => (
                <li key={v.id} className="surface space-y-2 p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cx('chip capitalize', IMPACT_STYLE[v.impact ?? 'minor'])}>{v.impact}</span>
                    <h3 className="font-semibold">{v.help}</h3>
                  </div>
                  <p className="text-muted">{v.description}</p>
                  <ul className="space-y-2">
                    {v.nodes.map((n, i) => (
                      <li key={i} className="space-y-1">
                        <pre className="overflow-x-auto rounded-md bg-gray-900 p-2 text-xs text-gray-50" tabIndex={0} aria-label="Failing element">
                          <code>{n.html}</code>
                        </pre>
                        {n.failureSummary && <p className="whitespace-pre-line">{n.failureSummary.replace(/^Fix (any|all) of the following:\n\s*/gm, 'To fix: ')}</p>}
                      </li>
                    ))}
                  </ul>
                  <a className="link" href={v.helpUrl} target="_blank" rel="noreferrer">
                    How to fix “{v.help}”<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
