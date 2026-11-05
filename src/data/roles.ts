import type { WcagRef } from './types';
import { WCAG } from './wcag';

export type RoleId = 'content' | 'design' | 'frontend' | 'qa';

export interface RoleGuide {
  id: RoleId;
  name: string;
  short: string;
  summary: string;
  owns: string[];
  checklist: string[];
  handoff: string[];
  wcag: WcagRef[];
}

export const roles: RoleGuide[] = [
  {
    id: 'content',
    name: 'Content',
    short: 'Content design',
    summary:
      'Words are the interface for screen reader and voice control users. Content owns every label, instruction, error message, alt text and link that people hear or read.',
    owns: [
      'Labels for buttons, links, form fields and icon-only controls',
      'Hint text, error messages and confirmation messages',
      'Alt text and long descriptions for images and charts',
      'Page titles, headings and the order of headings',
      'Plain language and reading level',
    ],
    checklist: [
      'Every page has a unique title that starts with the most specific part.',
      'Headings describe the content below them and follow a logical outline.',
      'Link text makes sense on its own, without “click here” or “read more”.',
      'Button labels start with a verb and say what will happen.',
      'Every form field has a visible label, and hints explain the expected format.',
      'Error messages say what went wrong and how to fix it.',
      'Informative images have alt text; decorative images are marked as decorative.',
      'Instructions don’t rely on shape, color, size or position alone (“the green button”).',
      'Status and confirmation messages are short and specific.',
    ],
    handoff: [
      'Write the accessible name for every icon-only button in the spec.',
      'Supply alt text for every image, or mark it decorative.',
      'List the error message for each validation rule.',
      'Give the heading level for each heading, not just its style.',
    ],
    wcag: [WCAG.nonText, WCAG.pageTitled, WCAG.linkPurpose, WCAG.headings, WCAG.labels, WCAG.errorSuggest, WCAG.sensory, WCAG.labelInName],
  },
  {
    id: 'design',
    name: 'Design',
    short: 'Visual and interaction design',
    summary:
      'Design decides whether people can see, understand and reach every part of the interface. That covers contrast, focus, target size, layout at zoom, and states that don’t depend on color.',
    owns: [
      'Color contrast for text, icons, borders and focus rings',
      'Focus indicators for every interactive element',
      'Target sizes and spacing',
      'States (hover, focus, selected, error, disabled) that don’t rely on color alone',
      'Layout at 320px wide and at 200% text size',
      'Motion and its reduced-motion alternative',
    ],
    checklist: [
      'Body text has at least 4.5:1 contrast; large text at least 3:1.',
      'Icons, input borders and focus rings have at least 3:1 contrast.',
      'Every interactive element has a designed focus state.',
      'Selected, error and required states use an icon, text or shape as well as color.',
      'Targets are at least 24×24 CSS pixels, and 44×44 on touch-first screens.',
      'Layouts are specified at 320px wide with no sideways scrolling.',
      'Text can grow to 200% without being cut off or overlapping.',
      'Animations have a reduced-motion version and nothing flashes.',
      'The visual reading order matches the intended tab order.',
    ],
    handoff: [
      'Annotate the tab order on complex screens.',
      'Include focus, hover, error and disabled states in every component spec.',
      'Mark which elements are headings and landmarks.',
      'Note any element that should be hidden from screen readers, and why.',
    ],
    wcag: [WCAG.contrast, WCAG.nonTextContrast, WCAG.useOfColor, WCAG.focusVisible, WCAG.targetSize, WCAG.reflow, WCAG.resize, WCAG.animation],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    short: 'Frontend engineering',
    summary:
      'Frontend turns the design and content into what assistive technology actually receives: semantic HTML, ARIA, keyboard behavior, focus management and live announcements.',
    owns: [
      'Semantic HTML and landmarks',
      'Accessible names, roles, states and properties',
      'Keyboard support for every interaction',
      'Focus management when content opens, closes or changes',
      'Live region announcements',
      'Automated and manual accessibility testing',
    ],
    checklist: [
      'Native elements are used before ARIA (button, a, input, select, dialog).',
      'Every interactive element has an accessible name that includes its visible label.',
      'Everything works with the keyboard alone, and nothing traps focus.',
      'Focus moves into dialogs and back to the trigger when they close.',
      'Route changes move focus to the new page heading and update the title.',
      'Status messages use role="status" or role="alert" and are announced.',
      'Form errors are linked with aria-describedby and marked with aria-invalid.',
      'The page passes an automated scan (axe or similar) with no violations.',
      'Key flows are tested with at least one screen reader.',
    ],
    handoff: [
      'Flag designs that need custom widgets where a native element would do.',
      'Ask content for missing names, alt text and error messages before building.',
      'Share automated scan results with the pull request.',
      'Record which screen reader and browser pairs were tested.',
    ],
    wcag: [WCAG.infoRel, WCAG.keyboard, WCAG.noTrap, WCAG.focusOrder, WCAG.nameRoleValue, WCAG.statusMessages, WCAG.bypass, WCAG.onFocus],
  },
  {
    id: 'qa',
    name: 'QA',
    short: 'Quality assurance and testing',
    summary:
      'QA confirms that what shipped actually works for people using a keyboard, a screen reader, zoom or voice control. Automated scans catch about a third of issues; the rest need a person.',
    owns: [
      'Keyboard-only testing of every flow',
      'Screen reader testing on the supported browser pairs',
      'Zoom, reflow and text-spacing checks',
      'Automated scans as part of regression testing',
      'Writing clear accessibility bug reports',
      'Confirming fixes against the original WCAG criterion',
    ],
    checklist: [
      'Every flow can be completed with the keyboard alone, with focus always visible.',
      'Tab order follows the visual reading order.',
      'Each control announces a sensible name, role and state in a screen reader.',
      'Dialogs, menus and popovers return focus to where you were when they close.',
      'Errors, status messages and loading states are announced.',
      'The page works at 200% zoom and at 320px wide without sideways scrolling.',
      'Nothing is lost when text spacing is increased (line height 1.5, letter spacing 0.12em).',
      'An automated scan (axe or similar) reports no violations.',
      'Content matches the handoff: labels, alt text and error messages are what content specified.',
    ],
    handoff: [
      'Log each bug with the WCAG criterion, steps to reproduce, expected and actual result.',
      'Record the browser, screen reader and versions used.',
      'Attach a short recording for keyboard and focus bugs.',
      'Mark severity by impact: blocks a task, slows it down, or is cosmetic.',
    ],
    wcag: [WCAG.keyboard, WCAG.noTrap, WCAG.focusOrder, WCAG.focusVisible, WCAG.nameRoleValue, WCAG.statusMessages, WCAG.reflow, WCAG.textSpacing],
  },
];

