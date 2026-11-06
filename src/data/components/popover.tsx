import { useEffect, useId, useRef, useState } from 'react';
import { Popover as HPopover } from '@headlessui/react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';

const panel = 'popover-panel absolute left-0 top-full z-20 mt-2 w-72 p-4 text-left text-sm';
const fieldClass =
  'block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-500 dark:focus-visible:ring-primary-300';

/** Interactive popover: a non-modal dialog. Headless UI handles aria-expanded, Escape, outside click and focus return. */
function InteractiveDemo() {
  const [copied, setCopied] = useState(false);
  return (
    <HPopover className="relative">
      <HPopover.Button as={Button} weight="light" color="gray">
        Share
      </HPopover.Button>
      <HPopover.Panel focus role="dialog" aria-label="Share" className={panel}>
        {({ close }) => (
          <div className="space-y-3">
            <p className="font-semibold">Share this page</p>
            <div className="space-y-1">
              <label htmlFor="share-link" className="block text-xs font-semibold">
                Page link
              </label>
              <input id="share-link" readOnly value="https://example.com/q3-report" className={fieldClass} />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" weight="clear" color="gray" onClick={() => close()}>
                Close
              </Button>
              <Button size="sm" className="btn-bold-primary" onClick={() => setCopied(true)}>
                {copied ? 'Copied' : 'Copy link'}
              </Button>
            </div>
            <p role="status" className="sr-only">
              {copied ? 'Link copied' : ''}
            </p>
          </div>
        )}
      </HPopover.Panel>
    </HPopover>
  );
}

/** Toggletip: a button that shows short help text and announces it. */
function ToggletipDemo() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !wrapRef.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <p className="flex items-center gap-2 text-sm">
      Billing date
      <span ref={wrapRef} className="relative inline-flex">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-tip`}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ring-1 ring-gray-500 focus-ring dark:ring-gray-300"
        >
          <span aria-hidden="true">i</span>
          <span className="sr-only">More about billing date</span>
        </button>
        <span id={`${id}-tip`} role="status" className="absolute left-8 top-1/2 w-60 -translate-y-1/2">
          {open && <span className="popover-panel block p-3">You’re billed on the same day each month. If that date doesn’t exist, it’s the last day of the month.</span>}
        </span>
      </span>
    </p>
  );
}

/** Native HTML popover attribute: light dismiss and Escape come free. */
function NativeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  useEffect(() => {
    ref.current?.setAttribute('popover', 'auto');
  }, []);
  return (
    <div className="relative">
      <button type="button" {...{ popovertarget: `pop-${id}` }} className="rounded-md px-3.5 py-2 text-sm font-medium ring-1 ring-gray-400 focus-ring dark:ring-gray-500">
        Keyboard shortcuts
      </button>
      <div ref={ref} id={`pop-${id}`} role="dialog" aria-label="Keyboard shortcuts" className="popover-panel m-auto w-72 p-4 text-sm text-gray-900 dark:text-gray-50">
        <p className="mb-2 font-semibold">Keyboard shortcuts</p>
        <ul className="space-y-1">
          <li>
            <kbd className="kbd">/</kbd> Search
          </li>
          <li>
            <kbd className="kbd">?</kbd> Show this list
          </li>
        </ul>
      </div>
    </div>
  );
}

export const popoverVariants: Variant[] = [
  {
    id: 'interactive',
    label: 'Interactive',
    description: 'Contains controls. It’s a non-modal dialog: focus moves in, the page stays usable, Escape returns focus to the button.',
    Demo: InteractiveDemo,
    html: `<div class="popover-wrap">
  <button type="button" aria-expanded="false" aria-controls="share-pop">Share</button>
  <div id="share-pop" role="dialog" aria-label="Share" hidden>
    <p>Share this page</p>
    <label for="share-link">Page link</label>
    <input id="share-link" readonly value="https://example.com/q3-report">
    <button type="button" class="close">Close</button>
    <button type="button">Copy link</button>
  </div>
</div>

<script>
  const btn = document.querySelector('[aria-controls="share-pop"]');
  const pop = document.getElementById('share-pop');
  const open = (show) => {
    pop.hidden = !show;
    btn.setAttribute('aria-expanded', String(show));
    if (show) pop.querySelector('input, button').focus();
  };
  const closeAndReturn = () => { open(false); btn.focus(); };
  btn.addEventListener('click', () => open(pop.hidden));
  pop.querySelector('.close').addEventListener('click', closeAndReturn);
  pop.addEventListener('keydown', (e) => e.key === 'Escape' && closeAndReturn());
  // Close when focus or a click moves outside (non-modal: no focus trap)
  document.addEventListener('click', (e) => !e.target.closest('.popover-wrap') && open(false));
  pop.addEventListener('focusout', (e) => !pop.contains(e.relatedTarget) && e.relatedTarget !== btn && open(false));
</script>`,
    code: `import { Popover } from '@headlessui/react';
import { Button } from '@fluid-design/fluid-ui';

<Popover className="relative">
  <Popover.Button as={Button}>Share</Popover.Button>
  {/* focus: move focus into the panel when it opens */}
  <Popover.Panel focus role="dialog" aria-label="Share" className="popover-panel">
    {({ close }) => (
      <>
        <label htmlFor="share-link">Page link</label>
        <input id="share-link" readOnly value={url} />
        <Button onClick={() => close()}>Close</Button>
        <Button onClick={copy}>Copy link</Button>
      </>
    )}
  </Popover.Panel>
