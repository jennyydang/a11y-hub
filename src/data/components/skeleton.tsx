import { useEffect, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const ITEMS = [
  { title: 'Quarterly report', meta: 'Updated 2 hours ago' },
  { title: 'Brand guidelines', meta: 'Updated yesterday' },
  { title: 'Onboarding checklist', meta: 'Updated last week' },
];

const bar = 'rounded bg-gray-200 motion-safe:animate-pulse dark:bg-gray-700';

function Demo() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const load = () => {
    if (state === 'loading') return;
    setState('loading');
    timer.current = window.setTimeout(() => setState('done'), 2500);
  };
  return (
    <div className="w-full max-w-sm space-y-3">
      <Button weight="light" color="gray" onClick={load} aria-disabled={state === 'loading'}>
        {state === 'done' ? 'Reload files' : 'Load files'}
      </Button>
      {/* The live region exists before loading starts, so the messages are announced */}
      <p role="status" className="sr-only">
        {state === 'loading' ? 'Loading files' : state === 'done' ? `${ITEMS.length} files loaded` : ''}
      </p>
      <ul aria-busy={state === 'loading'} aria-label="Recent files" className="space-y-3">
        {state === 'loading' &&
          ITEMS.map((_, i) => (
            <li key={i} aria-hidden="true" className="flex items-center gap-3">
              <span className={`h-10 w-10 flex-none rounded-lg ${bar}`} />
              <span className="flex-1 space-y-2">
                <span className={`block h-3 w-3/4 ${bar}`} />
                <span className={`block h-3 w-1/2 ${bar}`} />
              </span>
            </li>
          ))}
        {state === 'done' &&
          ITEMS.map((it) => (
            <li key={it.title} className="flex items-center gap-3">
              <span aria-hidden="true" className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-50">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M5 2h6l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm5 1v4h4" />
                </svg>
              </span>
              <span>
                <span className="block font-medium">{it.title}</span>
                <span className="block text-sm text-muted">{it.meta}</span>
              </span>
            </li>
          ))}
      </ul>
      {state === 'idle' && <p className="text-sm text-muted">Press Load files to see the skeleton.</p>}
    </div>
  );
}


export const skeleton: ComponentSpec = {
  slug: 'skeleton',
  name: 'Skeleton',
  category: 'Feedback',
  summary: 'A skeleton is a gray placeholder in the shape of content that’s still loading. It’s visual only, so pair it with a text status for screen readers.',
  semantics: 'aria-hidden placeholder shapes + role="status" message + aria-busy on the container',
  whenToUse: [
    'Use skeletons for content that loads in a second or two and has a predictable layout, like lists or cards.',
    'Use a progress bar instead for long tasks, or when you know how far along it is.',
    'Don’t use skeletons for content that loads instantly; the flash is distracting.',
  ],
  keyboard: [{ keys: ['—'], action: 'Skeletons aren’t focusable. Don’t move focus while loading; leave it where people were.' }],
  aria: [
    { attr: 'aria-hidden="true"', where: 'each placeholder shape', usage: 'Gray boxes mean nothing to a screen reader.' },
    { attr: 'role="status"', where: 'visually hidden message', usage: 'Says “Loading files”, then “3 files loaded”. It must exist before the text changes.' },
    { attr: 'aria-busy="true"', where: 'container being loaded', usage: 'Tells assistive tech the region is updating. Set it back to false when done.' },
  ],
  focus: [
    'Leave focus where it is while loading. Don’t disable the button that was pressed, or focus is lost; use aria-disabled and ignore extra presses.',
    'If the button that started loading disappears, move focus to the loaded content’s heading.',
  ],
  screenReader: ['On load start: “Loading files”.', 'When done: “3 files loaded”. The skeleton itself is never read.'],
  dos: ['Match the skeleton’s shape to the real layout so nothing jumps.', 'Stop the shimmer for reduced motion.', 'Show an error, not an endless skeleton, if loading fails.'],
  donts: ['Don’t leave the skeleton announced as empty content.', 'Don’t animate faster than a gentle pulse.', 'Don’t use skeletons where a spinner or status text is clearer.'],
  wcag: [WCAG.nonText, WCAG.statusMessages, WCAG.pause, WCAG.animation],
  testing: [
    'With a screen reader, start loading and confirm you hear a loading message and a done message.',
    'Confirm the gray shapes aren’t read or reachable.',
    'Turn on reduced motion and confirm the pulse stops.',
    'Simulate a slow or failed request and confirm there’s a clear outcome.',
  ],
  Demo,
};
