import { useCallback, useEffect, useState } from 'react';

export type QaResult = 'pass' | 'fail' | 'na';

export interface WorksheetEntry {
  where: string;
  /** Content: text for each field id. */
  fields: Record<string, string>;
  /** Design: requirement texts that are met. */
  design: string[];
  notes: string;
  /** Frontend: check ids that are done. */
  frontend: string[];
  frontendNotes: string;
  /** QA: result per test case id. */
  qa: Record<string, { result: QaResult; note?: string }>;
  env: Record<string, string>;
}

const KEY = 'a11y-hub:worksheets';
export const emptyWorksheet = (): WorksheetEntry => ({
  where: '',
  fields: {},
  design: [],
  notes: '',
  frontend: [],
  frontendNotes: '',
  qa: {},
  env: {},
});

function loadAll(): Record<string, Partial<WorksheetEntry>> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function loadWorksheet(slug: string): WorksheetEntry {
  return { ...emptyWorksheet(), ...loadAll()[slug] };
}

export function saveWorksheet(slug: string, entry: WorksheetEntry) {
  try {
    const all = loadAll();
    all[slug] = entry;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Combine a teammate's worksheet into ours. Their non-empty text wins, ticked
 * items are combined, and their QA results are added.
 */
export function mergeWorksheets(ours: WorksheetEntry, theirs: Partial<WorksheetEntry>): WorksheetEntry {
  const text = (a: string, b?: string) => (b && b.trim() ? b : a);
  const map = (a: Record<string, string>, b?: Record<string, string>) => {
    const out = { ...a };
    Object.entries(b ?? {}).forEach(([k, v]) => {
      if (typeof v === 'string' && v.trim()) out[k] = v;
    });
    return out;
  };
  return {
    where: text(ours.where, theirs.where),
    fields: map(ours.fields, theirs.fields),
    design: [...new Set([...ours.design, ...(theirs.design ?? [])])],
    notes: text(ours.notes, theirs.notes),
    frontend: [...new Set([...ours.frontend, ...(theirs.frontend ?? [])])],
    frontendNotes: text(ours.frontendNotes, theirs.frontendNotes),
    qa: { ...ours.qa, ...(theirs.qa ?? {}) },
    env: map(ours.env, theirs.env),
  };
}

const toggle = (list: string[], item: string) => (list.includes(item) ? list.filter((d) => d !== item) : [...list, item]);

export function useWorksheet(slug: string) {
  const [entry, setEntry] = useState<WorksheetEntry>(() => loadWorksheet(slug));
  useEffect(() => setEntry(loadWorksheet(slug)), [slug]);

  const update = useCallback(
    (fn: (e: WorksheetEntry) => WorksheetEntry) =>
      setEntry((prev) => {
        const next = fn(prev);
        saveWorksheet(slug, next);
        return next;
      }),
    [slug],
  );

  return {
    entry,
    setWhere: (where: string) => update((e) => ({ ...e, where })),
    setField: (id: string, value: string) => update((e) => ({ ...e, fields: { ...e.fields, [id]: value } })),
    toggleDesign: (text: string) => update((e) => ({ ...e, design: toggle(e.design, text) })),
    setNotes: (notes: string) => update((e) => ({ ...e, notes })),
    toggleFrontend: (id: string) => update((e) => ({ ...e, frontend: toggle(e.frontend, id) })),
    setFrontendNotes: (frontendNotes: string) => update((e) => ({ ...e, frontendNotes })),
    setQa: (id: string, result: QaResult) => update((e) => ({ ...e, qa: { ...e.qa, [id]: { ...e.qa[id], result } } })),
    setQaNote: (id: string, note: string) => update((e) => ({ ...e, qa: { ...e.qa, [id]: { result: e.qa[id]?.result ?? 'fail', note } } })),
    setEnv: (key: string, value: string) => update((e) => ({ ...e, env: { ...e.env, [key]: value } })),
    clear: () => update(() => emptyWorksheet()),
    merge: (theirs: Partial<WorksheetEntry>) => update((e) => mergeWorksheets(e, theirs)),
  };
}
