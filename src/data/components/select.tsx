import { Form, Select } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  return (
    <div className="w-full max-w-xs">
      <Form initialValues={{ size: 'Medium' }} onSubmit={() => undefined}>
        <Select name="size" label="T-shirt size" list={['Small', 'Medium', 'Large', 'Extra large']} />
      </Form>
    </div>
  );
}

export const select: ComponentSpec = {
  slug: 'select',
  name: 'Select',
  category: 'Forms',
  summary: 'A select lets people pick one option from a collapsed list.',
  semantics: 'button + role="listbox" (or native <select>)',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
  whenToUse: [
    'Use a select for one choice from about 5–15 options.',
    'Prefer a native <select> when you don’t need custom option content. It is the most robust option on mobile and with assistive tech.',
  ],
  keyboard: [
    { keys: ['Enter', 'Space', 'ArrowDown'], action: 'Opens the list and focuses the selected option.' },
    { keys: ['ArrowDown', 'ArrowUp'], action: 'Moves the active option.' },
    { keys: ['Home', 'End'], action: 'Jumps to the first or last option.' },
    { keys: ['A–Z'], action: 'Typeahead to the matching option.' },
    { keys: ['Enter'], action: 'Selects the active option and closes the list.' },
    { keys: ['Escape'], action: 'Closes without changing the value and returns focus to the button.' },
  ],
  aria: [
    { attr: 'aria-haspopup="listbox"', where: 'trigger', usage: 'Says the button opens a listbox.' },
    { attr: 'aria-expanded', where: 'trigger', usage: 'Reflects whether the list is open.' },
    { attr: 'aria-labelledby', where: 'trigger & listbox', usage: 'Combines the field label and the current value into the button’s name.' },
    { attr: 'role="option" + aria-selected', where: 'each option', usage: 'Exposes the options and which one is chosen.' },
    { attr: 'aria-activedescendant', where: 'listbox', usage: 'Points at the highlighted option while DOM focus stays on the listbox.' },
  ],
  focus: ['Focus moves into the list on open and back to the trigger on close.', 'The highlighted option needs a visible style that isn’t color alone.'],
  screenReader: ['Trigger is announced as: “T-shirt size Medium, button, collapsed”.', 'Inside the list: “Large, 3 of 4”.'],
  dos: ['Keep a visible label above the trigger.', 'Sort options logically: by size, alphabetically, or by popularity.'],
  donts: ['Don’t submit or navigate when the selection changes.', 'Don’t use a select for two options. Use radios.'],
  wcag: [WCAG.labels, WCAG.nameRoleValue, WCAG.keyboard, WCAG.onInput],
  testing: [
    'Open with keyboard, navigate with arrows and typeahead, select with Enter.',
    'Press Escape and confirm the value didn’t change and focus returned.',
    'Confirm the label and current value are announced on the trigger.',
  ],
  Demo,
  code: `import { Form, Select } from '@fluid-design/fluid-ui';

<Form initialValues={{ size: 'Medium' }} onSubmit={save}>
  <Select name="size" label="T-shirt size" list={['Small', 'Medium', 'Large']} />
</Form>

{/* Often the best choice: a native select */}
<label htmlFor="size">T-shirt size</label>
<select id="size">…</select>`,
  fluid: {
    source: 'Fluid UI component',
    notes: [
      'Fluid UI’s Select is built on Headless UI’s Listbox, which provides the listbox roles, typeahead and focus handling.',
      'Its label and button are linked, so the trigger is announced with both the label and the current value.',
    ],
  },
};
