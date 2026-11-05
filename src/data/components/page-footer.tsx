import { useId } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const GROUPS = [
  { title: 'Explore', links: ['Trails', 'Guides', 'Community'] },
  { title: 'Help', links: ['Contact us', 'Accessibility statement', 'Cookies'] },
];

/** A site footer. On a real page it's a top-level <footer>, which becomes the contentinfo landmark. */
function Demo() {
  const id = useId();
  const go = (e: React.MouseEvent) => e.preventDefault();
  return (
    <footer className="rounded-xl bg-gray-100 px-4 py-5 ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-700">
      <nav aria-label="Trailmate footer example">
        <div className="grid gap-6 sm:grid-cols-2">
          {GROUPS.map((g) => (
            <div key={g.title}>
              {/* h4 because the example sits under the page's h3 */}
              <h4 id={`${id}-${g.title}`} className="text-sm font-semibold">
                {g.title}
              </h4>
              <ul aria-labelledby={`${id}-${g.title}`} className="mt-2 space-y-1">
                {g.links.map((l) => (
                  <li key={l}>
                    <a href="#" onClick={go} className="inline-block rounded py-1 text-sm underline underline-offset-2 hover:decoration-2 focus-ring">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <p className="mt-6 border-t border-gray-300 pt-4 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-200">© 2026 Trailmate. All content is available under an open licence.</p>
    </footer>
  );
}

const code = `<footer>
  <nav aria-label="Footer">
    <h2>Explore</h2>
    <ul>
      <li><a href="/trails">Trails</a></li>
      …
    </ul>
    <h2>Help</h2>
    <ul>
      <li><a href="/contact">Contact us</a></li>
      <li><a href="/accessibility">Accessibility statement</a></li>
      <li><a href="/cookies">Cookies</a></li>
    </ul>
  </nav>
  <p>© 2026 Trailmate</p>
</footer>`;

export const pageFooter: ComponentSpec = {
  slug: 'footer',
  name: 'Footer',
  category: 'Navigation',
  summary: 'The site footer holds secondary links, contact and legal information. It’s the same on every page and becomes the contentinfo landmark.',
  semantics: 'Top-level <footer> (contentinfo landmark) with a labelled <nav>',
  whenToUse: [
    'Use one footer on every page for links people need occasionally: contact, help, legal, accessibility statement.',
    'Don’t move main tasks into the footer; people rarely scroll there to start something.',
  ],
  keyboard: [{ keys: ['Tab'], action: 'Moves through footer links in visual order.' }],
  aria: [
    { attr: '<footer>', where: 'page top level', usage: 'Becomes the contentinfo landmark only when it isn’t inside main, article, aside, nav or section.' },
    { attr: 'aria-label="Footer"', where: '<nav>', usage: 'Tells it apart from the main navigation.' },
    { attr: 'Headings', where: 'link groups', usage: 'Group titles as headings so people can skim them with heading navigation.' },
  ],
  focus: ['Links in the footer follow the visual order, group by group.'],
  screenReader: ['“Content information landmark.”', '“Footer navigation. Help, heading level 2. List, 3 items.”'],
  dos: ['Put Contact and the accessibility statement in the same place on every page.', 'Use real, underlined links with enough contrast on the footer background.', 'Stack groups into one column on small screens.'],
  donts: ['Don’t use tiny or low-contrast text for legal links.', 'Don’t use infinite scroll that stops people ever reaching the footer.', 'Don’t repeat the whole header navigation.'],
  wcag: [WCAG.infoRel, WCAG.consistentNav, WCAG.consistentHelp, WCAG.contrast, WCAG.linkPurpose, WCAG.reflow],
  testing: [
    'List landmarks and confirm one contentinfo and a named footer navigation.',
    'Confirm help and contact links are in the same place on every page.',
    'Check text contrast against the footer background.',
  ],
  Demo,
  code,
  fluid: { source: 'Native HTML + Fluid styles', notes: ['Plain links grouped under headings in a labelled nav.'] },
};
