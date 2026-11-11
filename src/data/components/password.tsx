import { useId, useState } from 'react';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';

const field = 'block w-full rounded-lg bg-white px-3 py-2 ring-1 ring-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-900 dark:ring-gray-400';
const showBtn = 'flex-none rounded-lg px-3 py-2 text-sm font-semibold text-primary-800 ring-1 ring-gray-500 hover:bg-gray-100 focus-ring dark:text-primary-200 dark:ring-gray-400 dark:hover:bg-gray-800';

function PasswordField({ label, autoComplete, hint, rules }: { label: string; autoComplete: string; hint?: string; rules?: boolean }) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const [value, setValue] = useState('');
  const checks = [
    { ok: value.length >= 12, text: 'At least 12 characters' },
    { ok: /\d/.test(value), text: 'At least one number' },
  ];
  return (
    <div className="w-full max-w-sm space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          type={shown ? 'text' : 'password'}
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-describedby={[hint && `${id}-hint`, rules && `${id}-rules`].filter(Boolean).join(' ') || undefined}
          className={field}
        />
        {/* The visible text changes, so no aria-pressed; the status below confirms it */}
        <button type="button" aria-controls={id} onClick={() => setShown((s) => !s)} className={showBtn}>
          {shown ? 'Hide' : 'Show'}
          <span className="sr-only"> password</span>
        </button>
      </div>
      <p role="status" className="sr-only">
        {shown ? 'Your password is visible' : 'Your password is hidden'}
      </p>
      {rules && (
        <ul id={`${id}-rules`} className="space-y-1 pt-1 text-sm">
          {checks.map((c) => (
            <li key={c.text} className={`flex items-center gap-2 ${c.ok ? 'text-emerald-800 dark:text-emerald-300' : 'text-muted'}`}>
              <span aria-hidden="true">{c.ok ? '✓' : '○'}</span>
              {c.text}
              <span className="sr-only">{c.ok ? ' (done)' : ' (not yet)'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const passwordVariants: Variant[] = [
  {
    id: 'sign-in',
    label: 'Sign in',
    description: 'For entering an existing password. autocomplete="current-password" lets password managers fill it.',
    Demo: () => <PasswordField label="Password" autoComplete="current-password" />,
    html: `<label for="password">Password</label>
<div class="password-row">
  <input id="password" type="password" autocomplete="current-password" spellcheck="false" autocapitalize="none">
  <button type="button" aria-controls="password" class="show">Show<span class="sr-only"> password</span></button>
</div>
<p role="status" class="sr-only">Your password is hidden</p>

<script>
  const input = document.getElementById('password');
  const btn = document.querySelector('.show');
  const status = document.querySelector('[role=status]');
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.firstChild.textContent = show ? 'Hide' : 'Show';
    status.textContent = show ? 'Your password is visible' : 'Your password is hidden';
  });
</script>`,
  },
  {
    id: 'new',
    label: 'New password',
    description: 'For creating a password. Rules are listed up front and linked with aria-describedby; each one shows a check, not just a color.',
    Demo: () => <PasswordField label="Create a password" autoComplete="new-password" hint="Use a long phrase that’s easy for you to remember." rules />,
    html: `<label for="new-password">Create a password</label>
<p id="pw-hint">Use a long phrase that’s easy for you to remember.</p>
<input id="new-password" type="password" autocomplete="new-password" aria-describedby="pw-hint pw-rules">
<button type="button" aria-controls="new-password">Show<span class="sr-only"> password</span></button>
<ul id="pw-rules">
  <li><span aria-hidden="true">○</span> At least 12 characters<span class="sr-only"> (not yet)</span></li>
  <li><span aria-hidden="true">○</span> At least one number<span class="sr-only"> (not yet)</span></li>
</ul>`,
  },
];

export const password: ComponentSpec = {
  slug: 'password',
  name: 'Password field',
  category: 'Forms',
  summary: 'A password field hides what people type, with a Show button so they can check it. It must work with password managers and paste.',
  semantics: '<input type="password"> with autocomplete, plus a Show/Hide <button>',
  whenToUse: [
    'Use it for passwords and other secrets people type.',
    'Always offer Show, so people can check for typos without retyping.',
    'Don’t ask people to type a new password twice; Show does the same job with less effort.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves from the field to the Show button.' },
    { keys: ['Enter', 'Space'], action: 'On Show: reveals or hides the password. Focus stays on the button.' },
  ],
  aria: [
    { attr: 'autocomplete', where: 'input', usage: '"current-password" to sign in, "new-password" to create one. Lets password managers help.' },
    { attr: 'aria-controls', where: 'Show button', usage: 'Points to the input it reveals.' },
    { attr: 'Visually hidden text', where: 'Show button', usage: '“Show password”, so the button makes sense on its own.' },
    { attr: 'role="status"', where: 'hidden message', usage: '“Your password is visible” after toggling.' },
    { attr: 'aria-describedby', where: 'input', usage: 'Links the hint and the rules list.' },
  ],
  focus: ['Keep focus on the Show button after toggling.', 'Don’t block paste; it breaks password managers and makes long passwords harder.'],
  screenReader: ['“Password, secure edit text.” Then “Show password, button”.', 'After pressing: “Your password is visible”.'],
  dos: ['Allow paste.', 'List the rules before people type.', 'Explain errors in words: “Password must be at least 12 characters”.'],
  donts: ['Don’t set maximum lengths that are lower than people need.', 'Don’t clear the field on an error.', 'Don’t use an eye icon without a text name.'],
  wcag: [WCAG.inputPurpose, WCAG.labels, WCAG.errorSuggest, WCAG.nameRoleValue, WCAG.statusMessages, WCAG.authentication],
  testing: [
    'Fill it with a password manager and confirm it works.',
    'Paste a password and confirm it’s accepted.',
    'Press Show and confirm the change is announced and focus stays on the button.',
    'With the new password variation, confirm each rule announces done or not yet.',
  ],
  Demo: passwordVariants[0].Demo,
};

