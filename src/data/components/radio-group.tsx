import { useState } from 'react';
import { RadioGroup } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const [value, setValue] = useState('standard');
  return (
    <RadioGroup
      className="w-full max-w-sm"
      legend="Delivery speed"
      hint="Prices include tax."
      value={value}
      onChange={setValue}
      options={[
        { value: 'standard', label: 'Standard', description: '4–6 business days, free' },
        { value: 'express', label: 'Express', description: '1–2 business days, $9' },
        { value: 'drone', label: 'Same-day drone', description: 'Not available in your area', disabled: true },
      ]}
    />
  );
}

export const radioGroup: ComponentSpec = {
  slug: 'radio-group',
  name: 'Radio group',
  category: 'Forms',
  summary: 'A set of options where exactly one can be selected.',
  semantics: '<fieldset> + <input type="radio" name>',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
  whenToUse: [
    'Use radios for two to about seven mutually exclusive options that people should compare side by side.',
    'For longer lists, use a select or combobox.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus into the group, landing on the selected radio (or the first one). The whole group is one tab stop.' },
    { keys: ['ArrowDown', 'ArrowRight'], action: 'Selects and focuses the next option, wrapping at the end.' },
    { keys: ['ArrowUp', 'ArrowLeft'], action: 'Selects and focuses the previous option.' },
    { keys: ['Space'], action: 'Selects the focused option if none is selected yet.' },
  ],
  aria: [
    { attr: 'name', where: 'each radio', usage: 'The shared name is what makes the inputs one group with arrow-key navigation.' },
    { attr: '<fieldset> + <legend>', where: 'group', usage: 'The legend is the question. It is read when users enter the group.' },
    { attr: 'aria-describedby', where: 'radio / fieldset', usage: 'Links option details or a group hint.' },
    { attr: 'role="radiogroup"', where: 'custom group', usage: 'Only needed when not using native radios and a fieldset.' },
  ],
  focus: [
    'Arrow keys move both focus and selection. This is built in for native radios.',
    'Disabled options are skipped by arrow keys. Say why they are unavailable in the option text.',
  ],
  screenReader: [
    'Announced as: “Delivery speed, group. Standard, radio button, checked, 1 of 3, 4–6 business days, free”.',
  ],
  dos: [
    'Pre-select a sensible default when there is one.',
    'Make the whole option card clickable by wrapping it in the <label>.',
  ],
  donts: [
    'Don’t use radios for a single on/off choice. Use a checkbox or switch.',
    'Don’t change page content immediately on selection without warning.',
  ],
  wcag: [WCAG.infoRel, WCAG.labels, WCAG.keyboard, WCAG.nameRoleValue, WCAG.onInput],
  testing: [
    'Tab into the group and confirm only one tab stop.',
    'Use arrow keys to change selection.',
    'Confirm the legend, option label, position (“1 of 3”) and description are announced.',
  ],
  Demo,
};
