import { useId, useRef } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const SECTIONS = ['Getting there', 'The route', 'Facilities'];

/** In-page links. This site uses a hash router, so the demo moves focus itself instead of using #fragments. */
function Demo() {
  const id = useId();
  const refs = useRef<(HTMLHeadingElement | null)[]>([]);
  const jump = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    const h = refs.current[i];
    h?.scrollIntoView({ block: 'nearest' });
    h?.focus();
  };
  return (
    <div className="grid gap-6 sm:grid-cols-[12rem_1fr]">
      <nav aria-labelledby={`${id}-toc`}>
        <h4 id={`${id}-toc`} className="text-sm font-semibold">
          Contents
        </h4>
        <ol className="mt-2 space-y-1 text-sm">
          {SECTIONS.map((s, i) => (
            <li key={s}>
              <a href={`#${id}-s${i}`} onClick={(e) => jump(e, i)} className="link inline-block py-1">
                {s}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="space-y-4">
        {SECTIONS.map((s, i) => (
          <section key={s} aria-labelledby={`${id}-s${i}`}>
            {/* h4 because the example sits under the page's h3 */}
            <h4 id={`${id}-s${i}`} ref={(el) => (refs.current[i] = el)} tabIndex={-1} className="rounded font-semibold focus-ring">
              {s}
            </h4>
            <p className="text-sm text-muted">A short paragraph about {s.toLowerCase()} on the Riverside loop.</p>
          </section>
        ))}
      </div>
    </div>
  );
}


export const tableOfContents: ComponentSpec = {
  slug: 'table-of-contents',
  name: 'Table of contents',
  category: 'Navigation',
  summary: 'A table of contents lists the sections of a long page as links, so people can see what’s there and jump straight to the part they need.',
  semantics: '<nav> with a heading and an <ol> of in-page links',
  whenToUse: [
    'Use it on long pages with three or more sections, like guides or policies.',
    'Use it when people come for one part of the page, not the whole thing.',
    'Don’t use it on short pages; headings alone are enough.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through the links.' },
    { keys: ['Enter'], action: 'Jumps to the section and moves focus to its heading.' },
  ],
  aria: [
    { attr: '<nav aria-labelledby>', where: 'wrapper', usage: 'Names it “Contents” so it’s a distinct landmark.' },
    { attr: 'href="#id"', where: 'each link', usage: 'Points at the section heading’s id.' },
    { attr: 'tabindex="-1"', where: 'section headings', usage: 'Lets the heading take focus, so the next Tab continues from there in every browser.' },
    { attr: 'aria-current="true"', where: 'current link (optional)', usage: 'When a sticky contents list highlights the section in view.' },
  ],
  focus: ['After a jump, focus is on the section heading, not left behind in the contents list.', 'A sticky header must not cover the heading people jumped to; use scroll-margin-top.'],
  screenReader: ['“Contents, navigation. List, 3 items. 1. Getting there, link.”', 'After a jump: “Getting there, heading level 2.”'],
  dos: ['Match link text exactly to the section headings.', 'Place it after the h1 and intro, before the first section.', 'Use an ordered list when the order matters.'],
  donts: ['Don’t use buttons with scroll scripts in place of links.', 'Don’t hide it behind a hover menu.', 'Don’t include every sub-heading; two levels at most.'],
  wcag: [WCAG.bypass, WCAG.linkPurpose, WCAG.focusOrder, WCAG.headings, WCAG.focusNotObscured],
  testing: [
    'Activate each link with Enter and press Tab: focus should continue from the section, not the list.',
    'Confirm link text matches the headings.',
    'With a sticky header, confirm the heading isn’t hidden after a jump.',
  ],
  Demo,
};
