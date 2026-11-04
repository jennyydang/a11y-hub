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
  menu: {
    parts: [
      { name: 'Menu button', required: true, note: 'aria-haspopup and aria-expanded; named for the group of actions.' },
      { name: 'Menu', required: true, note: 'role="menu", labelled by the button.' },
      { name: 'Menu item', required: true, note: 'role="menuitem"; starts with a verb.' },
      { name: 'Separator', required: false, note: 'role="separator" between groups.' },
    ],
    states: [
      { state: 'Closed', looks: 'Button with a chevron or ⋯', announced: '“Actions, menu button, collapsed”' },
      { state: 'Open', looks: 'Popover list below the button', announced: '“expanded”, then the first item' },
      { state: 'Item highlighted', looks: 'Filled background', announced: '“Duplicate, menu item, 2 of 4”' },
      { state: 'Item unavailable', looks: 'Muted text', announced: '“dimmed” or “unavailable”' },
    ],
  },
  'site-navigation': {
    parts: [
      { name: 'Nav landmark', required: true, note: '<nav> with a name if there are several.' },
      { name: 'Top-level link', required: true, note: 'Goes straight to a page.' },
      { name: 'Disclosure button', required: false, note: 'Opens a submenu; aria-expanded.' },
      { name: 'Submenu', required: false, note: 'A list of links shown on click.' },
      { name: 'Current page marker', required: true, note: 'aria-current="page" plus a visual cue.' },
    ],
    states: [
      { state: 'Default', looks: 'Row of links', announced: '“Main, navigation, list, 4 items”' },
      { state: 'Section open', looks: 'Submenu visible, chevron rotated', announced: '“Products, button, expanded”' },
      { state: 'Current page', looks: 'Underline or bold, not just color', announced: '“current page”' },
    ],
  },
  breadcrumbs: {
    parts: [
      { name: 'Nav landmark', required: true, note: 'aria-label="Breadcrumb".' },
      { name: 'Ordered list', required: true, note: 'Gives the count and order.' },
      { name: 'Crumb link', required: true, note: 'Matches the page title.' },
      { name: 'Separator', required: true, note: 'Decorative, drawn with CSS.' },
      { name: 'Current page', required: true, note: 'Last item, aria-current="page".' },
    ],
    states: [
      { state: 'Default', looks: 'Links with separators', announced: '“Breadcrumb, navigation, list, 3 items”' },
      { state: 'Current page', looks: 'Plain text or bold', announced: '“Billing, current page”' },
    ],
  },
  pagination: {
    parts: [
      { name: 'Nav landmark', required: true, note: 'Named, like “Search results pages”.' },
      { name: 'Previous and Next', required: true, note: 'Text labels, not arrows alone.' },
      { name: 'Page link', required: true, note: 'Hidden “Page” text before the number.' },
      { name: 'Current page', required: true, note: 'aria-current="page" plus a fill or border.' },
      { name: 'Range text', required: false, note: 'Like “Showing 21–30 of 80”.' },
    ],
    states: [
      { state: 'Default page', looks: 'Number in a box', announced: '“Page 4, link”' },
      { state: 'Current page', looks: 'Filled box', announced: '“Page 3, current page”' },
      { state: 'First or last page', looks: 'Previous or Next hidden or muted', announced: 'Not reachable, or “unavailable”' },
    ],
  },
  'skip-link': {
    parts: [
      { name: 'Link', required: true, note: 'First focusable element on the page.' },
      { name: 'Target', required: true, note: '<main id="main" tabindex="-1">.' },
    ],
    states: [
      { state: 'Hidden', looks: 'Off screen until focused', announced: 'Nothing until reached' },
      { state: 'Focused', looks: 'Visible at the top left, high contrast', announced: '“Skip to main content, link”' },
      { state: 'Activated', looks: 'Page scrolls to main content', announced: 'Focus moves to the main content' },
    ],
  },
  slider: {
    parts: [
      { name: 'Label', required: true, note: 'Visible, linked to the input.' },
      { name: 'Track', required: true, note: '3:1 contrast against the background.' },
      { name: 'Thumb', required: true, note: 'At least 24px, with a focus ring.' },
      { name: 'Value text', required: true, note: 'Visible, with units; also in aria-valuetext.' },
      { name: 'Min and max labels', required: false, note: 'At each end of the track.' },
    ],
    states: [
      { state: 'Default', looks: 'Thumb at the current value', announced: '“Temperature, 21 degrees Celsius, comfortable, slider”' },
      { state: 'Focus', looks: 'Ring around the thumb', announced: 'Label and value' },
      { state: 'Changing', looks: 'Thumb and value text move', announced: 'New value on each arrow press' },
    ],
  },
  'date-picker': {
    parts: [
      { name: 'Label', required: true, note: 'Visible.' },
      { name: 'Format hint', required: true, note: 'With a real example.' },
      { name: 'Date field', required: true, note: 'Native date input or day, month, year fields.' },
      { name: 'Calendar button', required: false, note: 'Opens a calendar dialog; named “Choose date”.' },
      { name: 'Error message', required: false, note: 'Linked with aria-describedby.' },
    ],
    states: [
      { state: 'Empty', looks: 'Field with format hint', announced: 'Label, hint and “edit text” or “date”' },
      { state: 'Filled', looks: 'Date shown', announced: 'Label and date' },
      { state: 'Error', looks: 'Icon, message and red border', announced: '“invalid entry” and the error' },
    ],
  },
  'file-upload': {
    parts: [
      { name: 'Label', required: true, note: 'Visible.' },
      { name: 'Rules hint', required: true, note: 'Allowed types and sizes.' },
      { name: 'Choose files button', required: true, note: 'The native file input.' },
      { name: 'Drop zone', required: false, note: 'Bonus only, never the only way.' },
      { name: 'File list', required: false, note: 'Each file with a named Remove button.' },
      { name: 'Status message', required: true, note: 'Announces added and removed files.' },
    ],
    states: [
      { state: 'Empty', looks: 'Button and hint', announced: '“Upload documents, button, no file selected”' },
      { state: 'Dragging over', looks: 'Drop zone border thickens, text changes', announced: 'Nothing' },
      { state: 'Files added', looks: 'List of files', announced: '“2 files added”' },
      { state: 'Error', looks: 'Message naming the file', announced: 'The error, like “report.docx is not a PDF”' },
    ],
  },
  'error-summary': {
    parts: [
      { name: 'Container', required: true, note: 'Strong border and icon; tabindex="-1" so it can take focus.' },
      { name: 'Heading', required: true, note: '“There is a problem”.' },
      { name: 'Error links', required: true, note: 'One per error, linking to the field.' },
    ],
    states: [
      { state: 'Hidden', looks: 'Not shown before submit', announced: 'Nothing' },
      { state: 'Shown after submit', looks: 'Box at the top of the form', announced: 'Focus moves here: heading, then the list' },
      { state: 'Link followed', looks: 'Field focused and scrolled into view', announced: 'Field label and its error' },
    ],
  },
  tooltip: {
    parts: [
      { name: 'Trigger', required: true, note: 'A focusable control.' },
      { name: 'Tooltip', required: true, note: 'role="tooltip", referenced by the trigger.' },
    ],
    states: [
      { state: 'Hidden', looks: 'Not shown', announced: 'Trigger name only' },
      { state: 'Shown', looks: 'Bubble beside the trigger', announced: 'As the name or description of the trigger' },
      { state: 'Dismissed', looks: 'Hidden by Escape', announced: 'Nothing' },
    ],
  },
  toast: {
    parts: [
      { name: 'Live region', required: true, note: 'Exists before any toast appears.' },
      { name: 'Message', required: true, note: 'Short and specific.' },
      { name: 'Icon', required: false, note: 'Decorative, paired with text.' },
      { name: 'Action', required: false, note: 'Also available elsewhere.' },
      { name: 'Dismiss button', required: false, note: 'Named “Dismiss”.' },
    ],
    states: [
      { state: 'Success', looks: 'Icon and message', announced: 'Politely, like “Changes saved”' },
      { state: 'Error', looks: 'Error icon, stays until dismissed', announced: 'Assertively, interrupting' },
      { state: 'Dismissed', looks: 'Gone', announced: 'Nothing; focus never moved' },
    ],
  },
  alert: {
    parts: [
      { name: 'Container', required: true, note: 'role="alert" only if it appears after load.' },
      { name: 'Icon', required: false, note: 'Decorative.' },
      { name: 'Type prefix', required: true, note: 'Like “Warning:”, visible or visually hidden.' },
      { name: 'Message', required: true, note: 'What happened and what to do.' },
    ],
    states: [
      { state: 'Info', looks: 'Blue with info icon', announced: '“Info: …”' },
      { state: 'Success', looks: 'Green with tick', announced: '“Success: …”' },
      { state: 'Warning', looks: 'Amber with warning icon', announced: '“Warning: …”' },
      { state: 'Error', looks: 'Red with error icon', announced: '“Error: …”' },
    ],
  },
  progress: {
    parts: [
      { name: 'Label', required: true, note: 'Names the task.' },
      { name: 'Bar or spinner', required: true, note: 'role="progressbar".' },
      { name: 'Value text', required: false, note: 'Percentage or steps, visible.' },
      { name: 'Status message', required: true, note: 'Announces start and finish.' },
    ],
    states: [
      { state: 'Determinate', looks: 'Bar fills to the value', announced: '“Uploading report.pdf, progress bar, 40%”' },
      { state: 'Indeterminate', looks: 'Moving bar or spinner, slower with reduced motion', announced: '“busy” or the label only' },
      { state: 'Complete', looks: 'Full bar or tick', announced: '“Upload complete”' },
    ],
  },
  image: {
    parts: [
      { name: 'Image', required: true, note: '<img> or <svg role="img">.' },
      { name: 'Alt text', required: true, note: 'Empty alt="" when decorative.' },
      { name: 'Caption', required: false, note: '<figcaption>, visible to everyone.' },
      { name: 'Long description', required: false, note: 'For charts and diagrams.' },
    ],
    states: [
      { state: 'Informative', looks: 'Image shown', announced: 'The alt text, then “image”' },
      { state: 'Decorative', looks: 'Image shown', announced: 'Skipped' },
      { state: 'Inside a link', looks: 'Image shown', announced: 'The alt text, then “link”' },
    ],
  },
  table: {
    parts: [
      { name: 'Caption', required: true, note: 'Names the table.' },
      { name: 'Column headers', required: true, note: '<th scope="col">.' },
      { name: 'Row headers', required: false, note: '<th scope="row"> for the first column.' },
      { name: 'Data cells', required: true, note: 'No merged cells.' },
      { name: 'Sort button', required: false, note: 'Inside the header, with aria-sort on the <th>.' },
    ],
    states: [
      { state: 'Default', looks: 'Rows and columns', announced: '“Invoices due in March, table, 4 columns, 5 rows”' },
      { state: 'Sorted', looks: 'Arrow icon on the sorted column', announced: '“sorted ascending”' },
      { state: 'Scrolling', looks: 'Table scrolls inside its box', announced: 'Nothing; the region is focusable and named' },
    ],
  },
};
