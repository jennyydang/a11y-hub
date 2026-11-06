import { useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const MIN = 1;
const MAX = 10;

/**
 * A text input with − and + buttons. Typing always works; the buttons are a shortcut.
 * Avoids type="number" quirks (scroll-wheel changes, poor screen reader support).
 */
function Demo() {
  const id = useId();
  const [value, setValue] = useState('2');
  const [msg, setMsg] = useState('');
  const n = Number(value);
  const valid = /^\d+$/.test(value) && n >= MIN && n <= MAX;
  const set = (next: number) => {
    const v = Math.max(MIN, Math.min(MAX, next));
    setValue(String(v));
    setMsg(`Quantity ${v}`);
  };
  const btn = 'grid h-10 w-10 place-items-center rounded-lg text-lg font-bold ring-1 ring-gray-500 hover:bg-gray-100 focus-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-60 dark:ring-gray-400 dark:hover:bg-gray-800';

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        Number of tickets
      </label>
      <p id={`${id}-hint`} className="text-sm text-muted">
        Up to {MAX} per order.
      </p>
      {!valid && (
        <p id={`${id}-err`} className="text-sm font-semibold text-red-700 dark:text-red-300">
          Error: Enter a number from {MIN} to {MAX}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button type="button" aria-controls={id} onClick={() => set((valid ? n : MIN) - 1)} aria-disabled={valid && n <= MIN} className={btn}>
          <span aria-hidden="true">−</span>
          <span className="sr-only">Decrease number of tickets</span>
        </button>
        <input
          id={id}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          aria-describedby={`${id}-hint${valid ? '' : ` ${id}-err`}`}
          aria-invalid={!valid || undefined}
          className={`h-10 w-16 rounded-lg bg-white text-center tabular-nums focus-visible:outline-none dark:bg-gray-900 ${valid ? 'ring-1 ring-gray-500 focus-visible:ring-2 focus-visible:ring-primary-600 dark:ring-gray-400' : 'ring-[3px] ring-red-700 dark:ring-red-400'}`}
        />
        <button type="button" aria-controls={id} onClick={() => set((valid ? n : MIN) + 1)} aria-disabled={valid && n >= MAX} className={btn}>
          <span aria-hidden="true">+</span>
          <span className="sr-only">Increase number of tickets</span>
        </button>
      </div>
      <p role="status" className="sr-only">
        {msg}
      </p>
    </div>
  );
}

const code = `<label htmlFor="tickets">Number of tickets</label>
<p id="tickets-hint">Up to 10 per order.</p>
<button type="button" aria-controls="tickets" onClick={() => set(n - 1)}>
  <span aria-hidden="true">−</span><span className="sr-only">Decrease number of tickets</span>
</button>
<input id="tickets" inputMode="numeric" pattern="[0-9]*" value={value}
       onChange={(e) => setValue(e.target.value)} aria-describedby="tickets-hint" />
<button type="button" aria-controls="tickets" onClick={() => set(n + 1)}>
  <span aria-hidden="true">+</span><span className="sr-only">Increase number of tickets</span>
</button>
<p role="status" className="sr-only">{message}</p>`;

export const quantity: ComponentSpec = {
  slug: 'quantity',
  name: 'Quantity stepper',
  category: 'Forms',
  summary: 'A quantity stepper is a number field with − and + buttons for small whole numbers, like tickets. Typing always works too.',
  semantics: '<input inputmode="numeric"> with two named <button>s',
  whenToUse: [
    'Use it for small whole numbers people usually change by one or two, like tickets or guests.',
    'Use a plain text input for large or exact numbers, like an amount of money.',
    'Use a select for a short fixed list, like 1 to 5.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through −, the field and +.' },
    { keys: ['Enter', 'Space'], action: 'On a button: changes the value by one.' },
  ],
  aria: [
    { attr: 'inputmode="numeric"', where: 'input', usage: 'Shows a number keypad on phones, without type="number" quirks.' },
    { attr: 'Visually hidden text', where: '− and + buttons', usage: '“Decrease number of tickets”, not “minus”.' },
    { attr: 'aria-controls', where: 'buttons', usage: 'Points to the field they change.' },
    { attr: 'role="status"', where: 'hidden message', usage: 'Announces “Quantity 3” after a button press.' },
    { attr: 'aria-disabled', where: 'buttons at the limit', usage: 'Keeps the button focusable so focus isn’t lost at the limit.' },
  ],
  focus: ['Keep focus on the button after pressing it.', 'At the min or max, use aria-disabled instead of disabled so focus doesn’t jump.'],
  screenReader: ['“Increase number of tickets, button.” Then “Quantity 3”.', 'On the field: “Number of tickets, edit text, 3. Up to 10 per order.”'],
  dos: ['Make buttons at least 24×24px, ideally 44px on touch screens.', 'State the limits in the hint.', 'Validate typed values with a clear error.'],
  donts: ['Don’t use type="number" for this; scrolling the page can change the value.', 'Don’t use “−” and “+” as the only button names.', 'Don’t make the field read-only.'],
  wcag: [WCAG.nameRoleValue, WCAG.labels, WCAG.statusMessages, WCAG.targetSize, WCAG.errorId],
  testing: ['Press + and − with the keyboard and confirm the new value is announced.', 'Type a value directly, including an invalid one, and check the error.', 'At the maximum, confirm focus stays on +.', 'On a phone, confirm a number keypad appears.'],
  Demo,
  code,
  fluid: { source: 'Native HTML + Fluid styles', notes: ['Fluid UI doesn’t ship a stepper. This uses a native input and buttons with Fluid’s form tokens.'] },
};
