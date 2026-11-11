import { useId, useRef, useState, type KeyboardEvent } from 'react';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';
import { Checkbox } from '../../ui';

const TOPICS = ['Accessibility', 'Design systems', 'Research', 'Content design', 'Frontend', 'Testing', 'Localization'];

const Check = ({ on }: { on: boolean }) => (
  <span aria-hidden="true" className={`grid h-4 w-4 flex-none place-items-center rounded border-2 ${on ? 'border-primary-700 bg-primary-700 text-white dark:border-primary-300 dark:bg-primary-300 dark:text-gray-900' : 'border-gray-500'}`}>
    {on && (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
      </svg>
    )}
  </span>
);

/**
 * Multi-select listbox: focus stays on the list and aria-activedescendant points to the
 * current option. Space toggles; Shift+arrows extend; Ctrl+A selects all.
 */
function ListboxDemo() {
  const id = useId();
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set([0]));
  const [focused, setFocused] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const optId = (i: number) => `${id}-opt-${i}`;

  const move = (i: number, extend: boolean) => {
    const next = Math.max(0, Math.min(TOPICS.length - 1, i));
    setActive(next);
    if (extend) setSelected((s) => new Set([...s, next]));
    listRef.current?.querySelector(`#${CSS.escape(optId(next))}`)?.scrollIntoView({ block: 'nearest' });
  };
  const toggle = (i: number) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  const onKeyDown = (e: KeyboardEvent) => {
    const map: Record<string, () => void> = {
      ArrowDown: () => move(active + 1, e.shiftKey),
      ArrowUp: () => move(active - 1, e.shiftKey),
      Home: () => move(0, false),
      End: () => move(TOPICS.length - 1, false),
      ' ': () => toggle(active),
    };
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      setSelected((s) => (s.size === TOPICS.length ? new Set() : new Set(TOPICS.map((_, i) => i))));
      return;
    }
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  return (
    <div className="w-full max-w-xs space-y-2">
      <p id={`${id}-label`} className="text-sm font-semibold">
        Topics you follow
      </p>
      <p id={`${id}-hint`} className="text-sm text-muted">
        Use the arrow keys to move and Space to select. Shift+arrow selects as you go.
      </p>
      <ul
        ref={listRef}
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        aria-activedescendant={optId(active)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="max-h-56 space-y-0.5 overflow-y-auto rounded-lg p-1 ring-1 ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:ring-gray-500 dark:focus-visible:ring-primary-300"
      >
        {TOPICS.map((t, i) => (
          <li
            key={t}
            id={optId(i)}
            role="option"
            aria-selected={selected.has(i)}
            onClick={() => {
              setActive(i);
              toggle(i);
            }}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
              focused && active === i ? 'outline outline-2 -outline-offset-2 outline-primary-600 dark:outline-primary-300' : ''
            } ${selected.has(i) ? 'bg-primary-50 font-semibold dark:bg-primary-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Check on={selected.has(i)} />
            {t}
          </li>
        ))}
      </ul>
      <p role="status" className="text-sm text-muted">
        {selected.size} selected
      </p>
    </div>
  );
}

function CheckboxesDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['Accessibility']));
  return (
    <fieldset className="w-full max-w-xs space-y-2">
      <legend className="mb-1 text-sm font-semibold">Topics you follow</legend>
      <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg p-3 ring-1 ring-gray-400 dark:ring-gray-500">
        {TOPICS.map((t) => (
          <Checkbox
            key={t}
            label={t}
            checked={selected.has(t)}
            onChange={() =>
              setSelected((s) => {
                const n = new Set(s);
                n.has(t) ? n.delete(t) : n.add(t);
                return n;
              })
            }
          />
        ))}
      </div>
      <p className="text-sm text-muted">{selected.size} selected</p>
    </fieldset>
  );
}

