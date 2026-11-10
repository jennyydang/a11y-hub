import { fieldTranslation } from '../lib/translation';
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Tab } from '@headlessui/react';
import { Button } from '@fluid-design/fluid-ui';
import { useSearchParams } from 'react-router-dom';
import type { ComponentSpec, Variant } from '../data/types';
import { lintField, type ContentField } from '../data/requirements';
import { useWorksheet, type QaResult, type WorksheetEntry } from '../lib/worksheetStore';
import { QA_ENV, SHEETS, contentFields, designRequirements, frontendChecks, groupBy, qaCases, type Check } from '../lib/worksheetItems';
import { Checkbox, TextField, cx } from '../ui';
import { BugReport } from './BugReport';
import { findComponent } from '../data/components';

const QA_LABELS: Record<QaResult, string> = { pass: 'Pass', fail: 'Fail', na: 'N/A' };

const inputClass = cx(
  'block w-full rounded-lg bg-white px-3 py-2 text-base text-gray-900 ring-1 ring-gray-400 placeholder:text-gray-500 outline-none',
  'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-500 dark:focus-visible:ring-primary-300 dark:focus-visible:ring-offset-gray-900',
);

function toMarkdown(spec: ComponentSpec, variant: Variant | undefined, e: WorksheetEntry) {
  const fields = contentFields(spec, variant);
  const design = designRequirements(spec, variant);
  const fe = frontendChecks(spec, variant, e);
  const qa = qaCases(spec, variant, e);
  const lines = [`# ${spec.name}: accessibility handoff`, ''];
  if (e.where.trim()) lines.push(`**Where it’s used:** ${e.where.trim()}  `);
  if (variant) lines.push(`**Variation:** ${variant.label}`);

  lines.push('', '## Content', '');
  fields.forEach((f) => {
    const v = (e.fields[f.id] ?? '').trim();
    const status = v ? '' : f.required ? ' ⚠️ MISSING' : ' (optional, left blank)';
    const tr = fieldTranslation(f);
    lines.push(`- **${f.label}** → \`${f.target}\`${status} _(${tr.translate ? `translate; ${tr.audience.toLowerCase()}` : 'don’t translate'})_`);
    if (v) v.split('\n').forEach((l) => lines.push(`  - ${l}`));
  });

  lines.push('', '## Design', '');
  design.forEach((d) => lines.push(`- [${e.design.includes(d.text) ? 'x' : ' '}] ${d.text} _${d.check}_`));
  if (e.notes.trim()) lines.push('', '**Design notes:**', '', e.notes.trim());

  lines.push('', '## Frontend', '');
  groupBy(fe).forEach(([group, checks]) => {
    lines.push(`**${group}**`, '');
    checks.forEach((c) => lines.push(`- [${e.frontend.includes(c.id) ? 'x' : ' '}] ${c.text}${c.value ? ` “${c.value.replace(/\n/g, ' / ')}”` : ''}${c.waiting ? ' ⚠️ waiting on content' : ''}`));
    lines.push('');
  });
  if (e.frontendNotes.trim()) lines.push('**Frontend notes:**', '', e.frontendNotes.trim(), '');

  const results = qa.map((c) => e.qa[c.id]?.result);
  lines.push(
    '## QA',
    '',
    `${results.filter((r) => r === 'pass').length} passed · ${results.filter((r) => r === 'fail').length} failed · ${results.filter((r) => r === 'na').length} N/A · ${results.filter((r) => !r).length} not tested`,
    '',
  );
  QA_ENV.forEach(({ key, label }) => e.env[key]?.trim() && lines.push(`- ${label}: ${e.env[key].trim()}`));
  lines.push('', '| Result | Test | Notes |', '| --- | --- | --- |');
  qa.forEach((c) => {
    const r = e.qa[c.id];
    const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(`| ${r ? (r.result === 'fail' ? '❌ Fail' : r.result === 'pass' ? '✅ Pass' : 'N/A') : '—'} | ${cell(`${c.group}: ${c.text}`)} | ${cell(r?.note ?? '')} |`);
  });
  return lines.join('\n') + '\n';
}

function NotesField({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <p id={`${id}-hint`} className="text-sm text-muted">
        {hint}
      </p>
      <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={`${id}-hint`} className={inputClass} />
    </div>
  );
}

