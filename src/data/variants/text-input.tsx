import { TextField } from '../../ui';
import type { Variant } from '../types';
import { textInput } from '../components/text-input';

export const textInputVariants: Variant[] = [
  {
    id: 'validation',
    label: 'With validation',
    description: 'Submit with an empty or invalid value to see the error appear, get linked and receive focus.',
    Demo: textInput.Demo,
    html: `<form novalidate>
  <label for="email">Email address <span aria-hidden="true">*</span></label>
  <p id="email-hint">We'll only use this to send your receipt.</p>
  <input id="email" type="email" autocomplete="email" required aria-describedby="email-hint">
  <p id="email-error" hidden></p>
  <button type="submit">Send receipt</button>
</form>

<script>
  const form = document.querySelector('form');
  const input = document.getElementById('email');
  const error = document.getElementById('email-error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = !input.validity.valid;
    error.hidden = !bad;
    error.textContent = bad ? 'Error: Enter an email address in the format name@example.com.' : '';
    input.toggleAttribute('aria-invalid', bad);
    input.setAttribute('aria-describedby', bad ? 'email-hint email-error' : 'email-hint');
    if (bad) input.focus();
  });
</script>`,
    code: textInput.code,
  },
  {
    id: 'hint',
    label: 'With hint',
    description: 'The hint is linked with aria-describedby, so it’s read after the label.',
    Demo: () => (
      <TextField className="w-full max-w-sm" label="Phone number" type="tel" autoComplete="tel" hint="Include your country code, like +44 20 7946 0000." />
    ),
    html: `<label for="phone">Phone number</label>
<p id="phone-hint">Include your country code, like +44 20 7946 0000.</p>
<input id="phone" type="tel" autocomplete="tel" aria-describedby="phone-hint">`,
    code: `<TextField label="Phone number" type="tel" autoComplete="tel"
  hint="Include your country code, like +44 20 7946 0000." />`,
  },
  {
    id: 'error',
    label: 'Error state',
    description: 'aria-invalid marks the field, and the error text is linked so it’s read with the label.',
    Demo: () => (
      <TextField className="w-full max-w-sm" label="Postcode" defaultValue="SW1A" autoComplete="postal-code" error="Enter a full postcode, like SW1A 1AA." />
    ),
    html: `<label for="postcode">Postcode</label>
<input id="postcode" value="SW1A" autocomplete="postal-code"
       aria-invalid="true" aria-describedby="postcode-error">
<p id="postcode-error">
  <svg aria-hidden="true" focusable="false">…</svg>
  <span class="sr-only">Error: </span>Enter a full postcode, like SW1A 1AA.
</p>`,
    code: `<TextField label="Postcode" defaultValue="SW1A" autoComplete="postal-code"
  error="Enter a full postcode, like SW1A 1AA." />`,
  },
  {
    id: 'read-only',
    label: 'Read-only',
    description: 'readonly keeps the value focusable and selectable. Use disabled only when the value doesn’t matter.',
    Demo: () => <TextField className="w-full max-w-sm" label="Account ID" readOnly defaultValue="ACC-48213" hint="Contact support to change this." />,
    html: `<label for="account">Account ID</label>
<p id="account-hint">Contact support to change this.</p>
<input id="account" value="ACC-48213" readonly aria-describedby="account-hint">`,
    code: `<TextField label="Account ID" readOnly defaultValue="ACC-48213" hint="Contact support to change this." />`,
  },
];
