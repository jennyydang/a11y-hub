/**
 * When to use each component, where it goes on the page, and the user experience
 * evidence behind that advice. Sources are well-known UX references; each point cites one.
 */

export type Region = 'Page top' | 'Header' | 'Navigation' | 'Main content' | 'Forms' | 'Sidebar' | 'Overlays' | 'Footer';

export const REGIONS: { id: Region; note: string }[] = [
  { id: 'Page top', note: 'Before everything else in the page, including the header.' },
  { id: 'Header', note: 'The same on every page: logo, search, account, global actions.' },
  { id: 'Navigation', note: 'How people move between pages and sections.' },
  { id: 'Main content', note: 'The reason people came to the page. One <main> per page.' },
  { id: 'Forms', note: 'Fields and actions inside a form, top to bottom.' },
  { id: 'Sidebar', note: 'Supporting content and filters beside the main content.' },
  { id: 'Overlays', note: 'Layers that open over the page, tied to the control that opened them.' },
  { id: 'Footer', note: 'Secondary links, legal text, contact details.' },
];

export interface Source {
  name: string;
  url: string;
}

const s = (name: string, url: string): Source => ({ name, url });
const nng = (title: string, path: string) => s(`${title} (Nielsen Norman Group)`, `https://www.nngroup.com/articles/${path}/`);
const ux = (title: string, path: string) => s(`${title} (Laws of UX)`, `https://lawsofux.com/${path}/`);
const gov = (title: string, path: string) => s(`${title} (GOV.UK Design System)`, `https://design-system.service.gov.uk/components/${path}/`);
const wcag = (title: string, path: string) => s(`Understanding ${title} (W3C)`, `https://www.w3.org/WAI/WCAG22/Understanding/${path}`);

export const SRC = {
  fitts: ux('Fitts’s law', 'fittss-law'),
  jakob: ux('Jakob’s law', 'jakobs-law'),
  hick: ux('Hick’s law', 'hicks-law'),
  proximity: ux('Law of proximity', 'law-of-proximity'),
  region: ux('Law of common region', 'law-of-common-region'),
  serial: ux('Serial position effect', 'serial-position-effect'),
  doherty: ux('Doherty threshold', 'doherty-threshold'),
  fPattern: nng('F-shaped pattern of reading on the web', 'f-shaped-pattern-reading-web-content'),
  banner: nng('Banner blindness', 'banner-blindness-old-and-new-findings'),
  modal: nng('Modal and nonmodal dialogs', 'modal-nonmodal-dialog'),
  tabs: nng('Tabs, used right', 'tabs-used-right'),
  breadcrumbs: nng('Breadcrumbs', 'breadcrumbs'),
  skeleton: nng('Skeleton screens', 'skeleton-screens'),
  empty: nng('Designing empty states', 'empty-state-interface-design'),
  toggle: nng('Toggle switch guidelines', 'toggle-switch-guidelines'),
  checkRadio: nng('Checkboxes vs. radio buttons', 'checkboxes-vs-radio-buttons'),
  placeholders: nng('Placeholders in form fields are harmful', 'form-design-placeholders'),
  formErrors: nng('Error messages in forms', 'errors-forms-design-guidelines'),
  hamburger: nng('Hamburger menus', 'hamburger-menus'),
  tooltip: nng('Tooltip guidelines', 'tooltip-guidelines'),
  progress: nng('Progress indicators', 'progress-indicators'),
  indicators: nng('Indicators, validations and notifications', 'indicators-validations-notifications'),
  dropdown: nng('Drop-down menus: use sparingly', 'drop-down-menus'),
  autoForward: nng('Auto-forwarding carousels', 'auto-forwarding'),
  govErrorSummary: gov('Error summary', 'error-summary'),
  govTextInput: gov('Text input', 'text-input'),
  govTextarea: gov('Textarea', 'textarea'),
  govSkip: gov('Skip link', 'skip-link'),
  govRadios: gov('Radios', 'radios'),
  govCheckboxes: gov('Checkboxes', 'checkboxes'),
  govDate: gov('Date input', 'date-input'),
  govPagination: gov('Pagination', 'pagination'),
  govTabs: gov('Tabs', 'tabs'),
  govAccordion: gov('Accordion', 'accordion'),
  govSelect: gov('Select', 'select'),
  govBreadcrumbs: gov('Breadcrumbs', 'breadcrumbs'),
  govFileUpload: gov('File upload', 'file-upload'),
  govBanner: gov('Notification banner', 'notification-banner'),
  govTable: gov('Table', 'table'),
  govButton: gov('Button', 'button'),
  govHeader: gov('Header', 'header'),
  wcagFocusObscured: wcag('Focus Not Obscured', 'focus-not-obscured-minimum'),
  wcagTarget: wcag('Target Size', 'target-size-minimum'),
  wcagConsistentNav: wcag('Consistent Navigation', 'consistent-navigation'),
  wcagBypass: wcag('Bypass Blocks', 'bypass-blocks'),
  wcagPause: wcag('Pause, Stop, Hide', 'pause-stop-hide'),
  wcagStatus: wcag('Status Messages', 'status-messages'),
  wcagHoverFocus: wcag('Content on Hover or Focus', 'content-on-hover-or-focus'),
  wcagSequence: wcag('Meaningful Sequence', 'meaningful-sequence'),
  wcagReflow: wcag('Reflow', 'reflow'),
  wcagDragging: wcag('Dragging Movements', 'dragging-movements'),
} satisfies Record<string, Source>;

