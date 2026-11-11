import { useId, useRef, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const PAGES = ['Accessibility statement', 'Annual report 2026', 'Contact us', 'Cookie settings', 'Opening times', 'Trail access guide', 'Volunteer with us'];

function Demo() {
  const id = useId();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<string[] | null>(null);
  const [submitted, setSubmitted] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <div className="w-full max-w-md space-y-4">
      <form
        role="search"
        aria-label="Site"
        onSubmit={(e) => {
          e.preventDefault();
          const term = q.trim();
          setSubmitted(term);
          setResults(PAGES.filter((p) => p.toLowerCase().includes(term.toLowerCase())));
          requestAnimationFrame(() => headingRef.current?.focus());
        }}
        className="flex gap-2"
      >
        <label htmlFor={id} className="sr-only">
          Search this site
        </label>
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search this site"
          enterKeyHint="search"
          className="block w-full rounded-lg bg-white px-3 py-2 ring-1 ring-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-900 dark:ring-gray-400"
        />
        <button type="submit" className="flex-none rounded-lg bg-primary-700 px-3 text-white hover:bg-primary-800 focus-ring dark:bg-primary-300 dark:text-gray-900">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M8.5 3a5.5 5.5 0 0 1 4.4 8.8l3.7 3.6a1 1 0 0 1-1.5 1.5l-3.6-3.7A5.5 5.5 0 1 1 8.5 3Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </form>
      {results && (
        <section aria-labelledby={`${id}-results`} className="space-y-2">
          {/* h4 because the example sits under the page's h3 */}
          <h4 ref={headingRef} id={`${id}-results`} tabIndex={-1} className="rounded font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
            {results.length} {results.length === 1 ? 'result' : 'results'} for “{submitted}”
          </h4>
          {results.length ? (
            <ul className="list-disc space-y-1 pl-5">
              {results.map((r) => (
                <li key={r}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="link">
                    {r}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Check the spelling or try a different word.</p>
          )}
        </section>
      )}
    </div>
  );
}


export const searchField: ComponentSpec = {
  slug: 'search-field',
  name: 'Search field',
  category: 'Forms',
  summary: 'A search field lets people find content by typing. It sits in a search landmark, has a label, and its button has a name even if it shows only an icon.',
  semantics: '<form role="search"> with <input type="search"> and a submit <button>',
  whenToUse: [
    'Use a search field when there’s more content than people can browse comfortably.',
    'Use a combobox when suggestions should appear as people type.',
    'Use a filter field when it narrows a list already on the page.',
  ],
  keyboard: [
    { keys: ['Enter'], action: 'Submits the search from the field.' },
    { keys: ['Escape'], action: 'Clears the field in most browsers (type="search").' },
  ],
  aria: [
    { attr: 'role="search"', where: '<form> (or <search>)', usage: 'A landmark people can jump to. Name it if there’s more than one.' },
    { attr: '<label>', where: 'input', usage: 'Can be visually hidden in the header, but must exist; a placeholder isn’t a label.' },
    { attr: 'Visually hidden text', where: 'icon button', usage: 'Names the button “Search”.' },
    { attr: 'type="search"', where: 'input', usage: 'Adds a clear button and a Search key on mobile keyboards.' },
  ],
  focus: ['After a search on the same page, move focus to the results heading.', 'After a search that loads a new page, put the result count in the page title and h1.'],
  screenReader: ['“Site, search landmark. Search this site, search edit text.”', 'After submitting: “3 results for trail, heading level 2”.'],
  dos: ['Keep the search field wide enough for typical queries.', 'Repeat the search term on the results page.', 'Keep the query in the field after searching.'],
  donts: ['Don’t rely on placeholder text as the label.', 'Don’t search on every keystroke without announcing results.', 'Don’t hide the field behind an icon on desktop if search is important.'],
  wcag: [WCAG.labels, WCAG.nameRoleValue, WCAG.infoRel, WCAG.statusMessages, WCAG.labelInName],
  testing: [
    'List landmarks with a screen reader and confirm search is there.',
    'Confirm the field has a label and the button has a name.',
    'Search and confirm the result count is announced.',
    'Search for nothing and confirm the empty state helps.',
  ],
  Demo,
};
