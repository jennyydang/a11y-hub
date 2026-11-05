import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@fluid-design/fluid-ui';
import { findComponent } from '../data/components';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

interface Option {
  label: string;
  hint?: string;
  next?: string;
  result?: { slug: string; variant?: string; why: string };
}
interface Node {
  ask: string;
  options: Option[];
}

const r = (slug: string, why: string, variant?: string): Option['result'] => ({ slug, why, variant });

const TREE: Record<string, Node> = {
  start: {
    ask: 'What do you need the interface to do?',
    options: [
      { label: 'Let people do something or go somewhere', hint: 'Buttons, links, menus', next: 'act' },
      { label: 'Let people choose from options', hint: 'Checkboxes, radios, selects', next: 'choose' },
      { label: 'Let people enter information', hint: 'Text, dates, numbers, files', next: 'enter' },
      { label: 'Tell people something', hint: 'Messages, errors, loading', next: 'tell' },
      { label: 'Organize or reveal content', hint: 'Tabs, accordions, tables, tooltips', next: 'organize' },
      { label: 'Help people find their way around', hint: 'Navigation, breadcrumbs, pages', next: 'wayfind' },
      { label: 'Show a picture, icon or chart', next: undefined, result: r('image', 'Images need alt text that matches their purpose, or to be hidden when decorative.') },
    ],
  },
  act: {
    ask: 'What happens when someone activates it?',
    options: [
      { label: 'They go to another page, file or place', result: r('link', 'If the URL changes, it’s a link, even if it looks like a button.') },
      { label: 'It turns a setting on or off right away', result: r('switch', 'A switch applies the change immediately, with no Save step.') },
      { label: 'It stays pressed or unpressed, like Bold or Mute', result: r('button', 'A toggle button announces “pressed” or “not pressed”.', 'toggle') },
      { label: 'It opens a list of related actions', result: r('menu', 'A menu button groups several actions behind one control.') },
      { label: 'It does one action, like Save or Delete', result: r('button', 'Buttons perform actions on the current page.') },
    ],
  },
  choose: {
    ask: 'How many options can people pick?',
    options: [
      { label: 'Any number, or just yes to one statement', result: r('checkbox', 'Checkboxes allow zero, one or many choices.') },
      { label: 'Exactly one', next: 'one' },
      { label: 'One on/off setting that applies immediately', result: r('switch', 'Use a switch when there’s no Save button.') },
    ],
  },
  one: {
    ask: 'How long is the list of options?',
    options: [
      { label: 'About 5 or fewer', result: r('radio-group', 'Short lists are fastest when every option is visible.') },
      { label: 'More than 5, easy to scan', result: r('select', 'A native select keeps longer lists compact and accessible.', 'native') },
      { label: 'Long, and people know what to type', hint: 'Like countries or airports', result: r('combobox', 'Typing to filter is faster than scrolling a long list.') },
    ],
  },
  enter: {
    ask: 'What kind of information?',
    options: [
      { label: 'A short answer on one line', hint: 'Name, email, postcode', result: r('text-input', 'A labelled text input with a hint and clear errors.') },
      { label: 'A longer answer', hint: 'Comments, descriptions', result: r('textarea', 'A textarea with the length limit stated up front.') },
      { label: 'A date', result: r('date-picker', 'Typing must always work; the calendar is optional.') },
      { label: 'A number where a rough value is fine', hint: 'Volume, temperature', result: r('slider', 'A slider with the value shown as text.') },
      { label: 'An exact number', result: r('text-input', 'Use a text input with inputmode="numeric" rather than a slider.') },
      { label: 'A file', result: r('file-upload', 'A native file input with a visible Choose files button.') },
    ],
  },
  tell: {
    ask: 'What kind of message?',
    options: [
      { label: 'People must decide something before continuing', result: r('dialog', 'A dialog interrupts the page and holds focus until it’s answered.') },
      { label: 'A quick confirmation, like “Saved”', result: r('toast', 'A toast confirms without interrupting.', 'success') },
      { label: 'Something important that stays on the page', result: r('alert', 'An alert stays visible and is announced if it appears later.') },
      { label: 'Errors after submitting a form', result: r('error-summary', 'An error summary lists every problem with links to the fields.') },
      { label: 'Something is loading', result: r('progress', 'Show progress and announce when it’s done.') },
      { label: 'A short hint about a control', result: r('tooltip', 'Tooltips are for short, non-essential hints on hover and focus.') },
    ],
  },
  organize: {
    ask: 'How should the content be organized?',
    options: [
      { label: 'Switch between views, one at a time', result: r('tabs', 'Tabs show one panel at a time under a shared heading.') },
      { label: 'Show and hide sections, several can be open', result: r('accordion', 'An accordion lets people expand only what they need.') },
      { label: 'Data to compare in rows and columns', result: r('table', 'A table with headers lets screen readers announce the row and column.') },
      { label: 'Extra detail people may not need', result: r('accordion', 'A native details element is the simplest show/hide.', 'details') },
    ],
  },
  wayfind: {
    ask: 'What do people need help with?',
    options: [
      { label: 'Reaching the main sections of the site', result: r('site-navigation', 'Site navigation is a labelled nav with links and disclosures.') },
      { label: 'Knowing where they are and going back up', result: r('breadcrumbs', 'Breadcrumbs show the path from the home page.') },
      { label: 'Moving through a long list of results', result: r('pagination', 'Pagination splits results into numbered pages.') },
      { label: 'Skipping repeated content with the keyboard', result: r('skip-link', 'A skip link is the first thing keyboard users reach.') },
    ],
  },
};

