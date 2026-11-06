import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';
import { Checkbox } from '../../ui';

const CloseIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

const closeBtn = 'rounded-md p-1.5 text-gray-700 hover:bg-gray-100 focus-ring dark:text-gray-200 dark:hover:bg-gray-800';

/** Modal drawer: a native <dialog> opened with showModal(), styled as a side sheet. */
function ModalDemo() {
  const ref = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = () => ref.current?.close();
  return (
    <>
      <Button ref={triggerRef} weight="light" color="gray" onClick={() => ref.current?.showModal()}>
        Open menu
      </Button>
      <dialog
        ref={ref}
        aria-labelledby={`${id}-title`}
        onClose={() => triggerRef.current?.focus()}
        onClick={(e) => e.target === ref.current && close()}
        className="m-0 ml-auto h-full max-h-none w-80 max-w-[90vw] bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-gray-900/50 motion-safe:animate-[a11yhub-drawer_200ms_ease-out] dark:bg-gray-900 dark:text-gray-50"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 id={`${id}-title`} className="text-lg font-semibold">
            Menu
          </h2>
          <button type="button" onClick={close} className={closeBtn}>
            <CloseIcon />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Drawer">
          <ul className="space-y-1 p-3">
            {['Dashboard', 'Invoices', 'Customers', 'Settings'].map((l) => (
              <li key={l}>
                <a href="#" onClick={(e) => e.preventDefault()} className="block rounded-md px-3 py-2 hover:bg-gray-100 focus-ring dark:hover:bg-gray-800">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
      <style>{`@keyframes a11yhub-drawer { from { transform: translateX(100%) } to { transform: none } }`}</style>
    </>
  );
}

/** Non-modal drawer: a side panel that opens beside the content. The page stays usable. */
function NonModalDemo() {
  const [open, setOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open]);
  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };
  return (
    <div className="flex w-full max-w-xl gap-4">
      <div className="min-w-0 flex-1 space-y-3">
        <Button ref={toggleRef} weight="light" color="gray" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => (open ? close() : setOpen(true))}>
          Filters
        </Button>
        <p className="text-sm text-muted">24 invoices</p>
      </div>
      <aside
        id={`${id}-panel`}
        hidden={!open}
        aria-labelledby={`${id}-title`}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        className="w-56 flex-none rounded-xl bg-white p-4 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700"
      >
        <div className="mb-3 flex items-center justify-between">
          {/* h4 here because the example sits under the page's h3; use the level that fits your page */}
          <h4 ref={headingRef} id={`${id}-title`} tabIndex={-1} className="rounded font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
            Filters
          </h4>
          <button type="button" onClick={close} className={closeBtn}>
            <CloseIcon />
            <span className="sr-only">Close filters</span>
          </button>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Status</legend>
          <div className="space-y-2">
            <Checkbox label="Paid" />
            <Checkbox label="Overdue" />
          </div>
        </fieldset>
      </aside>
    </div>
  );
}

export const drawerVariants: Variant[] = [
  {
    id: 'modal',
    label: 'Modal',
    description: 'Covers the page, like a mobile menu. It’s a modal dialog: focus is contained, the page behind is inert, Escape closes it.',
    Demo: ModalDemo,
    html: `<button type="button" id="open-menu">Open menu</button>

<!-- Native <dialog> + showModal(): focus containment, inert page and Escape for free -->
<dialog id="menu-drawer" class="drawer" aria-labelledby="menu-title">
  <header>
    <h2 id="menu-title">Menu</h2>
    <button type="button" class="close">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
      <span class="sr-only">Close menu</span>
    </button>
  </header>
  <nav aria-label="Drawer">
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/invoices">Invoices</a></li>
    </ul>
  </nav>
</dialog>

<style>
  .drawer { margin: 0 0 0 auto; height: 100%; max-height: none; width: 20rem; }
  @media (prefers-reduced-motion: no-preference) {
    .drawer[open] { animation: slide-in 200ms ease-out; }
  }
  @keyframes slide-in { from { transform: translateX(100%); } }
</style>

<script>
  const openBtn = document.getElementById('open-menu');
  const drawer = document.getElementById('menu-drawer');
  openBtn.addEventListener('click', () => drawer.showModal());
  drawer.querySelector('.close').addEventListener('click', () => drawer.close());
  // Click on the backdrop closes it
  drawer.addEventListener('click', (e) => e.target === drawer && drawer.close());
  drawer.addEventListener('close', () => openBtn.focus());
</script>`,
    code: `const ref = useRef<HTMLDialogElement>(null);
const triggerRef = useRef<HTMLButtonElement>(null);

<Button ref={triggerRef} onClick={() => ref.current?.showModal()}>Open menu</Button>
<dialog
  ref={ref}
  aria-labelledby="menu-title"
  onClose={() => triggerRef.current?.focus()}
  className="m-0 ml-auto h-full max-h-none w-80 backdrop:bg-gray-900/50"
>
  <h2 id="menu-title">Menu</h2>
  <button onClick={() => ref.current?.close()}>
    <CloseIcon aria-hidden="true" /><span className="sr-only">Close menu</span>
  </button>
  <nav aria-label="Drawer">…</nav>
</dialog>`,
  },
  {
    id: 'non-modal',
    label: 'Non-modal',
    description: 'Opens beside the content, like a filter panel. The page stays usable, so there’s no focus trap; focus moves to the panel heading.',
    Demo: NonModalDemo,
    html: `<button type="button" aria-expanded="false" aria-controls="filters">Filters</button>

<aside id="filters" aria-labelledby="filters-title" hidden>
  <h2 id="filters-title" tabindex="-1">Filters</h2>
  <button type="button" class="close">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
    <span class="sr-only">Close filters</span>
  </button>
  <fieldset>
    <legend>Status</legend>
    <label><input type="checkbox"> Paid</label>
    <label><input type="checkbox"> Overdue</label>
  </fieldset>
</aside>

<script>
  const toggle = document.querySelector('[aria-controls="filters"]');
  const panel = document.getElementById('filters');
  const set = (open) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('h2').focus();
    else toggle.focus();
  };
  toggle.addEventListener('click', () => set(panel.hidden));
  panel.querySelector('.close').addEventListener('click', () => set(false));
  panel.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
</script>`,
    code: `const [open, setOpen] = useState(false);
const headingRef = useRef<HTMLHeadingElement>(null);
useEffect(() => { if (open) headingRef.current?.focus(); }, [open]);

<Button aria-expanded={open} aria-controls="filters" onClick={() => setOpen(!open)}>Filters</Button>
<aside id="filters" hidden={!open} aria-labelledby="filters-title"
       onKeyDown={(e) => e.key === 'Escape' && close()}>
  <h2 ref={headingRef} id="filters-title" tabIndex={-1}>Filters</h2>
  <button onClick={close}><span className="sr-only">Close filters</span>…</button>
  …
</aside>`,
  },
];

