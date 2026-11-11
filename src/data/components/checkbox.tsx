import { useState } from 'react';
import { Checkbox } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const toppings = ['Mushrooms', 'Olives', 'Peppers'];

function Demo() {
  const [picked, setPicked] = useState<string[]>(['Olives']);
  const all = picked.length === toppings.length;
  const some = picked.length > 0 && !all;
  return (
    <fieldset className="w-full max-w-xs space-y-3">
      <legend className="mb-2 text-sm font-semibold">Pizza toppings</legend>
      <Checkbox
        label="All toppings"
        checked={all}
        indeterminate={some}
        onChange={() => setPicked(all ? [] : toppings)}
      />
      <div className="ml-8 space-y-2">
        {toppings.map((t) => (
          <Checkbox
            key={t}
            label={t}
            checked={picked.includes(t)}
            onChange={() => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))}
          />
        ))}
      </div>
      <Checkbox label="Accept the terms" description="You can withdraw consent at any time." />
    </fieldset>
  );
}

export const checkbox: ComponentSpec = {
  slug: 'checkbox',
  name: 'Checkbox',
  category: 'Forms',
  summary: 'Checkboxes let people pick any number of options from a set, or confirm a single yes/no choice.',
  semantics: '<input type="checkbox"> + <label>',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
  whenToUse: [
    'Use checkboxes when more than one option can be selected.',
    'Use a single checkbox for consent or opt-in. Use a switch instead when the change takes effect immediately.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to the next checkbox. Each checkbox is its own tab stop.' },
    { keys: ['Space'], action: 'Toggles the checkbox.' },
  ],
  aria: [
    { attr: '<fieldset> + <legend>', where: 'group', usage: 'Names the group, so each option is read with its question.' },
    { attr: 'indeterminate (DOM property)', where: 'parent checkbox', usage: 'Exposes the mixed state when some children are selected. It can only be set from JavaScript.' },
    { attr: 'aria-describedby', where: 'checkbox', usage: 'Links extra helper text to the option.' },
    { attr: 'aria-checked="mixed"', where: 'custom checkbox', usage: 'Only needed if you build a checkbox from role="checkbox" instead of a native input.' },
  ],
  focus: [
    'Make the label clickable so the target area is bigger than the 16px box.',
    'The focus outline should surround the box clearly, even with a custom-styled input.',
  ],
  screenReader: [
    'Announced as: “Olives, checkbox, checked, Pizza toppings, group”.',
    'A parent with some children selected: “All toppings, checkbox, half checked” (wording varies by screen reader).',
  ],
  dos: [
    'Phrase labels positively: “Send me updates”, not “Don’t send me updates”.',
    'List options vertically, one per line, so they are easy to scan.',
    'Use a native input. Style it with accent-color or an overlay so the real input still receives focus.',
  ],
  donts: [
    'Don’t hide the native input with display:none and draw a fake one. It removes it from the accessibility tree.',
    'Don’t trigger navigation or big layout changes when a checkbox is toggled.',
  ],
  wcag: [WCAG.infoRel, WCAG.labels, WCAG.nameRoleValue, WCAG.onInput, WCAG.nonTextContrast, WCAG.targetSize],
  testing: [
    'Toggle each checkbox with Space.',
    'Click each label and confirm it toggles the box.',
    'Confirm the group name (legend) is announced when entering the group.',
    'Check the checked, unchecked and mixed states are announced.',
  ],
  Demo,
};
