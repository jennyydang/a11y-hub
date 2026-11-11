import { useId, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';

const Illustration = () => (
  <svg aria-hidden="true" viewBox="0 0 120 80" className="h-20 w-28">
    <rect x="18" y="14" width="84" height="56" rx="8" className="fill-primary-100 dark:fill-primary-900" />
    <rect x="30" y="28" width="44" height="6" rx="3" className="fill-primary-300 dark:fill-primary-600" />
    <rect x="30" y="42" width="60" height="6" rx="3" className="fill-primary-200 dark:fill-primary-700" />
    <circle cx="92" cy="18" r="12" className="fill-amber-300" />
  </svg>
);

function FirstUseDemo() {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex max-w-sm flex-col items-center gap-3 rounded-xl p-6 text-center ring-1 ring-dashed ring-gray-300 dark:ring-gray-600">
      <Illustration />
      {/* h4 because the example sits under the page's h3; use the level that fits your page */}
      <h4 id={id} className="text-lg font-semibold">
        No projects yet
      </h4>
      <p className="text-sm text-muted">Projects keep your files, tasks and people together. Create one to get started.</p>
      <Button className="btn-bold-primary">Create a project</Button>
    </section>
  );
}

const ALL = ['Annual budget', 'Brand refresh', 'Customer survey', 'Hiring plan', 'Website redesign'];

function NoResultsDemo() {
  const id = useId();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const shown = ALL.filter((p) => p.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="space-y-1">
        <label htmlFor={`${id}-q`} className="block text-sm font-semibold">
          Filter projects
        </label>
        <input
          ref={inputRef}
          id={`${id}-q`}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “zebra”"
          className="block w-full rounded-lg bg-white px-3 py-2 ring-1 ring-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-900 dark:ring-gray-400"
        />
      </div>
      {/* Announces the result count after typing */}
      <p role="status" className="text-sm text-muted">
        {q.trim() ? (shown.length ? `${shown.length} of ${ALL.length} projects` : '') : `${ALL.length} projects`}
      </p>
      {shown.length ? (
        <ul className="list-disc space-y-1 pl-5">
          {shown.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2 rounded-xl p-4 ring-1 ring-gray-300 dark:ring-gray-600">
          <p role="status" className="font-semibold">
            No projects match “{q.trim()}”
          </p>
          <p className="text-sm text-muted">Check the spelling or try a shorter word.</p>
          <Button
            size="sm"
            weight="light"
            color="gray"
            onClick={() => {
              setQ('');
              inputRef.current?.focus();
            }}
          >
            Clear filter
          </Button>
        </div>
      )}
    </div>
  );
}

export const emptyStateVariants: Variant[] = [
  {
    id: 'first-use',
    label: 'First use',
    description: 'Nothing has been created yet. A heading says so, a sentence explains why it matters, and one button gets people started.',
    Demo: FirstUseDemo,
    html: `<section class="empty-state" aria-labelledby="empty-title">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 120 80">…</svg>
  <h2 id="empty-title">No projects yet</h2>
  <p>Projects keep your files, tasks and people together. Create one to get started.</p>
  <a class="button" href="/projects/new">Create a project</a>
</section>`,
  },
  {
    id: 'no-results',
    label: 'No results',
    description: 'A search or filter matched nothing. The message is announced, says what was searched for, and offers a way back.',
    Demo: NoResultsDemo,
    html: `<label for="q">Filter projects</label>
<input id="q" type="search">

<div class="empty-state">
  <!-- role="status" so screen reader users hear it after typing -->
  <p role="status"><strong>No projects match “zebra”</strong></p>
  <p>Check the spelling or try a shorter word.</p>
  <button type="button">Clear filter</button>
</div>`,
  },
];

export const emptyState: ComponentSpec = {
  slug: 'empty-state',
  name: 'Empty state',
  category: 'Content',
  summary: 'An empty state is what people see when there’s nothing to show yet, or when a search finds nothing. It explains why and what to do next.',
  semantics: 'A heading and text, with a link or button; role="status" for “no results” messages',
  whenToUse: [
    'Use a first-use empty state where a list or dashboard has no content yet.',
    'Use a no-results state after a search or filter that matches nothing.',
    'Use an alert instead if something failed to load.',
  ],
  keyboard: [{ keys: ['Tab'], action: 'Reaches the action button or link. The empty state itself isn’t focusable.' }],
  aria: [
    { attr: 'Heading', where: 'first-use title', usage: 'So screen reader users can find it by heading.' },
    { attr: 'aria-hidden="true"', where: 'illustration', usage: 'Decorative; the heading and text carry the message.' },
    { attr: 'role="status"', where: 'no-results message', usage: 'Announced after typing or filtering, without moving focus.' },
  ],
  focus: [
    'Don’t move focus to the empty state. Announce no-results messages with a status instead.',
    'When “Clear filter” removes the text, put focus back in the search field.',
  ],
  screenReader: ['First use: “No projects yet, heading level 2”, then the text and the button.', 'No results: “No projects match zebra” is announced while focus stays in the search field.'],
  dos: ['Say what’s empty and why in plain words.', 'Offer one clear next step.', 'Repeat the search term so people can spot typos.'],
  donts: ['Don’t show only an illustration.', 'Don’t blame people (“You haven’t…”).', 'Don’t make the illustration the only cue that the list is empty.'],
  wcag: [WCAG.nonText, WCAG.infoRel, WCAG.headings, WCAG.statusMessages],
  testing: [
    'Search for something that doesn’t exist and confirm the no-results message is announced.',
    'Confirm the illustration isn’t read.',
    'Navigate by headings and confirm the first-use title is listed.',
    'Activate Clear filter and confirm focus returns to the search field.',
  ],
  Demo: FirstUseDemo,
};
