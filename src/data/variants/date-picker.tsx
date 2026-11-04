import { useId } from 'react';
import type { Variant } from '../types';
import { datePicker } from '../components/date-picker';

function SeparateFields() {
  const id = useId();
  const field = 'block rounded-lg bg-white px-3 py-2.5 text-base ring-1 ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:ring-gray-500 dark:focus-visible:ring-primary-300';
  return (
    <fieldset className="space-y-2" aria-describedby={`${id}-hint`}>
      <legend className="text-sm font-semibold">Date of birth</legend>
      <p id={`${id}-hint`} className="text-sm text-muted">For example, 27 3 1990</p>
      <div className="flex gap-3">
        {[
          ['Day', 'bday-day', 'w-16'],
          ['Month', 'bday-month', 'w-16'],
          ['Year', 'bday-year', 'w-24'],
        ].map(([label, ac, w]) => (
          <div key={label} className="space-y-1">
            <label htmlFor={`${id}-${label}`} className="block text-sm">{label}</label>
            <input id={`${id}-${label}`} inputMode="numeric" autoComplete={ac} className={`${field} ${w}`} />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export const datePickerVariants: Variant[] = [
  {
    id: 'native',
    label: 'Native date input',
    description: 'For dates in the near future or past. The browser provides typing, a localized format and a calendar.',
    Demo: datePicker.Demo,
    html: `<label for="checkin">Check-in date</label>
<p id="checkin-hint">Pick today or a later date.</p>
<input id="checkin" type="date" min="2026-11-04" aria-describedby="checkin-hint">
<p id="checkin-confirm" aria-live="polite"></p>

<script>
  const date = document.getElementById('checkin');
  date.addEventListener('change', () => {
    const d = new Date(date.value + 'T00:00:00');
    document.getElementById('checkin-confirm').textContent = date.value
      ? 'You picked ' + d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '.'
      : '';
  });
</script>`,
    code: datePicker.code,
  },
  {
    id: 'memorable',
    label: 'Memorable date',
    description: 'For dates people know by heart, like a birthday. Three labelled fields are faster than any calendar.',
    Demo: SeparateFields,
    html: `<fieldset aria-describedby="dob-hint">
  <legend>Date of birth</legend>
  <p id="dob-hint">For example, 27 3 1990</p>
  <label for="dob-day">Day</label>
  <input id="dob-day" inputmode="numeric" autocomplete="bday-day" size="2">
  <label for="dob-month">Month</label>
  <input id="dob-month" inputmode="numeric" autocomplete="bday-month" size="2">
  <label for="dob-year">Year</label>
  <input id="dob-year" inputmode="numeric" autocomplete="bday-year" size="4">
</fieldset>`,
    code: `<fieldset aria-describedby="dob-hint">
  <legend>Date of birth</legend>
  <p id="dob-hint">For example, 27 3 1990</p>
  <label htmlFor="dob-day">Day</label>
  <input id="dob-day" inputMode="numeric" autoComplete="bday-day" />
  {/* …month and year the same way */}
</fieldset>`,
  },
];