export function findRole(id: string) {
  return roles.find((r) => r.id === id);
}

/** What each role is responsible for, per component. */
export const componentRoles: Record<string, Record<RoleId, string[]>> = {
  button: {
    content: ['Write verb-first labels. Name every icon-only button.'],
    design: ['Design focus, hover, pressed and disabled states. Keep targets at least 24×24px.'],
    frontend: ['Use <button>. Use aria-pressed for toggles and aria-disabled to keep unavailable buttons discoverable.'],
    qa: ['Activate with Enter and Space. Check icon-only buttons announce a name and toggles announce pressed.'],
  },
  menu: {
    content: ['Keep item labels short and distinct, starting with a verb.'],
    design: ['Show the highlighted item with more than color. Mark destructive items with text, not red alone.'],
    frontend: ['Use a menu button pattern with roving focus, typeahead and Escape. Don’t use it for site navigation.'],
    qa: ['Open with Enter, Space and Down Arrow. Check arrow keys, typeahead and Escape, and that focus returns to the button.'],
  },
  link: {
    content: ['Write link text that makes sense out of context. Say when a link opens a new tab or downloads a file.'],
    design: ['Underline links in body text, or give them 3:1 contrast with surrounding text plus a non-color cue.'],
    frontend: ['Always include href. Use buttons for actions.'],
    qa: ['Check every link announces a meaningful name and new-tab links say so.'],
  },
  'site-navigation': {
    content: ['Keep top-level labels short and consistent across pages.'],
    design: ['Show the current section with more than color. Open dropdowns on click, not hover alone.'],
    frontend: ['Use the disclosure pattern with aria-expanded. Close on Escape and when focus leaves.'],
    qa: ['Open sections with Enter. Check expanded state is announced and Escape closes them.'],
  },
  breadcrumbs: {
    content: ['Match each crumb to its page title.'],
    design: ['Use decorative separators and let the trail wrap on small screens.'],
    frontend: ['Use <nav aria-label="Breadcrumb"> with an <ol> and aria-current="page".'],
    qa: ['Check the trail is announced as a navigation list and the last crumb as the current page.'],
  },
  pagination: {
    content: ['Show the current range, like “Showing 21–30 of 80”.'],
    design: ['Mark the current page with a fill or border, not color alone. Keep links at least 40px.'],
    frontend: ['Label the nav, add hidden “Page” text, set aria-current and move focus to the results after paging.'],
    qa: ['Check the current page is announced and focus moves to the results after paging.'],
  },
  'skip-link': {
    content: ['Use the standard wording “Skip to main content”.'],
    design: ['Design a clearly visible focused state that isn’t hidden by a sticky header.'],
    frontend: ['Make it the first focusable element and point it at a focusable <main>.'],
    qa: ['Press Tab once on page load. The link appears and moves focus to the main content.'],
  },
  tabs: {
    content: ['Keep tab labels short and distinct.'],
    design: ['Show the selected tab with a shape or surface change, not only color.'],
    frontend: ['Use tablist/tab/tabpanel with roving tabindex and arrow keys.'],
    qa: ['Check arrow keys move between tabs, Tab moves into the panel, and the selected state is announced.'],
  },
  accordion: {
    content: ['Write headers that describe the hidden content.'],
    design: ['Make the whole header row clickable and show the expanded state with an icon.'],
    frontend: ['Wrap each button in a heading and set aria-expanded and aria-controls.'],
    qa: ['Check headers are reachable by heading navigation and announce expanded or collapsed.'],
  },
  'text-input': {
    content: ['Write a visible label, a format hint and fix-it error messages.'],
    design: ['Keep the label visible above the field. Give the border 3:1 contrast. Show errors with an icon and text.'],
    frontend: ['Link the label with for/id, and the hint and error with aria-describedby. Set aria-invalid and autocomplete.'],
    qa: ['Submit with errors. Check the error is announced with the field and the label is read on focus.'],
  },
  textarea: {
    content: ['State the length limit up front.'],
    design: ['Allow vertical resizing and keep the counter close to the field.'],
    frontend: ['Debounce the remaining-count announcement in a separate polite live region.'],
    qa: ['Type past the limit. Check the remaining count is announced without interrupting every keystroke.'],
  },
  checkbox: {
    content: ['Phrase options positively and give the group a clear question as its legend.'],
    design: ['Make the label clickable and the box border at least 3:1.'],
    frontend: ['Use native inputs inside a fieldset with a legend. Set indeterminate from script.'],
    qa: ['Toggle with Space. Check the group question is read before each option.'],
  },
  'radio-group': {
    content: ['Write the question as the legend and keep options mutually exclusive.'],
    design: ['Show the selected option with a filled radio and a shape change.'],
    frontend: ['Use native radios with a shared name inside a fieldset.'],
    qa: ['Check arrow keys move and select, and Tab leaves the group in one step.'],
  },
  switch: {
    content: ['Keep the label constant. The state is announced separately.'],
    design: ['Make on and off distinct without color. Give the off-state track 3:1 contrast.'],
    frontend: ['Use role="switch" with aria-checked, or a native checkbox with role="switch".'],
    qa: ['Toggle with Space. Check on and off are announced and the label doesn’t change.'],
  },
  select: {
    content: ['Order options logically and use a clear label.'],
    design: ['Show the highlighted option with more than color.'],
    frontend: ['Prefer native <select>. A custom listbox needs aria-activedescendant and typeahead.'],
    qa: ['Check the value is announced and options can be chosen with the keyboard and typeahead.'],
  },
  combobox: {
    content: ['Write a helpful “No results” message.'],
    design: ['Show the active option clearly while focus stays in the input.'],
    frontend: ['Keep DOM focus in the input, use aria-activedescendant and announce the result count.'],
    qa: ['Type to filter. Check the result count is announced and arrow keys move the active option.'],
  },
  slider: {
    content: ['Give the value units and words, like “21 degrees Celsius, comfortable”.'],
    design: ['Show the current value as text and make the thumb at least 24px.'],
    frontend: ['Use a native range input and set aria-valuetext.'],
    qa: ['Check arrow keys, Home and End change the value and the spoken value includes units.'],
  },
  'date-picker': {
    content: ['State the expected format and any date limits.'],
    design: ['Never make the field read-only. Typing must always work.'],
    frontend: ['Prefer <input type="date">. A custom calendar is a dialog with a grid.'],
    qa: ['Type a date without the calendar. Check the format hint is read and errors are announced.'],
  },
  'file-upload': {
    content: ['List allowed types and sizes. Name the file in every error and Remove button.'],
    design: ['Treat drag and drop as a bonus, with a visible Choose files button.'],
    frontend: ['Keep the native input focusable. Announce added and removed files. Manage focus after removal.'],
    qa: ['Choose a file with the keyboard. Check adding and removing files is announced and focus is kept.'],
  },
  'error-summary': {
    content: ['Use the same wording in the summary and the inline error.'],
    design: ['Place the summary at the top of the form with a strong border.'],
    frontend: ['Focus the summary after a failed submit. Each link focuses its field.'],
    qa: ['Submit an invalid form. Check focus moves to the summary and each link goes to its field.'],
  },
  dialog: {
    content: ['Use a clear title and specific action labels, not “OK”.'],
    design: ['Always show a visible close option.'],
    frontend: ['Trap focus, close on Escape, return focus to the trigger and label the dialog.'],
    qa: ['Check focus moves in, stays in, Escape closes it and focus returns to the trigger.'],
  },
  popover: {
    content: ['Give the popover a short name and keep its text brief. Never hide essential instructions in it.'],
    design: ['Open on click, not hover. Include a visible Close button for popovers with controls.'],
    frontend: ['Set aria-expanded on the button, move focus in for interactive popovers, close on Escape and return focus.'],
    qa: ['Check Escape returns focus to the button, focus isn’t trapped, and toggletip text is announced.'],
  },
  drawer: {
    content: ['Write a clear drawer heading and a specific Close label, like “Close filters”.'],
    design: ['Show a Close button, design a reduced-motion version, and check it fits at 320px.'],
    frontend: ['Use <dialog> for modal drawers. Hide closed drawers with hidden, and return focus to the trigger.'],
    qa: ['Check a closed drawer can’t be tabbed into, and modal drawers contain focus while non-modal ones don’t.'],
  },
  badge: {
    content: ['Write one or two status words that make sense without color. Put counts into the button name, like “Notifications, 3 unread”.'],
    design: ['Pair each status color with an icon and keep badge text at 4.5:1 contrast.'],
    frontend: ['Hide the visual count with aria-hidden and put it in the control’s name instead.'],
    qa: ['Check statuses in grayscale, and that counts are read once as part of the button name.'],
  },
  avatar: {
    content: ['Use the person’s name as alt text when it isn’t shown nearby; otherwise the photo gets alt="".'],
    design: ['Plan a fallback for missing photos, and check initials have 4.5:1 contrast.'],
    frontend: ['Set alt="" when the name is beside the photo. Hide initials and “+2” counters with aria-hidden.'],
    qa: ['Read a list of people and check no name is read twice or missing.'],
  },
  skeleton: {
    content: ['Write the loading, loaded and error messages screen readers will hear.'],
    design: ['Match the real layout, design a failure state, and stop the pulse for reduced motion.'],
    frontend: ['Hide the shapes with aria-hidden, set aria-busy, and use a status region that exists before loading.'],
    qa: ['Check you hear a loading and a loaded message, and the gray shapes are never read.'],
  },
  'empty-state': {
    content: ['Write a plain heading, a short reason and one action. For no results, repeat the search term.'],
    design: ['Make the message clear without the illustration, with a single main action.'],
    frontend: ['Hide the illustration, use a real heading, and announce no-results with role="status".'],
    qa: ['Search for nothing and check the message is announced without focus moving.'],
  },
  carousel: {
    content: ['Name the carousel, write alt text for every slide image, and keep essential messages off later slides.'],
    design: ['Keep controls always visible. If it auto-rotates, put a Stop button first.'],
    frontend: ['Follow the carousel pattern: labelled slides, hidden inactive slides, aria-live off while rotating, pause on focus and hover.'],
    qa: ['Check rotation stops on focus and with reduced motion, and Next announces “2 of 3”.'],
  },
  'data-grid': {
    content: ['Write the grid name, short column headers and a one-line keyboard hint.'],
    design: ['Design an inset focus ring for cells and a sort arrow that doesn’t rely on color.'],
    frontend: ['Use role="grid" with roving tabindex. Only use a grid when people interact with cells; otherwise use a table.'],
    qa: ['Check the grid is one tab stop and every arrow, Home and End key works.'],
  },
  'tree-view': {
    content: ['Name the tree and keep item labels unique at each level.'],
    design: ['Make expanded, selected and focused states all look different without color.'],
    frontend: ['Follow the tree pattern: roving tabindex, aria-expanded on folders only, ← and → to collapse and expand.'],
    qa: ['Check level and position are announced, and files aren’t announced as collapsed.'],
  },
  listbox: {
    content: ['Write the list label, the options, and a keyboard hint for the listbox version.'],
    design: ['Show a check on selected options, and a separate outline for the current one.'],
    frontend: ['Prefer a checkbox list in forms. For a listbox, use aria-multiselectable, aria-selected and aria-activedescendant.'],
    qa: ['Check Space toggles, the outline follows the arrow keys, and “selected” is announced.'],
  },
  tooltip: {
    content: ['Keep tooltip text to one short sentence. Never put essential information only in a tooltip.'],
    design: ['Show it on hover and focus, and keep it open while the pointer is over it.'],
    frontend: ['Use role="tooltip" with aria-labelledby or aria-describedby. Close on Escape.'],
    qa: ['Check it shows on focus, hides on Escape and its text is announced with the trigger.'],
  },
  toast: {
    content: ['Write short, specific confirmations like “Changes saved”.'],
    design: ['Keep toasts on screen long enough to read twice. Don’t auto-dismiss errors.'],
    frontend: ['Render into a live region that already exists. Use polite for confirmations and assertive only for errors.'],
    qa: ['Check confirmations are announced politely, errors stay until dismissed, and focus isn’t stolen.'],
  },
  alert: {
    content: ['Say what happened and what to do next.'],
    design: ['Pair color with an icon and a text prefix like “Warning:”.'],
    frontend: ['Add role="alert" only to messages that appear after the page loads.'],
    qa: ['Check alerts that appear after load are announced once, and page-load alerts aren’t repeated.'],
  },
  progress: {
    content: ['Name what is loading and confirm when it’s done.'],
    design: ['Pair spinners with text. Slow or stop animation for reduced motion.'],
    frontend: ['Use role="progressbar" with values, and announce start and finish with role="status".'],
    qa: ['Check start and finish are announced and the progress value is reachable.'],
  },
  image: {
    content: ['Write alt text that matches the image’s purpose. Describe charts in text.'],
    design: ['Give meaningful icons 3:1 contrast and avoid images of text.'],
    frontend: ['Always set alt. Use aria-hidden on decorative SVGs and role="img" with a title on meaningful ones.'],
    qa: ['Check alt text matches the handoff and decorative images are skipped by the screen reader.'],
  },
  table: {
    content: ['Write a caption and clear column headers.'],
    design: ['Avoid merged cells and let wide tables scroll inside their container.'],
    frontend: ['Use <th scope>, a <caption> and aria-sort on sortable columns.'],
    qa: ['Check headers are read when moving between cells and sort order is announced.'],
  },
};
