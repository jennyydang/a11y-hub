import { ComboBox, Form } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const countries = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Japan', 'Kenya', 'Mexico', 'Norway', 'Peru', 'Spain'];

function Demo() {
  return (
    <div className="w-full max-w-xs">
      <Form initialValues={{ country: '' }} onSubmit={() => undefined}>
        <ComboBox name="country" label="Country" list={countries} placeholder="Type to search…" />
      </Form>
    </div>
  );
}

export const combobox: ComponentSpec = {
  slug: 'combobox',
  name: 'Combobox',
  category: 'Forms',
  summary: 'A text input with a popup list of suggestions that filters as you type.',
  semantics: 'input[role="combobox"] + role="listbox"',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
  whenToUse: ['Use a combobox when the list is long enough that typing is faster than scrolling, like countries or people.'],
  keyboard: [
    { keys: ['ArrowDown'], action: 'Opens the list, or moves to the next option.' },
    { keys: ['ArrowUp'], action: 'Moves to the previous option.' },
    { keys: ['Enter'], action: 'Accepts the highlighted option and closes the list.' },
    { keys: ['Escape'], action: 'Closes the list. A second press may clear the input.' },
    { keys: ['Home', 'End'], action: 'Moves the text cursor within the input.' },
  ],
  aria: [
    { attr: 'role="combobox"', where: 'input', usage: 'Identifies the input as one that controls a popup.' },
    { attr: 'aria-expanded', where: 'input', usage: 'Whether the suggestion list is shown.' },
    { attr: 'aria-controls', where: 'input', usage: 'The id of the listbox.' },
    { attr: 'aria-activedescendant', where: 'input', usage: 'The id of the highlighted option. DOM focus stays in the input so typing keeps working.' },
    { attr: 'aria-autocomplete="list"', where: 'input', usage: 'Says suggestions are shown in a list.' },
    { attr: 'role="option" + aria-selected', where: 'options', usage: 'The suggestions and the current choice.' },
  ],
  focus: ['DOM focus never leaves the input. The highlighted option is communicated through aria-activedescendant.', 'Scroll the highlighted option into view.'],
  screenReader: [
    'Announced as: “Country, combo box, collapsed, editable”.',
    'When results change, announce the count with a polite status message, like “5 results available”.',
  ],
  dos: ['Show a “No results” message instead of an empty popup.', 'Allow free text when the value doesn’t have to match the list.'],
  donts: ['Don’t auto-select the first match while typing. It can overwrite what the user means to type.', 'Don’t use a combobox for fewer than about 10 options.'],
  wcag: [WCAG.nameRoleValue, WCAG.keyboard, WCAG.statusMessages, WCAG.labels, WCAG.onInput],
  testing: [
    'Type a few letters and confirm the list filters.',
    'Use arrow keys and confirm the active option is announced while focus stays in the input.',
    'Check Escape closes the list.',
  ],
  Demo,
  code: `import { ComboBox, Form } from '@fluid-design/fluid-ui';

<Form initialValues={{ country: '' }} onSubmit={save}>
  <ComboBox name="country" label="Country" list={countries} />
</Form>`,
  fluid: {
    source: 'Fluid UI component',
    notes: [
      'Fluid UI’s ComboBox is built on Headless UI’s Combobox, which manages aria-activedescendant and the expanded state.',
      'It doesn’t announce the number of results. Add a visually hidden role="status" region if your users need it.',
    ],
  },
};
