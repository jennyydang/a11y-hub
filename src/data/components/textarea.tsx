import { useEffect, useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const MAX = 200;

function Demo() {
  const id = useId();
  const [text, setText] = useState('');
  const [announced, setAnnounced] = useState('');
  const left = MAX - text.length;
  const over = left < 0;

  // Announce the remaining count only after typing pauses, so screen readers aren't flooded.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (text.length === 0) return setAnnounced('');
      setAnnounced(over ? `${-left} characters too many` : `${left} characters remaining`);
    }, 800);
    return () => window.clearTimeout(t);
  }, [text, left, over]);

  return (
    <div className="w-full max-w-md space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        Delivery instructions
      </label>
      <p id={`${id}-hint`} className="text-sm text-muted">
        For example, gate code or where to leave the parcel. Up to {MAX} characters.
      </p>
      <textarea
        id={id}
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-describedby={`${id}-hint ${id}-count`}
        aria-invalid={over || undefined}
        className={`block w-full resize-y rounded-lg bg-white px-4 py-2.5 text-base ring-1 focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-800 ${
          over
            ? 'ring-red-600 focus-visible:ring-red-600 dark:ring-red-400'
            : 'ring-gray-400 focus-visible:ring-primary-600 dark:ring-gray-500 dark:focus-visible:ring-primary-300'
        }`}
      />
      <p id={`${id}-count`} className={`text-sm ${over ? 'font-medium text-red-700 dark:text-red-300' : 'text-muted'}`}>
        {over ? `${-left} characters too many` : `${left} characters remaining`}
      </p>
      <p className="sr-only" aria-live="polite">
        {announced}
      </p>
    </div>
  );
}

export const textarea: ComponentSpec = {
  slug: 'textarea',
  name: 'Textarea',
  category: 'Forms',
  summary: 'A multi-line text field for longer answers, like comments, descriptions or delivery notes.',
  semantics: '<textarea> + <label>',
  whenToUse: ['Use a textarea when the answer may run longer than one line.', 'Size it to the expected answer, so people can see what they wrote without scrolling.'],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus into the textarea. Tab moves on to the next field; it never inserts a tab character.' },
    { keys: ['Enter'], action: 'Inserts a new line. It does not submit the form.' },
  ],
  aria: [
    { attr: '<label for>', where: 'label', usage: 'Names the field.' },
    { attr: 'aria-describedby', where: 'textarea', usage: 'Links the hint and the character count, so both are read after the name.' },
    { attr: 'aria-live="polite"', where: 'separate hidden region', usage: 'Announces the remaining count after typing pauses. Keep it separate from the visible counter, which updates on every key.' },
    { attr: 'aria-invalid', where: 'textarea', usage: 'Set when the text is over the limit.' },
    { attr: 'maxlength', where: 'textarea', usage: 'Optional. It silently stops input, so many teams prefer to allow overflow and show an error instead.' },
  ],
  focus: ['Let the field be resized vertically, so people with large text can see more.', 'Keep the counter close to the field so screen magnifier users notice it.'],
  screenReader: [
    'Announced as: “Delivery instructions, edit text, multi-line, For example, gate code… 200 characters remaining”.',
    'While typing, the remaining count is announced only after a short pause.',
  ],
  dos: ['Show the limit before people start typing.', 'Let people type past the limit and then show how much to cut, instead of cutting them off.'],
  donts: ['Don’t announce the count on every keystroke.', 'Don’t use a fixed-height textarea with no resize handle for long answers.'],
  wcag: [WCAG.labels, WCAG.statusMessages, WCAG.errorId, WCAG.reflow],
  testing: [
    'Type past the limit and confirm the error is shown and announced.',
    'Pause while typing and confirm the remaining count is announced once.',
    'Confirm Enter adds a line and Tab leaves the field.',
  ],
  Demo,
};
