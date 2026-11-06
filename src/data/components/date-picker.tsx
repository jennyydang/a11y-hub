import { useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const id = useId();
  const [value, setValue] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const pretty = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        Check-in date
      </label>
      <p id={`${id}-hint`} className="text-sm text-muted">
        Pick today or a later date.
      </p>
      <input
        id={id}
        type="date"
        min={today}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby={`${id}-hint`}
        className="block w-full rounded-lg bg-white px-4 py-2.5 text-base ring-1 ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:ring-gray-500 dark:focus-visible:ring-primary-300"
      />
      <p className="min-h-[1.5rem] text-sm" aria-live="polite">
        {pretty && <>You picked {pretty}.</>}
      </p>
    </div>
  );
}

export const datePicker: ComponentSpec = {
  slug: 'date-picker',
  name: 'Date picker',
  category: 'Forms',
  summary: 'A date picker lets people enter a date, by typing or by choosing from a calendar.',
  semantics: '<input type="date"> (or text input + calendar dialog)',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/',
  whenToUse: [
    'Use the native date input first. Browsers give it keyboard entry, a localized format and a calendar that works with screen readers.',
    'For dates people know by heart, like a birthday, three text fields (day, month, year) are faster than any calendar.',
    'Build a custom calendar only when you need things native inputs can’t do, like showing prices or unavailable dates.',
  ],
  keyboard: [
    { keys: ['ArrowUp', 'ArrowDown'], action: 'Native input: changes the focused part (day, month or year).' },
    { keys: ['ArrowLeft', 'ArrowRight'], action: 'Native input: moves between the day, month and year parts.' },
    { keys: ['0–9'], action: 'Types the date directly.' },
    { keys: ['Arrow keys'], action: 'Custom calendar grid: moves by day (left/right) and by week (up/down).' },
    { keys: ['PageUp', 'PageDown'], action: 'Custom calendar grid: previous or next month.' },
    { keys: ['Enter'], action: 'Custom calendar grid: selects the focused date and closes the calendar.' },
    { keys: ['Escape'], action: 'Custom calendar: closes without changing the date and returns focus to the button.' },
  ],
  aria: [
    { attr: '<label for>', where: 'input', usage: 'Names the field.' },
    { attr: 'min / max', where: 'native input', usage: 'Limits the range and disables dates outside it in the calendar.' },
    { attr: 'aria-describedby', where: 'input', usage: 'Links a hint. For text inputs, always state the format, like “DD/MM/YYYY”.' },
    { attr: 'role="dialog" + role="grid"', where: 'custom calendar', usage: 'The calendar is a dialog with a grid of days. Each day is a gridcell with a full date name.' },
    { attr: 'aria-selected / aria-current="date"', where: 'custom day cells', usage: 'Marks the chosen date and today.' },
  ],
  focus: [
    'Typing must always work. Never force people to use the calendar.',
    'A custom calendar opens from a button next to the field and returns focus to it on close.',
  ],
  screenReader: ['Native input: “Check-in date, date, Pick today or a later date”.', 'Confirm the chosen date in words, as this example does with a polite live region.'],
  dos: ['Accept typed dates in more than one format when you can.', 'Show the date back in an unambiguous form, like “Friday, 6 November 2026”.'],
  donts: ['Don’t make the text field read-only to force calendar use.', 'Don’t use a calendar for dates far in the past, like a date of birth.'],
  wcag: [WCAG.labels, WCAG.keyboard, WCAG.nameRoleValue, WCAG.errorSuggest, WCAG.inputPurpose],
  testing: [
    'Type a date with the keyboard alone.',
    'Try a date before the minimum and confirm it’s rejected with a clear message.',
    'With a screen reader, confirm the label, hint and chosen date are announced.',
  ],
  Demo,
  code: `<label for="checkin">Check-in date</label>
<p id="checkin-hint">Pick today or a later date.</p>
<input id="checkin" type="date" min="2026-11-04" aria-describedby="checkin-hint" />`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI has no date picker. The native input is the most robust choice, styled here with Fluid’s form colors.'],
  },
};
