import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { byCategory, categories, components } from '../data/components';
import { examples } from '../examples';
import { WCAG } from '../data/wcag';
import type { WcagRef } from '../data/types';
import {
  DELIVERABLES,
  SEVERITIES,
  SUPPORT_OPTIONS,
  buildDoc,
  emptyProject,
  toHtml,
  toMarkdown,
  type AgencyProject,
  type Block,
  type DeliverableId,
  type Finding,
  type Severity,
} from '../lib/deliverables';
import { cx } from '../ui';

const KEY = 'a11y-hub:agency-project';
const field =
  'block w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-500 dark:focus-visible:ring-primary-300';
const check = 'h-4 w-4 flex-none accent-primary-700 dark:accent-primary-300';
const wcagList = (Object.values(WCAG) as WcagRef[]).filter((w) => w.level !== 'AAA').sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

function load(): AgencyProject {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') return { ...emptyProject(), ...saved };
  } catch {
    /* ignore */
  }
  return emptyProject();
}

function download(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const fileSlug = (p: AgencyProject) =>
  (p.client || p.project || 'client')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'client';

function Step({ n, title, intro, children }: { n: number; title: string; intro: ReactNode; children: ReactNode }) {
  const id = `step-${n}`;
  return (
    <section aria-labelledby={id} className="scroll-mt-24 space-y-4 border-t border-gray-200 pt-10 first:border-0 first:pt-0 dark:border-gray-800">
      <h2 id={id} className="flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
        <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white dark:bg-primary-300 dark:text-gray-900">
          {n}
        </span>
        <span>
          <span className="sr-only">Step {n}: </span>
          {title}
        </span>
      </h2>
      <div className="prose-doc text-muted">{intro}</div>
      {children}
    </section>
  );
}

function Text({ label, hint, value, onChange, multiline, required }: { label: string; hint?: string; value: string; onChange: (v: string) => void; multiline?: boolean; required?: boolean }) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {!required && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea id={id} rows={4} className={field} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined} />
      ) : (
        <input id={id} className={field} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined} />
      )}
    </div>
  );
}

