import { cloneElement, useEffect, useId, useRef, useState, type ReactElement } from 'react';
import { cx } from './cx';

export interface TooltipProps {
  content: string;
  /** "label" makes the tooltip the trigger's accessible name; "description" adds it as a description. */
  relationship?: 'label' | 'description';
  placement?: 'top' | 'bottom';
  children: ReactElement<Record<string, unknown>>;
}

/**
 * Accessible tooltip. Shows on hover and on keyboard focus, stays open while the pointer
 * is over the tooltip itself, and closes with Escape (WCAG 1.4.13).
 */
export function Tooltip({ content, relationship = 'description', placement = 'top', children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(hideTimer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const a11yProps =
    relationship === 'label' ? { 'aria-labelledby': id } : { 'aria-describedby': id };

  return (
    <span className="relative inline-flex" onPointerEnter={show} onPointerLeave={hide}>
      {cloneElement(children, {
        ...a11yProps,
        onFocus: show,
        onBlur: hide,
      })}
      <span
        id={id}
        role="tooltip"
        onPointerEnter={show}
        onPointerLeave={hide}
        className={cx(
          'absolute left-1/2 z-50 w-max max-w-[16rem] -translate-x-1/2 rounded-md bg-gray-800 px-2.5 py-1.5 text-sm text-gray-50 shadow-lg dark:bg-gray-100 dark:text-gray-900',
          placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          open ? 'visible opacity-100' : 'invisible opacity-0',
          'transition-opacity motion-reduce:transition-none',
        )}
      >
        {content}
      </span>
    </span>
  );
}
