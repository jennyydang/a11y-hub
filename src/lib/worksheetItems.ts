import type { ComponentSpec, Variant } from '../data/types';
import { placement } from '../data/placement';
import { worksheets, type ContentField, type DesignRequirement } from '../data/requirements';
import type { WorksheetEntry } from './worksheetStore';

export const SHEETS = ['content', 'design', 'frontend', 'qa'] as const;
export type SheetId = (typeof SHEETS)[number];

export interface Check {
  id: string;
  group: string;
  text: string;
  detail?: string;
  /** For content-derived checks: the text content supplied, if any. */
  value?: string;
  waiting?: boolean;
}

export const QA_ENV = [
  { key: 'build', label: 'Build or URL tested' },
  { key: 'browser', label: 'Browser and version' },
  { key: 'at', label: 'Screen reader and version' },
  { key: 'device', label: 'Device and operating system' },
];

const forVariant = <T extends { variants?: string[] }>(items: T[], variant?: Variant) =>
  items.filter((i) => !i.variants || !variant || i.variants.includes(variant.id));

const keysText = (keys: string[]) => keys.join(' / ');

export function contentFields(spec: ComponentSpec, variant?: Variant): ContentField[] {
  return forVariant(worksheets[spec.slug]?.content ?? [], variant);
}

export function designRequirements(spec: ComponentSpec, variant?: Variant): DesignRequirement[] {
  const reqs = forVariant(worksheets[spec.slug]?.design ?? [], variant);
  const p = placement[spec.slug];
  if (!p) return reqs;
  return [
    ...reqs,
    {
      text: `It’s placed where people expect it (${p.regions.join(', ').toLowerCase()}).`,
      check: `${p.where[0]} See Placement & UX on this page.`,
    },
  ];
}

/** What frontend needs to build, including the text content handed over. */
export function frontendChecks(spec: ComponentSpec, variant: Variant | undefined, entry: WorksheetEntry): Check[] {
  const checks: Check[] = [
    { id: 'semantics', group: 'Structure', text: `Build it on ${spec.semantics}.`, detail: `Fluid UI approach: ${spec.fluid.source}.` },
  ];
  contentFields(spec, variant).forEach((f) => {
    const value = (entry.fields[f.id] ?? '').trim();
    checks.push({
      id: `content:${f.id}`,
      group: 'Content from the handoff',
      text: `${f.label} → ${f.target}`,
      value: value || undefined,
      waiting: !value && f.required,
      detail: value ? undefined : f.required ? 'Waiting on content. Ask your content designer before building.' : 'Optional. Content left this blank.',
    });
  });
  spec.aria.forEach((a) =>
    checks.push({ id: `aria:${a.attr}:${a.where}`, group: 'ARIA and semantics', text: `${a.attr} on ${a.where}`, detail: a.usage }),
  );
  spec.keyboard.forEach((k) =>
    checks.push({ id: `key:${k.keys.join('+')}`, group: 'Keyboard', text: `Support ${keysText(k.keys)}`, detail: k.action }),
  );
  spec.focus.forEach((f, i) => checks.push({ id: `focus:${i}`, group: 'Focus', text: f }));
  return checks;
}

/** Test script for QA, built from the spec and the other roles' handoff. */
export function qaCases(spec: ComponentSpec, variant: Variant | undefined, entry: WorksheetEntry): Check[] {
  const cases: Check[] = [];
  spec.keyboard.forEach((k) =>
    cases.push({ id: `key:${k.keys.join('+')}`, group: 'Keyboard', text: `Press ${keysText(k.keys)}`, detail: `Expected: ${k.action}` }),
  );
  spec.screenReader.forEach((s, i) => cases.push({ id: `sr:${i}`, group: 'Screen reader', text: s }));
  contentFields(spec, variant)
    .filter((f) => f.required)
    .forEach((f) => {
      const value = (entry.fields[f.id] ?? '').trim();
      cases.push({
        id: `content:${f.id}`,
        group: 'Content matches the handoff',
        text: `${f.label} is correct`,
        detail: value ? `Expected in ${f.target}:` : `Expected in ${f.target}. Content hasn’t filled this in yet, so check it exists and makes sense.`,
        value: value || undefined,
      });
    });
  designRequirements(spec, variant).forEach((d) =>
    cases.push({ id: `design:${d.text}`, group: 'Visual', text: d.text, detail: d.check }),
  );
  spec.testing.forEach((t, i) => cases.push({ id: `test:${i}`, group: 'More checks', text: t }));
  return cases;
}

export function groupBy(checks: Check[]) {
  const groups = new Map<string, Check[]>();
  checks.forEach((c) => groups.set(c.group, [...(groups.get(c.group) ?? []), c]));
  return [...groups.entries()];
}

/** Progress for one role's worksheet (used on role guide pages). */
export function sheetProgress(spec: ComponentSpec, sheet: SheetId, entry: WorksheetEntry) {
  if (sheet === 'content') {
    const fields = contentFields(spec);
    return { done: fields.filter((f) => (entry.fields[f.id] ?? '').trim()).length, total: fields.length, unit: 'fields to write' };
  }
  if (sheet === 'design') {
    const reqs = designRequirements(spec);
    return { done: reqs.filter((d) => entry.design.includes(d.text)).length, total: reqs.length, unit: 'requirements' };
  }
  if (sheet === 'frontend') {
    const checks = frontendChecks(spec, undefined, entry);
    return { done: checks.filter((c) => entry.frontend.includes(c.id)).length, total: checks.length, unit: 'build checks' };
  }
  const cases = qaCases(spec, undefined, entry);
  return { done: cases.filter((c) => entry.qa[c.id]?.result).length, total: cases.length, unit: 'test cases' };
}
