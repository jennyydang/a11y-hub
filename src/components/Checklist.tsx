import { useEffect, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { Checkbox } from '../ui';

const KEY = 'a11y-hub:checklists';

function load(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function save(v: Record<string, string[]>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
}

export function useChecklist(scope: string) {
  const [done, setDone] = useState<string[]>(() => load()[scope] ?? []);
  useEffect(() => {
    setDone(load()[scope] ?? []);
  }, [scope]);
  const update = (next: string[]) => {
    setDone(next);
    const all = load();
    all[scope] = next;
    save(all);
  };
  return {
    done,
    toggle: (item: string) => update(done.includes(item) ? done.filter((d) => d !== item) : [...done, item]),
    reset: () => update([]),
  };
}

export function Checklist({ scope, items, title }: { scope: string; items: string[]; title: string }) {
  const { done, toggle, reset } = useChecklist(scope);
  const count = items.filter((i) => done.includes(i)).length;
  return (
    <div className="surface p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium" aria-live="polite">
          {count} of {items.length} checks complete
        </p>
        <Button size="sm" weight="light" color="gray" onClick={reset} disabled={count === 0}>
          Reset
        </Button>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700" aria-hidden="true">
        <div className="h-full bg-emerald-600 transition-[width] dark:bg-emerald-400" style={{ width: `${(count / items.length) * 100}%` }} />
      </div>
      <fieldset>
        <legend className="sr-only">{title}</legend>
        <div className="space-y-3">
          {items.map((item) => (
            <Checkbox key={item} label={item} checked={done.includes(item)} onChange={() => toggle(item)} />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
