import { useId } from 'react';
import { roles, type RoleId } from '../data/roles';
import { useRole } from '../lib/useRole';
import { cx } from '../ui';

/** "Show sections for: Everyone / Content / Design / Frontend / QA". Saves the choice for the whole site. */
export function RoleFilter({ legend = 'Show sections for', status }: { legend?: string; status?: string }) {
  const [role, setRole] = useRole();
  const name = useId();
  const options: [RoleId | null, string][] = [[null, 'Everyone'], ...roles.map((r) => [r.id, r.name] as [RoleId, string])];
  return (
    <div className="space-y-1">
      <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <legend className="float-left mr-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{legend}</legend>
        <div className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800/70">
          {options.map(([id, label]) => {
            const checked = role === id;
            return (
              <label
                key={label}
                className={cx(
                  'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-600 dark:has-[:focus-visible]:ring-primary-300',
                  checked
                    ? 'bg-white text-primary-800 shadow-sm dark:bg-gray-900 dark:text-primary-100'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white',
                )}
              >
                <input type="radio" name={name} className="sr-only" checked={checked} onChange={() => setRole(id)} />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>
      <p role="status" className="text-sm text-muted">
        {status}
      </p>
    </div>
  );
}
