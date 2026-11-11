import { Form, Switch } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Form initialValues={{ wifi: true, airplane: false }} onSubmit={() => undefined}>
        <Switch name="wifi" label="Wi-Fi" />
        <Switch name="airplane" label="Airplane mode" />
      </Form>
    </div>
  );
}

export const switchSpec: ComponentSpec = {
  slug: 'switch',
  name: 'Switch',
  category: 'Forms',
  summary: 'A switch turns a single setting on or off, and the change applies straight away.',
  semantics: 'button[role="switch"][aria-checked]',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
  whenToUse: [
    'Use a switch for settings that apply immediately, like “Dark mode”.',
    'Use a checkbox instead when the choice is only saved after a Submit button.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the switch.' },
    { keys: ['Space'], action: 'Toggles the switch.' },
    { keys: ['Enter'], action: 'Also toggles the switch when it is built on a <button>.' },
  ],
  aria: [
    { attr: 'role="switch"', where: 'control', usage: 'Announced as “switch” with an on/off state.' },
    { attr: 'aria-checked', where: 'control', usage: 'true or false. Required for role="switch".' },
    { attr: 'aria-labelledby / <label>', where: 'control', usage: 'The visible label names the switch. Keep it constant and don’t change it to “On” or “Off”.' },
  ],
  focus: [
    'The focus ring should wrap the whole track, not just the thumb.',
    'Clicking the label should toggle the switch, too.',
  ],
  screenReader: ['Announced as: “Wi-Fi, switch, on”.'],
  dos: [
    'Make the on state clear without color: position of the thumb plus a strong contrast change.',
    'Give the track at least 3:1 contrast against the background in both states.',
  ],
  donts: [
    'Don’t use a switch for choices that need a Save button.',
    'Don’t change the label text to reflect the state. The state is announced separately.',
  ],
  wcag: [WCAG.nameRoleValue, WCAG.nonTextContrast, WCAG.useOfColor, WCAG.keyboard, WCAG.labels],
  testing: [
    'Toggle with Space and Enter.',
    'Confirm the screen reader announces “on” and “off”.',
    'View with the color-blindness simulation and check that the state is still clear.',
  ],
  Demo,
};
