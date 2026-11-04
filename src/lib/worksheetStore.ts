import { useCallback, useEffect, useState } from 'react';

export interface WorksheetEntry {
  where: string;
  fields: Record<string, string>;
  design: string[];
  notes: string;
}

const KEY = 'a11y-hub:worksheets';
const empty = (): WorksheetEntry => ({ where: '', fields: {}, design: [], notes: '' });

function loadAll(): Record<string, WorksheetEntry> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function loadWorksheet(slug: string): WorksheetEntry {
  return { ...empty(), ...loadAll()[slug] };
}

function saveWorksheet(slug: string, entry: WorksheetEntry) {
  try {
    const all = loadAll();
    all[slug] = entry;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}

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
    toggleDesign: (text: string) =>
      update((e) => ({ ...e, design: e.design.includes(text) ? e.design.filter((d) => d !== text) : [...e.design, text] })),
    setNotes: (notes: string) => update((e) => ({ ...e, notes })),
    clear: () => update(() => empty()),
  };
}