export interface Evidence {
  /** What people experience, in plain words. */
  point: string;
  source: Source;
}

export interface Placement {
  regions: Region[];
  /** Where it goes, specifically. */
  where: string[];
  /** Why that works for people, each backed by a source. */
  why: Evidence[];
  /** Situations where it's the wrong choice. */
  dontUse: string[];
}

export const placement: Record<string, Placement> = {
  button: {
    regions: ['Main content', 'Forms', 'Overlays'],
    where: [
      'Put the main action at the end of the content it acts on: after the last form field, at the bottom of a dialog.',
      'Line actions up with the left edge of the form in long forms, so people scanning down the left side find them.',
      'Keep one primary button per view. Secondary actions sit beside it with less visual weight.',
    ],
    why: [
      { point: 'Bigger, closer targets are faster and easier to hit, especially for people with tremors or on touch screens.', source: SRC.fitts },
      { point: 'People read forms top to bottom down the left edge; buttons placed in that path are found sooner.', source: SRC.fPattern },
      { point: 'Clear, single primary actions reduce decision time.', source: SRC.hick },
    ],
    dontUse: ['When the action takes people to a new page or URL. Use a link.', 'For an on/off setting in a list of settings. Use a switch.'],
  },
  menu: {
    regions: ['Main content', 'Header'],
    where: [
      'Place the menu button next to the item it acts on, like the end of a table row or a card’s top right.',
      'Use it in the header for account actions (profile, sign out).',
      'Open the menu below the button, aligned to its edge, and flip it when there isn’t room.',
    ],
    why: [
      { point: 'Hiding actions behind a button makes them less discoverable. Use menus for secondary actions only.', source: SRC.dropdown },
      { point: 'Items near the thing they affect are understood as related to it.', source: SRC.proximity },
      { point: 'Short menus are faster to choose from. Keep it to about 7 items or group them.', source: SRC.hick },
    ],
    dontUse: ['For page navigation. Use site navigation with links.', 'For picking a form value. Use a select or radio group.', 'For the one main action on a page. Show it as a button.'],
  },
  link: {
    regions: ['Main content', 'Navigation', 'Footer'],
    where: [
      'Inline in body text, where the words explain the destination.',
      'Put the important words first in the link text so people scanning the start of lines see them.',
      'Group related links in a list, like “Related guides” at the end of an article.',
    ],
    why: [
      { point: 'People scan the first words of lines and links; front-loaded link text gets noticed.', source: SRC.fPattern },
      { point: 'Underlined blue-ish text is what people expect a link to look like.', source: SRC.jakob },
    ],
    dontUse: ['When it performs an action on the page, like Save. Use a button.'],
  },
  'site-navigation': {
    regions: ['Header', 'Navigation'],
    where: [
      'At the top of every page, in the same place and order, inside the header.',
      'On small screens, collapse it behind a clearly labelled Menu button.',
      'Mark the current section so people know where they are.',
    ],
    why: [
      { point: 'People expect main navigation at the top or left, because that’s where most sites put it.', source: SRC.jakob },
      { point: 'Keeping navigation in the same place on every page is required, and means people don’t relearn it.', source: SRC.wcagConsistentNav },
      { point: 'Hidden navigation is used less than visible navigation. Keep it visible on desktop.', source: SRC.hamburger },
    ],
    dontUse: ['For actions like Sign out or Delete. Use a menu or buttons.'],
  },
  breadcrumbs: {
    regions: ['Navigation', 'Main content'],
    where: [
      'First thing inside <main>, above the page heading, in their own <nav aria-label="Breadcrumb">. Use them on pages more than two levels deep.',
      'Start with Home and end with the current page.',
    ],
    why: [
      { point: 'Breadcrumbs show where people are in the hierarchy and let them move up in one click, with little space cost.', source: SRC.breadcrumbs },
      { point: 'Inside main, people who jump straight to the main content still hear where they are before the heading.', source: SRC.wcagBypass },
      { point: 'Keep them in the same place on every page, so people know where to look.', source: SRC.wcagConsistentNav },
    ],
    dontUse: ['On flat sites with only one or two levels.', 'As a history of pages visited. Use a back link.'],
  },
  pagination: {
    regions: ['Main content'],
    where: [
      'Below the list of results, centered or aligned with the list.',
      'Optionally repeat it above long lists, with the result count.',
    ],
    why: [
      { point: 'People reach the end of a list and look for what’s next there.', source: SRC.govPagination },
      { point: 'Previous and Next at the ends match where the eye is when a page runs out.', source: SRC.serial },
    ],
    dontUse: ['For short lists that fit on one page.', 'For step-by-step forms. Use Continue buttons.'],
  },
  'skip-link': {
    regions: ['Page top'],
    where: ['The very first focusable element on every page, before the header and logo.', 'Visible when it receives focus, in the top left.'],
    why: [
      { point: 'Keyboard users otherwise tab through the whole header on every page before reaching content.', source: SRC.wcagBypass },
      { point: 'Placed first, it’s the first thing people find when they press Tab.', source: SRC.govSkip },
    ],
    dontUse: ['As the only way to bypass blocks on pages without headings or landmarks; add both.'],
  },
  tabs: {
    regions: ['Main content'],
    where: ['Directly above the panels they control, under the section heading.', 'Tab labels in one row; if they wrap, you have too many.'],
    why: [
      { point: 'Tabs work when people need one view at a time and don’t need to compare panels side by side.', source: SRC.tabs },
      { point: 'Content inside tabs is easy to miss. Use them for content people choose between, not content everyone needs.', source: SRC.govTabs },
      { point: 'A shared container makes the tabs and panel read as one unit.', source: SRC.region },
    ],
    dontUse: ['For steps in a process. Use separate pages.', 'For navigation between pages. Use links.', 'When people need to compare content side by side.'],
  },
  accordion: {
    regions: ['Main content', 'Sidebar'],
    where: ['In the main flow, under a heading that introduces the set.', 'In a sidebar for filter groups.'],
    why: [
      { point: 'Accordions help when people need only a few sections of a long page; they hide content from people who need it all.', source: SRC.govAccordion },
      { point: 'Each header and its content sit in one region, so it’s clear what opens.', source: SRC.region },
    ],
    dontUse: ['When most people need most of the content. Show it with headings.', 'For a single item. Use a details element.'],
  },
  'text-input': {
    regions: ['Forms'],
    where: ['Label above the field, hint between label and field, error above the field.', 'Size the field to the expected answer length.'],
    why: [
      { point: 'Labels above fields are read in one downward scan and don’t get cut off when zoomed.', source: SRC.govTextInput },
      { point: 'Placeholder text as a label disappears when typing and strains memory.', source: SRC.placeholders },
      { point: 'Field width is a hint: a short field for a postcode tells people what to expect.', source: SRC.govTextInput },
    ],
    dontUse: ['For choosing from a small set of options. Use radios or a select.', 'For long answers. Use a textarea.'],
  },
  textarea: {
    regions: ['Forms'],
    where: ['Label above, with the length limit stated in the hint.', 'Make it tall enough for the expected answer.'],
    why: [
      { point: 'A box that fits the expected answer encourages the right amount of detail.', source: SRC.govTextarea },
      { point: 'Knowing the limit before typing avoids rework.', source: SRC.formErrors },
    ],
    dontUse: ['For short answers. Use a text input.'],
  },
  checkbox: {
    regions: ['Forms', 'Sidebar'],
    where: ['Stack options vertically, one per line, with the box on the left.', 'Group them under a legend that asks the question.'],
    why: [
      { point: 'Vertical lists are faster to scan than options laid out in a row.', source: SRC.govCheckboxes },
      { point: 'Checkboxes signal “pick any”; using them correctly sets the right expectation.', source: SRC.checkRadio },
      { point: 'The label right next to its box makes it clear which goes with which.', source: SRC.proximity },
    ],
    dontUse: ['When only one option can be chosen. Use radios.', 'For a setting that applies immediately. Use a switch.'],
  },
  'radio-group': {
    regions: ['Forms'],
    where: ['Stack options vertically under a legend.', 'Put the most likely answer first, but don’t preselect unless there’s a safe default.'],
    why: [
      { point: 'Radios show every option at once, so people compare without opening anything.', source: SRC.checkRadio },
      { point: 'Vertical radios are easier to scan and to tap.', source: SRC.govRadios },
      { point: 'Fewer options means faster decisions; past about 7, consider a select or combobox.', source: SRC.hick },
    ],
    dontUse: ['For more than about 7 options. Use a select or combobox.', 'For yes/no settings that apply immediately. Use a switch.'],
  },
  switch: {
    regions: ['Main content', 'Sidebar'],
    where: ['In settings lists, with the label on the left and the switch on the right edge of the row.', 'Never inside a form that needs a Save button.'],
    why: [
      { point: 'Switches imply an instant change, like a light switch. Inside a form with Save, people aren’t sure if it applied.', source: SRC.toggle },
      { point: 'A consistent right-hand column of switches is quick to scan.', source: SRC.jakob },
    ],
    dontUse: ['In forms that are submitted. Use a checkbox.', 'When the label doesn’t clearly describe the “on” state.'],
  },
  select: {
    regions: ['Forms'],
    where: ['Label above. Width matches the longest option.', 'Order options logically: alphabetically, by size or by frequency.'],
    why: [
      { point: 'Selects hide options; use them only when there are too many to show as radios.', source: SRC.govSelect },
      { point: 'Drop-downs add clicks and hide choices; use them sparingly.', source: SRC.dropdown },
    ],
    dontUse: ['For fewer than about 5 options. Use radios.', 'For very long lists people know how to type. Use a combobox.'],
  },
  combobox: {
    regions: ['Forms', 'Header'],
    where: ['In forms with long lists, like country or airport.', 'As site search in the header.'],
    why: [
      { point: 'Typing to filter is faster than scrolling a long list.', source: SRC.hick },
      { point: 'Search is expected at the top right or center of the header.', source: SRC.jakob },
      { point: 'Results that update within about 400ms feel instant and keep people engaged.', source: SRC.doherty },
    ],
    dontUse: ['For short lists. Use radios or a select.'],
  },
  slider: {
    regions: ['Forms', 'Sidebar'],
    where: ['In filters or settings where a rough value is fine, with the current value shown as text.', 'Pair it with a text input when exact values matter.'],
    why: [
      { point: 'Sliders need precise dragging; offering buttons or typing is required and helps everyone.', source: SRC.wcagDragging },
      { point: 'Small thumbs are hard to grab, so keep the target at least 24×24px.', source: SRC.wcagTarget },
    ],
    dontUse: ['When people need an exact number. Use a text input.'],
  },
  'date-picker': {
    regions: ['Forms'],
    where: ['Label above, with the expected format in the hint.', 'The calendar button sits right after the text field.'],
    why: [
      { point: 'For known dates like a birthday, typing is faster than a calendar.', source: SRC.govDate },
      { point: 'Showing the format before people type prevents errors.', source: SRC.formErrors },
    ],
    dontUse: ['For dates people know well. Use separate day, month and year fields.'],
  },
  'file-upload': {
    regions: ['Forms'],
    where: ['Label above, with allowed types and sizes in the hint.', 'Show the list of chosen files directly below.'],
    why: [
      { point: 'Telling people the limits up front avoids failed uploads.', source: SRC.govFileUpload },
      { point: 'Drag and drop isn’t possible for everyone; a Choose files button must always be there.', source: SRC.wcagDragging },
    ],
    dontUse: ['When you can get the information another way, like a text field.'],
  },
  'error-summary': {
    regions: ['Forms', 'Main content'],
    where: ['At the top of the main content, above the h1 or right below it, after a failed submit.', 'Each error links to its field.'],
    why: [
      { point: 'A summary at the top tells people something went wrong before they scroll, and gives a list to work through.', source: SRC.govErrorSummary },
      { point: 'Errors should be visible, specific and near the problem; the summary plus inline errors does both.', source: SRC.formErrors },
    ],
    dontUse: ['For single-field forms. An inline error is enough.', 'Before people have submitted.'],
  },
  dialog: {
    regions: ['Overlays'],
    where: ['Centered over a dimmed page.', 'Actions at the bottom, in the same order in every dialog on your site.'],
    why: [
      { point: 'Modal dialogs interrupt; use them only for decisions people must make before continuing.', source: SRC.modal },
      { point: 'A consistent button order means people don’t have to read every dialog carefully to find the right action.', source: SRC.jakob },
    ],
    dontUse: ['For information people could read in the page.', 'For long forms. Use a page.', 'For confirmations. Use a toast.'],
  },
  popover: {
    regions: ['Overlays', 'Main content'],
    where: ['Next to the button that opens it, usually below.', 'Flip to stay on screen at narrow widths and high zoom.'],
    why: [
      { point: 'Content appearing next to its trigger is understood as related to it.', source: SRC.proximity },
      { point: 'Non-modal layers keep people in their task, unlike modal dialogs.', source: SRC.modal },
      { point: 'It must not cover what people are focused on.', source: SRC.wcagFocusObscured },
    ],
    dontUse: ['For essential information. Put it in the page.', 'For a decision that blocks progress. Use a dialog.'],
  },
  drawer: {
    regions: ['Overlays', 'Sidebar'],
    where: ['Slide in from the right for details and filters, from the left for navigation.', 'Full width on small screens.'],
    why: [
      { point: 'Left-side navigation drawers match common mobile patterns people already know.', source: SRC.jakob },
      { point: 'A non-modal panel lets people use filters and see results together.', source: SRC.modal },
      { point: 'At 320px wide the drawer must fit without sideways scrolling.', source: SRC.wcagReflow },
    ],
    dontUse: ['For a short decision. Use a dialog.', 'For small content tied to one button. Use a popover.'],
  },
  tooltip: {
    regions: ['Overlays'],
    where: ['Above or beside the control, never covering it.', 'Only on controls that have their own name, like icon buttons.'],
    why: [
      { point: 'Tooltips are for brief, supplementary text; essential information belongs in the page.', source: SRC.tooltip },
      { point: 'Hover content must be dismissible, hoverable and stay visible.', source: SRC.wcagHoverFocus },
    ],
    dontUse: ['For essential instructions or errors.', 'On touch-first interfaces where there’s no hover. Use a toggletip.'],
  },
  toast: {
    regions: ['Overlays'],
    where: ['A consistent corner, usually bottom left or bottom center, clear of main actions.', 'Stack new toasts, don’t replace them.'],
    why: [
      { point: 'Passive confirmations shouldn’t interrupt; toasts suit low-importance messages.', source: SRC.indicators },
      { point: 'Status messages must be announced without moving focus.', source: SRC.wcagStatus },
      { point: 'Toasts must not cover the element people are focused on.', source: SRC.wcagFocusObscured },
    ],
    dontUse: ['For errors that need action. Use an alert or inline error.', 'For anything people must read to continue.'],
  },
  alert: {
    regions: ['Main content'],
    where: ['At the top of the main content, below the h1, or at the top of the section it relates to.', 'Inline next to the thing it’s about.'],
    why: [
      { point: 'Important messages at the top of the content are seen before people start the task.', source: SRC.govBanner },
      { point: 'Messages styled like ads get ignored; keep alerts plain and inside the content.', source: SRC.banner },
    ],
    dontUse: ['For brief confirmations. Use a toast.', 'For form errors. Use an error summary and inline errors.'],
  },
  progress: {
    regions: ['Main content', 'Forms'],
    where: ['Where the result will appear, or next to the button that started it.', 'Show a percentage for tasks over about 10 seconds.'],
    why: [
      { point: 'Any wait over a second needs a sign that something is happening; long waits need progress.', source: SRC.progress },
      { point: 'Responses under about 400ms feel instant; past that, show feedback.', source: SRC.doherty },
    ],
    dontUse: ['For loads under a second; the flash is distracting.'],
  },
  skeleton: {
    regions: ['Main content'],
    where: ['In the exact space the content will fill, with the same shape.'],
    why: [
      { point: 'Skeletons suit loads under about 10 seconds: they show what’s coming and stop the layout jumping.', source: SRC.skeleton },
      { point: 'A text status is still needed, because skeletons are visual only.', source: SRC.wcagStatus },
    ],
    dontUse: ['For loads under a second.', 'For long tasks. Use a progress bar.'],
  },
  badge: {
    regions: ['Main content', 'Header', 'Navigation'],
    where: ['Right after the item it describes: in a table cell, after a title or on the corner of an icon button.'],
    why: [
      { point: 'A badge right next to its item is read as describing it.', source: SRC.proximity },
      { point: 'Status shown only by color fails people with color vision deficiencies; use words.', source: SRC.indicators },
    ],
    dontUse: ['For messages that need attention now. Use an alert.', 'As a button. If it’s clickable, make it a real button.'],
  },
  image: {
    regions: ['Main content'],
    where: ['Next to the text it supports, with a caption if it needs one.', 'Charts sit right after the paragraph that introduces them.'],
    why: [
      { point: 'People ignore images that look decorative or ad-like; meaningful images placed near related text get attention.', source: SRC.banner },
      { point: 'An image and its caption in one region read as one unit.', source: SRC.region },
    ],
    dontUse: ['For text. Use real text.', 'For data people need exact values from. Add a table.'],
  },
  avatar: {
    regions: ['Header', 'Main content'],
    where: ['Top right of the header for the signed-in account.', 'Left of the person’s name in lists, comments and assignments.'],
    why: [
      { point: 'People expect their account in the top right of the header.', source: SRC.jakob },
      { point: 'A face beside a name helps recognition, as long as the name is there too.', source: SRC.proximity },
    ],
    dontUse: ['As the only way to identify a person. Show the name.'],
  },
  carousel: {
    regions: ['Main content'],
    where: ['Below the main heading and key content, never as the only place for important information.', 'Controls visible above or beside the slides.'],
    why: [
      { point: 'Auto-rotating carousels are often ignored and frustrate people who are still reading.', source: SRC.autoForward },
      { point: 'Moving content must have a way to pause or stop it.', source: SRC.wcagPause },
      { point: 'Later slides get little attention; put the key message first.', source: SRC.serial },
    ],
    dontUse: ['For essential content. Use a list or grid.', 'For more than about 5 slides.'],
  },
  'empty-state': {
    regions: ['Main content'],
    where: ['In the space where the content would be, under the section heading.', 'For no results, right below the search field or filters.'],
    why: [
      { point: 'Empty states are a chance to teach and give a clear next step, instead of a blank screen.', source: SRC.empty },
      { point: 'No-results messages must be announced without moving focus.', source: SRC.wcagStatus },
    ],
    dontUse: ['When something failed to load. Use an alert with a retry.'],
  },
  'data-grid': {
    regions: ['Main content'],
    where: ['In the main content, with a heading and the keyboard hint above it.', 'Bulk actions in a toolbar directly above the grid.'],
    why: [
      { point: 'One tab stop keeps the rest of the page quick to reach; arrow keys match spreadsheet habits.', source: SRC.jakob },
      { point: 'Actions next to the data they change are understood as related.', source: SRC.proximity },
      { point: 'Wide grids scroll inside their own box, not the page, at 320px.', source: SRC.wcagReflow },
    ],
    dontUse: ['For data people only read. Use a table.', 'For layout.'],
  },
  'tree-view': {
    regions: ['Sidebar', 'Main content'],
    where: ['In a sidebar beside the content it controls, like a folder tree beside a file list.', 'In a dialog for picking a location.'],
    why: [
      { point: 'People know folder trees from their computer’s file manager.', source: SRC.jakob },
      { point: 'Deep trees are slow to scan; keep levels and items per level small.', source: SRC.hick },
    ],
    dontUse: ['For site navigation. Use nested lists of links.', 'For one level of sections. Use an accordion.'],
  },
  listbox: {
    regions: ['Forms', 'Sidebar'],
    where: ['In a form, label above. Or in a filters sidebar.', 'The selected count right below the list.'],
    why: [
      { point: 'Checkboxes signal “pick any” and need no explanation.', source: SRC.checkRadio },
      { point: 'Status messages like “3 selected” are announced without moving focus.', source: SRC.wcagStatus },
    ],
    dontUse: ['For one choice. Use radios or a select.', 'For long lists people can type. Use a combobox.'],
  },
  card: {
    regions: ['Main content'],
    where: ['In a grid in the main content, under a heading that introduces the set.', 'Same height and structure for every card in a row.'],
    why: [
      { point: 'A shared border or background makes each card read as one unit.', source: SRC.region },
      { point: 'People scan the first words of headings; front-load the card title.', source: SRC.fPattern },
    ],
    dontUse: ['For items people need to compare. Use a table.', 'For text-only lists. Use a list of links.'],
  },
  stepper: {
    regions: ['Main content', 'Forms'],
    where: ['At the top of main, above the step heading.', 'Back and Continue at the bottom of each step.'],
    why: [
      { point: 'Seeing progress toward the end motivates people to finish.', source: ux('Goal-gradient effect', 'goal-gradient-effect') },
      { point: 'Knowing how many steps remain reduces drop-off on long forms.', source: SRC.progress },
    ],
    dontUse: ['For 2 steps.', 'For journeys people complete in any order. Use a task list.'],
  },
  tags: {
    regions: ['Forms', 'Sidebar', 'Main content'],
    where: ['Directly below the input that adds them.', 'Above results, for applied filters, with a Clear all button.'],
    why: [
      { point: 'Tags next to the field that made them are understood as its values.', source: SRC.proximity },
      { point: 'Adding and removing must be announced without moving focus away.', source: SRC.wcagStatus },
    ],
    dontUse: ['For read-only labels. Use a badge.', 'For a short fixed set of options. Use checkboxes.'],
  },
  toolbar: {
    regions: ['Main content'],
    where: ['Directly above the content it acts on, like an editor or a table.', 'Most used buttons first, grouped with separators.'],
    why: [
      { point: 'Controls right above their content are understood as acting on it.', source: SRC.proximity },
      { point: 'Formatting toolbars match what people know from word processors.', source: SRC.jakob },
      { point: 'Fewer, grouped buttons are faster to choose from.', source: SRC.hick },
    ],
    dontUse: ['For one or two actions. Show buttons.', 'For rarely used actions. Use a menu.'],
  },
  table: {
    regions: ['Main content'],
    where: ['In the main content, with a caption or heading above.', 'Right-align numbers so they line up for comparison.'],
    why: [
      { point: 'Tables are for data people compare across rows and columns.', source: SRC.govTable },
      { point: 'At 320px wide, the table scrolls in its own box, not the whole page.', source: SRC.wcagReflow },
    ],
    dontUse: ['For layout.', 'For a single list of items. Use a list.'],
  },
};
