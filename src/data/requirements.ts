/**
 * Handoff worksheets: what each role must supply or decide when they use a component.
 *
 * Content fields are things a content designer fills in (labels, alt text, errors).
 * Design requirements are decisions a designer must make and check before handoff.
 * Both can be limited to specific variations with `variants`.
 */

export type FieldKind = 'name' | 'link' | 'alt' | 'label' | 'hint' | 'error' | 'heading' | 'message' | 'text';

export interface ContentField {
  id: string;
  /** What to fill in, as a question or short noun phrase. */
  label: string;
  /** Where the text ends up in the markup. */
  target: string;
  kind: FieldKind;
  required: boolean;
  guidance: string;
  good: string;
  bad?: string;
  multiline?: boolean;
  /** Only show this field for these variation ids. */
  variants?: string[];
}

export interface DesignRequirement {
  /** The requirement, phrased as something to check. */
  text: string;
  /** How to tell it's met. */
  check: string;
  variants?: string[];
}

export interface Worksheet {
  content: ContentField[];
  design: DesignRequirement[];
}

/* ---------- Shared design requirements ---------- */

const focus = (what = 'Every interactive part'): DesignRequirement => ({
  text: `${what} has a designed focus state.`,
  check: 'The focus indicator is at least 2px thick, has 3:1 contrast against the background, and isn’t clipped or covered.',
});
const target = (what = 'Clickable areas'): DesignRequirement => ({
  text: `${what} are at least 24×24px.`,
  check: 'Measure the hit area, including padding. Use 44×44px on touch-first screens.',
});
const textContrast: DesignRequirement = {
  text: 'All text meets contrast minimums.',
  check: 'Body text is at least 4.5:1. Text 24px and up, or 18.66px bold and up, is at least 3:1. Check every state, including hover and disabled-looking text.',
};
const reflow: DesignRequirement = {
  text: 'The layout works at 320px wide and at 200% text size.',
  check: 'Nothing is cut off, overlaps or needs sideways scrolling. Labels wrap instead of truncating.',
};
const notColorOnly = (state: string): DesignRequirement => ({
  text: `The ${state} doesn’t rely on color alone.`,
  check: 'View it in grayscale (use the Achromatopsia simulation above). The state is still obvious from an icon, text, weight or shape.',
});
const fieldBorder: DesignRequirement = {
  text: 'The field boundary has 3:1 contrast.',
  check: 'Measure the border or underline against the page background, in light and dark themes.',
};
const visibleLabel: DesignRequirement = {
  text: 'The label stays visible above the field.',
  check: 'No placeholder-only labels and no labels that disappear on typing. The label sits close to its field.',
};
const errorDesign: DesignRequirement = {
  text: 'Error states pair color with an icon and text.',
  check: 'The error message sits next to the field, starts with an icon, and the border changes thickness or style as well as color.',
};
const motion: DesignRequirement = {
  text: 'Motion has a reduced-motion version.',
  check: 'With “reduce motion” turned on, transitions are removed or replaced by a fade. Nothing flashes more than 3 times a second.',
};

/* ---------- Shared content fields ---------- */

const fieldLabel: ContentField = {
  id: 'label',
  label: 'Field label',
  target: '<label>',
  kind: 'label',
  required: true,
  guidance: 'Short and specific. Say what to enter, not how. Don’t end with a colon or add the required asterisk yourself.',
  good: 'Email address',
  bad: 'Enter your email here:',
};
const fieldHint: ContentField = {
  id: 'hint',
  label: 'Hint text',
  target: 'aria-describedby → hint',
  kind: 'hint',
  required: false,
  guidance: 'Explain the format or why you’re asking. Keep it to one sentence. Never put essential instructions in a placeholder.',
  good: 'We’ll only use this to send your receipt.',
};
const fieldError = (good: string, bad = 'Invalid input'): ContentField => ({
  id: 'error',
  label: 'Error message for each rule',
  target: 'aria-describedby → error',
  kind: 'error',
  required: true,
  multiline: true,
  guidance: 'One line per validation rule. Say what went wrong and how to fix it, in the same words the error summary will use.',
  good,
  bad,
});

