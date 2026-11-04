import { useId, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec, Variant } from '../data/types';
import { wcagUrl } from '../data/wcag';
import type { Check } from '../lib/worksheetItems';
import { QA_ENV } from '../lib/worksheetItems';
import type { WorksheetEntry } from '../lib/worksheetStore';
import { cx } from '../ui';

const SEVERITY = [
  { id: 'blocker', label: 'Blocker', hint: 'Someone can’t complete the task at all.' },
  { id: 'major', label: 'Major', hint: 'The task is possible but hard, slow or confusing.' },
  { id: 'minor', label: 'Minor', hint: 'An annoyance that doesn’t stop the task.' },
];

/** Which success criteria a failure in each test group usually maps to, best first. */
const LIKELY: Record<string, string[]> = {
  Keyboard: ['2.1.1', '2.1.2', '2.4.3', '2.4.7'],
  'Screen reader': ['4.1.2', '4.1.3', '1.3.1', '2.5.3'],
  'Content matches the handoff': ['1.1.1', '3.3.2', '2.4.4', '2.4.6', '3.3.1', '3.3.3'],
  Visual: ['1.4.3', '1.4.11', '2.4.7', '1.4.1', '2.5.8', '1.4.10'],
};

const field =
  'block w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-500 dark:focus-visible:ring-primary-300';

export function BugReport({ spec, variant, check, note, entry }: { spec: ComponentSpec; variant?: Variant; check: Check; note?: string; entry: WorksheetEntry }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const likely = LIKELY[check.group] ?? [];
  const defaultWcag = spec.wcag.find((w) => likely.includes(w.id))?.id ?? spec.wcag[0]?.id ?? '';
  const [wcag, setWcag] = useState(defaultWcag);
  const [severity, setSeverity] = useState('major');
  const [steps, setSteps] = useState(
    [`Go to ${entry.where.trim() || `the ${spec.name.toLowerCase()}`}.`, check.group === 'Keyboard' ? 'Use only the keyboard.' : check.group === 'Screen reader' ? 'Turn on the screen reader.' : '', check.text.replace(/\.$/, '') + '.']
      .filter(Boolean)
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n'),
  );
  const [copied, setCopied] = useState(false);

  const criterion = spec.wcag.find((w) => w.id === wcag);
  const env = QA_ENV.filter(({ key }) => entry.env[key]?.trim()).map(({ key, label }) => `- ${label}: ${entry.env[key].trim()}`);
  const expected = [check.detail?.replace(/^Expected:\s*/, ''), check.value ? `“${check.value}”` : ''].filter(Boolean).join(' ');
  const report = [
    `## [A11y] ${spec.name}${variant ? ` (${variant.label})` : ''}: ${check.text.replace(/\.$/, '')}`,
    '',
    `**Severity:** ${SEVERITY.find((s) => s.id === severity)?.label}`,
    criterion ? `**WCAG:** ${criterion.id} ${criterion.name} (Level ${criterion.level}) ${wcagUrl(criterion)}` : '',
    entry.where.trim() ? `**Where:** ${entry.where.trim()}` : '',
    '',
    '### Steps to reproduce',
    steps.trim(),
    '',
    '### Expected',
    expected || check.text,
    '',
    '### Actual',
    note?.trim() || '_Describe what happened._',
    ...(env.length ? ['', '### Environment', ...env] : []),
  ]
    .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mt-2">
      <Button size="sm" weight="light" color="red" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide bug report' : 'Write bug report'}
      </Button>
      <div id={`${id}-panel`} hidden={!open} className="mt-3 space-y-4 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200 dark:bg-gray-800/50 dark:ring-gray-700">
        <fieldset>
          <legend className="text-sm font-semibold">Severity</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {SEVERITY.map((s) => (
              <label key={s.id} className={cx('flex cursor-pointer gap-2 rounded-lg bg-white p-2 text-sm ring-1 dark:bg-gray-900', severity === s.id ? 'ring-2 ring-primary-700 dark:ring-primary-300' : 'ring-gray-300 dark:ring-gray-600')}>
                <input type="radio" name={`${id}-sev`} value={s.id} checked={severity === s.id} onChange={() => setSeverity(s.id)} className="mt-1 accent-primary-600 dark:accent-primary-300" />
                <span>
                  <span className="block font-semibold">{s.label}</span>
                  <span className="text-muted">{s.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-wcag`} className="block text-sm font-semibold">
            WCAG criterion
          </label>
          <select id={`${id}-wcag`} value={wcag} onChange={(e) => setWcag(e.target.value)} className={field}>
            {spec.wcag.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} {w.name} ({w.level})
              </option>
            ))}
            <option value="">Not sure</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-steps`} className="block text-sm font-semibold">
            Steps to reproduce
          </label>
          <textarea id={`${id}-steps`} rows={4} value={steps} onChange={(e) => setSteps(e.target.value)} className={field} />
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold">Preview</p>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-900 p-3 text-[13px] leading-6 text-gray-50" tabIndex={0} aria-label="Bug report preview">
            {report}
          </pre>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="btn-bold-primary" onClick={copy}>
            Copy bug report
          </Button>
          <span role="status" className="text-sm text-muted">
            {copied ? 'Bug report copied.' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
