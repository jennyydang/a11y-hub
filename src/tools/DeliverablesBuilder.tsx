import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { byCategory, categories, components } from '../data/components';
import { examples } from '../examples';
import { WCAG } from '../data/wcag';
import type { WcagRef } from '../data/types';
import {
  DELIVERABLES,
  SEVERITIES,
  SOURCES,
  STATUSES,
  SUPPORT_OPTIONS,
  buildDoc,
  emptyProject,
  isOutstanding,
  issueRef,
  lines,
  normalizeProject,
  ownerLabel,
  responsibility,
  type IssueOwner,
  type IssueStatus,
  type TestRecord,
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
    if (saved && typeof saved === 'object') return normalizeProject(saved);
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
          case 'code':
            return (
              <pre key={i} className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 font-mono text-xs ring-1 ring-gray-200 dark:bg-gray-800/60 dark:ring-gray-700">
                <code>{b.text.trim()}</code>
              </pre>
            );
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

type NewFinding = Omit<Finding, 'id' | 'n' | 'status' | 'retestDate' | 'retestNote'>;
const blankFinding = (): NewFinding => ({ source: 'delivery', owner: 'agency', page: '', issue: '', component: '', wcag: '', severity: 'major', recommendation: '' });

function Radios<T extends string>({ legend, name, value, options, onChange }: { legend: string; name: string; value: T; options: { id: T; label: string; hint?: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset className="space-y-1">
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className="space-y-1">
        {options.map((o) => (
          <label key={o.id} className="flex items-start gap-2 text-sm">
            <input type="radio" name={name} className={cx(check, 'mt-1')} checked={value === o.id} onChange={() => onChange(o.id)} />
            <span>
              <span className="font-medium">{o.label}</span>
              {o.hint && <span className="text-muted"> {o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FindingForm({ onAdd, owners }: { onAdd: (f: NewFinding) => void; owners: { id: IssueOwner; label: string; hint?: string }[] }) {
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
        onAdd(f);
        setF((x) => ({ ...blankFinding(), page: x.page, source: x.source, owner: x.owner }));
        setError('');
        issueRef.current?.focus();
      }}
    >
      <h3 id={`${id}-title`} className="font-semibold">
        Log an issue
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Radios legend="Found during" name={`${id}-src`} value={f.source} options={SOURCES} onChange={(v) => set('source', v)} />
        <Radios legend="Owner" name={`${id}-own`} value={f.owner} options={owners} onChange={(v) => set('owner', v)} />
      </div>
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
        <Radios legend="Severity" name={`${id}-sev`} value={f.severity} options={SEVERITIES} onChange={(v) => set('severity', v as Severity)} />
      </div>
      <Text label="Remediation" value={f.recommendation} onChange={(v) => set('recommendation', v)} hint="How to fix it. Point to the component documentation where one exists." />
      <Button as="button" type="submit" size="sm" className="btn-bold-primary">
        Add to the log
      </Button>
    </form>
  );
}

export function DeliverablesBuilder() {
  const [p, setP] = useState<AgencyProject>(load);
  const [chosen, setChosen] = useState<DeliverableId[]>(DELIVERABLES.filter((d) => d.required).map((d) => d.id));
  const [preview, setPreview] = useState<DeliverableId>('components');
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
  const pages = lines(p.pages);
  const owners: { id: IssueOwner; label: string }[] = (['agency', 'client', 'shared'] as IssueOwner[]).map((o) => ({ id: o, label: ownerLabel(o, p) }));
  const setTest = (key: string, patch: Partial<TestRecord>) =>
    setP((x) => ({ ...x, tests: { ...x.tests, [key]: { automated: false, manual: false, date: '', ...(x.tests[key] as TestRecord | undefined), ...patch } } }));
  const updateFinding = (id: string, patch: Partial<Finding>) => setP((x) => ({ ...x, findings: x.findings.map((f) => (f.id === id ? { ...f, ...patch } : f)) }));
  const testedCount = [...p.components, ...pages.map((pg) => `page:${pg}`)].filter((k) => p.tests[k]?.automated && p.tests[k]?.manual).length;
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
        title="Test results"
        intro={<p>Record which delivered components and templates have had automated and manual testing. Results feed the testing summary and the conformance summary. A component passes when it’s fully tested and has no outstanding issues.</p>}
      >
        {p.components.length + pages.length === 0 ? (
          <p className="text-sm text-muted">Add components in step 2 and templates in step 1 to record their testing.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="mb-2 text-left font-semibold">
                {testedCount} of {p.components.length + pages.length} fully tested
              </caption>
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th scope="col" className="py-2 pr-3">Component or template</th>
                  <th scope="col" className="py-2 pr-3">Automated (axe-core)</th>
                  <th scope="col" className="py-2 pr-3">Manual (keyboard, screen reader, zoom)</th>
                  <th scope="col" className="py-2 pr-3">Date tested</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...components.filter((c) => p.components.includes(c.slug)).map((c) => [c.slug, c.name] as const),
                  ...pages.map((pg) => [`page:${pg}`, `${pg} (template)`] as const),
                ].map(([key, label]) => {
                  const t = p.tests[key] ?? { automated: false, manual: false, date: '' };
                  return (
                    <tr key={key} className="border-b border-gray-100 dark:border-gray-800">
                      <th scope="row" className="py-2 pr-3 font-medium">
                        {label}
                      </th>
                      <td className="py-2 pr-3">
                        <input type="checkbox" className={check} aria-label={`Automated testing done: ${label}`} checked={t.automated} onChange={() => setTest(key, { automated: !t.automated })} />
                      </td>
                      <td className="py-2 pr-3">
                        <input type="checkbox" className={check} aria-label={`Manual testing done: ${label}`} checked={t.manual} onChange={() => setTest(key, { manual: !t.manual })} />
                      </td>
                      <td className="py-2 pr-3">
                        <input type="date" className={cx(field, 'w-auto py-1')} aria-label={`Date tested: ${label}`} value={t.date} onChange={(e) => setTest(key, { date: e.target.value })} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Step>

      <Step
        n={4}
        title="Issue log"
        intro={
          <p>
            Log each defect, who owns it and where its fix stands. Issues from testing delivered work go into the issue and remediation log, testing summary and conformance summary. Issues from the
            baseline audit of the current site go into the baseline audit report.
          </p>
        }
      >
        <div className="surface space-y-1 p-4 text-sm leading-6">
          <p className="font-semibold">Who owns what</p>
          <ul className="list-disc pl-5">
            {responsibility(p).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <FindingForm
          owners={owners}
          onAdd={(f) => {
            const n = Math.max(0, ...p.findings.map((x) => x.n)) + 1;
            set('findings', [...p.findings, { ...f, id: `${Date.now()}`, n, status: 'open', retestDate: '', retestNote: '' }]);
            flash(`A11Y-${String(n).padStart(3, '0')} added to the log.`);
          }}
        />
        {p.findings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="mb-2 text-left font-semibold">
                {p.findings.length} issue{p.findings.length === 1 ? '' : 's'} logged, {p.findings.filter((f) => f.source === 'delivery' && isOutstanding(f)).length} outstanding in delivered work
              </caption>
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th scope="col" className="py-2 pr-3">Issue</th>
                  <th scope="col" className="py-2 pr-3">Owner</th>
                  <th scope="col" className="py-2 pr-3">Status</th>
                  <th scope="col" className="py-2 pr-3">Retest</th>
                  <th scope="col" className="py-2"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {p.findings.map((f) => {
                  const ref = issueRef(f);
                  return (
                    <tr key={f.id} className="border-b border-gray-100 align-top dark:border-gray-800">
                      <th scope="row" className="max-w-xs py-2 pr-3 font-normal">
                        <span className="block font-semibold">
                          {ref} · {SEVERITIES.find((x) => x.id === f.severity)?.label}
                          {f.source === 'baseline' && <span className="font-normal text-muted"> · baseline</span>}
                        </span>
                        {f.issue}
                        <span className="block text-muted">{[f.page, components.find((c) => c.slug === f.component)?.name, f.wcag && `WCAG ${f.wcag}`].filter(Boolean).join(' · ')}</span>
                      </th>
                      <td className="py-2 pr-3">
                        <select className={cx(field, 'w-auto py-1')} aria-label={`Owner of ${ref}`} value={f.owner} onChange={(e) => updateFinding(f.id, { owner: e.target.value as IssueOwner })}>
                          {owners.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 pr-3">
                        <select className={cx(field, 'w-auto py-1')} aria-label={`Status of ${ref}`} value={f.status} onChange={(e) => updateFinding(f.id, { status: e.target.value as IssueStatus })}>
                          {STATUSES.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="space-y-1 py-2 pr-3">
                        <input type="date" className={cx(field, 'w-auto py-1')} aria-label={`Retest date for ${ref}`} value={f.retestDate} onChange={(e) => updateFinding(f.id, { retestDate: e.target.value })} />
                        <input className={cx(field, 'py-1')} aria-label={`Retest result for ${ref}`} placeholder="Retest result" value={f.retestNote} onChange={(e) => updateFinding(f.id, { retestNote: e.target.value })} />
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          className="link"
                          onClick={() => {
                            if (window.confirm(`Delete ${ref} from the log? To close an issue, set its status instead.`)) {
                              set('findings', p.findings.filter((x) => x.id !== f.id));
                              flash(`${ref} deleted.`);
                            }
                          }}
                        >
                          Delete<span className="sr-only"> {ref}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Step>

      <Step n={5} title="Preview and export" intro={<p>Choose the documents to export. HTML files open in any browser and print to a clean PDF. Markdown pastes into Confluence, Notion, GitHub or Google Docs.</p>}>
        {[
          { title: 'Required at delivery', list: DELIVERABLES.filter((d) => d.required) },
          { title: 'Supporting documents', list: DELIVERABLES.filter((d) => !d.required) },
        ].map((g) => (
          <fieldset key={g.title} className="space-y-2">
            <legend className="text-sm font-semibold">
              {g.title} <span className="font-normal text-muted">({g.list.filter((d) => chosen.includes(d.id)).length} of {g.list.length} chosen)</span>
            </legend>
            <ul className="grid gap-2 sm:grid-cols-2">
              {g.list.map((d) => (
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
                        {d.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
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
                {[true, false].map((req) => (
                  <optgroup key={String(req)} label={req ? 'Required at delivery' : 'Supporting documents'}>
                    {DELIVERABLES.filter((d) => d.required === req).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </optgroup>
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
                  setP(normalizeProject(data.project ?? {}));
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
