import { useEffect, useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const LIMIT = 200;

/**
 * No hard maxlength: people can type past the limit and edit down, instead of text being
 * cut off silently. The visible count updates as they type; the announcement waits for a pause.
 */
function Demo() {
  const id = useId();
  const [value, setValue] = useState('');
  const left = LIMIT - value.length;
  const message = left >= 0 ? `You have ${left} ${left === 1 ? 'character' : 'characters'} remaining` : `You have ${-left} ${left === -1 ? 'character' : 'characters'} too many`;
  const [announced, setAnnounced] = useState('');
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(message), 1000);
    return () => window.clearTimeout(t);
  }, [message]);
  const over = left < 0;

  return (
    <div className="w-full max-w-md space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        Describe the problem
      </label>
      <p id={`${id}-hint`} className="text-sm text-muted">
        Include what you were doing when it happened. You can enter up to {LIMIT} characters.
      </p>
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby={`${id}-hint ${id}-count`}
        aria-invalid={over || undefined}
        className={`block w-full rounded-lg bg-white p-3 focus-visible:outline-none dark:bg-gray-900 ${
          over ? 'ring-[3px] ring-red-700 dark:ring-red-400' : 'ring-1 ring-gray-500 focus-visible:ring-2 focus-visible:ring-primary-600 dark:ring-gray-400'
        }`}
      />
      {/* Visible count: not live, so it isn't read on every keystroke */}
      <p id={`${id}-count`} aria-hidden="true" className={`text-sm ${over ? 'font-semibold text-red-700 dark:text-red-300' : 'text-muted'}`}>
        {over && <span>Error: </span>}
        {message}
      </p>
      {/* Announced copy, updated after a 1 second pause in typing */}
      <p role="status" className="sr-only">
        {announced}
      </p>
    </div>
  );
}

const code = `const left = limit - value.length;
const message = left >= 0 ? \`You have \${left} characters remaining\` : \`You have \${-left} characters too many\`;
const announced = useDebounced(message, 1000);

<label htmlFor="details">Describe the problem</label>
<p id="details-hint">You can enter up to {limit} characters.</p>
<textarea id="details" value={value} onChange={…}
  aria-describedby="details-hint details-count" aria-invalid={left < 0 || undefined} />
<p id="details-count" aria-hidden="true">{message}</p>
<p role="status" className="sr-only">{announced}</p>`;

export const characterCount: ComponentSpec = {
  slug: 'character-count',
  name: 'Character count',
  category: 'Forms',
  summary: 'A character count tells people how much more they can type in a limited field, and when they’ve gone over, without cutting their text off.',
  semantics: '<textarea> with a hint, a visible count and a debounced role="status"',
  whenToUse: [
    'Use it when there’s a real limit, like a database field or an SMS.',
    'State the limit in the hint before people start typing.',
    'Don’t add a limit just to use the component; long answers are often useful.',
  ],
  keyboard: [{ keys: ['—'], action: 'No extra keys; it’s a normal textarea.' }],
  aria: [
    { attr: 'aria-describedby', where: 'textarea', usage: 'Links the hint and the count, so both are read on focus.' },
    { attr: 'role="status"', where: 'hidden copy of the count', usage: 'Announced after a pause in typing, not on every key.' },
    { attr: 'aria-invalid', where: 'textarea, when over', usage: 'Marks the field as invalid.' },
    { attr: 'No maxlength', where: 'textarea', usage: 'Let people type past the limit and edit down, instead of silently cutting off text.' },
  ],
  focus: ['Focus stays in the field; the count never takes focus.'],
  screenReader: ['On focus: “Describe the problem, edit text. Include what you were doing… You have 200 characters remaining.”', 'After a pause: “You have 12 characters remaining.”'],
  dos: ['Say “remaining” and “too many” in words.', 'Wait for a pause before announcing.', 'Show “too many” as an error with more than color.'],
  donts: ['Don’t use maxlength to block typing; pasted text gets cut without warning.', 'Don’t announce on every keystroke.', 'Don’t show only a fraction like “180/200”.'],
  wcag: [WCAG.labels, WCAG.statusMessages, WCAG.errorId, WCAG.useOfColor],
  testing: [
    'Type and pause, and confirm the remaining count is announced once.',
    'Paste text over the limit and confirm nothing is cut off and the error is clear.',
    'Check the over-limit state in grayscale.',
  ],
  Demo,
  code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI doesn’t ship a character count. This uses a native textarea with Fluid’s form tokens.', 'The error state uses a thicker border and an “Error:” prefix, not only red.'],
  },
};
