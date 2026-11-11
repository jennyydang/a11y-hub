import { useId, useRef, useState } from 'react';
import { WCAG } from '../data/wcag';
import { cx } from '../ui';
import type { Pattern } from './types';

const SIZES = [
  { v: '7', ok: true },
  { v: '8', ok: true },
  { v: '9', ok: false },
  { v: '10', ok: true },
  { v: '11', ok: true },
];

function Demo() {
  const id = useId();
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState('');
  const firstSize = useRef<HTMLInputElement>(null);

  const add = () => {
    if (!size) {
      setError(true);
      setStatus('');
      firstSize.current?.focus();
      return;
    }
    setError(false);
    setStatus(`Added ${qty} Ridgeline trail runner, size ${size}, to your bag.`);
  };

  return (
    <section aria-labelledby={`${id}-h`} className="max-w-sm space-y-4">
      <div>
        <h3 id={`${id}-h`} className="text-xl font-bold">
          Ridgeline trail runner
        </h3>
        <p className="font-semibold">$120</p>
      </div>
      <fieldset aria-describedby={error ? `${id}-err` : undefined} className="space-y-2">
        <legend className="font-semibold">Size (US)</legend>
        {error && (
          <p id={`${id}-err`} className="text-sm font-semibold text-red-700 dark:text-red-300">
            <span aria-hidden="true">⚠ </span>Choose a size
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s, i) => (
            <label
              key={s.v}
              className={cx(
                'relative flex min-w-[3rem] cursor-pointer flex-col items-center rounded-md border px-3 py-1.5 text-sm has-[:checked]:border-primary-700 has-[:checked]:bg-primary-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-600 dark:has-[:checked]:bg-primary-900/40',
                error ? 'border-red-700 dark:border-red-300' : 'border-gray-500',
                !s.ok && 'cursor-not-allowed border-dashed text-muted',
              )}
            >
              <input
                ref={i === 0 ? firstSize : undefined}
                type="radio"
                name={`${id}-size`}
                value={s.v}
                disabled={!s.ok}
                checked={size === s.v}
                onChange={() => {
                  setSize(s.v);
                  setError(false);
                }}
                className="sr-only"
              />
              <span className="font-semibold">{s.v}</span>
              {!s.ok && <span className="text-xs">Sold out</span>}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-1">
        <label htmlFor={`${id}-qty`} className="block font-semibold">
          Quantity
        </label>
        <input
          id={`${id}-qty`}
          type="number"
          inputMode="numeric"
          min={1}
          max={5}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(5, Number(e.target.value) || 1)))}
          className="w-20 rounded-md border border-gray-500 bg-white px-2 py-1.5 dark:bg-gray-900"
        />
      </div>
      <button type="button" onClick={add} className="w-full rounded-md bg-primary-700 px-4 py-2.5 font-semibold text-white hover:bg-primary-800 focus-ring">
        Add to bag
      </button>
      <p role="status" className="text-sm font-medium">
        {status}
      </p>
    </section>
  );
}

