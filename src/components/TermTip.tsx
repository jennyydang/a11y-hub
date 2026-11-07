import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from './Section';
import { TERMS, type Term } from '../data/glossary';

/**
 * A "toggletip" for jargon: the term is a button; pressing, hovering or focusing it shows the
 * plain-language meaning. Escape or a click elsewhere closes it, and the tip stays open while
 * the pointer is over it (WCAG 1.4.13). The meaning is announced through a status region.
 */
export function TermTip({ term, children }: { term: Term; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <span ref={root} className="relative inline" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        // Hover already opens it, so a click keeps it open rather than toggling it shut. Escape or clicking elsewhere closes it.
        onClick={show}
        onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && hide()}
        className="cursor-help rounded-sm underline decoration-primary-600 decoration-dotted decoration-2 underline-offset-4 focus-ring dark:decoration-primary-300"
      >
        {children}
      </button>
      <span role="status" className="contents">
        {open && (
          <span
            id={id}
            className="pop-in absolute left-0 top-full z-50 mt-1 block w-72 rounded-lg bg-gray-900 p-3 text-left text-sm font-normal normal-case leading-6 tracking-normal text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
          >
            <span className="font-semibold">{term.term}: </span>
            {term.plain}{' '}
            <Link to={`/glossary#${slugify(term.term)}`} className="underline underline-offset-2" onFocus={show} onBlur={hide}>
              More in the glossary
            </Link>
          </span>
        )}
      </span>
    </span>
  );
}

/** Jargon worth explaining wherever it appears. Generic words like "label" or "focus" are left alone. */
const TIPPED = [
  'Accessible name',
  'Accessible description',
  'ARIA',
  'Assistive technology',
  'Focus indicator',
  'Focus order',
  'Focus trap',
  'Keyboard trap',
  'Landmark',
  'Live region',
  'Reduced motion',
  'Reflow',
  'Roving tabindex',
  'Screen reader',
  'Semantic HTML',
  'Target size',
  'Visually hidden',
  'WCAG',
];
const tipped = TERMS.filter((t) => TIPPED.includes(t.term)).sort((a, b) => b.term.length - a.term.length);
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp(`(?<![\\w-])(${tipped.map((t) => esc(t.term)).join('|')})s?(?![\\w-])`, 'gi');
/** Acronyms like ARIA only count in capitals, so "aria" in prose or code isn't tipped. */
const findTerm = (word: string) =>
  tipped.find((t) => (t.term === t.term.toUpperCase() ? word === t.term : word.toLowerCase() === t.term.toLowerCase()));

/** Wrap the first mention of each jargon term in a string with a TermTip. */
export function withTerms(text: string): ReactNode {
  const seen = new Set<string>();
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const word = m[0];
    const term = findTerm(m[1]);
    if (!term || seen.has(term.term)) continue;
    seen.add(term.term);
    out.push(text.slice(last, m.index), <TermTip key={m.index} term={term}>{word}</TermTip>);
    last = (m.index ?? 0) + word.length;
  }
  if (!out.length) return text;
  out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}
