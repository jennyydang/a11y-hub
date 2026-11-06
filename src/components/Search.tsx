import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { components } from '../data/components';
import { foundations } from '../data/foundations';
import { roles } from '../data/roles';
import { tools, toolPath } from '../data/tools';
import { cx } from '../ui';
import { examples } from '../examples';
import { basicsTasks } from '../data/basics';
import { fixes } from '../data/fixes';
import { slugify } from './Section';

interface Entry {
  title: string;
  kind: string;
  to: string;
  fields: { label: string; text: string }[];
}

function buildIndex(): Entry[] {
  const entries: Entry[] = [];
  components.forEach((c) =>
    entries.push({
      title: c.name,
      kind: `Component · ${c.category}`,
      to: `/components/${c.slug}`,
      fields: [
        { label: 'Summary', text: c.summary },
        { label: 'Built on', text: c.semantics },
        ...c.aria.map((a) => ({ label: 'ARIA', text: `${a.attr} on ${a.where}: ${a.usage}` })),
        ...c.keyboard.map((k) => ({ label: 'Keyboard', text: `${k.keys.join(' / ')}: ${k.action}` })),
        ...(c.variants ?? []).map((v) => ({ label: 'Variation', text: `${v.label}: ${v.description}` })),
        ...c.whenToUse.map((t) => ({ label: 'Usage', text: t })),
        ...c.wcag.map((w) => ({ label: 'WCAG', text: `${w.id} ${w.name}` })),
      ],
    }),
  );
  foundations.forEach((f) =>
    entries.push({
      title: f.name,
      kind: 'Foundation',
      to: `/foundations/${f.slug}`,
      fields: [{ label: 'Summary', text: f.summary }, ...f.sections.map((s) => ({ label: s.heading, text: [s.heading, ...s.body, ...(s.bullets ?? [])].join(' ') }))],
    }),
  );
  roles.forEach((r) =>
    entries.push({
      title: `${r.name} guide`,
      kind: 'Role guide',
      to: `/roles/${r.id}`,
      fields: [{ label: 'Summary', text: r.summary }, ...r.owns.map((o) => ({ label: 'Owns', text: o })), ...r.checklist.map((c) => ({ label: 'Checklist', text: c }))],
    }),
  );
  entries.push(
    ...tools.map((t) => ({ title: t.name, kind: 'Tool', to: toolPath(t.id), fields: [{ label: 'Tool', text: t.description }] })),
    { title: 'Team progress', kind: 'Page', to: '/progress', fields: [{ label: 'Page', text: 'Dashboard of worksheet progress for every role, export and import all worksheets' }] },
    { title: 'Page examples', kind: 'Page', to: '/examples', fields: [{ label: 'Page', text: 'Annotated example pages: content page, sign-up form, search results, dashboard. Layout, placement, wireframe' }] },
    ...examples.map((e) => ({ title: `${e.name} example`, kind: 'Page example', to: `/examples/${e.id}`, fields: [{ label: 'Example', text: e.summary }, ...e.notes.map((n) => ({ label: 'Note', text: `${n.title}. ${n.why}` }))] })),
    {
      title: 'Accessibility basics',
      kind: 'Page',
      to: '/basics',
      fields: [{ label: 'Page', text: 'Plain-language basics for anyone: before you publish checklist, social media, email, PDF, documents, slides, video captions, hashtags, emoji, alt text' }],
    },
    ...basicsTasks.map((t) => ({ title: t.title, kind: 'Basics', to: `/basics#${t.id}`, fields: [{ label: 'Basics', text: `${t.why} ${t.dos.join(' ')}` }] })),
    ...fixes.map((f) => ({ title: f.symptom, kind: 'Problem and fix', to: `/fixes#${slugify(f.symptom)}`, fields: [{ label: 'Fix', text: `${f.cause} ${f.fix}` }] })),
    { title: 'What’s new', kind: 'Page', to: '/changelog', fields: [{ label: 'Page', text: 'Changelog, recent updates, new pages and tools' }] },
    { title: 'Agency playbook', kind: 'Page', to: '/agency', fields: [{ label: 'Page', text: 'Client redesign, agency deliverables, conformance summary, testing summary, issue log, handoff' }] },
    { title: 'Glossary', kind: 'Page', to: '/glossary', fields: [{ label: 'Page', text: 'Definitions: accessible name, landmark, live region, focus trap, alt text, ARIA, WCAG' }] },
    { title: 'Testing checklist', kind: 'Page', to: '/checklist', fields: [{ label: 'Page', text: 'Every testing checklist in one place' }] },
  );
  return entries;
}

