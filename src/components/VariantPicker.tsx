import { useId } from 'react';
import type { Variant } from '../data/types';
import { cx } from '../ui';

/** Segmented control built from native radios, so arrow keys and grouping work for free. */
export function VariantPicker({ variants, value, onChange }: { variants: Variant[]; value: string; onChange: (id: string) => void }) {
  const id = useId();
  const current = variants.find((v) => v.id === value) ?? variants[0];
  return (
    <fieldset className="space-y-2" aria-describedby={`${id}-desc`}>
      <legend className="mb-2 text-sm font-semibold">Variation</legend>
      <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {variants.map((v) => {
          const checked = v.id === current.id;
          return (
            <label
              key={v.id}
              className={cx(
                'relative cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-600 dark:has-[:focus-visible]:ring-primary-300',
                checked
                  ? 'bg-white text-gray-900 shadow ring-1 ring-black/5 dark:bg-gray-600 dark:text-white'
                  : 'text-gray-700 hover:bg-white/60 dark:text-gray-200 dark:hover:bg-gray-700',
              )}
            >
              <input
                type="radio"
                name={`${id}-variant`}
                value={v.id}
                checked={checked}
                onChange={() => onChange(v.id)}
                className="sr-only"
              />
              {v.label}
            </label>
          );
        })}
      </div>
      <p id={`${id}-desc`} className="text-sm text-muted">
        {current.description}
      </p>
    </fieldset>
  );
}
