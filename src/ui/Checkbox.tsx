import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from './cx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
}

/** Native checkbox with Fluid UI colors. Native input = free keyboard + screen reader support. */
export function Checkbox({ label, description, indeterminate = false, className, ...props }: CheckboxProps) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx('flex items-start gap-3', className)}>
      <div className="flex h-6 items-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-describedby={description ? `${id}-desc` : undefined}
          className={cx(
            'h-5 w-5 cursor-pointer rounded border-2 border-gray-500 accent-primary-600 dark:border-gray-300 dark:accent-primary-300',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-300',
          )}
          {...props}
        />
      </div>
      <div className="text-sm leading-6">
        <label htmlFor={id} className="cursor-pointer font-medium text-gray-900 dark:text-gray-50">
          {label}
        </label>
        {description && (
          <p id={`${id}-desc`} className="text-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
