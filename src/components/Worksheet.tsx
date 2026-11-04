import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Button } from '@fluid-design/fluid-ui';
import { useSearchParams } from 'react-router-dom';
import type { ComponentSpec, Variant } from '../data/types';
import { lintField, worksheets, type ContentField, type DesignRequirement } from '../data/requirements';
import { useWorksheet, type WorksheetEntry } from '../lib/worksheetStore';
import { Checkbox, TextField, cx } from '../ui';

const SHEETS = ['content', 'design'] as const;

const forVariant = <T extends { variants?: string[] }>(items: T[], variant?: Variant) =>
  items.filter((i) => !i.variants || !variant || i.variants.includes(variant.id));

function toMarkdown(spec: ComponentSpec, variant: Variant | undefined, fields: ContentField[], design: DesignRequirement[], e: WorksheetEntry) {
  const lines = [`# ${spec.name}: accessibility handoff`, ''];
  if (e.where.trim()) lines.push(`**Where it’s used:** ${e.where.trim()}`);
  if (variant) lines.push(`**Variation:** ${variant.label}`);
  lines.push('', '## Content', '');
  fields.forEach((f) => {
    const v = (e.fields[f.id] ?? '').trim();
    const status = v ? '' : f.required ? ' ⚠️ MISSING' : ' (optional, left blank)';
    lines.push(`- **${f.label}** → \`${f.target}\`${status}`);
    if (v) v.split('\n').forEach((l) => lines.push(`  - ${l}`));
  });
  lines.push('', '## Design', '');
  design.forEach((d) => lines.push(`- [${e.design.includes(d.text) ? 'x' : ' '}] ${d.text} _${d.check}_`));
  if (e.notes.trim()) lines.push('', '## Design notes', '', e.notes.trim());
  return lines.join('\n') + '\n';
}

