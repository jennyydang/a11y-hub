import { Accordion } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  return (
    <div className="w-full max-w-lg">
      <Accordion
        defaultOpen={[0]}
        items={[
          { title: 'What is your return policy?', content: 'Return unused items within 30 days for a full refund.' },
          { title: 'Do you ship internationally?', content: 'Yes, to over 40 countries. Duties are calculated at checkout.' },
          { title: 'How do I track my order?', content: 'Use the tracking link in your confirmation email.' },
        ]}
      />
    </div>
  );
}

export const accordion: ComponentSpec = {
  slug: 'accordion',
  name: 'Accordion',
  category: 'Navigation',
  summary: 'A stack of headings that each show or hide a section of content.',
  semantics: '<h3><button aria-expanded></button></h3> + region',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',
  whenToUse: [
    'Use accordions to shorten long pages where people only need some sections, like FAQs.',
    'Avoid them for content everyone needs to read. Hiding it adds work.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves between accordion headers and any focusable content in open panels.' },
    { keys: ['Enter', 'Space'], action: 'Expands or collapses the focused section.' },
    { keys: ['ArrowDown', 'ArrowUp'], action: 'Optional: moves between headers.' },
  ],
  aria: [
    { attr: '<h2>–<h6>', where: 'wrapper of each button', usage: 'Lets screen reader users jump between sections by heading. Pick the level that fits the page outline.' },
    { attr: 'aria-expanded', where: 'header button', usage: 'true when the section is open.' },
    { attr: 'aria-controls', where: 'header button', usage: 'Points to the panel it toggles.' },
    { attr: 'aria-hidden="true"', where: 'chevron icon', usage: 'The icon is decorative because aria-expanded already gives the state.' },
  ],
  focus: ['Focus stays on the header after toggling.', 'The whole header row is the hit target, not just the chevron.'],
  screenReader: ['Announced as: “What is your return policy?, button, expanded, heading level 3”.'],
  dos: ['Write headers that say what’s inside.', 'Allow several sections open at once unless there’s a strong reason not to.'],
  donts: ['Don’t put the toggle on the chevron only.', 'Don’t use aria-live on the header. It makes screen readers repeat the label every time it changes.'],
  wcag: [WCAG.infoRel, WCAG.nameRoleValue, WCAG.keyboard, WCAG.headings],
  testing: ['Toggle each section with Enter and Space.', 'Navigate by headings (H key in NVDA/JAWS) and confirm each header is listed.', 'Confirm expanded/collapsed is announced.'],
  Demo,
  code: `import { Disclosure } from '@headlessui/react';

<Disclosure>
  <h3>
    <Disclosure.Button>What is your return policy?</Disclosure.Button>
  </h3>
  <Disclosure.Panel>Return unused items within 30 days…</Disclosure.Panel>
</Disclosure>`,
  fluid: {
    source: 'Headless UI + Fluid styles',
    notes: [
      'Fluid UI’s Accordion has two issues: it puts aria-live="assertive" on each header button, and it doesn’t wrap headers in heading elements. It also places a <p> inside the <button>, which is invalid HTML.',
      'This site rebuilds it on the same Headless UI Disclosure with Fluid’s accordion styles, adds a heading wrapper and drops the live region.',
    ],
  },
};
