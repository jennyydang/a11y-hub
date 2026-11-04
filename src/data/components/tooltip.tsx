import { Button } from '@fluid-design/fluid-ui';
import { Tooltip } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.88a1.5 1.5 0 0 1 1.06.44l3.12 3.12A1.5 1.5 0 0 1 17 6.62V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.38a3 3 0 0 0-.88-2.12L10.5 5.38A3 3 0 0 0 8.38 4.5H7v-1Z" />
      <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.88a1.5 1.5 0 0 0-.44-1.06L9.44 6.44A1.5 1.5 0 0 0 8.38 6H4.5Z" />
    </svg>
  );
}

function Demo() {
  return (
    <>
      <Tooltip content="Copy link" relationship="label">
        <Button iconOnly icon={CopyIcon} weight="light" color="gray" />
      </Tooltip>
      <Tooltip content="Drafts are deleted after 30 days" relationship="description" placement="bottom">
        <Button weight="outline" color="gray">
          Save draft
        </Button>
      </Tooltip>
    </>
  );
}

export const tooltip: ComponentSpec = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'Overlays',
  summary: 'A small text popup that names or describes a control when it is hovered or focused.',
  semantics: 'role="tooltip" referenced by aria-labelledby / aria-describedby',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
  whenToUse: [
    'Use a tooltip to show the name of an icon-only button, or a short, non-essential hint.',
    'Never put interactive content or essential information in a tooltip. Touch users and many screen magnifier users won’t see it.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Focusing the trigger shows the tooltip.' },
    { keys: ['Escape'], action: 'Hides the tooltip without moving focus.' },
  ],
  aria: [
    { attr: 'role="tooltip"', where: 'popup', usage: 'Identifies the popup.' },
    { attr: 'aria-labelledby', where: 'trigger', usage: 'Use when the tooltip is the control’s only name, as with icon-only buttons.' },
    { attr: 'aria-describedby', where: 'trigger', usage: 'Use when the tooltip adds information to a control that already has a name.' },
  ],
  focus: ['The tooltip never receives focus itself.', 'It must not cover the focused element.'],
  screenReader: ['Icon button with a label tooltip: “Copy link, button”.', 'Button with a description tooltip: “Save draft, button, Drafts are deleted after 30 days”.'],
  dos: [
    'Show on both hover and keyboard focus.',
    'Keep it open while the pointer moves onto the tooltip, so magnifier users can read it (WCAG 1.4.13).',
    'Keep tooltip text to one short sentence.',
  ],
  donts: [
    'Don’t use the title attribute. It isn’t shown on focus or touch, and screen readers read it inconsistently.',
    'Don’t use CSS-only ::before/::after tooltips. Generated content isn’t reliably exposed to assistive tech.',
    'Don’t put links or buttons inside a tooltip. Use a popover instead.',
  ],
  wcag: [WCAG.hoverFocus, WCAG.nameRoleValue, WCAG.keyboard, WCAG.nonText],
  testing: [
    'Tab to the trigger and confirm the tooltip appears.',
    'Press Escape and confirm it hides while focus stays put.',
    'Hover, then move the pointer onto the tooltip and confirm it stays open.',
    'Confirm the screen reader reads it as the name or description.',
  ],
  Demo,
  code: `<Tooltip content="Copy link" relationship="label">
  <Button iconOnly icon={CopyIcon} />
</Tooltip>

{/* Renders: */}
<button aria-labelledby="tip-1">…</button>
<span role="tooltip" id="tip-1">Copy link</span>`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI’s tooltip plugin draws tooltips with CSS ::before/::after from a data-tooltip attribute. That text isn’t reliably exposed to screen readers and can’t be dismissed with Escape.',
      'This site uses a small React Tooltip with role="tooltip", proper ARIA linking, focus support and Escape to dismiss.',
    ],
  },
};
