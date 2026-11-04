import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from './cx';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Visually hide the label (it stays in the accessibility tree). */
  hideLabel?: boolean;
}

/**
 * A text input styled with Fluid UI's form tokens. The label, hint and error
 * are all programmatically associated with the input.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, hideLabel, className, required, ...props },
  ref,
) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('space-y-1.5', className)}>
      <label htmlFor={id} className={cx('block text-sm font-semibold text-gray-800 dark:text-gray-100', hideLabel && 'sr-only')}>
        {label}
        {required && (
          <span className="ml-1 text-red-700 dark:text-red-300" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(
          'block w-full rounded-lg px-4 py-2.5 text-base outline-none transition [-webkit-tap-highlight-color:transparent]',
          'bg-white text-gray-900 ring-1 placeholder:text-gray-500 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400',
          'focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
          error
            ? 'ring-red-600 focus-visible:ring-red-600 dark:ring-red-400 dark:focus-visible:ring-red-400'
            : 'ring-gray-400 focus-visible:ring-primary-600 dark:ring-gray-500 dark:focus-visible:ring-primary-300',
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-sm font-medium text-red-700 dark:text-red-300">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 flex-none" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
    </div>
  );
});
