import { useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const OPTIONS = [
  { value: 'list', label: 'List', icon: 'M4 5h12v2H4V5Zm0 4h12v2H4V9Zm0 4h12v2H4v-2Z' },
  { value: 'grid', label: 'Grid', icon: 'M4 4h5v5H4V4Zm7 0h5v5h-5V4ZM4 11h5v5H4v-5Zm7 0h5v5h-5v-5Z' },
  { value: 'map', label: 'Map', icon: 'M10 2a5 5 0 0 1 5 5c0 4-5 11-5 11S5 11 5 7a5 5 0 0 1 5-5Zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z' },
];

/** Native radios styled as a segmented control: the browser handles arrow keys and grouping. */
function Demo() {
  const id = useId();
  const [view, setView] = useState('list');
  return (
    <div className="space-y-3">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">View trails as</legend>
        <div className="inline-flex rounded-lg bg-gray-100 p-1 ring-1 ring-gray-400 dark:bg-gray-800 dark:ring-gray-500">
          {OPTIONS.map((o) => (
            <label key={o.value} className="relative">
              <input type="radio" name={`${id}-view`} value={o.value} checked={view === o.value} onChange={() => setView(o.value)} className="peer sr-only" />
              <span className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 peer-checked:bg-white peer-checked:font-semibold peer-checked:text-gray-900 peer-checked:shadow peer-checked:ring-1 peer-checked:ring-gray-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600 dark:text-gray-100 dark:peer-checked:bg-gray-950 dark:peer-checked:text-gray-50 dark:peer-focus-visible:ring-primary-300">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d={o.icon} />
                </svg>
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-sm text-muted">Showing trails as a {view}.</p>
    </div>
  );
}


export const segmentedControl: ComponentSpec = {
  slug: 'segmented-control',
  name: 'Segmented control',
  category: 'Forms',
  summary: 'A segmented control is a compact row of options where exactly one is chosen, like List, Grid or Map. Build it from native radio buttons.',
  semantics: '<fieldset> of <input type="radio"> styled as segments',
  whenToUse: [
    'Use it for 2 to 5 short options that change a view or setting immediately.',
    'Use tabs if each option shows a different panel of content with its own heading.',
    'Use a radio group in forms that are submitted.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to the selected option; the group is one tab stop.' },
    { keys: ['←', '→', '↑', '↓'], action: 'Selects the previous or next option (built into native radios).' },
  ],
  aria: [
    { attr: '<fieldset> + <legend>', where: 'group', usage: 'Names the group; read when entering it.' },
    { attr: '<input type="radio">', where: 'each option', usage: 'Native radios give one tab stop and arrow keys for free.' },
    { attr: 'sr-only', where: 'the radio input', usage: 'Hidden visually but still focusable and announced. Don’t use display: none.' },
    { attr: 'aria-hidden="true"', where: 'icons', usage: 'The text label names each option.' },
  ],
  focus: ['Show a focus ring on the segment when its hidden radio has keyboard focus (peer-focus-visible).', 'The selected segment must look different without color: shadow, border and bold text.'],
  screenReader: ['“View trails as, group. List, radio button, checked, 1 of 3.”'],
  dos: ['Keep labels to one or two words.', 'Show text labels, not icons alone.', 'Apply the change immediately and show the result.'],
  donts: ['Don’t use buttons with aria-pressed for a pick-one choice; radios already do this.', 'Don’t use more than 5 segments.', 'Don’t hide the radios with display: none.'],
  wcag: [WCAG.infoRel, WCAG.keyboard, WCAG.nameRoleValue, WCAG.focusVisible, WCAG.useOfColor, WCAG.nonTextContrast],
  testing: [
    'Tab to the group once, then use arrow keys to change the selection.',
    'Confirm the legend and “checked” state are announced.',
    'Confirm the focus ring shows on the segment.',
    'Check the selected segment in grayscale.',
  ],
  Demo,
};
