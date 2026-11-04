import { useId, type ReactNode } from 'react';
import { cx } from './cx';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend: string;
  name?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  className?: string;
}

/**
 * Native radios inside a fieldset. The browser handles the roving focus and arrow-key
 * selection, and the legend becomes the group's accessible name.
 */
export function RadioGroup({ legend, name, options, value, onChange, hint, className }: RadioGroupProps) {
  const id = useId();
  const groupName = name ?? id;
  return (
    <fieldset className={cx('space-y-3', className)} aria-describedby={hint ? `${id}-hint` : undefined}>
      <legend className="text-sm font-semibold text-gray-800 dark:text-gray-100">{legend}</legend>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="space-y-2">
        {options.map((opt) => {
          const optId = `${id}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={cx(
                'flex cursor-pointer items-start gap-3 rounded-lg p-3 ring-1 transition-colors',
                checked
                  ? 'bg-primary-50 ring-2 ring-primary-600 dark:bg-primary-900/40 dark:ring-primary-300'
                  : 'bg-white ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:ring-gray-700 dark:hover:bg-gray-700/60',
                opt.disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <input
                id={optId}
                type="radio"
                name={groupName}
                value={opt.value}
                checked={checked}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                aria-describedby={opt.description ? `${optId}-desc` : undefined}
                className="mt-0.5 h-5 w-5 flex-none cursor-pointer accent-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:accent-primary-300 dark:focus-visible:outline-primary-300"
              />
              <span className="text-sm">
                <span className="block font-medium text-gray-900 dark:text-gray-50">{opt.label}</span>
                {opt.description && (
                  <span id={`${optId}-desc`} className="block text-muted">
                    {opt.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
