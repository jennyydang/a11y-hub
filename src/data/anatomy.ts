export interface Part {
  name: string;
  required: boolean;
  note: string;
}

export interface State {
  state: string;
  looks: string;
  announced: string;
}

export interface Anatomy {
  parts: Part[];
  states: State[];
}

export const anatomy: Record<string, Anatomy> = {
  button: {
    parts: [
      { name: 'Container', required: true, note: 'The <button> element. Its hit area is at least 24×24px.' },
      { name: 'Label', required: true, note: 'Visible text, or an accessible name if icon-only.' },
      { name: 'Icon', required: false, note: 'Decorative when there’s a label (aria-hidden).' },
      { name: 'Focus ring', required: true, note: 'At least 2px with 3:1 contrast.' },
    ],
    states: [
      { state: 'Default', looks: 'Solid or outlined container', announced: '“Save changes, button”' },
      { state: 'Hover', looks: 'Darker fill', announced: 'Nothing' },
      { state: 'Focus', looks: 'Visible focus ring', announced: 'Name and role' },
      { state: 'Pressed (toggle)', looks: 'Filled, darker, with a check or bold', announced: '“…toggle button, pressed”' },
      { state: 'Loading', looks: 'Spinner beside the label, same width', announced: 'Status message, like “Saving…”' },
      { state: 'Unavailable', looks: 'Muted but readable, still focusable', announced: '“…dimmed” or “unavailable”, plus the reason' },
    ],
  },
  link: {
    parts: [
      { name: 'Link text', required: true, note: 'Makes sense on its own.' },
      { name: 'Underline', required: true, note: 'In body text, or another non-color cue.' },
      { name: 'External or file icon', required: false, note: 'Decorative; the text says “opens in a new tab” or the file type.' },
    ],
    states: [
      { state: 'Default', looks: 'Underlined, link color', announced: '“Annual report, link”' },
      { state: 'Hover', looks: 'Thicker underline', announced: 'Nothing' },
      { state: 'Focus', looks: 'Focus ring around the text', announced: 'Name and role' },
      { state: 'Visited', looks: 'Optional different color', announced: '“visited link”' },
      { state: 'Current page', looks: 'Bold or marked, not just color', announced: '“current page”' },
    ],
  },
  'text-input': {
    parts: [
      { name: 'Label', required: true, note: 'Visible, above the field, linked with for/id.' },
      { name: 'Hint', required: false, note: 'Between label and field, linked with aria-describedby.' },
      { name: 'Field', required: true, note: 'Border with 3:1 contrast.' },
      { name: 'Error message', required: false, note: 'Icon plus text, linked with aria-describedby.' },
      { name: 'Required marker', required: false, note: 'Or mark optional fields instead.' },
    ],
    states: [
      { state: 'Empty', looks: 'Border, no placeholder-only label', announced: '“Email address, edit text”, then the hint' },
      { state: 'Focus', looks: 'Thicker border or ring', announced: 'Label, role, hint' },
      { state: 'Filled', looks: 'Text in the field', announced: 'Label and value' },
      { state: 'Error', looks: 'Red border plus icon and message', announced: '“invalid entry”, then the error' },
      { state: 'Read-only', looks: 'Filled background, no border', announced: '“read only”' },
      { state: 'Disabled', looks: 'Muted; avoid when possible', announced: '“dimmed” or skipped' },
    ],
  },
  textarea: {
    parts: [
      { name: 'Label', required: true, note: 'Visible, linked with for/id.' },
      { name: 'Hint with limit', required: false, note: 'States the character limit up front.' },
      { name: 'Field', required: true, note: 'Resizable vertically.' },
      { name: 'Counter', required: false, note: 'Visible count; a debounced polite announcement.' },
      { name: 'Error message', required: false, note: 'Linked with aria-describedby.' },
    ],
    states: [
      { state: 'Default', looks: 'Bordered multi-line box', announced: '“Description, edit text, multi-line”' },
      { state: 'Near limit', looks: 'Counter text changes', announced: '“20 characters remaining”, after a pause' },
      { state: 'Over limit', looks: 'Counter and border show an error with an icon', announced: '“invalid entry” and the count' },
    ],
  },
  checkbox: {
    parts: [
      { name: 'Group legend', required: false, note: 'The question, for groups of checkboxes.' },
      { name: 'Box', required: true, note: 'Border with 3:1 contrast.' },
      { name: 'Label', required: true, note: 'Clickable, linked to the box.' },
      { name: 'Hint', required: false, note: 'Extra detail, linked with aria-describedby.' },
    ],
    states: [
      { state: 'Unchecked', looks: 'Empty box', announced: '“Product updates, checkbox, not checked”' },
      { state: 'Checked', looks: 'Filled box with a tick', announced: '“checked”' },
      { state: 'Mixed', looks: 'Filled box with a dash', announced: '“mixed” or “half checked”' },
      { state: 'Error', looks: 'Error text above the group with an icon', announced: '“invalid entry” and the error' },
    ],
  },
  'radio-group': {
    parts: [
      { name: 'Legend', required: true, note: 'The question the options answer.' },
      { name: 'Radio', required: true, note: 'Circle with 3:1 contrast.' },
      { name: 'Option label', required: true, note: 'Clickable.' },
    ],
    states: [
      { state: 'None selected', looks: 'Empty circles', announced: '“Email, radio button, not selected, 1 of 3”' },
      { state: 'Selected', looks: 'Filled dot, not just color', announced: '“selected”' },
      { state: 'Focus', looks: 'Ring around the focused radio', announced: 'Legend on entry, then the option' },
    ],
  },
  switch: {
    parts: [
      { name: 'Label', required: true, note: 'Names the setting, never changes.' },
      { name: 'Track', required: true, note: 'Off-state border or fill at 3:1.' },
      { name: 'Thumb', required: true, note: 'Moves to show the state.' },
      { name: 'On/off text', required: false, note: 'Helps people who can’t rely on position or color.' },
    ],
    states: [
      { state: 'Off', looks: 'Thumb left, outlined track', announced: '“Email notifications, switch, off”' },
      { state: 'On', looks: 'Thumb right, filled track, optional tick', announced: '“on”' },
      { state: 'Focus', looks: 'Ring around the track', announced: 'Name, role and state' },
    ],
  },
  select: {
    parts: [
      { name: 'Label', required: true, note: 'Visible, linked to the control.' },
      { name: 'Trigger', required: true, note: 'Shows the current value and a chevron.' },
      { name: 'List', required: true, note: 'Options; native or role="listbox".' },
      { name: 'Option', required: true, note: 'Highlighted with more than color.' },
    ],
    states: [
      { state: 'Closed', looks: 'Value and chevron', announced: '“Size, Medium, pop-up button” or “combo box”' },
      { state: 'Open', looks: 'List below the trigger', announced: '“expanded”, then the selected option' },
      { state: 'Option highlighted', looks: 'Filled background or check', announced: 'The option and “selected” if chosen' },
    ],
  },
  combobox: {
    parts: [
      { name: 'Label', required: true, note: 'Visible.' },
      { name: 'Input', required: true, note: 'Focus stays here while choosing.' },
      { name: 'Listbox', required: true, note: 'Filtered options.' },
      { name: 'Result count', required: true, note: 'A polite status message.' },
      { name: 'Empty message', required: true, note: 'When nothing matches.' },
    ],
    states: [
      { state: 'Collapsed', looks: 'Text field', announced: '“Country, combo box, collapsed”' },
      { state: 'Expanded', looks: 'List of matches', announced: '“expanded”, then “5 results available”' },
      { state: 'Active option', looks: 'Highlighted row', announced: 'The option, via aria-activedescendant' },
      { state: 'No results', looks: 'Message in the list', announced: 'The no-results message' },
    ],
  },
  tabs: {
    parts: [
      { name: 'Tab list', required: true, note: 'Named with aria-label.' },
      { name: 'Tab', required: true, note: 'Short label; selected one marked by shape.' },
      { name: 'Panel', required: true, note: 'Linked to its tab; focusable if it has no focusable content.' },
    ],
    states: [
      { state: 'Selected tab', looks: 'Underline or raised surface, not just color', announced: '“Specs, tab, selected, 2 of 3”' },
      { state: 'Unselected tab', looks: 'Plain text', announced: '“tab, 3 of 3”' },
      { state: 'Focus', looks: 'Ring on the tab', announced: 'Name, role, position' },
    ],
  },
  accordion: {
    parts: [
      { name: 'Heading', required: true, note: 'Wraps the button, right level for the page.' },
      { name: 'Header button', required: true, note: 'Full width; aria-expanded.' },
      { name: 'Chevron', required: true, note: 'Rotates to show the state; decorative.' },
      { name: 'Panel', required: true, note: 'Hidden when collapsed.' },
    ],
    states: [
      { state: 'Collapsed', looks: 'Chevron pointing down or right', announced: '“Shipping, button, collapsed, heading level 3”' },
      { state: 'Expanded', looks: 'Chevron pointing up, panel visible', announced: '“expanded”' },
      { state: 'Focus', looks: 'Ring on the full header row', announced: 'Name, role, state' },
    ],
  },
  dialog: {
    parts: [
      { name: 'Backdrop', required: true, note: 'Dims and blocks the page.' },
      { name: 'Title', required: true, note: 'A heading, referenced by aria-labelledby.' },
      { name: 'Body', required: false, note: 'Optional description via aria-describedby.' },
      { name: 'Actions', required: true, note: 'Specific verbs.' },
      { name: 'Close button', required: true, note: 'Visible, with an accessible name.' },
    ],
    states: [
      { state: 'Open', looks: 'Panel over a dimmed page', announced: '“Delete this project?, dialog”, then the focused control' },
      { state: 'Focus trapped', looks: 'Tab cycles inside', announced: 'Only dialog content' },
      { state: 'Closed', looks: 'Gone', announced: 'Focus is back on the trigger, which is announced' },
    ],
  },
};
