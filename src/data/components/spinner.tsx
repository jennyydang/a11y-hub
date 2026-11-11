import { useEffect, useRef, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

/** A button that shows a spinner while it saves. The status region announces start and finish. */
function Demo() {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const save = () => {
    if (state === 'saving') return;
    setState('saving');
    timer.current = window.setTimeout(() => setState('saved'), 2000);
  };
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={save}
        aria-disabled={state === 'saving' || undefined}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 font-semibold text-white focus-ring aria-disabled:cursor-progress dark:bg-primary-300 dark:text-gray-950"
      >
        {state === 'saving' && (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 motion-safe:animate-spin" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".35" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {state === 'saving' ? 'Saving…' : 'Save route'}
      </button>
      <p role="status" className="text-sm">
        {state === 'saving' ? 'Saving your route' : state === 'saved' ? 'Route saved' : ''}
      </p>
    </div>
  );
}


export const spinner: ComponentSpec = {
  slug: 'spinner',
  name: 'Loading spinner',
  category: 'Feedback',
  summary: 'A spinner shows that something is happening when you can’t say how long it will take. Pair it with words and a status message.',
  semantics: 'Decorative icon + role="status" text',
  whenToUse: [
    'Use it for short waits, roughly 1 to 10 seconds, where progress can’t be measured.',
    'Use a progress bar when you know how far along it is, or for longer waits.',
    'Use a skeleton when loading content into a known layout.',
  ],
  keyboard: [{ keys: ['Enter', 'Space'], action: 'Starts the action. Pressing again while it’s busy does nothing.' }],
  aria: [
    { attr: 'aria-hidden="true"', where: 'spinner icon', usage: 'The words carry the meaning, not the animation.' },
    { attr: 'role="status"', where: 'message', usage: 'Announces “Saving your route”, then “Route saved”. Must exist before it changes.' },
    { attr: 'aria-disabled="true"', where: 'button while busy', usage: 'Keeps focus on the button. The disabled attribute would drop focus.' },
  ],
  focus: ['Focus stays on the button throughout.', 'If the result loads new content, move focus to its heading once it’s ready.'],
  screenReader: ['“Saving your route.” Then “Route saved.”'],
  dos: ['Show it only after about a second, to avoid a flash on fast responses.', 'Stop the spin for people who prefer reduced motion.', 'Say what’s happening in words.'],
  donts: ['Don’t leave a spinner running with no end or error.', 'Don’t use aria-busy alone to announce loading.', 'Don’t disable the button with the disabled attribute while it’s focused.'],
  wcag: [WCAG.statusMessages, WCAG.nonText, WCAG.pause, WCAG.animation],
  testing: [
    'With a screen reader, start the action and confirm start and finish are announced.',
    'Turn on reduced motion and confirm the spinner stops spinning.',
    'Make the request fail and confirm an error message appears.',
  ],
  Demo,
};