export const buyBox: Pattern = {
  slug: 'buy-box',
  name: 'Add to cart (buy box)',
  category: 'Commerce',
  summary:
    'The part of a product page where people choose options and add the product to their bag. Options are real radio buttons, sold out options say so in words, errors are linked to the group, and adding is confirmed without moving focus.',
  uses: ['radio-group', 'fieldset', 'quantity', 'button', 'alert', 'toast'],
  whenToUse: ['Product detail pages with options such as size or color.', 'Quick-buy dialogs, using the same structure inside the dialog.'],
  structure: [
    { part: 'Product name', element: '<h1>', notes: 'On the product page it’s the page’s main heading.' },
    { part: 'Price', element: '<p>', notes: 'With hidden words for sale prices, as in the product listing.' },
    { part: 'Option group', element: '<fieldset> + <legend>', notes: 'One per option, like size or color. Each choice is a native radio button, styled as a tile.' },
    { part: 'Sold out option', element: '<input type="radio" disabled> with “Sold out” text', notes: 'Stays in the list, so people know it exists, with the reason in words.' },
    { part: 'Error', element: '<p> linked by aria-describedby', notes: 'Shown when Add is pressed without a choice. Focus moves to the first option.' },
    { part: 'Quantity', element: '<label> + <input type="number">', notes: 'Or the quantity stepper component.' },
    { part: 'Add button', element: '<button>', notes: 'Never disabled before a choice is made: let people press it and explain what’s missing.' },
    { part: 'Confirmation', element: 'role="status"', notes: 'Says what was added. Focus stays on the button. Update the bag count too.' },
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves into the size group (to the chosen size, or the first one), then quantity, then Add to bag.' },
    { keys: ['←', '→', '↑', '↓'], action: 'In the size group, moves between available sizes and selects them. Sold out sizes are skipped.' },
    { keys: ['Enter', 'Space'], action: 'On Add to bag, adds the product or shows the error.' },
  ],
  aria: [
    { attr: '<fieldset> + <legend>', where: 'each option group', usage: 'Announces “Size (US), group” with the choices.' },
    { attr: 'disabled', where: 'sold out radio', usage: 'Skips it in arrow key navigation. Its “Sold out” text is still read when browsing.' },
    { attr: 'aria-describedby', where: '<fieldset>, on error', usage: 'Reads “Choose a size” when focus enters the group.' },
    { attr: 'role="status"', where: 'confirmation', usage: 'Announces “Added 1 Ridgeline trail runner, size 8, to your bag.” without moving focus.' },
    { attr: 'aria-hidden="true"', where: 'warning icon', usage: 'The word “Choose” says it; the icon adds nothing.' },
  ],
  content: [
    { label: 'Option group name', target: '<legend>', guidance: 'Include the unit or system if it matters.', good: 'Size (US)' },
    { label: 'Unavailable option', target: 'Option text', guidance: 'Say why it can’t be chosen.', good: 'Sold out' },
    { label: 'Missing choice error', target: 'Error message', guidance: 'Say what to do, not what went wrong.', good: 'Choose a size' },
    { label: 'Add button', target: 'Button text', guidance: 'A verb and where it goes.', good: 'Add to bag' },
    { label: 'Added confirmation', target: 'role="status"', guidance: 'What was added, with the options chosen.', good: 'Added 1 Ridgeline trail runner, size 8, to your bag.' },
  ],
  design: [
    'Option tiles show selection with more than color: a thicker border, a fill and a check, or a text change.',
    'Sold out tiles look different in more than color, such as a dashed border plus the words “Sold out”.',
    'Tiles are at least 24 by 24px, and show a focus ring when the radio inside has focus.',
    'The error sits next to the group, in text, with an icon, and the group border changes too.',
    'The confirmation is visible near the button, and the bag count in the header updates.',
  ],
  screenReader: [
    '“Ridgeline trail runner, heading level 1. $120.”',
    'Press Add to bag with no size: focus moves to the sizes. “Size (US), group. Choose a size. 7, radio button, not checked, 1 of 5.”',
    'Arrow right: “8, radio button, checked.”',
    '“Quantity, spin button, 1.” Then “Add to bag, button.”',
    'Press it: “Added 1 Ridgeline trail runner, size 8, to your bag.”',
  ],
  mistakes: [
    'Size tiles built as <div>s or buttons without radio semantics, so the choice isn’t announced.',
    'Removing sold out sizes, or showing them only with a strike through or grey color.',
    'Disabling Add to bag until a size is chosen, with no explanation.',
    'An error that appears only as a red border.',
    'Opening a mini-cart drawer that steals focus with no way back, or adding silently with no confirmation.',
  ],
  testing: [
    'Each option group has a legend and real radio buttons.',
    'Sold out options are announced as unavailable, with the reason.',
    'Pressing Add with nothing chosen shows a text error, moves focus to the group and reads the error.',
    'Adding announces what was added, and focus stays on the button.',
    'Selection and sold out states don’t rely on color alone.',
    'Tiles, quantity and button are at least 24 by 24px and work at 320px wide.',
  ],
  wcag: [WCAG.infoRel, WCAG.useOfColor, WCAG.nonTextContrast, WCAG.keyboard, WCAG.focusOrder, WCAG.focusVisible, WCAG.targetSize, WCAG.labels, WCAG.errorId, WCAG.errorSuggest, WCAG.nameRoleValue, WCAG.statusMessages],
  sources: [
    { title: 'Radios component', url: 'https://design-system.service.gov.uk/components/radios/', by: 'GOV.UK Design System', note: 'Grouped radios with a legend and inline errors.' },
    { title: 'Radio Group pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/', by: 'W3C WAI ARIA Authoring Practices', note: 'Arrow key behavior.' },
    { title: 'Understanding Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', by: 'W3C WAI', note: 'Confirming “added to bag” without moving focus.' },
  ],
  roles: {
    content: ['Write the legend, sold out wording, error and confirmation.', 'Mark the confirmation for translation; it may only be heard.'],
    design: ['Design selected, sold out, focus and error states without color alone.', 'Show the confirmation and the bag count change.'],
    frontend: ['Use native radios in a fieldset, styled as tiles.', 'On error, focus the group and link the message; on success, announce in a status.'],
    qa: ['Try adding with no size chosen.', 'Check sold out options and the confirmation in a screen reader.'],
  },
  Demo,
  html: `<h1>Ridgeline trail runner</h1>
<p>$120</p>
<fieldset aria-describedby="size-error">
  <legend>Size (US)</legend>
  <p id="size-error" class="error">Choose a size</p> <!-- only when shown -->
  <label><input type="radio" name="size" value="8"> 8</label>
  <label><input type="radio" name="size" value="9" disabled> 9 <span>Sold out</span></label>
</fieldset>
<label for="qty">Quantity</label>
<input id="qty" type="number" min="1" max="5" value="1">
<button type="button">Add to bag</button>
<p role="status"></p>`,
};
