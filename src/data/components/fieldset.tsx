import { useId } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const field = 'mt-1 block w-full rounded-lg bg-white px-3 py-2 ring-1 ring-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-900 dark:ring-gray-400 dark:focus-visible:ring-primary-300';

/** A fieldset groups related fields under one question, the legend. */
function Demo() {
  const id = useId();
  return (
    <fieldset className="max-w-md space-y-4">
      <legend className="mb-1 text-lg font-semibold">What is your address?</legend>
      <div>
        <label htmlFor={`${id}-l1`} className="block text-sm font-semibold">
          Address line 1
        </label>
        <input id={`${id}-l1`} autoComplete="address-line1" className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-l2`} className="block text-sm font-semibold">
          Address line 2 (optional)
        </label>
        <input id={`${id}-l2`} autoComplete="address-line2" className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-town`} className="block text-sm font-semibold">
            Town or city
          </label>
          <input id={`${id}-town`} autoComplete="address-level2" className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-pc`} className="block text-sm font-semibold">
            Postcode
          </label>
          <input id={`${id}-pc`} autoComplete="postal-code" className={`${field} max-w-[10ch]`} />
        </div>
      </div>
    </fieldset>
  );
}


export const fieldsetSpec: ComponentSpec = {
  slug: 'fieldset',
  name: 'Fieldset',
  category: 'Forms',
  summary: 'A fieldset groups related fields, like the parts of an address, under one question called the legend. Screen readers read the legend when people enter the group.',
  semantics: '<fieldset> with a <legend>',
  whenToUse: [
    'Use it for a set of radios or checkboxes that answer one question.',
    'Use it for fields that only make sense together, like an address or a date.',
    'Don’t wrap a single field, or a whole long form, in a fieldset.',
  ],
  keyboard: [{ keys: ['Tab'], action: 'Moves through the fields in order. The fieldset itself isn’t focusable.' }],
  aria: [
    { attr: '<fieldset>', where: 'wrapper', usage: 'Has the group role natively. No ARIA needed.' },
    { attr: '<legend>', where: 'first child', usage: 'Names the group. It must be the first child of the fieldset.' },
    { attr: '<h1> inside <legend>', where: 'one-question pages', usage: 'When the question is the page title, put the heading inside the legend so it isn’t read twice.' },
    { attr: 'role="group" + aria-labelledby', where: 'custom layouts', usage: 'Only when a fieldset can’t be used.' },
  ],
  focus: ['Entering the first field announces the legend, then the field label.'],
  screenReader: ['“What is your address?, group. Address line 1, edit text.”', 'Some screen readers repeat the legend for every field, so keep it short.'],
  dos: ['Write the legend as the question people are answering.', 'Keep the legend short; put extra help in a hint linked with aria-describedby.', 'Mark optional fields in the label.'],
  donts: ['Don’t nest fieldsets.', 'Don’t use a styled div or heading in place of a legend.', 'Don’t put long instructions inside the legend.'],
  wcag: [WCAG.infoRel, WCAG.labels, WCAG.headings, WCAG.inputPurpose],
  testing: [
    'Tab into the first field with a screen reader and confirm the legend is read.',
    'Check the legend is the first child of the fieldset in the DOM.',
    'Confirm related fields don’t make sense without the legend, and that it’s visible.',
  ],
  Demo,
};
