import { useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const id = useId();
  const [temp, setTemp] = useState(21);
  const describe = (t: number) => (t < 19 ? 'cool' : t > 23 ? 'warm' : 'comfortable');
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold">
          Thermostat
        </label>
        <output htmlFor={id} className="text-lg font-semibold tabular-nums">
          {temp}°C
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={16}
        max={28}
        step={0.5}
        value={temp}
        onChange={(e) => setTemp(Number(e.target.value))}
        aria-valuetext={`${temp} degrees Celsius, ${describe(temp)}`}
        className="h-11 w-full cursor-pointer accent-primary-600 dark:accent-primary-300"
      />
      <div className="flex justify-between text-xs text-muted" aria-hidden="true">
        <span>16°C</span>
        <span>28°C</span>
      </div>
    </div>
  );
}

export const slider: ComponentSpec = {
  slug: 'slider',
  name: 'Slider',
  category: 'Forms',
  summary: 'A slider picks a value from a range by dragging a thumb along a track.',
  semantics: '<input type="range">',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',
  whenToUse: [
    'Use a slider when the exact value matters less than the rough position, like volume or brightness.',
    'When people need a precise value, offer a number input as well, or instead.',
  ],
  keyboard: [
    { keys: ['ArrowRight', 'ArrowUp'], action: 'Increases the value by one step.' },
    { keys: ['ArrowLeft', 'ArrowDown'], action: 'Decreases the value by one step.' },
    { keys: ['PageUp', 'PageDown'], action: 'Changes the value by a larger step.' },
    { keys: ['Home', 'End'], action: 'Jumps to the minimum or maximum.' },
  ],
  aria: [
    { attr: '<label for>', where: 'label', usage: 'Names the slider.' },
    { attr: 'min / max / step', where: 'input', usage: 'Native attributes become aria-valuemin, aria-valuemax and the step size.' },
    { attr: 'aria-valuetext', where: 'input', usage: 'A human-readable value with units, like “21 degrees Celsius, comfortable”. Without it, screen readers read only the bare number.' },
    { attr: '<output for>', where: 'visible value', usage: 'Shows the current value next to the label.' },
    { attr: 'role="slider"', where: 'custom slider', usage: 'Only for custom builds. Then you must handle every key yourself and set aria-valuenow.' },
  ],
  focus: ['The thumb needs a visible focus ring.', 'Make the thumb at least 24×24 CSS pixels so it is easy to grab.'],
  screenReader: ['Announced as: “Thermostat, slider, 21 degrees Celsius, comfortable”.', 'Each arrow press announces the new value text.'],
  dos: ['Show the current value as text.', 'Include units in aria-valuetext.', 'Offer a way to set the value without dragging, such as arrow keys or a number field.'],
  donts: ['Don’t rely on dragging only. WCAG 2.5.7 requires a single-pointer alternative, and a click on the track counts.', 'Don’t use a slider for a value with only two or three options.'],
  wcag: [WCAG.nameRoleValue, WCAG.keyboard, WCAG.dragging, WCAG.targetSize, WCAG.nonTextContrast],
  testing: [
    'Change the value with arrows, Page Up/Down, Home and End.',
    'Confirm the screen reader reads the value with its units.',
    'Click on the track and confirm the value jumps there, with no drag needed.',
  ],
  Demo,
};
