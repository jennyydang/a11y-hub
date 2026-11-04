import { useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.44c-.8.08-1.58.18-2.36.3a.75.75 0 1 0 .22 1.49l.15-.02.84 10.52A2.75 2.75 0 0 0 7.59 19h4.82a2.75 2.75 0 0 0 2.74-2.52l.84-10.52.15.02a.75.75 0 0 0 .22-1.49c-.78-.12-1.57-.22-2.36-.3v-.44A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.67.03 2.5.08v-.33c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.33C8.33 4.03 9.16 4 10 4Z" clipRule="evenodd" />
    </svg>
  );
}

function Demo() {
  const [saving, setSaving] = useState(false);
  const [muted, setMuted] = useState(false);
  const save = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1500);
  };
  return (
    <>
      <Button className="btn-bold-primary" onClick={save} isLoading={saving} aria-disabled={saving || undefined}>
        {saving ? 'Saving' : 'Save changes'}
      </Button>
      <Button weight="outline" color="gray">
        Cancel
      </Button>
      <Button weight="light" color="gray" aria-pressed={muted} onClick={() => setMuted((m) => !m)}>
        {muted ? 'Unmute' : 'Mute'} notifications
      </Button>
      <Button iconOnly icon={TrashIcon} color="red" weight="light" sr="Delete draft" />
    </>
  );
}

export const button: ComponentSpec = {
  slug: 'button',
  name: 'Button',
  category: 'Actions',
  summary: 'Buttons trigger an action on the current page, like submitting a form, opening a dialog or toggling a setting.',
  semantics: '<button>',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  whenToUse: [
    'Use a button when activating it does something on this page. If it takes the user somewhere else, use a link.',
    'Use a toggle button (aria-pressed) for a setting that is simply on or off and takes effect immediately.',
    'Use an icon-only button only for well-known actions, and always give it a text name.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the button. Disabled buttons are skipped.' },
    { keys: ['Enter'], action: 'Activates the button.' },
    { keys: ['Space'], action: 'Activates the button when the key is released, which lets users cancel by moving focus away first.' },
  ],
  aria: [
    { attr: 'aria-pressed', where: 'button', usage: 'Makes it a toggle button. Keep the label constant and let the pressed state carry the meaning.' },
    { attr: 'aria-expanded', where: 'button', usage: 'Use when the button shows and hides another region, such as a menu or disclosure.' },
    { attr: 'aria-label', where: 'icon-only button', usage: 'Gives an icon-only button a name. Visually hidden text (Fluid UI’s sr prop) works just as well.' },
    { attr: 'aria-disabled="true"', where: 'button', usage: 'Keeps a temporarily unavailable button focusable so users can still discover it and read why it is unavailable.' },
    { attr: 'aria-hidden="true"', where: 'decorative icon', usage: 'Hides the SVG so it does not add noise to the accessible name.' },
  ],
  focus: [
    'Use a native <button>. It is focusable, activates with Enter and Space, and announces itself as a button with no extra work.',
    'Show a focus indicator with at least 3:1 contrast against the background. Fluid UI buttons use a focus-visible ring, so keyboard users get it and mouse users do not.',
    'When a button opens something (dialog, menu), move focus into it. When that thing closes, return focus to the button.',
  ],
  screenReader: [
    'Announced as: “Save changes, button”.',
    'A toggle button announces its state: “Mute notifications, toggle button, not pressed”.',
    'While loading, update the visible label (“Saving”) so the change is announced and doesn’t rely on a spinner alone.',
  ],
  dos: [
    'Start labels with a verb that says what will happen: “Save changes”, “Delete draft”.',
    'Make the hit area at least 24×24 CSS pixels. 44×44 is better on touch screens.',
    'Use aria-disabled rather than disabled when users need to find the button and learn why it is unavailable.',
  ],
  donts: [
    'Don’t make a clickable <div> or <span>. You would have to rebuild focus, roles and key handling by hand.',
    'Don’t use vague labels like “Click here” or several identical “Edit” buttons with no context.',
    'Don’t rely on color alone to show the primary or destructive action.',
  ],
  wcag: [WCAG.keyboard, WCAG.nameRoleValue, WCAG.focusVisible, WCAG.labelInName, WCAG.targetSize, WCAG.nonTextContrast],
  testing: [
    'Tab to every button and confirm a visible focus ring appears.',
    'Activate each button with Enter and with Space.',
    'Check that icon-only buttons have a name in the accessibility tree.',
    'Confirm toggle buttons announce their pressed state.',
    'Zoom to 200% and confirm labels don’t truncate or overlap.',
  ],
  Demo,
  code: `import { Button } from '@fluid-design/fluid-ui';

<Button className="btn-bold-primary" onClick={save}>Save changes</Button>

{/* Toggle button: the label stays the same and the state changes */}
<Button weight="light" aria-pressed={muted} onClick={toggle}>
  Mute notifications
</Button>

{/* Icon-only: Fluid's \`sr\` prop renders visually hidden text */}
<Button iconOnly icon={TrashIcon} color="red" sr="Delete draft" />`,
  fluid: {
    source: 'Fluid UI component',
    notes: [
      'Fluid UI’s Button renders a native <button>, so keyboard and role support come for free.',
      'The sr prop adds visually hidden text, which is the easiest way to name an icon-only button.',
      'Fluid UI’s Button always renders type="button" unless you also pass as="button". To make a submit button, write <Button as="button" type="submit">.',
      'isLoading sets aria-busy on the button. Also change the visible label, because aria-busy alone is not announced reliably.',
    ],
  },
};