function search(index: Entry[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const results: { entry: Entry; score: number; snippet?: { label: string; text: string } }[] = [];
  for (const entry of index) {
    const title = entry.title.toLowerCase();
    const all = `${title} ${entry.fields.map((f) => f.text).join(' ')}`.toLowerCase();
    if (!terms.every((t) => all.includes(t))) continue;
    let score = 0;
    if (title.startsWith(terms[0])) score += 10;
    if (terms.every((t) => title.includes(t))) score += 6;
    if (entry.kind.startsWith('Component')) score += 1;
    const snippet = terms.every((t) => title.includes(t)) ? undefined : entry.fields.find((f) => terms.some((t) => f.text.toLowerCase().includes(t)));
    results.push({ entry, score, snippet });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 12);
}

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query.split(/\s+/).filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${terms.join('|')})`, 'ig'));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <mark key={i} className="rounded-sm bg-amber-200 text-inherit dark:bg-amber-500/40">
            {p}
          </mark>
        ) : (
          p
        ),
      )}
    </>
  );
}

export function Search() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const index = useMemo(buildIndex, []);
  const results = useMemo(() => search(index, query), [index, query]);
  const navigate = useNavigate();
  const id = useId();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  const open = () => {
    setQuery('');
    setActive(0);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  };
  const close = () => {
    dialogRef.current?.close();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.matches('input, textarea, select') || e.target.isContentEditable);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        if (dialogRef.current?.open) return;
        e.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setActive(0), [query]);

  const go = (to: string) => {
    close();
    navigate(to);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active].entry.to);
    }
  };

  useEffect(() => {
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, id]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 focus-ring sm:min-w-[11rem] dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-800"
        aria-keyshortcuts="Control+K Meta+K /"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
        <span>Search</span>
        <kbd className="kbd ml-auto hidden sm:inline-flex" aria-hidden="true">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        onClose={() => triggerRef.current?.focus()}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="mt-[10vh] w-[min(40rem,calc(100vw-2rem))] rounded-2xl bg-white p-0 text-gray-900 shadow-2xl ring-1 ring-black/10 backdrop:bg-gray-900/50 dark:bg-gray-900 dark:text-gray-50 dark:ring-white/10"
      >
        <h2 id={`${id}-title`} className="sr-only">
          Search A11y Hub
        </h2>
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-700">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-none text-gray-500 dark:text-gray-400">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
          <label htmlFor={`${id}-input`} className="sr-only">
            Search components, foundations and guides
          </label>
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={results.length ? `${id}-opt-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Search, e.g. aria-pressed, focus trap, alt text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          <button type="button" onClick={close} className="rounded-md px-2 py-1 text-sm text-gray-700 focus-ring dark:text-gray-200">
            <kbd className="kbd" aria-hidden="true">
              Esc
            </kbd>
            <span className="sr-only">Close search</span>
          </button>
        </div>
        <ul id={`${id}-list`} role="listbox" aria-label="Results" className="max-h-[60vh] overflow-y-auto p-2">
          {results.map((r, i) => (
            <li
              key={r.entry.to + r.entry.title}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => go(r.entry.to)}
              className={cx('cursor-pointer rounded-lg px-3 py-2', i === active && 'bg-primary-50 ring-1 ring-primary-600 dark:bg-primary-900/40 dark:ring-primary-300')}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">
                  <Highlight text={r.entry.title} query={query} />
                </span>
                <span className="flex-none text-xs text-muted">{r.entry.kind}</span>
              </span>
              {r.snippet && (
                <span className="mt-0.5 block truncate text-sm text-muted">
                  {r.snippet.label}: <Highlight text={r.snippet.text} query={query} />
                </span>
              )}
            </li>
          ))}
        </ul>
        {query && !results.length && <p className="px-5 pb-5 pt-1 text-sm text-muted">No results for “{query}”. Try a component name, an ARIA attribute or a key.</p>}
        <p role="status" className="sr-only">
          {query ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : ''}
        </p>
        <p className="border-t border-gray-200 px-4 py-2 text-xs text-muted dark:border-gray-700">
          <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> to move, <kbd className="kbd">Enter</kbd> to open, <kbd className="kbd">Esc</kbd> to close
        </p>
      </dialog>
    </>
  );
}
