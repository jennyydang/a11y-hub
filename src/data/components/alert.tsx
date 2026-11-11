import { useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { Alert } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full max-w-lg space-y-3">
      <Alert intent="warning" title="Scheduled maintenance">
        The dashboard will be read-only on Sunday from 02:00 to 04:00 UTC.
      </Alert>
      <Button weight="outline" color="gray" onClick={() => setShow((s) => !s)}>
        {show ? 'Hide' : 'Show'} payment error
      </Button>
      <div>
        {show && (
          <Alert intent="error" title="Payment declined" live>
            Your card was declined. Try a different card or contact your bank.
          </Alert>
        )}
      </div>
    </div>
  );
}

export const alert: ComponentSpec = {
  slug: 'alert',
  name: 'Alert',
  category: 'Feedback',
  summary: 'An inline message that draws attention to important information, like a warning or an error.',
  semantics: 'role="alert" (dynamic) or plain content (static)',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
  whenToUse: [
    'Use a static alert for information that’s there when the page loads.',
    'Add role="alert" only when the message appears after the user does something and needs immediate attention.',
  ],
  keyboard: [{ keys: ['—'], action: 'Alerts aren’t interactive. Any links or buttons inside follow their own keyboard rules.' }],
  aria: [
    { attr: 'role="alert"', where: 'dynamic error', usage: 'Assertive live region. The content is announced as soon as it’s inserted.' },
    { attr: 'role="status"', where: 'dynamic info/success', usage: 'Polite live region for less urgent updates.' },
    { attr: 'aria-hidden="true"', where: 'icon', usage: 'The icon is decorative. The intent is in visually hidden text (“Warning:”).' },
  ],
  focus: ['Alerts don’t take focus.', 'For form errors, move focus to the first invalid field or an error summary instead.'],
  screenReader: ['A dynamic error is announced right away: “Error: Payment declined. Your card was declined…”.', 'Static alerts are read in normal reading order.'],
  dos: ['Combine color with an icon and a text prefix (“Warning:”).', 'Explain what happened and what to do next.'],
  donts: [
    'Don’t put role="alert" on content that is there on page load. Some screen readers announce it immediately and it’s noisy.',
    'Don’t auto-hide alerts.',
  ],
  wcag: [WCAG.statusMessages, WCAG.useOfColor, WCAG.contrast, WCAG.errorId],
  testing: [
    'Turn on the color-blindness simulation and confirm the intent is still clear.',
    'Show the dynamic alert with a screen reader running and confirm it’s announced.',
    'Check text contrast is at least 4.5:1 against the tinted background.',
  ],
  Demo,
};