export const worksheets: Record<string, Worksheet> = {
  button: {
    content: [
      {
        id: 'label',
        label: 'Button label',
        target: 'Visible text',
        kind: 'name',
        required: true,
        guidance: 'Start with a verb that says what will happen. Two or three words is ideal. Don’t include the word “button”.',
        good: 'Save changes',
        bad: 'OK',
        variants: ['standard', 'toggle', 'loading', 'unavailable'],
      },
      {
        id: 'aria-label',
        label: 'Accessible name for the icon',
        target: 'aria-label',
        kind: 'name',
        required: true,
        guidance: 'Icon-only buttons have no visible text, so screen readers rely entirely on this. Describe the action, not the icon.',
        good: 'Delete invoice INV-204',
        bad: 'Trash can',
        variants: ['icon-only'],
      },
      {
        id: 'tooltip',
        label: 'Tooltip text',
        target: 'Visible tooltip',
        kind: 'text',
        required: true,
        guidance: 'Sighted users need to know what the icon does too. Match the accessible name so voice control users can say it.',
        good: 'Delete invoice',
        variants: ['icon-only'],
      },
      {
        id: 'toggle-state',
        label: 'What “on” means',
        target: 'aria-pressed',
        kind: 'text',
        required: true,
        guidance: 'Keep the label the same in both states. Screen readers add “pressed” or “not pressed”, so the label must make sense with either.',
        good: 'Mute notifications (pressed = muted)',
        bad: 'Mute / Unmute (label swaps)',
        variants: ['toggle'],
      },
      {
        id: 'loading',
        label: 'Loading and done announcements',
        target: 'role="status"',
        kind: 'message',
        required: true,
        multiline: true,
        guidance: 'What screen readers hear when work starts and when it finishes.',
        good: 'Saving… / Changes saved',
        variants: ['loading'],
      },
      {
        id: 'reason',
        label: 'Why it’s unavailable',
        target: 'aria-describedby',
        kind: 'hint',
        required: true,
        guidance: 'Tell people what they need to do to make the button available.',
        good: 'Add at least one item to check out.',
        variants: ['unavailable'],
      },
    ],
    design: [
      focus('The button'),
      target('Buttons'),
      textContrast,
      { text: 'Hover, pressed and unavailable states are all designed.', check: 'Each state is visually distinct. The unavailable style still has readable text (aim for 4.5:1) because it stays focusable.' },
      notColorOnly('pressed state'),
      { text: 'The icon has 3:1 contrast and a visible tooltip.', check: 'Measure the icon against its background. The tooltip shows on hover and on keyboard focus.', variants: ['icon-only'] },
      { text: 'The button keeps its width while loading.', check: 'The spinner replaces or sits beside the label without shifting the layout.', variants: ['loading'] },
    ],
  },

  menu: {
    content: [
      { id: 'trigger', label: 'Menu button label', target: 'Visible text or aria-label', kind: 'name', required: true, guidance: 'Name the group of actions. If it’s an icon (like ⋯), write the accessible name.', good: 'Actions for invoice INV-204', bad: 'More' },
      { id: 'items', label: 'Menu items', target: 'role="menuitem"', kind: 'name', required: true, multiline: true, guidance: 'One per line, each starting with a verb. Make the first letters different so typeahead works. Put destructive items last.', good: 'Edit\nDuplicate\nDownload PDF\nDelete', bad: 'Click to edit\nClick to copy' },
    ],
    design: [focus('Each menu item'), notColorOnly('highlighted item'), { text: 'Destructive items are marked with more than red.', check: 'Use an icon or the word itself (“Delete”) and separate it from other items.' }, target('Menu items'), reflow],
  },

  link: {
    content: [
      { id: 'text', label: 'Link text', target: 'Visible text', kind: 'link', required: true, guidance: 'It must make sense out of context, because screen reader users often list all links. Describe the destination.', good: 'Read the 2026 accessibility report', bad: 'Click here' },
      { id: 'new-tab', label: 'New tab warning', target: 'Visible text or visually hidden text', kind: 'text', required: true, guidance: 'Say the link opens in a new tab, so people aren’t surprised when Back doesn’t work.', good: '(opens in a new tab)', variants: ['external'] },
      { id: 'file', label: 'File type and size', target: 'Visible text', kind: 'text', required: true, guidance: 'Tell people what they’re downloading before they commit to it.', good: 'Annual report (PDF, 2.4 MB)', variants: ['download'] },
    ],
    design: [
      { text: 'Links in body text are underlined.', check: 'Or they have 3:1 contrast with the surrounding text plus a non-color cue on hover and focus.', variants: ['inline'] },
      focus('The link'),
      textContrast,
      { text: 'The external-link icon is decorative and paired with text.', check: 'The icon alone isn’t the only signal. The “new tab” text is visible or present for screen readers.', variants: ['external'] },
      target('Standalone links'),
    ],
  },

  'site-navigation': {
    content: [
      { id: 'nav-name', label: 'Navigation name', target: 'aria-label on <nav>', kind: 'label', required: true, guidance: 'Only needed when the page has more than one nav. Don’t include the word “navigation”; it’s announced already.', good: 'Main', bad: 'Main navigation menu' },
      { id: 'items', label: 'Top-level labels', target: 'Links and disclosure buttons', kind: 'link', required: true, multiline: true, guidance: 'One per line. Short, distinct and the same on every page.', good: 'Products\nPricing\nDocs\nSupport' },
    ],
    design: [focus('Each link and toggle'), notColorOnly('current page marker'), { text: 'Dropdowns open on click, not hover alone.', check: 'A visible chevron shows a section can expand. Hover can preview, but click and Enter must work.' }, reflow, target('Links')],
  },

  breadcrumbs: {
    content: [
      { id: 'trail', label: 'Breadcrumb trail', target: 'Links in an <ol>', kind: 'link', required: true, multiline: true, guidance: 'One crumb per line, from the top level down. Each should match the title of the page it links to.', good: 'Home\nAccount\nBilling' },
    ],
    design: [{ text: 'Separators are decorative.', check: 'They’re drawn with CSS or an aria-hidden icon, not typed as characters in the text.' }, notColorOnly('current page marker'), { text: 'The trail wraps on small screens.', check: 'At 320px wide, crumbs wrap onto new lines instead of being cut off.' }, focus('Each crumb')],
  },

  pagination: {
    content: [
      { id: 'range', label: 'Results range text', target: 'Visible text', kind: 'message', required: true, guidance: 'Tells people where they are in the results.', good: 'Showing 21–30 of 80 results' },
      { id: 'nav-name', label: 'Navigation name', target: 'aria-label on <nav>', kind: 'label', required: true, guidance: 'Distinguishes this nav from others on the page.', good: 'Search results pages', bad: 'Pagination navigation' },
    ],
    design: [notColorOnly('current page marker'), target('Page links'), focus('Each page link'), { text: 'Previous and Next have text, not just arrows.', check: 'Arrows can sit beside the words. On narrow screens the words can be hidden only if the accessible name stays.' }],
  },

  'skip-link': {
    content: [{ id: 'text', label: 'Skip link text', target: 'Visible text', kind: 'link', required: true, guidance: 'Use the standard wording people recognize.', good: 'Skip to main content', bad: 'Skip' }],
    design: [{ text: 'The focused skip link is clearly visible.', check: 'It appears at the top left on first Tab, with strong contrast, and isn’t hidden under a sticky header.' }, textContrast],
  },

  tabs: {
    content: [
      { id: 'list-name', label: 'Name for the set of tabs', target: 'aria-label on the tablist', kind: 'label', required: true, guidance: 'Describe what the tabs switch between.', good: 'Account settings' },
      { id: 'tabs', label: 'Tab labels', target: 'role="tab"', kind: 'label', required: true, multiline: true, guidance: 'One per line. One or two words, each distinct. Don’t include counts that change unless they’re also in the panel.', good: 'Profile\nSecurity\nNotifications' },
    ],
    design: [notColorOnly('selected tab'), focus('Each tab'), target('Tabs'), { text: 'Tabs that don’t fit scroll or wrap.', check: 'At 320px no tab is cut off. Vertical tabs stack above the panel on narrow screens.' }, { text: 'Panel content is visually connected to its tab.', check: 'A shared surface or border shows which panel belongs to the selected tab.' }],
  },

  accordion: {
    content: [
      { id: 'headers', label: 'Section headers', target: 'Button inside a heading', kind: 'heading', required: true, multiline: true, guidance: 'One per line. Each should describe what’s hidden, so people can decide whether to open it.', good: 'How do refunds work?\nCan I change my plan later?', bad: 'More info\nDetails' },
      { id: 'level', label: 'Heading level', target: '<h2>–<h4>', kind: 'text', required: true, guidance: 'The level fits the page outline, not the visual size.', good: 'h3 (sits under the “FAQ” h2)' },
    ],
    design: [{ text: 'The whole header row is clickable.', check: 'Not just the chevron. The hit area spans the full width.' }, notColorOnly('expanded state'), focus('Each header'), motion],
  },

  'text-input': {
    content: [
      fieldLabel,
      { ...fieldHint, variants: ['hint', 'validation', 'error'] },
      { ...fieldError('Enter an email address in the format name@example.com', 'Invalid email'), variants: ['validation', 'error'] },
      { id: 'autocomplete', label: 'What the field collects', target: 'autocomplete', kind: 'text', required: false, guidance: 'If it’s personal data, name it so frontend can set the right autocomplete token.', good: 'Email (autocomplete="email")' },
      { id: 'readonly', label: 'Why it can’t be changed', target: 'Hint text', kind: 'hint', required: true, guidance: 'Tell people why the value is locked and where to change it.', good: 'Contact your admin to change your username.', variants: ['read-only'] },
    ],
    design: [visibleLabel, fieldBorder, focus('The field'), { ...errorDesign, variants: ['validation', 'error'] }, { text: 'Read-only looks different from editable.', check: 'Use a filled background or no border, and keep the text at 4.5:1.', variants: ['read-only'] }, reflow],
  },

  textarea: {
    content: [
      fieldLabel,
      { id: 'limit', label: 'Length limit text', target: 'Hint, then live count', kind: 'hint', required: true, guidance: 'State the limit before people start typing, and write the remaining-count message.', good: 'You can enter up to 500 characters. / You have 20 characters remaining.' },
      fieldError('Description must be 500 characters or fewer'),
    ],
    design: [visibleLabel, fieldBorder, { text: 'People can resize the field vertically.', check: 'Don’t lock the height. Text grows without being clipped.' }, { text: 'The character count is next to the field.', check: 'It’s close enough to see while typing and changes style when over the limit, not just color.' }, focus('The field')],
  },

  checkbox: {
    content: [
      { id: 'legend', label: 'Group question', target: '<legend>', kind: 'label', required: true, guidance: 'Phrase it as a question or instruction. It’s read before each option.', good: 'Which emails would you like?', variants: ['group', 'required'] },
      { id: 'options', label: 'Option labels', target: '<label>', kind: 'label', required: true, multiline: true, guidance: 'One per line. Phrase positively (“Send me…”, not “Don’t send me…”).', good: 'Product updates\nWeekly tips\nEvent invitations' },
      { id: 'error', label: 'Error message', target: 'aria-describedby → error', kind: 'error', required: true, guidance: 'Say what they need to select.', good: 'Select at least one type of email', bad: 'Required', variants: ['required', 'single'] },
    ],
    design: [{ text: 'The checkbox border has 3:1 contrast.', check: 'Measure the unchecked box against the background.' }, { text: 'The label is clickable.', check: 'Clicking the text toggles the box, so the hit area is bigger than the box.' }, focus('Each checkbox'), notColorOnly('checked state')],
  },

  'radio-group': {
    content: [
      { id: 'legend', label: 'Group question', target: '<legend>', kind: 'label', required: true, guidance: 'The question the options answer.', good: 'How should we contact you?' },
      { id: 'options', label: 'Option labels', target: '<label>', kind: 'label', required: true, multiline: true, guidance: 'One per line. Mutually exclusive and in a logical order.', good: 'Email\nPhone\nText message' },
      { id: 'error', label: 'Error message', target: 'aria-describedby → error', kind: 'error', required: false, guidance: 'Only if a choice is required.', good: 'Select how we should contact you' },
    ],
    design: [notColorOnly('selected state'), { text: 'The radio border has 3:1 contrast.', check: 'Measure the unselected circle against the background.' }, focus('The group'), target('Options (including the label)')],
  },

  switch: {
    content: [
      { id: 'label', label: 'Switch label', target: '<label> or aria-labelledby', kind: 'label', required: true, guidance: 'Name the setting, not the state. It stays the same when toggled; screen readers announce on or off.', good: 'Email notifications', bad: 'Turn notifications on' },
      { id: 'effect', label: 'What happens when toggled', target: 'Hint text', kind: 'hint', required: false, guidance: 'Only if the effect isn’t obvious. Switches act immediately, with no Save button.', good: 'We’ll email you when someone comments.' },
    ],
    design: [notColorOnly('on state'), { text: 'The off-state track has 3:1 contrast.', check: 'Measure the track border or fill against the background.' }, focus('The switch'), target('The switch')],
  },

  select: {
    content: [
      fieldLabel,
      { id: 'options', label: 'Options', target: '<option> or role="option"', kind: 'label', required: true, multiline: true, guidance: 'One per line, in a logical order (alphabetical, by size, by frequency).', good: 'Small\nMedium\nLarge' },
      { id: 'placeholder', label: 'Empty choice', target: 'First option', kind: 'text', required: false, guidance: 'If nothing is selected by default, write the prompt.', good: 'Select a size' },
    ],
    design: [visibleLabel, fieldBorder, { text: 'The highlighted option shows with more than color.', check: 'Use a filled background with 3:1 against the list, or a check mark.', variants: ['custom'] }, focus('The select'), reflow],
  },

  combobox: {
    content: [
      fieldLabel,
      { id: 'empty', label: '“No results” message', target: 'Listbox and live region', kind: 'message', required: true, guidance: 'Say nothing matched and suggest what to try.', good: 'No countries match “Narn”. Check the spelling.', bad: 'No data' },
      { id: 'count', label: 'Result count announcement', target: 'role="status"', kind: 'message', required: true, guidance: 'Short. Screen readers hear it every time the list changes.', good: '5 results available.' },
    ],
    design: [visibleLabel, fieldBorder, { text: 'The active option is clear while typing.', check: 'A filled highlight with 3:1 contrast moves with the arrow keys.' }, focus('The input'), reflow],
  },

  slider: {
    content: [
      fieldLabel,
      { id: 'valuetext', label: 'Value wording', target: 'aria-valuetext', kind: 'text', required: true, guidance: 'How each value should be read aloud, with units and meaning.', good: '21 degrees Celsius, comfortable', bad: '21' },
      { id: 'range', label: 'Minimum and maximum labels', target: 'Visible text', kind: 'text', required: false, guidance: 'Shown at each end of the track.', good: '16 °C / 28 °C' },
    ],
    design: [{ text: 'The current value is shown as text.', check: 'Not only by the thumb position.' }, { text: 'The thumb is at least 24px.', check: 'And has 3:1 contrast against the track and background.' }, focus('The thumb'), { text: 'There’s an alternative to dragging.', check: 'Clicking the track, arrow keys or a number field can also set the value.' }],
  },

  'date-picker': {
    content: [
      fieldLabel,
      { id: 'format', label: 'Format hint', target: 'aria-describedby → hint', kind: 'hint', required: true, guidance: 'Give the format with a real example.', good: 'For example, 27 3 2007', variants: ['memorable'] },
      { id: 'limits', label: 'Date limits', target: 'Hint text', kind: 'hint', required: false, guidance: 'Say if only some dates can be chosen.', good: 'Choose a date in the next 30 days.' },
      fieldError('Date of birth must be in the past', 'Invalid date'),
    ],
    design: [visibleLabel, { text: 'Typing a date always works.', check: 'The field is never read-only; the calendar is optional.' }, fieldBorder, focus('Each field and calendar button'), reflow],
  },

  'file-upload': {
    content: [
      fieldLabel,
      { id: 'rules', label: 'Allowed types and size', target: 'Hint text', kind: 'hint', required: true, guidance: 'List them before people choose a file.', good: 'PDF or JPG, up to 10 MB each.' },
      { id: 'errors', label: 'Error messages', target: 'aria-describedby → error', kind: 'error', required: true, multiline: true, guidance: 'One per rule. Name the file in each message.', good: 'report.docx is not a PDF or JPG\nphoto.jpg is larger than 10 MB' },
      { id: 'remove', label: 'Remove button name', target: 'aria-label', kind: 'name', required: true, guidance: 'Include the file name so each Remove button is unique.', good: 'Remove report.pdf', bad: 'Remove' },
    ],
    design: [{ text: 'There’s a visible “Choose files” button.', check: 'Drag and drop is a bonus, never the only way.' }, focus('The button and each Remove button'), { text: 'The drop zone border has 3:1 contrast.', check: 'And the drag-over state uses more than color.' }, reflow],
  },

  'error-summary': {
    content: [
      { id: 'title', label: 'Summary heading', target: 'Heading inside the summary', kind: 'heading', required: true, guidance: 'Say there’s a problem in plain words.', good: 'There is a problem', bad: 'Error!' },
      { id: 'messages', label: 'Error links', target: 'Links to each field', kind: 'error', required: true, multiline: true, guidance: 'One per line, worded exactly as the inline error next to the field.', good: 'Enter your full name\nEnter an email address in the format name@example.com' },
    ],
    design: [{ text: 'The summary sits at the top of the form.', check: 'It has a strong border and an icon, not just a colored background.' }, textContrast, focus('The summary and each link')],
  },

  dialog: {
    content: [
      { id: 'title', label: 'Dialog title', target: 'aria-labelledby → heading', kind: 'heading', required: true, guidance: 'Names the dialog. Screen readers announce it on open.', good: 'Delete this project?' },
      { id: 'body', label: 'Description', target: 'aria-describedby', kind: 'text', required: false, multiline: true, guidance: 'Short explanation of consequences. Read after the title.', good: 'This permanently removes 12 files. You can’t undo this.' },
      { id: 'actions', label: 'Action buttons', target: 'Buttons', kind: 'name', required: true, multiline: true, guidance: 'One per line. Specific verbs, not OK and Cancel.', good: 'Delete project\nKeep project', bad: 'OK\nCancel' },
      { id: 'close', label: 'Close button name', target: 'aria-label', kind: 'name', required: true, guidance: 'For the × icon button.', good: 'Close', bad: '×' },
    ],
    design: [{ text: 'There’s always a visible close option.', check: 'An × or Cancel button, not only Escape or clicking outside.' }, focus('Every control in the dialog'), reflow, { text: 'The page behind is clearly dimmed.', check: 'The backdrop makes it obvious the rest of the page is inactive.' }, motion],
  },

  popover: {
    content: [
      { id: 'trigger', label: 'Button label', target: 'Button text or aria-label', kind: 'name', required: true, guidance: 'Say what opens. For an info icon, write the accessible name.', good: 'Share', bad: 'More', variants: ['interactive', 'native'] },
      { id: 'tip-name', label: 'Info button name', target: 'Visually hidden text', kind: 'name', required: true, guidance: 'Say what the help is about, since the visible “i” means nothing to a screen reader.', good: 'More about billing date', bad: 'Info', variants: ['toggletip'] },
      { id: 'name', label: 'Popover name', target: 'aria-label or aria-labelledby', kind: 'label', required: true, guidance: 'Short name announced when focus moves in.', good: 'Share', variants: ['interactive', 'native'] },
      { id: 'text', label: 'Popover text', target: 'Panel content or role="status"', kind: 'text', required: true, multiline: true, guidance: 'Keep it short. Nothing essential should live only here.', good: 'You’re billed on the same day each month.' },
      { id: 'close', label: 'Close button label', target: 'Button', kind: 'name', required: false, guidance: 'For popovers with controls.', good: 'Close', variants: ['interactive'] },
    ],
    design: [
      { text: 'It opens on click or Enter, not hover alone.', check: 'Hover may preview, but click must open it, so touch and keyboard work.' },
      focus('The button and every control inside'),
      { text: 'Popovers with controls have a visible Close button.', check: 'Escape and clicking outside aren’t discoverable for everyone.', variants: ['interactive'] },
      { text: 'It stays on screen at 320px and 200% zoom.', check: 'It flips or repositions instead of being cut off.' },
      { text: 'The panel edge has 3:1 contrast or a clear shadow.', check: 'The popover is clearly separate from the page behind.' },
    ],
  },
  drawer: {
    content: [
      { id: 'trigger', label: 'Trigger label', target: 'Button text', kind: 'name', required: true, guidance: 'Name what opens.', good: 'Filters', bad: 'Open' },
      { id: 'heading', label: 'Drawer heading', target: 'aria-labelledby → heading', kind: 'heading', required: true, guidance: 'Names the drawer when it opens.', good: 'Filters' },
      { id: 'close', label: 'Close button name', target: 'Visually hidden text', kind: 'name', required: true, guidance: 'Say what closes, since the icon is an ×.', good: 'Close filters', bad: '×' },
      { id: 'nav-name', label: 'Navigation name', target: 'aria-label on <nav>', kind: 'label', required: false, guidance: 'If the drawer holds navigation.', good: 'Main', variants: ['modal'] },
    ],
    design: [
      { text: 'There’s a visible Close button.', check: 'At the top of the drawer, with at least a 24×24px target.' },
      motion,
      { text: 'The drawer fits at 320px wide.', check: 'It takes the full width on small screens and nothing is cut off.' },
      { text: 'The page behind is dimmed for a modal drawer.', check: 'The backdrop makes it clear the page is inactive.', variants: ['modal'] },
      { text: 'The drawer doesn’t cover the content people are filtering.', check: 'On wide screens, it sits beside the content.', variants: ['non-modal'] },
      focus('Every control in the drawer'),
    ],
  },
  tooltip: {
    content: [
      { id: 'text', label: 'Tooltip text', target: 'role="tooltip"', kind: 'text', required: true, guidance: 'One short sentence. Never put essential information only in a tooltip.', good: 'Copy link to clipboard' },
      { id: 'trigger', label: 'Trigger’s own name', target: 'aria-label or text', kind: 'name', required: true, guidance: 'If the tooltip adds a description, the trigger still needs its own name.', good: 'Help with billing dates', variants: ['description'] },
    ],
    design: [{ text: 'It shows on hover and keyboard focus.', check: 'It stays open while the pointer moves onto it, and Escape closes it.' }, textContrast, { text: 'It doesn’t cover what it describes.', check: 'Position it beside the trigger and keep it on screen at 320px.' }],
  },

  toast: {
    content: [
      { id: 'message', label: 'Toast message', target: 'role="status" or role="alert"', kind: 'message', required: true, guidance: 'Short and specific. Say what happened.', good: 'Changes saved', bad: 'Success!', variants: ['success'] },
      { id: 'error', label: 'Error message', target: 'role="alert"', kind: 'error', required: true, guidance: 'What went wrong and what to do.', good: 'Couldn’t save. Check your connection and try again.', variants: ['error'] },
      { id: 'action', label: 'Action label', target: 'Button', kind: 'name', required: false, guidance: 'If there’s an action, make sure it’s also available elsewhere.', good: 'Undo' },
    ],
    design: [{ text: 'Toasts stay long enough to read.', check: 'At least 5 seconds plus 1 second per 10 words. Errors stay until dismissed.' }, notColorOnly('success or error styling'), { text: 'Toasts don’t cover important content.', check: 'They avoid the main action area and don’t block focus.' }, motion],
  },

  alert: {
    content: [
      { id: 'prefix', label: 'Type prefix', target: 'Visible or visually hidden text', kind: 'text', required: true, guidance: 'A word that states the type, so it isn’t conveyed by color alone.', good: 'Warning:' },
      { id: 'message', label: 'Alert message', target: 'Text', kind: 'message', required: true, multiline: true, guidance: 'Say what happened and what to do next.', good: 'Your session expires in 5 minutes. Save your work to keep it.' },
    ],
    design: [notColorOnly('alert type'), textContrast, { text: 'Icons are paired with a text prefix.', check: 'The icon is decorative; the word carries the meaning.' }, reflow],
  },

  progress: {
    content: [
      { id: 'label', label: 'What’s loading', target: 'aria-label or <label>', kind: 'label', required: true, guidance: 'Name the task.', good: 'Uploading report.pdf', bad: 'Loading' },
      { id: 'done', label: 'Done message', target: 'role="status"', kind: 'message', required: true, guidance: 'Confirm when it’s finished.', good: 'Upload complete' },
      { id: 'value', label: 'Value wording', target: 'aria-valuetext', kind: 'text', required: false, guidance: 'If a percentage isn’t meaningful, say it another way.', good: 'Step 2 of 5', variants: ['determinate'] },
    ],
    design: [{ text: 'Spinners are paired with text.', check: 'A visible label sits next to the spinner.', variants: ['spinner', 'indeterminate'] }, { text: 'The bar has 3:1 contrast against its track.', check: 'Measure the fill against the empty track.', variants: ['determinate'] }, motion],
  },

  image: {
    content: [
      { id: 'alt', label: 'Alt text', target: 'alt', kind: 'alt', required: true, guidance: 'Describe what the image tells people in this context, not every detail. Usually under 150 characters. Don’t start with “Image of”.', good: 'Volunteers planting trees along the riverbank', bad: 'Image of people', variants: ['informative'] },
      { id: 'decorative', label: 'Why it’s decorative', target: 'alt=""', kind: 'text', required: true, guidance: 'Confirm the image adds nothing that the text doesn’t already say. Frontend will set an empty alt so screen readers skip it.', good: 'Background texture; the heading says everything.', variants: ['decorative'] },
      { id: 'short-alt', label: 'Short alt text', target: 'alt', kind: 'alt', required: true, guidance: 'Identify the image and where to find the full description.', good: 'Bar chart of monthly sales, described below', variants: ['complex'] },
      { id: 'long', label: 'Long description', target: 'Text near the image or aria-describedby', kind: 'text', required: true, multiline: true, guidance: 'Give the key data or trends in words, or a data table.', good: 'Sales rose every month from January (£12k) to June (£31k), with the biggest jump in April.', variants: ['complex'] },
      { id: 'link-alt', label: 'Alt text (destination)', target: 'alt on an image inside a link', kind: 'link', required: true, guidance: 'The image is the link text, so describe where it goes, not what it looks like.', good: 'Acme home page', bad: 'Logo', variants: ['link'] },
      { id: 'caption', label: 'Caption', target: '<figcaption>', kind: 'text', required: false, guidance: 'Visible to everyone. Don’t repeat the alt text word for word.', good: 'Spring planting day, April 2026', variants: ['informative', 'complex'] },
    ],
    design: [{ text: 'There are no images of text.', check: 'Text is real text, styled with CSS. Logos are the exception.' }, { text: 'Meaningful icons and chart marks have 3:1 contrast.', check: 'Measure each against its background.' }, notColorOnly('difference between chart series'), reflow],
  },

  badge: {
    content: [
      { id: 'statuses', label: 'Status words', target: 'Badge text', kind: 'text', required: true, multiline: true, guidance: 'One per line. One or two words each, and distinct without their color.', good: 'Paid\nDue soon\nOverdue', bad: 'Green\nAmber\nRed', variants: ['status'] },
      { id: 'name', label: 'Button name with count', target: 'Visually hidden text', kind: 'name', required: true, guidance: 'The control’s name plus the count and what it counts. Use {n} for the number.', good: 'Notifications, {n} unread', bad: '3', variants: ['count'] },
      { id: 'new', label: 'Announcement for new items', target: 'role="status"', kind: 'message', required: false, guidance: 'Optional. Said when the count goes up while people are on the page.', good: '1 new notification', variants: ['count'] },
    ],
    design: [
      notColorOnly('status'),
      { text: 'Badge text has 4.5:1 contrast with its fill.', check: 'Check every status color in light and dark themes.' },
      { text: 'Count badges don’t cover the icon’s meaning.', check: 'The icon is still recognizable with the badge on it, at 200% zoom too.', variants: ['count'] },
      { text: 'Badges don’t look clickable.', check: 'No hover state or pointer cursor, unless the whole badge is a real button or link.' },
    ],
  },
  avatar: {
    content: [
      { id: 'name', label: 'Visible name', target: 'Text beside the image', kind: 'text', required: true, guidance: 'The person’s name as people know them. The photo then gets alt="".', good: 'Amara Okafor', variants: ['with-name', 'initials'] },
      { id: 'alt', label: 'Alt text', target: 'alt', kind: 'alt', required: true, guidance: 'The person’s name, not what they look like.', good: 'Mei Chen', bad: 'Profile photo', variants: ['alone'] },
      { id: 'link-alt', label: 'Alt text when linked', target: 'alt on an image inside a link', kind: 'link', required: false, guidance: 'Say where the link goes.', good: 'Sam Patel’s profile', bad: 'Avatar', variants: ['alone'] },
      { id: 'group', label: 'Group name', target: 'aria-label on the list', kind: 'label', required: true, guidance: 'Who’s in the group, including the hidden ones.', good: 'Editors: Amara Okafor, Lucas Ferreira, Mei Chen, Sam Patel, Noor Haddad', bad: '+2', variants: ['group'] },
    ],
    design: [
      { text: 'Initials have 4.5:1 contrast with their circle.', check: 'Measure each color pair you use, in both themes.', variants: ['initials'] },
      { text: 'Linked avatars have a visible round focus ring.', check: 'The ring follows the circle and isn’t clipped by overlapping avatars.', variants: ['alone', 'group'] },
      { text: 'Stacked avatars are separated by a ring.', check: 'The ring matches the page background so the overlap is visible in both themes.', variants: ['group'] },
      { text: 'There’s a fallback when the photo fails.', check: 'Initials or a generic icon, never an empty circle.' },
    ],
  },
  skeleton: {
    content: [
      { id: 'loading', label: 'Loading message', target: 'role="status" (visually hidden)', kind: 'message', required: true, guidance: 'Say what’s loading.', good: 'Loading files', bad: 'Please wait…' },
      { id: 'done', label: 'Loaded message', target: 'role="status" (visually hidden)', kind: 'message', required: true, guidance: 'Say it’s ready, with a count if helpful.', good: '3 files loaded', bad: 'Done' },
      { id: 'error', label: 'Error message', target: 'role="alert"', kind: 'error', required: true, guidance: 'What failed and what to do.', good: 'Files couldn’t load. Refresh the page to try again.' },
    ],
    design: [
      { text: 'The skeleton matches the real layout.', check: 'Swap in real content and confirm nothing jumps or shifts.' },
      motion,
      { text: 'There’s a designed error state.', check: 'The skeleton never stays forever; an error replaces it.' },
    ],
  },
  'empty-state': {
    content: [
      { id: 'heading', label: 'Heading', target: 'Heading element', kind: 'heading', required: true, guidance: 'Say what’s empty, plainly.', good: 'No projects yet', bad: 'Oops!', variants: ['first-use'] },
      { id: 'body', label: 'Explanation', target: 'Paragraph', kind: 'text', required: true, multiline: true, guidance: 'Why it matters or what to do. One or two sentences.', good: 'Projects keep your files, tasks and people together. Create one to get started.', variants: ['first-use'] },
      { id: 'action', label: 'Action label', target: 'Button or link', kind: 'name', required: false, guidance: 'A verb-first label for the next step.', good: 'Create a project', bad: 'Click here', variants: ['first-use'] },
      { id: 'message', label: 'No-results message', target: 'role="status"', kind: 'message', required: true, guidance: 'Repeat what was searched for. Use {q} for the search term.', good: 'No projects match “{q}”', bad: 'Nothing here', variants: ['no-results'] },
      { id: 'tip', label: 'Suggestion', target: 'Paragraph', kind: 'text', required: false, guidance: 'How to get results.', good: 'Check the spelling or try a shorter word.', variants: ['no-results'] },
      { id: 'clear', label: 'Clear button label', target: 'Button', kind: 'name', required: false, guidance: 'Say what it resets.', good: 'Clear filter', variants: ['no-results'] },
    ],
    design: [
      { text: 'The illustration is optional and decorative.', check: 'The message is fully clear with the illustration removed.' },
      { text: 'There’s one clear next step.', check: 'A single main button or link, not a row of equal options.' },
      textContrast,
      reflow,
    ],
  },
  carousel: {
    content: [
      { id: 'name', label: 'Carousel name', target: 'aria-label on the section', kind: 'label', required: true, guidance: 'What the set of slides is.', good: 'Featured guides', bad: 'Carousel' },
      { id: 'alts', label: 'Alt text for each slide image', target: 'alt', kind: 'alt', required: true, multiline: true, guidance: 'One per line, in slide order. Use alt="" if the slide heading says it all.', good: 'Green hills under a pale blue sky\nSandy shoreline at sunset\nDark hills under a night sky with a full moon' },
      { id: 'headings', label: 'Slide headings', target: 'Heading in each slide', kind: 'heading', required: true, multiline: true, guidance: 'One per line, in slide order.', good: 'Spring trail guide\nCoastal cycling\nNight sky events' },
      { id: 'links', label: 'Slide link text', target: 'Link in each slide', kind: 'link', required: false, multiline: true, guidance: 'One per line. Each makes sense on its own.', good: 'Read the spring trail guide', bad: 'Learn more' },
    ],
    design: [
      { text: 'Previous and Next are always visible.', check: 'Not only on hover, with at least a 24×24px target and 3:1 contrast.' },
      { text: 'Auto-rotation has a visible Stop button, placed first.', check: 'It’s before the slides in reading order and shows its state with an icon change.', variants: ['auto'] },
      { text: 'Slides change without sliding motion, or have a reduced-motion version.', check: 'With reduced motion on, slides swap instantly and auto-rotation doesn’t start.' },
      { text: 'Nothing essential is only on a later slide.', check: 'The key message is on slide 1 or elsewhere on the page.' },
      focus('Each control and link'),
    ],
  },

  'data-grid': {
    content: [
      { id: 'name', label: 'Grid name', target: '<caption> or aria-labelledby', kind: 'label', required: true, guidance: 'What the data is.', good: 'Invoices', bad: 'Table' },
      { id: 'hint', label: 'Keyboard hint', target: 'aria-describedby', kind: 'hint', required: true, guidance: 'One sentence on how to move and act.', good: 'Tab into the grid, then use the arrow keys. Press Enter on a column header to sort.' },
      { id: 'headers', label: 'Column headers', target: '<th scope="col">', kind: 'heading', required: true, multiline: true, guidance: 'One per line. Short and unique.', good: 'Invoice\nClient\nDue date\nAmount' },
      { id: 'sorted', label: 'Sort announcement', target: 'role="status"', kind: 'message', required: false, guidance: 'Said after sorting. Use {col} and {dir}.', good: 'Sorted by {col}, {dir}' },
    ],
    design: [
      focus('The current cell'),
      { text: 'The focus ring is inset and visible inside the table border.', check: 'It isn’t clipped on the first and last rows and columns.' },
      { text: 'Sorted state is shown with an arrow, not only color.', check: 'Unsorted columns show a faint arrow so people know they can sort.' },
      { text: 'Numbers are right-aligned.', check: 'Decimal points line up for comparison.' },
      reflow,
    ],
  },
  'tree-view': {
    content: [
      { id: 'name', label: 'Tree name', target: 'aria-labelledby', kind: 'label', required: true, guidance: 'What the tree holds.', good: 'Files' },
      { id: 'items', label: 'Item labels', target: 'Each treeitem', kind: 'text', required: true, multiline: true, guidance: 'One per line, indent children with spaces. Keep labels unique at each level.', good: 'Documents\n  Reports\n  Cover letter.docx' },
    ],
    design: [
      { text: 'Expanded and collapsed look different without color.', check: 'A chevron that rotates, or a plus and minus.' },
      { text: 'Focus and selection look different.', check: 'Focus is a ring; selection is a fill and bold text.' },
      { text: 'Indentation shows the level clearly.', check: 'At least 16px per level, still clear at 200% zoom.' },
      target('Rows'),
    ],
  },
  listbox: {
    content: [
      { id: 'label', label: 'List label', target: 'aria-labelledby or <legend>', kind: 'label', required: true, guidance: 'What people are choosing.', good: 'Topics you follow' },
      { id: 'hint', label: 'Keyboard hint', target: 'aria-describedby', kind: 'hint', required: true, guidance: 'How to move and select.', good: 'Use the arrow keys to move and Space to select.', variants: ['listbox'] },
      { id: 'options', label: 'Options', target: 'role="option" or checkbox labels', kind: 'text', required: true, multiline: true, guidance: 'One per line.', good: 'Accessibility\nDesign systems\nResearch' },
      { id: 'count', label: 'Selected count', target: 'role="status"', kind: 'message', required: false, guidance: 'Use {n} for the number.', good: '{n} selected' },
    ],
    design: [
      notColorOnly('selected state'),
      { text: 'The current option has its own outline.', check: 'Different from the selected style, and visible in both themes.', variants: ['listbox'] },
      { text: 'The list shows at least 5 options before scrolling.', check: 'A partly visible last option hints that it scrolls.' },
      target('Options'),
    ],
  },

  card: {
    content: [
      { id: 'title', label: 'Card heading', target: 'Heading (and link text)', kind: 'link', required: true, guidance: 'Makes sense on its own, since it’s also the link.', good: 'Spring trail guide', bad: 'Read more' },
      { id: 'summary', label: 'Summary', target: 'Paragraph', kind: 'text', required: false, guidance: 'One or two lines.', good: 'Twelve walks under two hours, all step-free.' },
      { id: 'alt', label: 'Image alt text', target: 'alt', kind: 'alt', required: false, guidance: 'Usually leave this empty: the image is decorative and gets alt="". Only describe it if it adds something the heading doesn’t.', good: 'A cyclist on a flat coastal path at sunset' },
      { id: 'actions', label: 'Action labels', target: 'Buttons + hidden text', kind: 'name', required: true, multiline: true, guidance: 'One per line. The card title is added as hidden text automatically.', good: 'Read\nSave', variants: ['actions'] },
    ],
    design: [
      { text: 'The whole card has a visible focus and hover state.', check: 'A ring or shadow around the card, the same for hover and focus.', variants: ['link'] },
      { text: 'Cards stack to one column at 320px.', check: 'Nothing is cut off and images keep their aspect ratio.' },
      { text: 'Card borders or shadows have 3:1 contrast, or cards are clearly separated by space.', check: 'Check in both themes.' },
      textContrast,
    ],
  },
  stepper: {
    content: [
      { id: 'name', label: 'Navigation name', target: 'aria-label on <nav>', kind: 'label', required: true, guidance: 'What the steps are for.', good: 'Checkout progress' },
      { id: 'steps', label: 'Step names', target: 'List items and step headings', kind: 'heading', required: true, multiline: true, guidance: 'One per line. Short, and the same as the step’s heading.', good: 'Your details\nDelivery\nPayment\nCheck and send' },
    ],
    design: [
      notColorOnly('difference between completed, current and future steps'),
      { text: 'There’s a “Step 2 of 4” text label.', check: 'Near the heading, not only in the indicator.' },
      { text: 'Steps wrap at 320px.', check: 'No sideways scrolling; consider a compact “Step 2 of 4: Delivery” on mobile.' },
    ],
  },
  tags: {
    content: [
      { id: 'label', label: 'Input label', target: '<label>', kind: 'label', required: true, guidance: 'What people add.', good: 'Add a topic' },
      { id: 'list', label: 'Tag list label', target: 'aria-labelledby on <ul>', kind: 'label', required: true, guidance: 'What the tags are.', good: 'Your topics' },
      { id: 'remove', label: 'Remove button name', target: 'Visually hidden text', kind: 'name', required: true, guidance: 'Use {tag} for the tag text.', good: 'Remove {tag}', bad: '×' },
      { id: 'removed', label: 'Removed message', target: 'role="status"', kind: 'message', required: true, guidance: 'Use {tag}.', good: '{tag} removed' },
    ],
    design: [target('Remove buttons'), focus('Each remove button'), { text: 'Tags wrap onto new lines.', check: 'At 200% zoom tags wrap, and long tag text wraps or truncates with the full text available.' }],
  },
  toolbar: {
    content: [
      { id: 'name', label: 'Toolbar name', target: 'aria-label', kind: 'label', required: true, guidance: 'What the controls do as a group.', good: 'Text formatting' },
      { id: 'buttons', label: 'Button names', target: 'Hidden text + tooltip', kind: 'name', required: true, multiline: true, guidance: 'One per line. Toggle names stay the same when pressed.', good: 'Bold\nItalic\nUnderline\nInsert link' },
    ],
    design: [notColorOnly('pressed state'), focus('Each button'), target('Buttons'), { text: 'Every icon has a visible tooltip.', check: 'On hover and keyboard focus.' }],
  },

  password: {
    content: [
      { id: 'label', label: 'Field label', target: '<label>', kind: 'label', required: true, guidance: 'Plain and specific.', good: 'Password', bad: 'Enter password here' },
      { id: 'hint', label: 'Hint', target: 'aria-describedby', kind: 'hint', required: false, guidance: 'Encourage long phrases.', good: 'Use a long phrase that’s easy for you to remember.', variants: ['new'] },
      { id: 'rules', label: 'Password rules', target: 'List linked with aria-describedby', kind: 'text', required: true, multiline: true, guidance: 'One per line. Only rules you really enforce.', good: 'At least 12 characters\nAt least one number', variants: ['new'] },
      { id: 'error', label: 'Error message', target: 'Error text', kind: 'error', required: true, guidance: 'Say what’s wrong and how to fix it.', good: 'Password must be at least 12 characters', bad: 'Invalid password' },
    ],
    design: [{ text: 'The Show button is text, not only an eye icon.', check: 'It reads Show or Hide, at least 24×24px.' }, notColorOnly('met and unmet rules'), fieldBorder, focus('The field and the Show button')],
  },
  'character-count': {
    content: [
      { id: 'label', label: 'Field label', target: '<label>', kind: 'label', required: true, guidance: 'What to write.', good: 'Describe the problem' },
      { id: 'hint', label: 'Hint with the limit', target: 'aria-describedby', kind: 'hint', required: true, guidance: 'State the limit up front.', good: 'You can enter up to 200 characters.' },
      { id: 'remaining', label: 'Remaining message', target: 'Count text', kind: 'message', required: true, guidance: 'Use {n}.', good: 'You have {n} characters remaining', bad: '{n}/200' },
      { id: 'over', label: 'Over-limit message', target: 'Count text', kind: 'error', required: true, guidance: 'Use {n}.', good: 'You have {n} characters too many' },
    ],
    design: [errorDesign, fieldBorder, { text: 'The count sits directly below the field.', check: 'Left-aligned with the field so it’s seen when typing.' }],
  },
  'search-field': {
    content: [
      { id: 'label', label: 'Field label', target: '<label> (can be visually hidden)', kind: 'label', required: true, guidance: 'Say what’s searched.', good: 'Search this site' },
      { id: 'button', label: 'Button name', target: 'Hidden text', kind: 'name', required: true, guidance: 'For the magnifying glass button.', good: 'Search' },
      { id: 'results', label: 'Results heading', target: 'Heading', kind: 'heading', required: true, guidance: 'Use {n} and {q}.', good: '{n} results for “{q}”' },
      { id: 'none', label: 'No-results tip', target: 'Paragraph', kind: 'text', required: false, guidance: 'How to get results.', good: 'Check the spelling or try a different word.' },
    ],
    design: [fieldBorder, target('The search button'), focus('The field and button'), { text: 'The field is wide enough for typical queries.', check: 'About 25 characters visible on desktop.' }],
  },
  'segmented-control': {
    content: [
      { id: 'legend', label: 'Group label', target: '<legend>', kind: 'label', required: true, guidance: 'What’s being chosen.', good: 'View trails as' },
      { id: 'options', label: 'Option labels', target: 'Radio labels', kind: 'text', required: true, multiline: true, guidance: 'One per line, one or two words each.', good: 'List\nGrid\nMap' },
    ],
    design: [notColorOnly('selected segment'), focus('Each segment'), target('Segments'), { text: 'Every segment has a text label.', check: 'Icons are optional extras, not the only label.' }],
  },

  video: {
    content: [
      { id: 'title', label: 'Video caption', target: '<figcaption>', kind: 'text', required: true, guidance: 'What it is and how long.', good: 'Riverside loop: how to find the start (9 seconds)' },
      { id: 'captions', label: 'Captions file', target: '<track kind="captions">', kind: 'text', required: true, multiline: true, guidance: 'Paste the WebVTT, or note who is producing it. Include speaker names and sounds in [brackets].', good: '[Birdsong]\nNarrator: Start at the visitor centre car park.' },
      { id: 'transcript', label: 'Transcript', target: '<details> below the video', kind: 'text', required: true, multiline: true, guidance: 'Speech, sounds and important visuals.', good: 'Narrator: Start at the visitor centre car park.\nVisual: a red-roofed hut by the river path.' },
      { id: 'ad', label: 'Audio description', target: 'Described version or extra narration', kind: 'text', required: false, multiline: true, guidance: 'Needed when important things are only shown, not said.', good: 'A red marker post stands to the left of the gate.' },
    ],
    design: [
      { text: 'There’s no autoplay.', check: 'The video starts only when people press Play.' },
      { text: 'Nothing flashes more than 3 times a second.', check: 'Check the whole video, including transitions.' },
      { text: 'The transcript is right below the video.', check: 'Not on another page or in a download only.' },
      { text: 'Text in the video has 4.5:1 contrast and stays on screen long enough to read.', check: 'Also check it isn’t covered by captions.' },
    ],
  },
  'cookie-banner': {
    content: [
      { id: 'heading', label: 'Heading', target: 'Heading', kind: 'heading', required: true, guidance: 'Name the site.', good: 'Cookies on Trailmate' },
      { id: 'body', label: 'Explanation', target: 'Paragraph', kind: 'text', required: true, multiline: true, guidance: 'Plain words on what’s essential and what’s optional.', good: 'We use some essential cookies to make this site work. We’d also like to set analytics cookies to understand how you use it.' },
      { id: 'buttons', label: 'Button labels', target: 'Buttons', kind: 'name', required: true, multiline: true, guidance: 'Say what each does.', good: 'Accept analytics cookies\nReject analytics cookies', bad: 'OK\nNo thanks' },
      { id: 'confirm', label: 'Confirmation', target: 'Message that receives focus', kind: 'message', required: true, guidance: 'Use {choice}.', good: 'You’ve {choice} additional cookies. You can change your cookie settings at any time.' },
    ],
    design: [
      { text: 'Accept and Reject look equally important.', check: 'Same size, style and color.' },
      { text: 'The banner is in the page flow, not fixed over content.', check: 'It doesn’t cover anything people tab to, at any zoom.' },
      reflow,
    ],
  },
  'back-link': {
    content: [{ id: 'text', label: 'Link text', target: 'Link + hidden text', kind: 'link', required: true, guidance: '“Back”, plus where to in hidden text if helpful.', good: 'Back to delivery' }],
    design: [{ text: 'It looks like a link.', check: 'Underlined, small, top left above the heading.' }, focus('The link')],
  },
  quantity: {
    content: [
      { id: 'label', label: 'Field label', target: '<label>', kind: 'label', required: true, guidance: 'What’s being counted.', good: 'Number of tickets' },
      { id: 'hint', label: 'Hint with limits', target: 'aria-describedby', kind: 'hint', required: true, guidance: 'The minimum or maximum.', good: 'Up to 10 per order.' },
      { id: 'buttons', label: 'Button names', target: 'Hidden text', kind: 'name', required: true, multiline: true, guidance: 'Two lines: decrease, increase.', good: 'Decrease number of tickets\nIncrease number of tickets', bad: 'Minus\nPlus' },
      { id: 'error', label: 'Error message', target: 'Error text', kind: 'error', required: true, guidance: 'Give the allowed range.', good: 'Enter a number from 1 to 10' },
    ],
    design: [target('The − and + buttons'), errorDesign, fieldBorder, { text: 'The at-limit state is clear without disabling.', check: 'Faded but still focusable, with enough contrast to read.' }],
  },

  header: {
    content: [
      { id: 'logo', label: 'Logo link name', target: 'Logo alt or hidden text', kind: 'link', required: true, guidance: 'The site name and “home”.', good: 'Trailmate home', bad: 'logo' },
      { id: 'nav', label: 'Navigation label', target: 'aria-label', kind: 'name', required: true, guidance: 'One word that tells it apart from other navigation.', good: 'Main' },
    ],
    design: [{ text: 'It’s identical on every page.', check: 'Same items, same order, same place.' }, { text: 'A sticky header doesn’t hide focus.', check: 'Tab down the page; the focused item is never under the header.' }, focus('Header links'), reflow],
  },
  footer: {
    content: [
      { id: 'groups', label: 'Group headings', target: '<h2>', kind: 'heading', required: true, multiline: true, guidance: 'One short heading per group.', good: 'Explore\nHelp' },
      { id: 'nav', label: 'Navigation label', target: 'aria-label', kind: 'name', required: true, guidance: 'Tells it apart from the main navigation.', good: 'Footer' },
    ],
    design: [{ text: 'Help and contact links are in the same place on every page.', check: 'Same group, same order.' }, textContrast, reflow],
  },
  fieldset: {
    content: [
      { id: 'legend', label: 'Legend', target: '<legend>', kind: 'heading', required: true, guidance: 'The question people answer, kept short.', good: 'What is your address?', bad: 'Please fill in your address details below so we can send your order' },
      { id: 'hint', label: 'Hint', target: 'aria-describedby', kind: 'hint', required: false, guidance: 'Extra help, outside the legend.', good: 'We’ll only use this to send your order.' },
    ],
    design: [{ text: 'The legend is visible and above the fields.', check: 'Not hidden, not beside the fields.' }, fieldBorder, errorDesign],
  },
  'star-rating': {
    content: [
      { id: 'legend', label: 'Legend', target: '<legend>', kind: 'heading', required: true, guidance: 'What’s being rated.', good: 'Rate Riverside loop', bad: 'Rating' },
      { id: 'names', label: 'Star names', target: 'Hidden text', kind: 'name', required: true, guidance: 'A number and “star” or “stars”.', good: '3 stars' },
    ],
    design: [target('Each star'), notColorOnly('selected stars'), focus('The focused star'), { text: 'Selected stars have a 3:1 outline.', check: 'Filled and outlined stars both meet non-text contrast.' }],
  },
  table: {
    content: [
      { id: 'caption', label: 'Table caption', target: '<caption>', kind: 'heading', required: true, guidance: 'Names the table. Screen readers announce it on entry.', good: 'Invoices due in March 2026' },
      { id: 'headers', label: 'Column headers', target: '<th scope="col">', kind: 'label', required: true, multiline: true, guidance: 'One per line. Short and unique. Include units.', good: 'Invoice\nCustomer\nAmount (USD)\nDue date' },
      { id: 'sort', label: 'Sort announcement', target: 'role="status"', kind: 'message', required: false, guidance: 'Confirm the new order.', good: 'Sorted by due date, earliest first', variants: ['sortable'] },
    ],
    design: [{ text: 'There are no merged or split cells.', check: 'Every row has the same columns. Complex tables are split into simpler ones.' }, { text: 'Wide tables scroll inside their container.', check: 'The page itself doesn’t scroll sideways at 320px.' }, notColorOnly('sorted column marker'), textContrast],
  },
};

