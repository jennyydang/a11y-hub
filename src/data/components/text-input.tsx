import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '@fluid-design/fluid-ui';
import { TextField } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      // Render the error first, so it is part of the description when focus lands on the field.
      flushSync(() => {
        setError(email ? 'Enter an email address in the format name@example.com.' : 'Enter your email address.');
        setSent(false);
      });
      ref.current?.focus();
      return;
    }
    setError('');
    setSent(true);
  };
  return (
    <form noValidate onSubmit={submit} className="w-full max-w-sm space-y-4">
      <TextField
        ref={ref}
        label="Email address"
        type="email"
        name="email"
        autoComplete="email"
        required
        hint="We’ll only use this to send your receipt."
        value={email}
        error={error}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button as="button" type="submit" className="btn-bold-primary">
        Send receipt
      </Button>
      <p role="status" className="text-sm text-emerald-800 dark:text-emerald-200">
        {sent ? 'Receipt sent.' : ''}
      </p>
    </form>
  );
}

export const textInput: ComponentSpec = {
  slug: 'text-input',
  name: 'Text input',
  category: 'Forms',
  summary: 'A single-line field for typing text, like a name, email address or search term.',
  semantics: '<input type="text|email|…"> + <label>',
  whenToUse: [
    'Use the most specific input type (email, tel, url, number) so mobile keyboards adapt.',
    'Use a textarea for answers that may span more than one line.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus into the field.' },
    { keys: ['Enter'], action: 'Submits the surrounding form.' },
  ],
  aria: [
    { attr: '<label for>', where: 'label', usage: 'Gives the input its accessible name. Clicking the label also focuses the input.' },
    { attr: 'aria-describedby', where: 'input', usage: 'Points to hint text and the error message, so they are read after the name.' },
    { attr: 'aria-invalid="true"', where: 'input', usage: 'Set only after validation fails. Remove it when the value is fixed.' },
    { attr: 'required', where: 'input', usage: 'Announces the field as required. Also show it visually.' },
    { attr: 'autocomplete', where: 'input', usage: 'Identifies personal data fields (email, name, tel) so browsers and assistive tech can fill them.' },
  ],
  focus: [
    'On a failed submit, move focus to the first invalid field, or to an error summary at the top when there are several.',
    'Never move focus or submit while the user is typing.',
  ],
  screenReader: [
    'Announced as: “Email address, required, edit text, We’ll only use this to send your receipt.”',
    'With an error: “… invalid entry, Error: Enter your email address.”',
  ],
  dos: [
    'Keep the label visible at all times, above the field.',
    'Write errors that say how to fix the problem.',
    'Give the input border at least 3:1 contrast against its background.',
  ],
  donts: [
    'Don’t use placeholder text as the label. It disappears on input and usually has low contrast.',
    'Don’t validate on every keystroke. Wait for blur or submit.',
    'Don’t show errors with red color alone. Add an icon and text.',
  ],
  wcag: [WCAG.labels, WCAG.infoRel, WCAG.inputPurpose, WCAG.errorId, WCAG.errorSuggest, WCAG.nonTextContrast, WCAG.onInput],
  testing: [
    'Click the label and confirm the input receives focus.',
    'Submit empty and confirm the error is announced and focus moves to the field.',
    'Check that the hint and error are read after the label.',
    'Zoom to 400% (or 320px wide) and confirm nothing is cut off.',
  ],
  Demo,
  code: `const id = useId();

<label htmlFor={id}>Email address</label>
<p id={\`\${id}-hint\`}>We'll only use this to send your receipt.</p>
<input
  id={id}
  type="email"
  autoComplete="email"
  required
  aria-invalid={error ? true : undefined}
  aria-describedby={\`\${id}-hint \${error ? \`\${id}-error\` : ''}\`}
/>
{error && <p id={\`\${id}-error\`}>{error}</p>}`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI’s Input renders <label for={name}> but does not set a matching id on the input, so the label is not linked. Pass id={name} if you use it.',
      'It also swaps the label text for the error message, which means the field’s name changes when it is invalid. This site uses its own TextField with Fluid’s form styling that keeps the label and links the error with aria-describedby.',
      'Fluid’s input background (gray-100 at 30% opacity) has no visible border, so we added a 3:1 outline ring.',
    ],
  },
};