/** On-page preview of a generated document. Headings start at h3 so they nest under this page's outline. */
function DocPreview({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-3 text-sm leading-6">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h': {
            const H = (['h3', 'h4', 'h5'] as const)[b.level - 1];
            return (
              <H key={i} className={cx('font-semibold tracking-tight', b.level === 1 ? 'text-2xl' : b.level === 2 ? 'pt-3 text-lg' : 'pt-1 text-base')}>
                {b.text}
              </H>
            );
          }
          case 'p':
            return <p key={i}>{b.text}</p>;
          case 'note':
            return (
              <p key={i} className="border-l-4 border-primary-600 bg-primary-50 px-3 py-2 dark:border-primary-300 dark:bg-primary-900/30">
                {b.text}
              </p>
            );
          case 'meta':
            return (
              <dl key={i} className="grid gap-x-6 gap-y-1 rounded-lg bg-gray-50 p-3 sm:grid-cols-3 dark:bg-gray-800/60">
                {b.rows.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            );
          case 'ul':
            return (
              <ul key={i} className="list-disc space-y-1 pl-5">
                {b.items.map((x, j) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal space-y-1 pl-5">
                {b.items.map((x, j) => (
                  <li key={j}>{x}</li>
                ))}
              </ol>
            );
          case 'table':
            return (
              <div key={i} className="overflow-x-auto" tabIndex={0} role="region" aria-label={`Table: ${b.head.join(', ')}`}>
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="border border-gray-300 bg-gray-50 px-2 py-1.5 font-semibold dark:border-gray-600 dark:bg-gray-800">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k} className="border border-gray-300 px-2 py-1.5 align-top dark:border-gray-600">
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

const blankFinding = (): Omit<Finding, 'id'> => ({ page: '', issue: '', component: '', wcag: '', severity: 'major', recommendation: '' });

function FindingForm({ onAdd }: { onAdd: (f: Finding) => void }) {
  const [f, setF] = useState(blankFinding);
  const [error, setError] = useState('');
  const issueRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <form
      className="surface space-y-4 p-5"
      aria-labelledby={`${id}-title`}
      onSubmit={(e) => {
        e.preventDefault();
        if (!f.issue.trim()) {
          setError('Describe the issue before adding it.');
          issueRef.current?.focus();
          return;
        }
        onAdd({ ...f, id: `${Date.now()}` });
        setF((x) => ({ ...blankFinding(), page: x.page }));
        setError('');
        issueRef.current?.focus();
      }}
    >
      <h3 id={`${id}-title`} className="font-semibold">
        Add a finding
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Text label="Page or URL" value={f.page} onChange={(v) => set('page', v)} />
        <div className="space-y-1">
          <label htmlFor={`${id}-comp`} className="block text-sm font-semibold">
            Component <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={`${id}-comp`} className={field} value={f.component} onChange={(e) => set('component', e.target.value)}>
            <option value="">Not a specific component</option>
            {components
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-issue`} className="block text-sm font-semibold">
          Issue
        </label>
        <p id={`${id}-issue-hint`} className="text-sm text-muted">
          What happens, and who it affects. For example: “The menu button can’t be reached with Tab, so keyboard users can’t open navigation.”
        </p>
        {error && (
          <p id={`${id}-issue-error`} className="text-sm font-semibold text-red-700 dark:text-red-300">
            <span className="sr-only">Error: </span>
            {error}
          </p>
        )}
        <textarea
          ref={issueRef}
          id={`${id}-issue`}
          rows={2}
          className={field}
          value={f.issue}
          onChange={(e) => set('issue', e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-issue-hint${error ? ` ${id}-issue-error` : ''}`}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor={`${id}-wcag`} className="block text-sm font-semibold">
            WCAG criterion <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={`${id}-wcag`} className={field} value={f.wcag} onChange={(e) => set('wcag', e.target.value)}>
            <option value="">Not sure yet</option>
            {wcagList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} {w.name} ({w.level})
              </option>
            ))}
          </select>
        </div>
        <fieldset className="space-y-1">
          <legend className="text-sm font-semibold">Severity</legend>
          <div className="space-y-1">
            {SEVERITIES.map((s) => (
              <label key={s.id} className="flex items-start gap-2 text-sm">
                <input type="radio" name={`${id}-sev`} className={cx(check, 'mt-1')} checked={f.severity === s.id} onChange={() => set('severity', s.id as Severity)} />
                <span>
                  <span className="font-medium">{s.label}</span> <span className="text-muted">{s.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <Text label="Recommendation" value={f.recommendation} onChange={(v) => set('recommendation', v)} hint="How the redesign should fix it. Link to the component spec where one exists." />
      <Button as="button" type="submit" size="sm" className="btn-bold-primary">
        Add finding
      </Button>
    </form>
  );
}

export function DeliverablesBuilder() {
  const [p, setP] = useState<AgencyProject>(load);
  const [chosen, setChosen] = useState<DeliverableId[]>(DELIVERABLES.map((d) => d.id));
  const [preview, setPreview] = useState<DeliverableId>('scope');
  const [status, setStatus] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const previewId = useId();

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* storage unavailable */
    }
  }, [p]);

  const set = <K extends keyof AgencyProject>(k: K, v: AgencyProject[K]) => setP((x) => ({ ...x, [k]: v }));
  const flash = (msg: string) => {
    setStatus(msg);
    window.setTimeout(() => setStatus(''), 5000);
  };
  const toggleIn = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const addComponents = (slugs: string[]) => set('components', [...new Set([...p.components, ...slugs])]);
  const docs = DELIVERABLES.filter((d) => chosen.includes(d.id)).map((d) => buildDoc(d.id, p));
  const current = buildDoc(preview, p);
  const name = fileSlug(p);

  return (
    <div className="space-y-12">
      <Step n={1} title="About the project" intro={<p>This goes on the cover of every document. Everything you enter is saved in this browser as you type.</p>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Client" value={p.client} onChange={(v) => set('client', v)} required />
          <Text label="Project name" value={p.project} onChange={(v) => set('project', v)} required />
          <Text label="Your agency" value={p.agency} onChange={(v) => set('agency', v)} required />
          <Text label="Accessibility contact for the new site" hint="Goes in the accessibility statement." value={p.contact} onChange={(v) => set('contact', v)} />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Conformance target</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {(['WCAG 2.2 AA', 'WCAG 2.1 AA'] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm">
                <input type="radio" name="target" className={check} checked={p.target === t} onChange={() => set('target', t)} />
                {t}
                {t === 'WCAG 2.2 AA' && <span className="text-muted">(recommended)</span>}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Pages and templates in scope" hint="One per line, for example: Home, Product listing, Checkout." value={p.pages} onChange={(v) => set('pages', v)} multiline required />
          <Text label="Out of scope" hint="One per line, for example: Third-party chat widget." value={p.outOfScope} onChange={(v) => set('outOfScope', v)} multiline />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Browsers and assistive technology you’ll support and test</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SUPPORT_OPTIONS.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className={check} checked={p.support.includes(s)} onChange={() => set('support', toggleIn(p.support, s))} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
      </Step>

      <Step
        n={2}
        title="Components in scope"
        intro={<p>Pick the components the new design uses. Their specs, WCAG criteria and acceptance criteria are pulled into the documents automatically.</p>}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold">Start from a page type</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => {
              const slugs = [...new Set(ex.notes.map((n) => n.slug).filter((s): s is string => Boolean(s)))];
              return (
                <Button
                  key={ex.id}
                  size="sm"
                  weight="light"
                  color="gray"
                  onClick={() => {
                    addComponents(slugs);
                    flash(`Added the ${slugs.length} components from the ${ex.name} page.`);
                  }}
                >
                  Add {ex.name} components
                </Button>
              );
            })}
            {p.components.length > 0 && (
              <Button size="sm" weight="clear" color="gray" onClick={() => set('components', [])}>
                Clear all
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm font-medium" aria-live="polite">
          {p.components.length} of {components.length} components selected
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat) => {
            const list = byCategory(cat);
            const all = list.every((c) => p.components.includes(c.slug));
            return (
              <fieldset key={cat} className="surface p-4">
                <legend className="sr-only">{cat}</legend>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p aria-hidden="true" className="font-semibold">
                    {cat}
                  </p>
                  <button
                    type="button"
                    className="link text-sm"
                    onClick={() => set('components', all ? p.components.filter((s) => !list.some((c) => c.slug === s)) : [...new Set([...p.components, ...list.map((c) => c.slug)])])}
                  >
                    {all ? 'Clear' : 'Select all'}
                    <span className="sr-only"> {cat}</span>
                  </button>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {list.map((c) => (
                    <label key={c.slug} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className={check} checked={p.components.includes(c.slug)} onChange={() => set('components', toggleIn(p.components, c.slug))} />
                      {c.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
      </Step>

      <Step
        n={3}
        title="Baseline findings"
        intro={
          <p>
            Optional. Log what’s wrong with the current site as you audit it. Findings feed the baseline audit report and the known limitations in the accessibility statement.
          </p>
        }
      >
        <FindingForm
          onAdd={(f) => {
            set('findings', [...p.findings, f]);
            flash(`Finding added. ${p.findings.length + 1} recorded.`);
          }}
        />
        {p.findings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="mb-2 text-left font-semibold">{p.findings.length} finding{p.findings.length === 1 ? '' : 's'} recorded</caption>
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th scope="col" className="py-2 pr-3">Severity</th>
                  <th scope="col" className="py-2 pr-3">Page</th>
                  <th scope="col" className="py-2 pr-3">Issue</th>
                  <th scope="col" className="py-2 pr-3">WCAG</th>
                  <th scope="col" className="py-2"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {p.findings.map((f, i) => (
                  <tr key={f.id} className="border-b border-gray-100 align-top dark:border-gray-800">
                    <td className="py-2 pr-3 font-medium">{SEVERITIES.find((s) => s.id === f.severity)?.label}</td>
                    <td className="py-2 pr-3">{f.page || '—'}</td>
                    <td className="py-2 pr-3">{f.issue}</td>
                    <td className="py-2 pr-3">{f.wcag || '—'}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        className="link"
                        onClick={() => {
                          set('findings', p.findings.filter((x) => x.id !== f.id));
                          flash('Finding removed.');
                        }}
                      >
                        Remove<span className="sr-only"> finding {i + 1}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Step>

      <Step n={4} title="Preview and export" intro={<p>Choose the documents to export. HTML files open in any browser and print to a clean PDF. Markdown pastes into Confluence, Notion, GitHub or Google Docs.</p>}>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Documents to export</legend>
          <ul className="grid gap-2 sm:grid-cols-2">
            {DELIVERABLES.map((d) => (
              <li key={d.id}>
                <div className="surface flex h-full gap-3 p-3 text-sm">
                  <input
                    id={`${previewId}-${d.id}`}
                    type="checkbox"
                    className={cx(check, 'mt-0.5')}
                    checked={chosen.includes(d.id)}
                    onChange={() => setChosen(toggleIn(chosen, d.id))}
                    aria-describedby={`${previewId}-${d.id}-desc`}
                  />
                  <div>
                    <label htmlFor={`${previewId}-${d.id}`} className="block cursor-pointer font-semibold">
                      {d.name}
                    </label>
                    <p id={`${previewId}-${d.id}-desc`} className="text-muted">
                      <span className="font-medium">{d.when}.</span> {d.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </fieldset>
        <div className="flex flex-wrap gap-2">
          <Button
            className="btn-bold-primary"
            disabled={!docs.length}
            onClick={() => {
              download(`${name}-accessibility-deliverables.html`, toHtml(docs, p), 'text/html');
              flash(`Downloaded ${docs.length} document${docs.length === 1 ? '' : 's'} as HTML. Open the file and print to save a PDF.`);
            }}
          >
            Download as HTML (print to PDF)
          </Button>
          <Button
            weight="light"
            disabled={!docs.length}
            onClick={() => {
              download(`${name}-accessibility-deliverables.md`, docs.map(toMarkdown).join('\n\n---\n\n'), 'text/markdown');
              flash(`Downloaded ${docs.length} document${docs.length === 1 ? '' : 's'} as Markdown.`);
            }}
          >
            Download as Markdown
          </Button>
        </div>
        <p role="status" className="text-sm font-medium">
          {status}
        </p>

        <div className="surface overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/60">
            <div className="space-y-1">
              <label htmlFor={previewId} className="block text-sm font-semibold">
                Preview
              </label>
              <select id={previewId} className={cx(field, 'w-auto')} value={preview} onChange={(e) => setPreview(e.target.value as DeliverableId)}>
                {DELIVERABLES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              size="sm"
              weight="light"
              color="gray"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(toMarkdown(current));
                  flash(`${current.title} copied as Markdown.`);
                } catch {
                  flash('Couldn’t copy. Use Download as Markdown instead.');
                }
              }}
            >
              Copy this document
            </Button>
          </div>
          <div className="max-h-[36rem] overflow-y-auto p-5" tabIndex={0} role="region" aria-label={`Preview: ${current.title}`}>
            <DocPreview blocks={current.blocks} />
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-200 pt-6 dark:border-gray-800">
          <h3 className="font-semibold">Share or switch projects</h3>
          <p className="text-sm text-muted">Save the project as a file to send to a teammate or keep with the client’s files. Open it later to pick up where you left off.</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              weight="light"
              color="gray"
              onClick={() => {
                download(`${name}-a11y-project.json`, JSON.stringify({ app: 'a11y-hub', kind: 'agency-project', version: 1, project: p }, null, 2), 'application/json');
                flash('Project file downloaded.');
              }}
            >
              Save project file
            </Button>
            <Button size="sm" weight="light" color="gray" onClick={() => fileRef.current?.click()}>
              Open project file
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                try {
                  const data = JSON.parse(await file.text());
                  if (data?.app !== 'a11y-hub' || data.kind !== 'agency-project') throw new Error('not ours');
                  setP({ ...emptyProject(), ...data.project });
                  flash(`Opened ${data.project?.project || data.project?.client || 'the project'}.`);
                } catch {
                  flash('Couldn’t read that file. Choose a project file saved from this page.');
                }
              }}
            />
            <Button
              size="sm"
              weight="clear"
              color="gray"
              onClick={() => {
                if (window.confirm('Start a new project? This clears everything entered on this page. Save a project file first if you need it.')) {
                  setP(emptyProject());
                  flash('Started a new project.');
                }
              }}
            >
              Start a new project
            </Button>
          </div>
        </div>
      </Step>
    </div>
  );
}
