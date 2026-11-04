import { useState } from 'react';
import { Menu } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const [last, setLast] = useState('');
  const pick = (label: string) => () => setLast(label);
  return (
    <div className="flex flex-col items-center gap-4">
      <Menu
        label="Document actions"
        color="gray"
        weight="light"
        menuPositionY="bottom"
        menus={[
          { label: 'Rename', onClick: pick('Rename') },
          { label: 'Duplicate', onClick: pick('Duplicate') },
          { label: 'Share', onClick: pick('Share') },
          { role: 'separator' },
          { label: 'Delete', role: 'destructive', onClick: pick('Delete') },
        ]}
      />
      <p role="status" className="min-h-[1.5rem] text-sm text-muted">
        {last ? `You chose “${last}”.` : ''}
      </p>
    </div>
  );
}

export const menu: ComponentSpec = {
  slug: 'menu',
  name: 'Menu',
  category: 'Actions',
  summary: 'A menu button opens a list of actions. Choosing an action runs it and closes the menu.',
  semantics: 'button[aria-haspopup] + role="menu"',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/',
  whenToUse: [
    'Use a menu for a short list of actions related to one object, like a row’s overflow actions.',
    'Don’t use role="menu" for site navigation. Use a list of links in a <nav> instead. Screen readers treat menus as application widgets, which changes how users move through them.',
  ],
  keyboard: [
    { keys: ['Enter', 'Space', 'ArrowDown'], action: 'On the trigger: opens the menu and focuses the first item.' },
    { keys: ['ArrowUp'], action: 'On the trigger: opens the menu and focuses the last item.' },
    { keys: ['ArrowDown', 'ArrowUp'], action: 'Moves between items, skipping separators and disabled items.' },
    { keys: ['Home', 'End'], action: 'Jumps to the first or last item.' },
    { keys: ['A–Z'], action: 'Typeahead: moves to the next item that starts with the typed letters.' },
    { keys: ['Enter', 'Space'], action: 'Runs the focused item and closes the menu.' },
    { keys: ['Escape'], action: 'Closes the menu and returns focus to the trigger.' },
    { keys: ['Tab'], action: 'Closes the menu and moves focus on as normal.' },
  ],
  aria: [
    { attr: 'aria-haspopup="menu"', where: 'trigger button', usage: 'Tells users the button opens a menu.' },
    { attr: 'aria-expanded', where: 'trigger button', usage: 'true while the menu is open.' },
    { attr: 'aria-controls', where: 'trigger button', usage: 'Points to the menu element.' },
    { attr: 'role="menu"', where: 'popup', usage: 'Container of menu items, labelled by the trigger.' },
    { attr: 'role="menuitem"', where: 'each action', usage: 'Use menuitemcheckbox or menuitemradio for items that hold a state.' },
    { attr: 'role="separator"', where: 'divider', usage: 'Groups related items. It is not focusable.' },
  ],
  focus: [
    'Opening the menu moves focus into it. Closing it with Escape or a selection returns focus to the trigger.',
    'Only one item is in the tab order at a time (roving focus). Arrow keys move between items.',
  ],
  screenReader: [
    'Trigger is announced as: “Document actions, menu button, collapsed”.',
    'Inside: “Rename, menu item, 1 of 4”.',
    'After an action, confirm the result with a status message, as the example does.',
  ],
  dos: [
    'Keep menus short, ideally under ten items.',
    'Use a visible label on the trigger, not only a “⋯” icon. If you must use an icon, give it a name like “More actions for Report.pdf”.',
    'Show destructive items with a label and position, not just red text.',
  ],
  donts: [
    'Don’t put form fields or links to other pages in a menu.',
    'Don’t open menus on hover only.',
    'Don’t nest menus more than one level deep.',
  ],
  wcag: [WCAG.keyboard, WCAG.nameRoleValue, WCAG.focusOrder, WCAG.useOfColor, WCAG.statusMessages],
  testing: [
    'Open the menu with Enter, Space and ArrowDown.',
    'Move through items with the arrow keys and type a letter to jump.',
    'Press Escape and confirm focus returns to the trigger.',
    'Confirm aria-expanded flips between true and false.',
  ],
  Demo,
  code: `import { Menu } from '@fluid-design/fluid-ui';

<Menu
  label="Document actions"
  menuPositionY="bottom"
  menus={[
    { label: 'Rename', onClick: rename },
    { label: 'Duplicate', onClick: duplicate },
    { role: 'separator' },
    { label: 'Delete', role: 'destructive', onClick: remove },
  ]}
/>`,
  fluid: {
    source: 'Fluid UI component',
    notes: [
      'Fluid UI’s Menu wraps Headless UI’s Menu, so it handles roving focus, typeahead, Escape and focus return.',
      'The role prop on items (destructive, info…) only changes color. Make sure the label alone explains the risk.',
    ],
  },
};