function Intro({ who, children }: { who: string; children: ReactNode }) {
  return (
    <p className="text-sm leading-6">
      <strong>{who}</strong> {children}
    </p>
  );
}

function Quote({ value }: { value: string }) {
  return (
    <span className="mt-1 block whitespace-pre-line rounded-md bg-gray-50 px-3 py-2 font-medium text-gray-900 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-700">
      {value}
    </span>
  );
}

function FrontendCheck({ check, checked, onToggle }: { check: Check; checked: boolean; onToggle: () => void }) {
  return (
    <Checkbox
      label={check.text}
      checked={checked}
      onChange={onToggle}
      description={
        check.value || check.detail ? (
          <>
            {check.waiting && <span className="chip mr-1 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100">Waiting</span>}
            {check.detail}
            {check.value && <Quote value={check.value} />}
          </>
        ) : undefined
      }
    />
  );
}

function QaCase({ check, result, note, onResult, onNote, report }: { check: Check; result?: QaResult; note?: string; onResult: (r: QaResult) => void; onNote: (n: string) => void; report: ReactNode }) {
  const id = useId();
  return (
    <li className="py-3">
      <fieldset aria-describedby={check.detail || check.value ? `${id}-detail` : undefined}>
        <legend className="text-sm font-medium leading-6">{check.text}</legend>
        {(check.detail || check.value) && (
          <div id={`${id}-detail`} className="text-sm leading-6 text-muted">
            {check.detail}
            {check.value && <Quote value={check.value} />}
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(QA_LABELS) as QaResult[]).map((r) => (
            <label
              key={r}
              className={cx(
                'inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-600 dark:has-[:focus-visible]:ring-primary-300',
                result === r
                  ? r === 'pass'
                    ? 'bg-emerald-50 text-emerald-900 ring-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-50 dark:ring-emerald-400'
                    : r === 'fail'
                      ? 'bg-red-50 text-red-900 ring-red-600 dark:bg-red-900/50 dark:text-red-50 dark:ring-red-400'
                      : 'bg-gray-100 text-gray-900 ring-gray-500 dark:bg-gray-700 dark:text-gray-50 dark:ring-gray-400'
                  : 'text-gray-800 ring-gray-300 hover:bg-gray-50 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-800',
              )}
            >
              <input type="radio" name={`${id}-result`} value={r} checked={result === r} onChange={() => onResult(r)} className="h-4 w-4 accent-primary-600 dark:accent-primary-300" />
              {result === r && r === 'pass' && <span aria-hidden="true">✓</span>}
              {result === r && r === 'fail' && <span aria-hidden="true">✕</span>}
              {QA_LABELS[r]}
            </label>
          ))}
        </div>
      </fieldset>
      {result === 'fail' && (
        <div className="mt-2">
          <TextField label="What happened?" hint="What you heard or saw instead." value={note ?? ''} onChange={(e) => onNote(e.target.value)} />
          {report}
        </div>
      )}
    </li>
  );
}