export const listboxVariants: Variant[] = [
  {
    id: 'listbox',
    label: 'Listbox',
    description: 'A custom list where focus stays on the list and aria-activedescendant tracks the current option. Compact, but needs the keyboard model explained.',
    Demo: ListboxDemo,
    html: `<p id="topics-label">Topics you follow</p>
<p id="topics-hint">Use the arrow keys to move and Space to select.</p>
<ul role="listbox" aria-multiselectable="true" tabindex="0"
    aria-labelledby="topics-label" aria-describedby="topics-hint"
    aria-activedescendant="opt-0">
  <li role="option" id="opt-0" aria-selected="true">Accessibility</li>
  <li role="option" id="opt-1" aria-selected="false">Design systems</li>
  <li role="option" id="opt-2" aria-selected="false">Research</li>
</ul>
<p role="status">1 selected</p>

<script>
  const list = document.querySelector('[role=listbox]');
  const opts = [...list.querySelectorAll('[role=option]')];
  let active = 0;
  const setActive = (i) => {
    active = Math.max(0, Math.min(opts.length - 1, i));
    list.setAttribute('aria-activedescendant', opts[active].id);
    opts[active].scrollIntoView({ block: 'nearest' });
  };
  const toggle = (o) => o.setAttribute('aria-selected', String(o.getAttribute('aria-selected') !== 'true'));
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') setActive(active + 1);
    else if (e.key === 'ArrowUp') setActive(active - 1);
    else if (e.key === ' ') toggle(opts[active]);
    else return;
    e.preventDefault();
  });
</script>`,
  },
  {
    id: 'checkboxes',
    label: 'Checkbox list',
    description: 'Native checkboxes in a scrolling fieldset. Every option is a tab stop, but everyone already knows how it works. Prefer this in forms.',
    Demo: CheckboxesDemo,
    html: `<fieldset>
  <legend>Topics you follow</legend>
  <div class="scroll-box">
    <label><input type="checkbox" name="topics" value="a11y" checked> Accessibility</label>
    <label><input type="checkbox" name="topics" value="ds"> Design systems</label>
    <label><input type="checkbox" name="topics" value="research"> Research</label>
  </div>
</fieldset>`,
  },
];

export const listbox: ComponentSpec = {
  slug: 'listbox',
  name: 'Multi-select list',
  category: 'Forms',
  summary: 'A multi-select list lets people pick several items from a visible list. Build it as a native checkbox list where you can; use the listbox pattern when you need a compact widget.',
  semantics: 'role="listbox" aria-multiselectable with role="option", or a fieldset of checkboxes',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
  whenToUse: [
    'Use it when people choose several items from a list of around 5 to 20.',
    'In forms, prefer a checkbox list: it works the same everywhere and submits without script.',
    'For long lists people can type, use a combobox with multiple selection instead.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Listbox: one stop for the whole list. Checkboxes: each checkbox is a stop.' },
    { keys: ['↓', '↑'], action: 'Listbox: moves the current option.' },
    { keys: ['Space'], action: 'Selects or deselects the current option or checkbox.' },
    { keys: ['Shift+↓', 'Shift+↑'], action: 'Listbox: moves and selects as you go.' },
    { keys: ['Ctrl+A'], action: 'Listbox: selects all, or clears all if everything is selected.' },
    { keys: ['Home', 'End'], action: 'Listbox: first or last option.' },
  ],
  aria: [
    { attr: 'role="listbox"', where: '<ul>', usage: 'With aria-multiselectable="true" and a name.' },
    { attr: 'role="option"', where: 'each <li>', usage: 'With aria-selected true or false on every option.' },
    { attr: 'aria-activedescendant', where: 'listbox', usage: 'Points to the current option while focus stays on the list.' },
    { attr: 'aria-describedby', where: 'listbox', usage: 'Links a short hint that explains the keys.' },
    { attr: '<fieldset> + <legend>', where: 'checkbox list', usage: 'Names the group; no ARIA needed.' },
  ],
  focus: [
    'Listbox: focus stays on the list. Draw a visible outline on the current option yourself, because the browser won’t.',
    'Scroll the current option into view as it moves.',
    'Checkbox list: each checkbox shows its own focus ring.',
  ],
  screenReader: [
    'Listbox: “Topics you follow, list box, multi-select. Accessibility, selected, 1 of 7”.',
    'Checkbox list: “Topics you follow, group. Accessibility, checkbox, checked”.',
  ],
  dos: ['Show a check icon on selected options, not only a background color.', 'Show how many are selected.', 'Explain the keys in a visible hint for the listbox.'],
  donts: ['Don’t rely on Ctrl+click or Shift+click alone; many people don’t know them.', 'Don’t use a native <select multiple>; it’s hard for most people to use.', 'Don’t put buttons or links inside options.'],
  wcag: [WCAG.infoRel, WCAG.keyboard, WCAG.focusVisible, WCAG.nameRoleValue, WCAG.useOfColor, WCAG.labels],
  testing: [
    'Listbox: Tab in once, move with arrows, select with Space, and confirm the outline follows.',
    'Confirm selected options show a check, and the count updates.',
    'With a screen reader, confirm “selected” or “not selected” is announced for each option.',
    'Click options with a mouse and confirm they toggle without needing Ctrl.',
    'Checkbox list: confirm the legend is read when entering the group.',
  ],
  Demo: ListboxDemo,
};
