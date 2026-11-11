import { Tab } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  return (
    <div className="w-full max-w-lg">
      <Tab
        tabs={[
          { title: 'Overview', content: <p className="p-4 text-sm leading-6">Arrow keys move between tabs. Tab moves into this panel.</p> },
          { title: 'Specs', content: <p className="p-4 text-sm leading-6">Weight 1.2 kg · Battery 12 h · USB-C charging.</p> },
          { title: 'Reviews', content: <p className="p-4 text-sm leading-6">4.6 out of 5 stars from 212 reviews.</p> },
        ]}
      />
    </div>
  );
}

export const tabs: ComponentSpec = {
  slug: 'tabs',
  name: 'Tabs',
  category: 'Navigation',
  summary: 'Tabs split related content into panels and show one panel at a time.',
  semantics: 'role="tablist" / "tab" / "tabpanel"',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
  whenToUse: [
    'Use tabs to switch between views of the same subject on one page.',
    'If each “tab” loads a new page with its own URL, it is navigation: use links with aria-current="page".',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the selected tab, then on into its panel. The tab list is one tab stop.' },
    { keys: ['ArrowRight', 'ArrowLeft'], action: 'Moves to the next or previous tab, wrapping around. Use ArrowUp/ArrowDown for vertical tabs.' },
    { keys: ['Home', 'End'], action: 'Moves to the first or last tab.' },
    { keys: ['Enter', 'Space'], action: 'Activates the focused tab when tabs use manual activation.' },
  ],
  aria: [
    { attr: 'role="tablist"', where: 'container', usage: 'Groups the tabs. Add aria-label if there’s no visible heading.' },
    { attr: 'role="tab" + aria-selected', where: 'each tab', usage: 'Marks which tab is active.' },
    { attr: 'aria-controls', where: 'each tab', usage: 'Points to the tab’s panel.' },
    { attr: 'role="tabpanel" + aria-labelledby', where: 'panel', usage: 'Names the panel after its tab.' },
    { attr: 'tabindex="0"', where: 'panel', usage: 'Lets keyboard users reach a panel that has no focusable content.' },
    { attr: 'aria-orientation="vertical"', where: 'tablist', usage: 'Set when tabs are stacked vertically.' },
  ],
  focus: [
    'Use automatic activation (selecting on arrow) when panels render instantly. Use manual activation when panels are slow to load.',
    'Only the active tab has tabindex="0". The rest have tabindex="-1" (roving tabindex).',
  ],
  screenReader: ['Announced as: “Specs, tab, selected, 2 of 3”.', 'Entering the panel: “Specs, tab panel”.'],
  dos: ['Keep tab labels short and distinct.', 'Indicate the selected tab with more than color, such as a raised surface, underline or weight change.'],
  donts: ['Don’t nest tabs within tabs.', 'Don’t make each tab its own tab stop.'],
  wcag: [WCAG.nameRoleValue, WCAG.keyboard, WCAG.infoRel, WCAG.useOfColor, WCAG.focusOrder],
  testing: [
    'Tab to the list and use arrows, Home and End.',
    'Press Tab from a tab and confirm focus goes into the panel.',
    'Confirm aria-selected and the “x of y” position are announced.',
  ],
  Demo,
};
