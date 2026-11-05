import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

interface Node {
  id: string;
  label: string;
  children?: Node[];
}
const TREE: Node[] = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      { id: 'reports', label: 'Reports', children: [{ id: 'q3', label: 'Q3 summary.pdf' }, { id: 'q4', label: 'Q4 forecast.xlsx' }] },
      { id: 'letter', label: 'Cover letter.docx' },
    ],
  },
  { id: 'photos', label: 'Photos', children: [{ id: 'trip', label: 'Lisbon trip' }, { id: 'team', label: 'Team day' }] },
  { id: 'notes', label: 'Notes.txt' },
];

const all = (n: Node): Node[] => [n, ...(n.children ?? []).flatMap(all)];
const ALL = TREE.flatMap(all);

interface Flat {
  node: Node;
  level: number;
  parent?: string;
  setsize: number;
  posinset: number;
}

/** Visible items in reading order, given which folders are open. */
function flatten(nodes: Node[], open: Set<string>, level = 1, parent?: string): Flat[] {
  return nodes.flatMap((node, i) => [
    { node, level, parent, setsize: nodes.length, posinset: i + 1 },
    ...(node.children && open.has(node.id) ? flatten(node.children, open, level + 1, node.id) : []),
  ]);
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 flex-none transition-transform motion-reduce:transition-none ${open ? 'rotate-90' : ''}`}>
    <path d="M7.2 15.8a1 1 0 0 1 0-1.4L11.6 10 7.2 5.6a1 1 0 1 1 1.4-1.4l5.1 5.1a1 1 0 0 1 0 1.4l-5.1 5.1a1 1 0 0 1-1.4 0Z" />
  </svg>
);
const Icon = ({ folder }: { folder: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 flex-none ${folder ? 'text-amber-600 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'}`}>
    <path d={folder ? 'M2 5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z' : 'M5 2h6l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z'} />
  </svg>
);