export const drawer: ComponentSpec = {
  slug: 'drawer',
  name: 'Drawer',
  category: 'Overlays',
  summary: 'A drawer is a panel that slides in from the edge of the screen for navigation, filters or details. It can be modal or sit beside the page.',
  semantics: '<dialog> (modal) or <aside> + button[aria-expanded] (non-modal)',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  whenToUse: [
    'Use a modal drawer for navigation or tasks on small screens, where the page behind shouldn’t be used.',
    'Use a non-modal drawer for panels people use alongside the content, like filters or details.',
    'Use a dialog instead for decisions, and a popover for small content tied to one button.',
  ],
  keyboard: [
    { keys: ['Enter', 'Space'], action: 'On the trigger: opens the drawer.' },
    { keys: ['Tab', 'Shift+Tab'], action: 'Modal: cycles inside the drawer. Non-modal: moves through the drawer and the page normally.' },
    { keys: ['Escape'], action: 'Closes the drawer and returns focus to the trigger.' },
  ],
  aria: [
    { attr: '<dialog> + showModal()', where: 'modal drawer', usage: 'Contains focus, makes the page inert and handles Escape.' },
    { attr: 'aria-labelledby', where: 'drawer', usage: 'Points to the drawer’s heading.' },
    { attr: 'aria-expanded', where: 'non-modal trigger', usage: 'Shows whether the panel is open.' },
    { attr: '<aside> / role="complementary"', where: 'non-modal drawer', usage: 'A named landmark people can jump to.' },
    { attr: 'hidden', where: 'closed drawer', usage: 'Removes it from the tab order and accessibility tree, not just off screen.' },
  ],
  focus: [
    'Modal: move focus into the drawer on open (the first control, or the heading), keep it inside, and return it to the trigger on close.',
    'Non-modal: move focus to the drawer heading on open so people know where they are, and back to the trigger on close.',
    'A closed drawer must not be focusable. Hide it with hidden or display: none, not just a transform.',
  ],
  screenReader: [
    'Modal announced as: “Menu, dialog”, then the focused element.',
    'Non-modal trigger: “Filters, button, collapsed”, then “expanded”. The panel is reachable as a complementary landmark.',
  ],
  dos: ['Always show a visible Close button.', 'Reduce or remove the slide animation for reduced motion.', 'Keep the drawer’s position in the DOM close to its trigger, or move focus explicitly.'],
  donts: ['Don’t leave a closed drawer in the tab order off screen.', 'Don’t trap focus in a non-modal drawer.', 'Don’t open a drawer on hover.'],
  wcag: [WCAG.keyboard, WCAG.noTrap, WCAG.focusOrder, WCAG.nameRoleValue, WCAG.animation, WCAG.focusNotObscured],
  testing: [
    'Open with the keyboard and confirm focus moves into the drawer.',
    'Modal: Tab past the last item and confirm focus stays inside. Non-modal: confirm it doesn’t.',
    'Press Escape and confirm focus returns to the trigger.',
    'When closed, Tab through the page and confirm nothing in the drawer receives focus.',
    'Turn on reduced motion and confirm the slide is removed.',
    'At 320px wide, confirm the drawer fits and can be closed.',
  ],
  Demo: ModalDemo,
  code: drawerVariants[0].code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI doesn’t ship a drawer. The modal version uses the native <dialog> element, which gives focus containment, an inert background and Escape.',
      'You could also use Fluid’s Dialog with side-sheet styles, but remember to return focus to the trigger as shown on the Dialog page.',
      'The slide animation only runs when the user hasn’t asked for reduced motion.',
    ],
  },
};
