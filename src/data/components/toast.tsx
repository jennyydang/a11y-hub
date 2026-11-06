import { Button, useToast } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const [present] = useToast() as [(o: Record<string, unknown>) => void];
  return (
    <>
      <Button className="btn-bold-primary" onClick={() => present({ title: 'Changes saved', message: 'Your profile is up to date.', role: 'success', duration: 6000 })}>
        Save profile
      </Button>
      <Button weight="outline" color="gray" onClick={() => present({ title: 'Couldn’t upload photo', message: 'The file is larger than 5 MB.', role: 'error' })}>
        Upload large photo
      </Button>
    </>
  );
}

export const toast: ComponentSpec = {
  slug: 'toast',
  name: 'Toast',
  category: 'Feedback',
  summary: 'A brief, non-blocking message that confirms an action or reports a problem.',
  semantics: 'live region (role="status" / role="alert")',
  whenToUse: [
    'Use toasts to confirm that something happened, like “Changes saved”.',
    'Don’t use a toast for anything the user must act on or read in full. Use an inline alert or a dialog.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'A dismiss button or action inside the toast is reachable by keyboard.' },
    { keys: ['Escape'], action: 'Optional: dismisses the most recent toast.' },
  ],
  aria: [
    { attr: 'role="status" / aria-live="polite"', where: 'toast region', usage: 'For confirmations. They’re announced when the screen reader is idle.' },
    { attr: 'role="alert" / aria-live="assertive"', where: 'error toast', usage: 'Interrupts the user. Use it only for errors.' },
    { attr: 'aria-atomic="true"', where: 'region', usage: 'Reads the whole toast, not just the changed text.' },
  ],
  focus: [
    'Don’t move focus to a toast. It would pull users away from their task.',
    'The live region must exist in the DOM before the message is inserted, or it may not be announced.',
  ],
  screenReader: ['Announced without moving focus: “Changes saved. Your profile is up to date.”'],
  dos: [
    'Keep toasts on screen for at least 5 seconds, longer for longer text, and pause the timer on hover and focus (WCAG 2.2.1).',
    'Don’t auto-dismiss error toasts.',
    'Make any action in a toast available elsewhere too.',
  ],
  donts: ['Don’t use assertive announcements for routine confirmations.', 'Don’t show several toasts at once for one action.'],
  wcag: [WCAG.statusMessages, WCAG.timing, WCAG.pause, WCAG.useOfColor],
  testing: [
    'Trigger a toast with a screen reader running and confirm it’s announced without moving focus.',
    'Measure how long it stays. It should be long enough to read twice.',
    'Confirm errors persist until dismissed.',
  ],
  Demo,
  code: `import { Button, useToast } from '@fluid-design/fluid-ui';

const [present] = useToast();

<Button onClick={() => present({
  title: 'Changes saved',
  message: 'Your profile is up to date.',
  role: 'success',
  duration: 6000,
})}>Save profile</Button>`,
  fluid: {
    source: 'Fluid UI component',
    notes: [
      'Fluid UI renders all toasts into a single, always-present live region, which is the right setup for reliable announcements.',
      'That region is aria-live="assertive" for every toast, so success messages interrupt too. For a stricter setup, mirror confirmations into your own role="status" region.',
      'Default timeouts are 2s for success and 3s for default, which is short. Pass a longer duration. Errors stay until dismissed, which is good.',
    ],
  },
};