/** WAI-ARIA tree view: one tab stop, arrows move and expand, Enter selects. */
function Demo() {
  const [open, setOpen] = useState<Set<string>>(new Set(['docs']));
  const [active, setActive] = useState('docs');
  const [selected, setSelected] = useState('letter');
  const refs = useRef<Record<string, HTMLLIElement | null>>({});
  const items = useMemo(() => flatten(TREE, open), [open]);

  const focus = (id: string) => {
    setActive(id);
    refs.current[id]?.focus();
  };
  const toggle = (id: string, to?: boolean) =>
    setOpen((s) => {
      const n = new Set(s);
      (to ?? !n.has(id)) ? n.add(id) : n.delete(id);
      return n;
    });

  const onKeyDown = (e: KeyboardEvent, f: Flat) => {
    const i = items.findIndex((x) => x.node.id === f.node.id);
    const isOpen = open.has(f.node.id);
    const handled = () => {
      e.preventDefault();
      e.stopPropagation();
    };
    switch (e.key) {
      case 'ArrowDown':
        handled();
        if (items[i + 1]) focus(items[i + 1].node.id);
        break;
      case 'ArrowUp':
        handled();
        if (items[i - 1]) focus(items[i - 1].node.id);
        break;
      case 'ArrowRight':
        handled();
        if (f.node.children && !isOpen) toggle(f.node.id, true);
        else if (f.node.children && isOpen) focus(f.node.children[0].id);
        break;
      case 'ArrowLeft':
        handled();
        if (f.node.children && isOpen) toggle(f.node.id, false);
        else if (f.parent) focus(f.parent);
        break;
      case 'Home':
        handled();
        focus(items[0].node.id);
        break;
      case 'End':
        handled();
        focus(items[items.length - 1].node.id);
        break;
      case 'Enter':
      case ' ':
        handled();
        setSelected(f.node.id);
        break;
      case '*': {
        // Expand all siblings at this level
        handled();
        const sibs = items.filter((x) => x.parent === f.parent && x.node.children).map((x) => x.node.id);
        setOpen((s) => new Set([...s, ...sibs]));
        break;
      }
    }
  };

  // A flat list with aria-level, aria-setsize and aria-posinset: each item's name is
  // just its own label, and closed folders' children aren't in the DOM.
  const render = () =>
    items.map((f) => {
      const { node, level } = f;
      const isOpen = open.has(node.id);
      return (
        <li
          key={node.id}
          ref={(el) => (refs.current[node.id] = el)}
          role="treeitem"
          aria-level={level}
          aria-setsize={f.setsize}
          aria-posinset={f.posinset}
          aria-expanded={node.children ? isOpen : undefined}
          aria-selected={selected === node.id}
          tabIndex={active === node.id ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, f)}
          onFocus={() => setActive(node.id)}
          onClick={() => {
            focus(node.id);
            setSelected(node.id);
            if (node.children) toggle(node.id);
          }}
          style={{ paddingLeft: `${(level - 1) * 1.25 + 0.5}rem` }}
          className={`flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300 ${
            selected === node.id ? 'bg-primary-100 font-semibold text-primary-900 dark:bg-primary-900 dark:text-primary-50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {node.children ? <Chevron open={isOpen} /> : <span className="w-4" />}
          <Icon folder={Boolean(node.children)} />
          {node.label}
        </li>
      );
    });

  const sel = ALL.find((n) => n.id === selected)?.label;
  return (
    <div className="w-full max-w-xs space-y-2">
      <p id="tree-label" className="text-sm font-semibold">
        Files
      </p>
      <ul role="tree" aria-labelledby="tree-label" className="space-y-0.5 rounded-lg p-1 ring-1 ring-gray-200 dark:ring-gray-700">
        {render()}
      </ul>
      <p className="text-sm text-muted">Selected: {sel}</p>
    </div>
  );
}

const code = `// Flatten the visible items, then render one list with level and position
const items = flatten(tree, open); // [{ node, level, setsize, posinset }]

<ul role="tree" aria-labelledby="tree-label">
  {items.map(({ node, level, setsize, posinset }) => (
    <li key={node.id} role="treeitem"
        aria-level={level} aria-setsize={setsize} aria-posinset={posinset}
        aria-expanded={node.children ? open.has(node.id) : undefined}
        aria-selected={selected === node.id}
        tabIndex={active === node.id ? 0 : -1}
        onKeyDown={onKeyDown}>
      {node.label}
    </li>
  ))}
</ul>

// ↓ ↑ next/previous visible item, → open or go to first child,
// ← close or go to parent, Home/End first/last, Enter selects.`;

export const treeView: ComponentSpec = {
  slug: 'tree-view',
  name: 'Tree view',
  category: 'Data',
  summary: 'A tree view shows nested items, like folders and files, that people expand and collapse. Arrow keys move through it, and it’s one tab stop.',
  semantics: 'role="tree" with role="treeitem" items and aria-level, aria-setsize, aria-posinset',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/',
  whenToUse: [
    'Use a tree for deep hierarchies people browse and pick from, like a file system or category picker.',
    'Use nested lists of links, or an accordion, for site navigation. Trees are harder to use and many people don’t know the keys.',
    'Keep it shallow when you can; three levels is plenty for most people.',
  ],
  keyboard: [
    { keys: ['↓', '↑'], action: 'Next or previous visible item.' },
    { keys: ['→'], action: 'Opens a closed folder. On an open folder, moves to its first child.' },
    { keys: ['←'], action: 'Closes an open folder. On a child, moves to its parent.' },
    { keys: ['Home', 'End'], action: 'First or last visible item.' },
    { keys: ['Enter', 'Space'], action: 'Selects the item.' },
    { keys: ['*'], action: 'Expands every folder at the current level.' },
  ],
  aria: [
    { attr: 'role="tree"', where: 'outer <ul>', usage: 'With a name from aria-labelledby.' },
    { attr: 'role="treeitem"', where: 'each <li>', usage: 'One per item, focusable with roving tabindex.' },
    { attr: 'role="group"', where: 'nested <ul> (if nesting)', usage: 'Holds a folder’s children. This example uses a flat list instead, so each item’s name is only its own label.' },
    { attr: 'aria-expanded', where: 'folders only', usage: 'true or false. Leave it off files, or they’re announced as folders.' },
    { attr: 'aria-selected', where: 'treeitems', usage: 'Shows which item is chosen.' },
    { attr: 'aria-level / setsize / posinset', where: 'treeitems', usage: 'Gives level and position in a flat list (“level 2, 1 of 2”).' },
  ],
  focus: [
    'One tab stop: only the current item has tabindex="0".',
    'Focus stays visible on the row, separate from the selected style.',
    'When a folder closes while a child has focus, move focus to the folder.',
  ],
  screenReader: [
    'Announced as: “Files, tree. Documents, expanded, level 1, 1 of 3”.',
    'On a file: “Cover letter.docx, selected, level 2, 2 of 2”.',
  ],
  dos: ['Show expand and collapse with an icon that rotates, not color.', 'Let clicking the row toggle, not only the tiny arrow.', 'Make focus and selection look different.'],
  donts: ['Don’t use a tree for main site navigation.', 'Don’t put links and buttons inside tree items.', 'Don’t set aria-expanded on items that have no children.'],
  wcag: [WCAG.infoRel, WCAG.keyboard, WCAG.focusVisible, WCAG.nameRoleValue, WCAG.useOfColor, WCAG.targetSize],
  testing: [
    'Tab in once and out once; the tree is a single stop.',
    'Use ← and → to open, close, go to children and back to parents.',
    'With a screen reader, confirm level, position and expanded state are read.',
    'Confirm files aren’t announced as “collapsed”.',
    'Check focus and selection look different in grayscale.',
  ],
  Demo,
  code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI and Headless UI don’t ship a tree. This follows the WAI-ARIA tree pattern with list markup.',
      'The chevron’s rotation is turned off for people who prefer reduced motion.',
    ],
  },
};
