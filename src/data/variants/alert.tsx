import { useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { Alert } from '../../ui';
import type { Variant } from '../types';

type Intent = 'info' | 'success' | 'warning' | 'error';
const copy: Record<Intent, [string, string]> = {
  info: ['New dashboard layout', 'Your widgets have moved to the left sidebar.'],
  success: ['Payment received', 'We’ve emailed your receipt to sam@example.com.'],
  warning: ['Scheduled maintenance', 'The dashboard will be read-only on Sunday from 02:00 to 04:00 UTC.'],
  error: ['Payment declined', 'Your card was declined. Try a different card or contact your bank.'],
};
const label: Record<Intent, string> = { info: 'Info', success: 'Success', warning: 'Warning', error: 'Error' };

const staticVariant = (intent: Intent): Variant => ({
  id: intent,
  label: label[intent],
  description: `A static ${intent} message that’s on the page when it loads. It needs no live role.`,
  Demo: () => (
    <Alert className="w-full max-w-lg" intent={intent} title={copy[intent][0]}>
      {copy[intent][1]}
    </Alert>
  ),
  html: `<div class="alert alert-${intent}">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  <p><strong><span class="sr-only">${label[intent]}: </span>${copy[intent][0]}</strong></p>
  <p>${copy[intent][1]}</p>
</div>`,
});

function Live() {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full max-w-lg space-y-3">
      <Button weight="outline" color="gray" onClick={() => setShow((s) => !s)}>
        {show ? 'Hide' : 'Show'} payment error
      </Button>
      <div>
        {show && (
          <Alert intent="error" title={copy.error[0]} live>
            {copy.error[1]}
          </Alert>
        )}
      </div>
    </div>
  );
}

export const alertVariants: Variant[] = [
  staticVariant('info'),
  staticVariant('success'),
  staticVariant('warning'),
  staticVariant('error'),
  {
    id: 'live',
    label: 'Dynamic (announced)',
    description: 'A message added after the page loads. role="alert" makes screen readers announce it right away.',
    Demo: Live,
    html: `<button type="button" id="pay">Pay now</button>
<!-- The alert container exists, empty, before the message is added -->
<div id="payment-error" role="alert"></div>

<script>
  document.getElementById('pay').addEventListener('click', () => {
    document.getElementById('payment-error').innerHTML =
      '<p><strong>Error: Payment declined.</strong> Try a different card or contact your bank.</p>';
  });
</script>`,
  },
];
