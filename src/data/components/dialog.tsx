import { useEffect } from 'react';
import { Button, Dialog, useModal } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function ConfirmDelete({ dismiss, returnFocusTo }: { dismiss: () => void; returnFocusTo?: HTMLElement | null }) {
  // Fluid renders dialogs from a provider, so focus isn't restored automatically. Restore it on unmount.
  useEffect(() => () => void window.setTimeout(() => returnFocusTo?.focus(), 0), [returnFocusTo]);
  return (
    <Dialog className="max-w-md">
      <Dialog.Header>
        <Dialog.Title>Delete “Q3 report”?</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>This permanently removes the file and its version history. You can’t undo this.</Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <div className="flex justify-end gap-2">
          <Button weight="outline" color="gray" onClick={dismiss}>
            Cancel
          </Button>
          <Button color="red" weight="bold" onClick={dismiss}>
            Delete file
          </Button>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
}

function Demo() {
  const [present] = useModal(ConfirmDelete);
  return (
    <Button color="red" weight="light" onClick={(e: React.MouseEvent<HTMLButtonElement>) => present({ returnFocusTo: e.currentTarget })}>
      Delete report…
    </Button>
  );
}

export const dialog: ComponentSpec = {
  slug: 'dialog',
  name: 'Dialog',
  category: 'Overlays',
  summary: 'A modal dialog interrupts the page to ask for a decision or show focused content. The page behind it can’t be used until it closes.',
  semantics: 'role="dialog" + aria-modal="true" (or <dialog>)',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  whenToUse: ['Use a dialog for short, focused tasks or confirmations that block the flow.', 'Avoid stacking dialogs on top of each other.'],
  keyboard: [
    { keys: ['Tab', 'Shift+Tab'], action: 'Cycles focus through elements inside the dialog only (focus is contained).' },
    { keys: ['Escape'], action: 'Closes the dialog and returns focus to the element that opened it.' },
  ],
  aria: [
    { attr: 'role="dialog"', where: 'container', usage: 'Use role="alertdialog" for urgent confirmations that need a response.' },
    { attr: 'aria-modal="true"', where: 'container', usage: 'Tells assistive tech the rest of the page is inert.' },
    { attr: 'aria-labelledby', where: 'container', usage: 'Points to the dialog title.' },
    { attr: 'aria-describedby', where: 'container', usage: 'Points to the main message, so it’s read when the dialog opens.' },
    { attr: 'inert', where: 'page behind', usage: 'Removes the background from focus and the accessibility tree.' },
  ],
  focus: [
    'When it opens, move focus to the first focusable element, or to the least destructive action for destructive confirmations.',
    'Keep focus inside the dialog while it is open.',
    'When it closes, return focus to the trigger.',
  ],
  screenReader: ['Announced as: “Delete Q3 report?, dialog, This permanently removes the file…”.'],
  dos: ['Use a clear title and a specific primary action (“Delete file”, not “OK”).', 'Always offer a visible way to close.'],
  donts: ['Don’t open dialogs automatically on page load.', 'Don’t put long forms or several steps in a modal.'],
  wcag: [WCAG.noTrap, WCAG.focusOrder, WCAG.nameRoleValue, WCAG.keyboard, WCAG.focusNotObscured],
  testing: [
    'Open with keyboard and confirm focus moves inside.',
    'Tab past the last element and confirm focus wraps inside the dialog.',
    'Press Escape and confirm focus returns to the trigger.',
    'With a screen reader, confirm the title and description are read on open.',
  ],
  Demo,
  code: `import { useEffect } from 'react';
import { Button, Dialog, useModal } from '@fluid-design/fluid-ui';

function ConfirmDelete({ dismiss, returnFocusTo }) {
  // Restore focus to the trigger when the dialog closes
  useEffect(() => () => setTimeout(() => returnFocusTo?.focus()), []);
  return (
    <Dialog>
      <Dialog.Header><Dialog.Title>Delete “Q3 report”?</Dialog.Title></Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>This permanently removes the file.</Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <Button onClick={dismiss}>Cancel</Button>
        <Button color="red" onClick={dismiss}>Delete file</Button>
      </Dialog.Footer>
    </Dialog>
  );
}

const [present] = useModal(ConfirmDelete);
<Button onClick={(e) => present({ returnFocusTo: e.currentTarget })}>
  Delete report…
</Button>`,
  fluid: {
    source: 'Fluid UI component',
    notes: [
      'Fluid UI’s Dialog is built on Headless UI’s Dialog: it traps focus, closes on Escape, sets aria-modal and links Dialog.Title and Dialog.Description.',
      'Wrap your app in FluidProvider so useModal can render dialogs.',
      'Because the dialog is rendered by the provider rather than next to its trigger, focus is not returned to the trigger on close. Pass the trigger into present() and focus it when the dialog unmounts, as shown in the code.',
      'Its motion respects prefers-reduced-motion through framer-motion’s useReducedMotion.',
    ],
  },
};
