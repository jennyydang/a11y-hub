import { useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const STAR = 'M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8L10 1.8Z';

/** Five native radios: arrow keys, grouping and "3 of 5" come for free. Stars are only the look. */
function Demo() {
  const id = useId();
  const [rating, setRating] = useState(0);
  return (
    <div className="space-y-2">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Rate Riverside loop</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="relative">
              <input type="radio" name={`${id}-rating`} value={n} checked={rating === n} onChange={() => setRating(n)} className="peer sr-only" />
              <span className="grid h-10 w-10 cursor-pointer place-items-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600 dark:peer-focus-visible:ring-primary-300">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={`h-8 w-8 stroke-[1.5] ${n <= rating ? 'fill-amber-500 stroke-amber-800 dark:fill-amber-300 dark:stroke-amber-100' : 'fill-transparent stroke-gray-600 dark:stroke-gray-300'}`}
                >
                  <path d={STAR} strokeLinejoin="round" />
                </svg>
              </span>
              <span className="sr-only">
                {n} {n === 1 ? 'star' : 'stars'}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-sm" aria-hidden="true">
        {rating ? `${rating} out of 5 stars` : 'Not rated yet'}
      </p>
    </div>
  );
}


export const starRating: ComponentSpec = {
  slug: 'star-rating',
  name: 'Star rating',
  category: 'Forms',
  summary: 'A star rating lets people score something from 1 to 5. Build it from five radio buttons that look like stars.',
  semantics: '<fieldset> of 5 <input type="radio">, styled as stars',
  whenToUse: [
    'Use it for a quick overall score, like rating a trail or a support answer.',
    'Pair it with a text field when you need to know why.',
    'To show an average rating that people can’t change, use text like “4.5 out of 5” with stars hidden from screen readers.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves into the group, to the selected star or the first one.' },
    { keys: ['←', '→', '↑', '↓'], action: 'Selects the previous or next rating.' },
    { keys: ['Space'], action: 'Selects the focused star when none is chosen yet.' },
  ],
  aria: [
    { attr: '<fieldset> + <legend>', where: 'wrapper', usage: 'Names what is being rated.' },
    { attr: 'Visually hidden “3 stars”', where: 'each label', usage: 'Gives each radio a name; the star icons are aria-hidden.' },
    { attr: 'aria-hidden="true"', where: 'visible summary', usage: 'Screen readers already hear the checked radio, so the visual “3 out of 5” isn’t repeated.' },
  ],
  focus: ['A visible ring on the star that has focus.', 'One tab stop for the whole rating.'],
  screenReader: ['“Rate Riverside loop, group. 3 stars, radio button, checked, 3 of 5.”'],
  dos: ['Make each star at least 24×24px, ideally 40px.', 'Show the chosen rating with fill and outline, not color alone.', 'Show the result in words beside the stars.'],
  donts: ['Don’t submit on selection; let people change their mind.', 'Don’t use hover-only previews to show the value.', 'Don’t use half stars for input.'],
  wcag: [WCAG.infoRel, WCAG.nameRoleValue, WCAG.keyboard, WCAG.nonTextContrast, WCAG.useOfColor, WCAG.targetSize],
  testing: [
    'Tab in and use arrow keys; confirm each rating is announced with “of 5”.',
    'Check the focus ring is visible on the star.',
    'View in grayscale and confirm selected stars are still clear.',
    'Zoom to 200% and confirm the stars don’t overlap.',
  ],
  Demo,
};
