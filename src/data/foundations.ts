import { LOCALIZATION_RULES } from '../lib/translation';
import { ContrastChecker } from '../tools/ContrastChecker';
import { MotionDemo } from '../tools/MotionDemo';
import { PageLayoutMap } from '../tools/PageLayoutMap';
import type { FoundationSpec } from './types';
import { WCAG } from './wcag';

export const foundations: FoundationSpec[] = [
  {
    slug: 'keyboard',
    name: 'Keyboard navigation',
    summary:
      'Everything you can do with a mouse must also work with a keyboard alone. Many people rely on keyboards, switch devices, voice control or screen readers, and all of these work through keyboard events.',
    wcag: [WCAG.keyboard, WCAG.noTrap, WCAG.focusOrder, WCAG.bypass, WCAG.onFocus],
    sections: [
      {
        heading: 'The basic keys',
        body: ['Users expect the same keys to do the same things everywhere. Stick to these conventions before inventing shortcuts.'],
        bullets: [
          'Tab and Shift+Tab move between interactive elements.',
          'Enter activates links and buttons. Space activates buttons and toggles checkboxes.',
          'Arrow keys move within a composite widget: radio group, tabs, menu, listbox.',
          'Escape closes the topmost popup, menu or dialog.',
          'Home and End jump to the first or last item in a list.',
        ],
      },
      {
        heading: 'One tab stop per widget',
        body: [
          'Composite widgets like tabs, menus and radio groups count as one stop in the tab order. Inside the widget, arrow keys move between items. This is called roving tabindex: the current item has tabindex="0" and the rest have tabindex="-1".',
          'This keeps the tab sequence short. A toolbar with 12 buttons shouldn’t take 12 presses to get past.',
        ],
      },
      {
        heading: 'Logical order',
        body: [
          'The tab order should follow the visual reading order. The easiest way to get this right is to keep the DOM in the same order as the layout, and avoid positive tabindex values.',
        ],
        bullets: [
          'Never use tabindex values greater than 0.',
          'Use tabindex="0" only on custom widgets that need to be focusable.',
          'Use tabindex="-1" to make an element focusable from script (like a heading after route change) without adding it to the tab order.',
        ],
      },
      {
        heading: 'Skip links',
        body: [
          'A “Skip to main content” link as the first focusable element lets keyboard users bypass repeated navigation. It can be visually hidden until it receives focus. This site has one: press Tab right after the page loads to see it.',
        ],
      },
    ],
  },
  {
    slug: 'focus',
    name: 'Focus management',
    summary:
      'Focus is the keyboard user’s cursor. It has to be visible at all times, and it has to land somewhere sensible when content appears, disappears or changes.',
    wcag: [WCAG.focusVisible, WCAG.focusOrder, WCAG.focusNotObscured, WCAG.nonTextContrast, WCAG.pageTitled],
    sections: [
      {
        heading: 'Visible focus indicators',
        body: [
          'Every focusable element needs a clearly visible focus style. A good default is a 2px outline in a color with at least 3:1 contrast against the surrounding background, offset slightly from the element.',
          'Use :focus-visible to show the ring for keyboard users without showing it on every mouse click.',
        ],
        bullets: ['Never remove outlines with outline: none unless you replace them with something equally visible.', 'Make sure sticky headers and footers never cover the focused element.'],
      },
      {
        heading: 'Moving focus on purpose',
        body: ['Move focus only when the user’s context changes. Some common cases:'],
        bullets: [
          'Opening a dialog: move focus into it. Closing it: return focus to the trigger.',
          'Deleting an item from a list: move focus to the next item, or to the list heading.',
          'Navigating in a single-page app: move focus to the new page’s main heading and update document.title. This site does both.',
          'Submitting a form with errors: move focus to the error summary or the first invalid field.',
        ],
      },
      {
        heading: 'Don’t steal focus',
        body: [
          'Never move focus without user action, like when a toast appears, data refreshes or a carousel advances. Users lose their place and screen readers start announcing something unexpected.',
        ],
      },
    ],
  },
  {
    slug: 'color',
    name: 'Color & contrast',
    summary:
      'Text and interface elements need enough contrast to be readable, and color should never be the only way information is shown.',
    wcag: [WCAG.contrast, WCAG.nonTextContrast, WCAG.useOfColor, WCAG.sensory],
    Tool: ContrastChecker,
    sections: [
      {
        heading: 'Minimum ratios',
        body: ['WCAG measures contrast as a ratio from 1:1 (no contrast) to 21:1 (black on white).'],
        bullets: [
          'Normal text: at least 4.5:1.',
          'Large text (24px regular, or 18.66px bold and up): at least 3:1.',
          'Icons, input borders, focus rings and chart elements: at least 3:1 against what’s next to them.',
          'Disabled controls and pure decoration are exempt, but should still be legible.',
        ],
      },
      {
        heading: 'Don’t rely on color alone',
        body: [
          'About 1 in 12 men and 1 in 200 women have some form of color vision deficiency. Pair color with a second cue: an icon, a text label, an underline, a pattern or a change in shape.',
          'Every live example on this site has a vision simulation menu. Use it to check your own components.',
        ],
      },
    ],
  },
  {
    slug: 'semantics',
    name: 'Semantics & ARIA',
    summary:
      'Assistive technology understands a page through its semantics: the roles, names, states and relationships exposed in the accessibility tree. Native HTML gives you most of these for free.',
    wcag: [WCAG.infoRel, WCAG.nameRoleValue, WCAG.headings, WCAG.language, WCAG.labelInName],
    sections: [
      {
        heading: 'Use native HTML first',
        body: [
          'A <button> is focusable, responds to Enter and Space, and is announced as a button. A <div onClick> does none of that. Reach for native elements first: <button>, <a href>, <input>, <select>, <dialog>, <details>, <table>, <nav>, <main>, <h1>–<h6>.',
        ],
      },
      {
        heading: 'Roles, names, states',
        body: ['Every interactive element must expose three things:'],
        bullets: [
          'Role: what it is (button, checkbox, tab).',
          'Name: what it’s called, usually from its text, a <label> or aria-label.',
          'State and value: whether it’s checked, expanded, selected or disabled, and its current value.',
        ],
      },
      {
        heading: 'Rules for ARIA',
        body: ['ARIA changes what assistive tech is told. It doesn’t change behavior. Follow these rules:'],
        bullets: [
          'If a native element does the job, don’t use ARIA.',
          'Don’t change native semantics unless you must (no role="button" on a heading).',
          'Every interactive ARIA role must be keyboard operable.',
          'Never put aria-hidden="true" or role="presentation" on a focusable element.',
          'Every interactive element needs an accessible name.',
        ],
      },
      {
        heading: 'Landmarks and headings',
        body: [
          'Landmarks (<header>, <nav>, <main>, <footer>, <aside>) and a logical heading outline let screen reader users jump straight to what they need. Use one <h1> per page and don’t skip levels.',
        ],
      },
      {
        heading: 'Translation and language',
        body: [
          'On a translated page, screen reader users hear every string you give them, including ones nobody sees. If the visible copy is translated but an aria-label isn’t, they hear a mix of languages. Each component’s ARIA table has a Translate column, and its handoff worksheet marks which copy is screen reader only.',
        ],
        bullets: LOCALIZATION_RULES,
      },
    ],
  },
  {
    slug: 'motion',
    name: 'Motion & animation',
    summary:
      'Motion can help people understand changes, but it can also cause dizziness, nausea or distraction. Respect people’s motion settings and give them control.',
    wcag: [WCAG.pause, WCAG.flashes, WCAG.animation],
    Tool: MotionDemo,
    sections: [
      {
        heading: 'Respect prefers-reduced-motion',
        body: [
          'Operating systems let people ask for less motion. Read the prefers-reduced-motion media query and replace large movement, parallax and zooms with simple fades, or remove them.',
          'This site turns off its own transitions and animations when reduced motion is on. Check that your component library does the same.',
        ],
      },
      {
        heading: 'Let people pause',
        body: ['Anything that moves, blinks or scrolls automatically for more than 5 seconds needs a way to pause, stop or hide it.'],
      },
      {
        heading: 'No flashing',
        body: ['Nothing should flash more than three times per second. Flashing content can cause seizures.'],
      },
    ],
  },
  {
    slug: 'text',
    name: 'Text, zoom & reflow',
    summary:
      'People change text size, zoom, line spacing and window width. Layouts must adapt without cutting off content or forcing sideways scrolling.',
    wcag: [WCAG.resize, WCAG.reflow, WCAG.textSpacing, WCAG.targetSize],
    sections: [
      {
        heading: 'Zoom to 400%',
        body: [
          'At 400% zoom on a 1280px screen, the viewport is 320 CSS pixels wide. Content should reflow into a single column with no horizontal scrolling, except for things that need two dimensions, like data tables and maps.',
        ],
      },
      {
        heading: 'Use relative units',
        body: ['Size text in rem so it follows the user’s browser font setting. Avoid fixed heights on containers that hold text.'],
      },
      {
        heading: 'Text spacing',
        body: ['Content must still work when users override spacing to:'],
        bullets: ['Line height of 1.5 times the font size.', 'Paragraph spacing of 2 times the font size.', 'Letter spacing of 0.12 times the font size.', 'Word spacing of 0.16 times the font size.'],
      },
      {
        heading: 'Target size',
        body: ['Interactive targets should be at least 24×24 CSS pixels, or have enough spacing around them.'],
      },
    ],
  },
  {
    slug: 'layout',
    name: 'Page layout and placement',
    summary:
      'Where a component sits matters as much as how it’s built. People find things faster when they’re where other sites put them, next to what they affect, and in the same place on every page.',
    wcag: [WCAG.bypass, WCAG.sequence, WCAG.focusOrder, WCAG.reflow, WCAG.focusNotObscured, WCAG.infoRel],
    Tool: PageLayoutMap,
    sections: [
      {
        heading: 'Put things where people expect them',
        body: [
          'People spend most of their time on other sites, so they expect yours to work the same way (Jakob’s law). Logo top left, search and account top right, main navigation across the top or down the left, legal links in the footer.',
          'Breaking these conventions costs time for everyone. It costs the most for screen magnifier users, who see a small part of the page at once and rely on knowing where to look.',
        ],
      },
      {
        heading: 'Keep the same things in the same place',
        body: ['Navigation, search and help must appear in the same relative order on every page (WCAG 3.2.3 and 3.2.6). People with memory or cognitive disabilities depend on this most.'],
      },
      {
        heading: 'Place controls next to what they affect',
        body: [
          'Items close together are seen as related (the law of proximity). A row action belongs at the end of its row, a field’s error belongs right by the field, a filter panel belongs beside the results it filters.',
          'Distance also costs effort: a control far from where people are looking takes longer to reach (Fitts’s law), and screen magnifier users may not see it at all.',
        ],
      },
      {
        heading: 'Make the reading order match the visual order',
        body: [
          'Screen readers and keyboards follow the order of the HTML, not the visual layout. If CSS moves something visually, such as a sidebar shown before the main content, the two orders disagree and people get lost.',
          'Use the Show focus order button on any component example to check the order.',
        ],
        bullets: [
          'One <header>, one <nav> per navigation area (each labelled), one <main>, one <footer>.',
          'The skip link comes first, then the header, then navigation, then main content.',
          'Overlays are placed in the HTML right after the control that opens them, or focus is moved into them.',
        ],
      },
      {
        heading: 'Put the important things first',
        body: [
          'On text-heavy pages people scan in an F shape: across the top, then down the left edge. Key actions, headings and the first words of links get the most attention.',
          'People also remember the first and last items in a list best (the serial position effect), so put the most important navigation items at the ends.',
        ],
      },
      {
        heading: 'Plan for small screens and zoom',
        body: [
          'At 320px wide, or 400% zoom on a laptop, a three-column layout becomes one column. Decide the stacking order: usually main content before the sidebar, and filters behind a button.',
          'Sticky headers and cookie banners must not cover the focused element (WCAG 2.4.11).',
        ],
      },
    ],
  },
];

export function findFoundation(slug: string) {
  return foundations.find((f) => f.slug === slug);
}