function TranslateChip({ field }: { field: ContentField }) {
  const t = fieldTranslation(field);
  const label = !t.translate ? 'Don’t translate' : t.audience === 'Visible' ? 'Translate' : `Translate · ${t.audience.toLowerCase()}`;
  return (
    <span className={cx('chip', t.translate ? 'bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-100' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200')}>
      {label}
    </span>
  );
}

function FieldInput({ field, value, onChange }: { field: ContentField; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const lints = lintField(field.kind, value);
  const describedBy = [`${id}-guide`, `${id}-ex`, lints.length ? `${id}-lint` : null].filter(Boolean).join(' ');
  const filled = value.trim().length > 0;

  return (
    <li className="surface space-y-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="font-semibold">
          {field.label}
        </label>
        <span className="chip bg-gray-100 font-mono font-normal text-gray-800 dark:bg-gray-800 dark:text-gray-100">{field.target}</span>
        <TranslateChip field={field} />
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
        {fieldTranslation(field).audience !== 'Visible' || !fieldTranslation(field).translate ? ` ${fieldTranslation(field).note}` : ''}
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

export function Worksheet({ spec, variant, defaultSheet }: { spec: ComponentSpec; variant?: Variant; defaultSheet?: string }) {
  const ws = useWorksheet(spec.slug);
  const { entry } = ws;
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const requested = params.get('sheet');
  const index = Math.max(0, SHEETS.indexOf((requested ?? defaultSheet) as (typeof SHEETS)[number]));

  // Arriving from a role guide: bring the worksheet into view.
  useEffect(() => {
    if (requested) rootRef.current?.scrollIntoView({ block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.slug]);

  const fields = contentFields(spec, variant);
  const design = designRequirements(spec, variant);
  if (!fields.length && !design.length) return null;
  const fe = frontendChecks(spec, variant, entry);
  const qa = qaCases(spec, variant, entry);

  const required = fields.filter((f) => f.required);
  const filled = required.filter((f) => (entry.fields[f.id] ?? '').trim()).length;
  const designDone = design.filter((d) => entry.design.includes(d.text)).length;
  const feDone = fe.filter((c) => entry.frontend.includes(c.id)).length;
  const results = qa.map((c) => entry.qa[c.id]?.result);
  const passed = results.filter((r) => r === 'pass').length;
  const failed = results.filter((r) => r === 'fail').length;
  const tested = results.filter(Boolean).length;
  const waiting = fe.filter((c) => c.waiting).length;

  const setSheet = (i: number) => {
    const next = new URLSearchParams(params);
    next.set('sheet', SHEETS[i]);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const md = () => toMarkdown(spec, variant, entry);
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
  const fileRef = useRef<HTMLInputElement>(null);
  const exportJson = () => {
    const data = { app: 'a11y-hub', version: 1, component: spec.slug, exported: new Date().toISOString(), worksheet: entry };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.slug}-worksheet.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Worksheet file downloaded. Send it to a teammate to import.');
  };
  const importJson = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data?.app !== 'a11y-hub' || !data.worksheet) throw new Error('not ours');
      if (data.component !== spec.slug) {
        const other = findComponent(String(data.component))?.name ?? String(data.component);
        flash(`That file is for the ${other} worksheet, not ${spec.name}. Open the ${other} page to import it.`);
        return;
      }
      ws.merge(data.worksheet);
      flash('Teammate’s worksheet imported and combined with yours.');
    } catch {
      flash('Couldn’t read that file. Choose a worksheet .json exported from A11y Hub.');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };
  const reset = () => {
    if (window.confirm(`Clear everything entered in the ${spec.name} worksheet, for all roles?`)) {
      ws.clear();
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
  const tabs: { name: string; done: number; total: number; sr: string }[] = [
    { name: 'Content', done: filled, total: required.length, sr: 'required fields filled' },
    { name: 'Design', done: designDone, total: design.length, sr: 'requirements met' },
    { name: 'Frontend', done: feDone, total: fe.length, sr: 'build checks done' },
    { name: 'QA', done: tested, total: qa.length, sr: 'test cases run' },
  ];

  return (
    <div ref={rootRef} className="scroll-mt-24 space-y-4">
      <TextField
        label="Where is this being used?"
        hint="So the handoff is easy to match to a screen. For example: Checkout page, “Save card” button."
        value={entry.where}
        onChange={(e) => ws.setWhere(e.target.value)}
      />
      {variant && (
        <p className="text-sm text-muted">
          Showing what’s needed for the <strong className="text-gray-900 dark:text-gray-50">{variant.label}</strong> variation. Switch variations
          in the live example to see what changes.
        </p>
      )}

      <Tab.Group selectedIndex={index} onChange={setSheet}>
        <Tab.List aria-label="Worksheet for" className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800/70">
          {tabs.map((t) => (
            <Tab key={t.name} className={tabClass}>
              {t.name}
              <span className="text-xs font-normal">
                {t.done}/{t.total}
                <span className="sr-only"> {t.sr}</span>
              </span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-3">
          <Tab.Panel as={Fragment}>
            <div className="space-y-3 rounded-xl focus-ring">
              <Intro who="For content designers.">
                Write the words this component needs. Frontend will put each one where the code chip says. Anything marked Required must be
                filled before build.
              </Intro>
              <ul className="space-y-3">
                {fields.map((f) => (
                  <FieldInput key={f.id} field={f} value={entry.fields[f.id] ?? ''} onChange={(v) => ws.setField(f.id, v)} />
                ))}
              </ul>
            </div>
          </Tab.Panel>

          <Tab.Panel as={Fragment}>
            <div className="space-y-3 rounded-xl focus-ring">
              <Intro who="For designers.">Decisions to make and check in your design before handoff. Tick each one once your design meets it.</Intro>
              <fieldset className="surface p-5">
                <legend className="sr-only">{spec.name} design requirements</legend>
                <div className="space-y-4">
                  {design.map((d) => (
                    <Checkbox key={d.text} label={d.text} description={d.check} checked={entry.design.includes(d.text)} onChange={() => ws.toggleDesign(d.text)} />
                  ))}
                </div>
              </fieldset>
              <NotesField label="Design notes" hint="Link to the design file, and note any exceptions or decisions frontend should know about." value={entry.notes} onChange={ws.setNotes} />
            </div>
          </Tab.Panel>

          <Tab.Panel as={Fragment}>
            <div className="space-y-4 rounded-xl focus-ring">
              <Intro who="For frontend developers.">
                What to build, including the exact text content handed over. Tick each item once it’s in the code. The HTML tab in the live
                example shows the markup.
              </Intro>
              {waiting > 0 && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-950 ring-1 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-50 dark:ring-amber-700">
                  <strong>Waiting on content:</strong> {waiting} required {waiting === 1 ? 'piece of text hasn’t' : 'pieces of text haven’t'} been
                  written yet. See the Content tab.
                </p>
              )}
              {entry.notes.trim() && (
                <div className="surface p-4 text-sm">
                  <p className="font-semibold">Notes from design</p>
                  <p className="mt-1 whitespace-pre-line">{entry.notes.trim()}</p>
                </div>
              )}
              {groupBy(fe).map(([group, checks]) => (
                <fieldset key={group} className="surface p-5">
                  <legend className="float-left mb-3 w-full text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">{group}</legend>
                  <div className="clear-left space-y-4">
                    {checks.map((c) => (
                      <FrontendCheck key={c.id} check={c} checked={entry.frontend.includes(c.id)} onToggle={() => ws.toggleFrontend(c.id)} />
                    ))}
                  </div>
                </fieldset>
              ))}
              <NotesField label="Frontend notes" hint="Pull request link, deviations from the spec, and anything QA should focus on." value={entry.frontendNotes} onChange={ws.setFrontendNotes} />
            </div>
          </Tab.Panel>

          <Tab.Panel as={Fragment}>
            <div className="space-y-4 rounded-xl focus-ring">
              <Intro who="For QA.">
                A test script built from this component’s spec and the other roles’ handoff. Mark each case, and describe what happened for
                anything that fails.
              </Intro>
              <p className="text-sm font-medium">
                {passed} passed · {failed} failed · {qa.length - tested} not tested
              </p>
              <fieldset className="surface p-5">
                <legend className="float-left mb-3 w-full text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Test environment</legend>
                <div className="clear-left grid gap-4 sm:grid-cols-2">
                  {QA_ENV.map(({ key, label }) => (
                    <TextField key={key} label={label} value={entry.env[key] ?? ''} onChange={(e) => ws.setEnv(key, e.target.value)} />
                  ))}
                </div>
              </fieldset>
              {groupBy(qa).map(([group, cases]) => (
                <section key={group} className="surface p-5" aria-label={group}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">{group}</h3>
                  <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {cases.map((c) => (
                      <QaCase
                        key={c.id}
                        check={c}
                        result={entry.qa[c.id]?.result}
                        note={entry.qa[c.id]?.note}
                        onResult={(r) => ws.setQa(c.id, r)}
                        onNote={(n) => ws.setQaNote(c.id, n)}
                        report={<BugReport spec={spec} variant={variant} check={c} note={entry.qa[c.id]?.note} entry={entry} />}
                      />
                    ))}
                  </ul>
                </section>
              ))}
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
        <Button size="sm" weight="light" color="gray" onClick={exportJson}>
          Export for team
        </Button>
        <Button size="sm" weight="light" color="gray" onClick={() => fileRef.current?.click()}>
          Import teammate’s file
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => importJson(e.target.files?.[0])} />
        <Button size="sm" weight="clear" color="gray" onClick={reset}>
          Clear worksheet
        </Button>
        <span role="status" className="text-sm text-muted">
          {status}
        </span>
      </div>
      <p className="text-xs text-muted">
        Saved in this browser only. To work together, export your worksheet and have the next person import it: their answers are
        combined with yours, nothing is overwritten with blanks. The copied Markdown handoff includes all four roles for your ticket.
      </p>
    </div>
  );
}