/* ---------- Content checks ---------- */

export interface Lint {
  message: string;
}

/** Quick heuristics to catch common content problems while typing. */
export function lintField(kind: FieldKind, value: string): Lint[] {
  const v = value.trim();
  if (!v) return [];
  const out: Lint[] = [];
  const lines = v.split('\n').map((l) => l.trim()).filter(Boolean);
  const any = (re: RegExp) => lines.some((l) => re.test(l));

  if (kind === 'alt') {
    if (any(/^(an? )?(image|picture|photo|graphic|icon)( of)?\b/i)) out.push({ message: 'Screen readers already say “image”. Start with what it shows.' });
    if (any(/\.(png|jpe?g|gif|svg|webp)$/i)) out.push({ message: 'This looks like a file name, not a description.' });
    if (v.length > 150) out.push({ message: 'Over 150 characters. Consider a short alt plus a long description.' });
  }
  if (kind === 'link' && any(/^(click here|here|read more|learn more|more|link|this)$/i)) {
    out.push({ message: 'This won’t make sense out of context. Describe the destination.' });
  }
  if (kind === 'name') {
    if (any(/^(ok|okay|submit|click|yes|no|go)$/i)) out.push({ message: 'Say what will happen, like “Save changes”.' });
    if (any(/\bbutton\b/i)) out.push({ message: 'Don’t include “button”. Screen readers announce the role.' });
  }
  if (kind === 'label' || kind === 'name') {
    if (any(/\*$/)) out.push({ message: 'Leave out the asterisk. The component adds the required marker.' });
    if (kind === 'label' && any(/:$/)) out.push({ message: 'No colon needed at the end of a label.' });
  }
  if (kind === 'error' && lines.some((l) => l.split(/\s+/).length < 3)) {
    out.push({ message: 'Too short to help. Say what went wrong and how to fix it.' });
  }
  if (/\b[A-Z]{5,}\b/.test(v) && !/^[A-Z0-9-]+$/.test(v)) {
    out.push({ message: 'Avoid all caps. Some screen readers spell it out letter by letter.' });
  }
  return out;
}
