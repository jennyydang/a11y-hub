import { useId, useRef, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

/** Removable tags with an input to add more. Focus moves sensibly after each removal. */
function Demo() {
  const id = useId();
  const [tags, setTags] = useState(['Accessibility', 'Research', 'Design systems']);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const remove = (i: number) => {
    const name = tags[i];
    setTags((t) => t.filter((_, j) => j !== i));
    setMessage(`${name} removed`);
    // Focus the tag that took its place, the one before it, or the input if none are left
    requestAnimationFrame(() => {
      const next = btnRefs.current[Math.min(i, tags.length - 2)];
      (tags.length > 1 && next ? next : inputRef.current)?.focus();
    });
  };
  const add = () => {
    const v = value.trim();
    if (!v) return;
    if (tags.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setMessage(`${v} is already added`);
      return;
    }
    setTags((t) => [...t, v]);
    setValue('');
    setMessage(`${v} added`);
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="space-y-1.5">
        <label htmlFor={`${id}-input`} className="block text-sm font-semibold">
          Add a topic
        </label>
        <p id={`${id}-hint`} className="text-sm text-muted">
          Press Enter to add it.
        </p>
        <input
          ref={inputRef}
          id={`${id}-input`}
          aria-describedby={`${id}-hint`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className="block w-full rounded-lg bg-white px-3 py-2 ring-1 ring-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-900 dark:ring-gray-400"
        />
      </div>
      <p id={`${id}-label`} className="text-sm font-semibold">
        Your topics
      </p>
      {tags.length ? (
        <ul aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <li key={t} className="inline-flex items-center gap-1 rounded-full bg-primary-50 py-1 pl-3 pr-1 text-sm font-medium text-primary-900 ring-1 ring-primary-700/40 dark:bg-primary-900/50 dark:text-primary-50 dark:ring-primary-300/40">
              {t}
              <button
                ref={(el) => (btnRefs.current[i] = el)}
                type="button"
                onClick={() => remove(i)}
                className="grid h-6 w-6 place-items-center rounded-full hover:bg-primary-100 focus-ring dark:hover:bg-primary-800"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M6.3 5.2a.8.8 0 0 0-1.1 1.1L8.9 10l-3.7 3.7a.8.8 0 1 0 1.1 1.1L10 11.1l3.7 3.7a.8.8 0 0 0 1.1-1.1L11.1 10l3.7-3.7a.8.8 0 0 0-1.1-1.1L10 8.9 6.3 5.2Z" />
                </svg>
                <span className="sr-only">Remove {t}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No topics yet.</p>
      )}
      <p role="status" className="sr-only">
        {message}
      </p>
    </div>
  );
}


export const tags: ComponentSpec = {
  slug: 'tags',
  name: 'Tags',
  category: 'Forms',
  summary: 'Tags show items people have added or chosen, like topics or filters, each with a button to remove it.',
  semantics: '<ul> of tags, each with a <button> named “Remove {tag}”',
  whenToUse: [
    'Use tags to show and remove a set of chosen values, like applied filters or topics.',
    'Use a badge for a status label that people can’t remove.',
    'Use checkboxes when there’s a fixed, short list to choose from.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to each tag’s remove button.' },
    { keys: ['Enter', 'Space'], action: 'Removes the tag. Focus moves to the next tag, or the input if none are left.' },
    { keys: ['Enter'], action: 'In the input, adds a new tag.' },
  ],
  aria: [
    { attr: '<ul> + aria-labelledby', where: 'tag list', usage: 'Announces “Your topics, list, 3 items”.' },
    { attr: 'Visually hidden text', where: 'remove button', usage: '“Remove Accessibility”, not just “×” or “Remove”.' },
    { attr: 'role="status"', where: 'hidden message', usage: 'Confirms “Research removed” or “Design added”.' },
  ],
  focus: [
    'After removing a tag, move focus to the next tag’s button, or the previous one, or the input when the list is empty. Never leave focus on <body>.',
    'Keep the remove button’s target at least 24×24px.',
  ],
  screenReader: ['“Remove Research, button.” Then “Research removed”, and focus lands on “Remove Design systems, button”.'],
  dos: ['Name every remove button with its tag.', 'Announce additions and removals.', 'Let people undo or re-add easily.'],
  donts: ['Don’t remove tags on Backspace in the input without a clear cue.', 'Don’t make the whole tag a button when it also has a remove button.', 'Don’t rely on the × alone.'],
  wcag: [WCAG.nameRoleValue, WCAG.focusOrder, WCAG.statusMessages, WCAG.targetSize, WCAG.labelInName],
  testing: [
    'Remove a tag with the keyboard and confirm focus moves to the next tag.',
    'Remove every tag and confirm focus lands in the input.',
    'With a screen reader, confirm each remove button says which tag it removes.',
    'Confirm adding and removing are announced.',
  ],
  Demo,
};
