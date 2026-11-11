import { useId, useRef, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const TRAILS = ['Riverside loop', 'Oak ridge', 'Mill pond', 'Heron marsh', 'Beacon hill', 'Fern gully'];

/** "Show more": a button that reveals hidden items and moves focus to the first new one. */
function Demo() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const firstNew = useRef<HTMLAnchorElement>(null);
  const toggle = () => {
    setOpen((o) => !o);
    if (!open) window.requestAnimationFrame(() => firstNew.current?.focus());
  };
  const link = (t: string, ref?: React.Ref<HTMLAnchorElement>) => (
    <a ref={ref} href="#" onClick={(e) => e.preventDefault()} className="link inline-block py-1">
      {t}
    </a>
  );
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Trails near you</h4>
      <ul className="space-y-1 text-sm">
        {TRAILS.slice(0, 3).map((t) => (
          <li key={t}>{link(t)}</li>
        ))}
      </ul>
      <ul id={`${id}-more`} hidden={!open} className="space-y-1 text-sm">
        {TRAILS.slice(3).map((t, i) => (
          <li key={t}>{link(t, i === 0 ? firstNew : undefined)}</li>
        ))}
      </ul>
      <button type="button" aria-expanded={open} aria-controls={`${id}-more`} onClick={toggle} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold ring-1 ring-gray-500 hover:bg-gray-100 focus-ring dark:ring-gray-400 dark:hover:bg-gray-800">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}>
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
        {open ? 'Show fewer trails' : 'Show 3 more trails'}
      </button>
    </div>
  );
}


export const disclosure: ComponentSpec = {
  slug: 'disclosure',
  name: 'Show/hide disclosure',
  category: 'Content',
  summary: 'A disclosure is one button that shows or hides content, like “Show 3 more trails”. It says whether it’s expanded, and the content stays in the normal page flow.',
  semantics: '<button aria-expanded aria-controls>, or native <details>',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
  whenToUse: [
    'Use it to shorten a long list or hide optional detail.',
    'Use an accordion for several stacked sections with headings.',
    'Use native details and summary when you don’t need custom behavior.',
  ],
  keyboard: [{ keys: ['Enter', 'Space'], action: 'Shows or hides the content.' }],
  aria: [
    { attr: 'aria-expanded', where: 'button', usage: 'true or false, so people know the state.' },
    { attr: 'aria-controls', where: 'button', usage: 'Points to the content it shows.' },
    { attr: 'hidden', where: 'content', usage: 'Removes it from view, tab order and screen readers while closed.' },
  ],
  focus: ['For “show more” lists, move focus to the first new item so people don’t have to search for it.', 'For extra detail, leave focus on the button.'],
  screenReader: ['“Show 3 more trails, button, collapsed.”', 'After opening: focus moves to “Heron marsh, link”.'],
  dos: ['Say what will appear and how many: “Show 3 more trails”.', 'Change the label when it opens.', 'Keep the button after the content so the order makes sense.'],
  donts: ['Don’t use a link for show/hide.', 'Don’t hide content people need to complete the task.', 'Don’t load content with no announcement or focus change.'],
  wcag: [WCAG.nameRoleValue, WCAG.keyboard, WCAG.focusOrder, WCAG.infoRel],
  testing: [
    'Confirm the button announces collapsed and expanded.',
    'Open it with the keyboard and confirm focus lands on the first new item.',
    'Confirm hidden items can’t be reached with Tab while closed.',
  ],
  Demo,
};