export function ChoosePage({ usedBy }: { usedBy?: React.ReactNode } = {}) {
  usePageTitle('Which component should I use?');
  const [path, setPath] = useState<{ node: string; option: Option }[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (path.length) headingRef.current?.focus();
  }, [path]);

  const last = path[path.length - 1];
  const result = last?.option.result;
  const nodeId = last ? last.option.next ?? 'start' : 'start';
  const node = TREE[nodeId];
  const component = result && findComponent(result.slug);

  return (
    <article className="max-w-3xl">
      <PageHeader eyebrow="Tools" title="Which component should I use?" meta={usedBy}>
        <p>Answer a question or two to find the right component, and why. Many accessibility problems start with picking the wrong one.</p>
      </PageHeader>

      <div className="surface overflow-hidden">
        {path.length > 0 && (
          <ol aria-label="Your answers" className="flex flex-wrap gap-2 border-b border-gray-100 px-5 py-3 text-xs dark:border-gray-800">
            {path.map((p, i) => (
              <li key={i} className="chip bg-gray-100 font-normal text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                {p.option.label}
              </li>
            ))}
          </ol>
        )}

        {result && component ? (
          <div className="space-y-4 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">Recommendation</p>
            <h2 ref={headingRef} tabIndex={-1} className="rounded text-2xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
              Use: {component.name}
              {result.variant && component.variants?.find((v) => v.id === result.variant) && (
                <span className="text-lg font-normal text-muted"> ({component.variants.find((v) => v.id === result.variant)!.label})</span>
              )}
            </h2>
            <p className="leading-7">{result.why}</p>
            <p className="text-sm text-muted">{component.summary}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/components/${component.slug}${result.variant ? `?variant=${result.variant}` : ''}`} className="link">
                Go to {component.name}
              </Link>
              <Button size="sm" weight="light" color="gray" onClick={() => setPath((p) => p.slice(0, -1))}>
                Back
              </Button>
              <Button size="sm" weight="clear" color="gray" onClick={() => setPath([])}>
                Start again
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-5">
            <h2 ref={headingRef} tabIndex={-1} className="rounded text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
              {node.ask}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {node.options.map((o) => (
                <li key={o.label}>
                  <button
                    type="button"
                    onClick={() => setPath((p) => [...p, { node: nodeId, option: o }])}
                    className="flex h-full w-full flex-col items-start rounded-xl px-4 py-3 text-left ring-1 ring-gray-300 hover:bg-primary-50 hover:ring-primary-600 focus-ring dark:ring-gray-600 dark:hover:bg-primary-900/30 dark:hover:ring-primary-300"
                  >
                    <span className="font-semibold">{o.label}</span>
                    {o.hint && <span className="text-sm text-muted">{o.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
            {path.length > 0 && (
              <Button size="sm" weight="clear" color="gray" onClick={() => setPath((p) => p.slice(0, -1))}>
                Back
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