function FieldInput({ field, value, onChange }: { field: ContentField; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const lints = lintField(field.kind, value);
  const describedBy = [`${id}-guide`, `${id}-ex`, lints.length ? `${id}-lint` : null].filter(Boolean).join(' ');
  const inputClass = cx(
    'block w-full rounded-lg bg-white px-3 py-2 text-base text-gray-900 ring-1 ring-gray-400 placeholder:text-gray-500 outline-none',
    'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-500 dark:focus-visible:ring-primary-300 dark:focus-visible:ring-offset-gray-900',
  );
  const filled = value.trim().length > 0;

  return (
    <li className="surface space-y-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="font-semibold">
          {field.label}
        </label>
        <span className="chip bg-gray-100 font-mono font-normal text-gray-800 dark:bg-gray-800 dark:text-gray-100">{field.target}</span>
        {field.required ? (
          <span className={cx('chip', filled ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100' : 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100')}>
            {filled ? '✓ Filled' : 'Required'}
          </span>
        ) : (
          <span className="chip bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">Optional</span>
        )}
      </div>
      <p id={`${id}-guide`} className="text-sm leading-6 text-muted">
        {field.guidance}
      </p>
      {field.multiline ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} className={inputClass} />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} className={inputClass} />
      )}
      <div id={`${id}-ex`} className="grid gap-1 text-sm sm:grid-cols-2">
        <p className="whitespace-pre-line">
          <span className="font-semibold text-emerald-800 dark:text-emerald-300">Example: </span>
          {field.good}
        </p>
        {field.bad && (
          <p className="whitespace-pre-line">
            <span className="font-semibold text-red-700 dark:text-red-300">Avoid: </span>
            {field.bad}
          </p>
        )}
      </div>
      {lints.length > 0 && (
        <ul id={`${id}-lint`} className="space-y-1 rounded-lg bg-amber-50 p-3 text-sm text-amber-950 ring-1 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-50 dark:ring-amber-700">
          {lints.map((l) => (
            <li key={l.message} className="flex gap-2">
              <span aria-hidden="true">⚠</span>
              <span>
                <span className="sr-only">Suggestion: </span>
                {l.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Worksheet({ spec, variant }: { spec: ComponentSpec; variant?: Variant }) {
  const sheet = worksheets[spec.slug];
  const { entry, setWhere, setField, toggleDesign, setNotes, clear } = useWorksheet(spec.slug);
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const notesId = useId();

  const requested = params.get('sheet');
  const index = Math.max(0, SHEETS.indexOf(requested as (typeof SHEETS)[number]));

  // Arriving from a role guide: bring the worksheet into view.
  useEffect(() => {
    if (requested) rootRef.current?.scrollIntoView({ block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.slug]);

  if (!sheet) return null;
  const fields = forVariant(sheet.content, variant);
  const design = forVariant(sheet.design, variant);
  const required = fields.filter((f) => f.required);
  const filled = required.filter((f) => (entry.fields[f.id] ?? '').trim()).length;
  const checked = design.filter((d) => entry.design.includes(d.text)).length;

  const setSheet = (i: number) => {
    const next = new URLSearchParams(params);
    next.set('sheet', SHEETS[i]);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const md = () => toMarkdown(spec, variant, fields, design, entry);
  const flash = (msg: string) => {
    setStatus(msg);
    window.setTimeout(() => setStatus(''), 4000);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md());
      flash('Handoff copied as Markdown.');
    } catch {
      flash('Couldn’t copy. Try Download instead.');
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([md()], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.slug}${variant ? `-${variant.id}` : ''}-handoff.md`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Handoff downloaded.');
  };
  const reset = () => {
    if (window.confirm(`Clear everything entered in the ${spec.name} worksheet?`)) {
      clear();
      flash('Worksheet cleared.');
    }
  };

  const tabClass = ({ selected }: { selected: boolean }) =>
    cx(
      'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold focus-ring',
      selected
        ? 'bg-white text-gray-900 shadow ring-1 ring-black/10 dark:bg-gray-700 dark:text-white dark:ring-white/20'
        : 'text-gray-700 hover:bg-white/60 dark:text-gray-200 dark:hover:bg-gray-800',
    );

  return (
    <div ref={rootRef} className="scroll-mt-24 space-y-4">
      <TextField
        label="Where is this being used?"
        hint="So the handoff is easy to match to a screen. For example: Checkout page, “Save card” button."
        value={entry.where}
        onChange={(e) => setWhere(e.target.value)}
      />
      {variant && (
        <p className="text-sm text-muted">
          Showing what’s needed for the <strong className="text-gray-900 dark:text-gray-50">{variant.label}</strong> variation. Switch variations
          in the live example to see what changes.
        </p>
      )}

      <Tab.Group selectedIndex={index} onChange={setSheet}>
        <Tab.List aria-label="Worksheet for" className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800/70">
          <Tab className={tabClass}>
            Content
            <span className="text-xs font-normal">
              {filled}/{required.length}
              <span className="sr-only"> required fields filled</span>
            </span>
          </Tab>
          <Tab className={tabClass}>
            Design
            <span className="text-xs font-normal">
              {checked}/{design.length}
              <span className="sr-only"> requirements met</span>
            </span>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-3">
          <Tab.Panel as={Fragment}>
            <div className="space-y-3 focus-ring rounded-xl">
              <p className="text-sm leading-6">
                <strong>For content designers.</strong> Write the words this component needs. Frontend will put each one where the
                code chip says. Anything marked Required must be filled before build.
              </p>
              <ul className="space-y-3">
                {fields.map((f) => (
                  <FieldInput key={f.id} field={f} value={entry.fields[f.id] ?? ''} onChange={(v) => setField(f.id, v)} />
                ))}
              </ul>
            </div>
          </Tab.Panel>
          <Tab.Panel as={Fragment}>
            <div className="space-y-3 focus-ring rounded-xl">
              <p className="text-sm leading-6">
                <strong>For designers.</strong> Decisions to make and check in your design before handoff. Tick each one once your
                design meets it.
              </p>
              <fieldset className="surface p-5">
                <legend className="sr-only">{spec.name} design requirements</legend>
                <div className="space-y-4">
                  {design.map((d) => (
                    <Checkbox key={d.text} label={d.text} description={d.check} checked={entry.design.includes(d.text)} onChange={() => toggleDesign(d.text)} />
                  ))}
                </div>
              </fieldset>
              <div className="space-y-1.5">
                <label htmlFor={notesId} className="block text-sm font-semibold">
                  Design notes
                </label>
                <p id={`${notesId}-hint`} className="text-sm text-muted">
                  Link to the design file, and note any exceptions or decisions frontend should know about.
                </p>
                <textarea
                  id={notesId}
                  rows={3}
                  value={entry.notes}
                  onChange={(e) => setNotes(e.target.value)}
                  aria-describedby={`${notesId}-hint`}
                  className="block w-full rounded-lg bg-white px-3 py-2 text-base text-gray-900 ring-1 ring-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-500 dark:focus-visible:ring-primary-300 dark:focus-visible:ring-offset-gray-900"
                />
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
        <Button size="sm" className="btn-bold-primary" onClick={copy}>
          Copy handoff as Markdown
        </Button>
        <Button size="sm" weight="light" color="gray" onClick={download}>
          Download .md
        </Button>
        <Button size="sm" weight="clear" color="gray" onClick={reset}>
          Clear worksheet
        </Button>
        <span role="status" className="text-sm text-muted">
          {status}
        </span>
      </div>
      <p className="text-xs text-muted">Saved in this browser only. Copy or download it to share with your team.</p>
    </div>
  );
}