</Popover>`,
  },
  {
    id: 'toggletip',
    label: 'Toggletip',
    description: 'Short help text behind an info button. Text is announced through a status region; focus stays on the button.',
    Demo: ToggletipDemo,
    html: `<p>
  Billing date
  <span class="toggletip">
    <button type="button" aria-expanded="false" aria-controls="tip">
      <span aria-hidden="true">i</span>
      <span class="sr-only">More about billing date</span>
    </button>
    <!-- The status region exists first; text is added on open so it's announced -->
    <span id="tip" role="status"></span>
  </span>
</p>

<script>
  const btn = document.querySelector('.toggletip button');
  const tip = document.getElementById('tip');
  const text = 'You’re billed on the same day each month.';
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    tip.textContent = open ? text : '';
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  document.addEventListener('click', (e) => !e.target.closest('.toggletip') && set(false));
</script>`,
    code: `const [open, setOpen] = useState(false);

<button aria-expanded={open} aria-controls="tip" onClick={() => setOpen(!open)}>
  <span aria-hidden="true">i</span>
  <span className="sr-only">More about billing date</span>
</button>
<span id="tip" role="status">
  {open && <span className="popover-panel">You’re billed on the same day each month.</span>}
</span>`,
  },
  {
    id: 'native',
    label: 'Native popover',
    description: 'The HTML popover attribute gives Escape, light dismiss and top-layer stacking with no script. Add a role and name yourself.',
    Demo: NativeDemo,
    html: `<button type="button" popovertarget="shortcuts">Keyboard shortcuts</button>

<!-- popover="auto": Escape and clicking outside close it; focus returns to the button -->
<div id="shortcuts" popover="auto" role="dialog" aria-label="Keyboard shortcuts">
  <p>Keyboard shortcuts</p>
  <ul>
    <li><kbd>/</kbd> Search</li>
    <li><kbd>?</kbd> Show this list</li>
  </ul>
</div>`,
    code: `// React 18 passes these lowercase attributes through to the DOM
<button type="button" popovertarget="shortcuts">Keyboard shortcuts</button>
<div id="shortcuts" popover="auto" role="dialog" aria-label="Keyboard shortcuts" className="popover-panel">
  …
</div>`,
  },
];

export const popover: ComponentSpec = {
  slug: 'popover',
  name: 'Popover',
  category: 'Overlays',
  summary: 'A popover shows extra content or controls next to the button that opened it, without blocking the rest of the page.',
  semantics: 'button[aria-expanded] + non-modal role="dialog" (or popover attribute)',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
  whenToUse: [
    'Use a popover for small, optional content or controls tied to one button, like sharing options or filters.',
    'Use a tooltip instead for a short label on hover and focus, and a dialog when people must respond before continuing.',
    'Use a toggletip for help text that people should be able to open on touch screens and with the keyboard.',
  ],
  keyboard: [
    { keys: ['Enter', 'Space'], action: 'On the button: opens or closes the popover.' },
    { keys: ['Tab'], action: 'Moves through controls in the popover, then on to the page. Focus isn’t trapped.' },
    { keys: ['Escape'], action: 'Closes the popover and returns focus to the button.' },
  ],
  aria: [
    { attr: 'aria-expanded', where: 'button', usage: 'true when open, false when closed.' },
    { attr: 'aria-controls', where: 'button', usage: 'Points to the popover, where supported.' },
    { attr: 'role="dialog"', where: 'popover with controls', usage: 'Non-modal: don’t add aria-modal. Name it with aria-label or aria-labelledby.' },
    { attr: 'role="status"', where: 'toggletip text', usage: 'So the text is read when it appears, without moving focus.' },
    { attr: 'popover / popovertarget', where: 'native HTML', usage: 'Built-in light dismiss and Escape. Still add a role and name.' },
  ],
  focus: [
    'If the popover has controls, move focus to the first one when it opens.',
    'Don’t trap focus. Tabbing past the last control can close the popover or carry on through the page.',
    'Escape and the Close button return focus to the button that opened it.',
    'Place the popover right after its button in the DOM so the tab order makes sense.',
  ],
  screenReader: [
    'Button announced as: “Share, button, collapsed”, then “expanded” when open.',
    'An interactive popover announces as “Share, dialog” when focus moves in.',
    'A toggletip reads its text through the status region without moving focus.',
  ],
  dos: ['Open on click or Enter, not on hover alone.', 'Keep the content short and related to the button.', 'Give every popover a visible way to close if it has controls.'],
  donts: ['Don’t trap focus or make the page inert. Use a dialog if you need that.', 'Don’t put essential instructions only in a popover.', 'Don’t open a popover automatically.'],
  wcag: [WCAG.keyboard, WCAG.focusOrder, WCAG.hoverFocus, WCAG.nameRoleValue, WCAG.statusMessages, WCAG.focusNotObscured],
  testing: [
    'Open with Enter and Space, and confirm aria-expanded changes.',
    'Confirm focus moves into an interactive popover, and Escape returns it to the button.',
    'Tab past the last control and confirm focus isn’t trapped.',
    'Click outside and confirm it closes.',
    'With a screen reader, confirm toggletip text is announced.',
    'Zoom to 200% and confirm the popover stays on screen.',
  ],
  Demo: InteractiveDemo,
  code: popoverVariants[0].code,
  fluid: {
    source: 'Headless UI + Fluid styles',
    notes: [
      'Fluid UI’s own Popover is still marked as in progress, so this uses Headless UI’s Popover with Fluid’s popover-panel styles.',
      'Headless UI sets aria-expanded, closes on Escape and outside click, and returns focus to the button. Add the focus prop so focus moves into the panel.',
      'Headless UI doesn’t give the panel a role. Add role="dialog" and a name when it contains controls.',
    ],
  },
};
