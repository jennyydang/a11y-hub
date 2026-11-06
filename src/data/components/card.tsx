import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';

const art = (sky: string, ground: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120"><rect width="320" height="120" fill="${sky}"/><path d="M0 120 90 45l50 40 40-28 140 63Z" fill="${ground}"/></svg>`);

const GUIDES = [
  { title: 'Spring trail guide', text: 'Twelve walks under two hours, all step-free.', meta: '8 min read', img: art('#bae6fd', '#15803d') },
  { title: 'Coastal cycling', text: 'Flat routes with places to stop every few miles.', meta: '5 min read', img: art('#fed7aa', '#d97706') },
];

const shell = 'overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700';

/** Whole card clickable, but only the heading is the link. A pseudo-element stretches its hit area. */
function LinkCardDemo() {
  return (
    <ul className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      {GUIDES.map((g) => (
        <li key={g.title} className={`relative flex flex-col ${shell} focus-within:ring-2 focus-within:ring-primary-600 hover:shadow-md dark:focus-within:ring-primary-300`}>
          <img src={g.img} alt="" className="h-28 w-full object-cover" />
          <div className="flex flex-1 flex-col gap-1 p-4">
            {/* h4 because the example sits under the page's h3 */}
            <h4 className="font-semibold">
              <a href="#" onClick={(e) => e.preventDefault()} className="outline-none after:absolute after:inset-0 hover:underline">
                {g.title}
              </a>
            </h4>
            <p className="text-sm text-muted">{g.text}</p>
            <p className="mt-auto pt-2 text-xs text-muted">{g.meta}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Several actions: no stretched link, each action is its own control. */
function ActionsDemo() {
  return (
    <ul className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      {GUIDES.map((g) => (
        <li key={g.title} className={`flex flex-col ${shell}`}>
          <img src={g.img} alt="" className="h-28 w-full object-cover" />
          <div className="flex flex-1 flex-col gap-1 p-4">
            <h4 className="font-semibold">{g.title}</h4>
            <p className="text-sm text-muted">{g.text}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-3">
              <Button size="sm" className="btn-bold-primary">
                Read<span className="sr-only"> {g.title}</span>
              </Button>
              <Button size="sm" weight="light" color="gray">
                Save<span className="sr-only"> {g.title}</span>
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export const cardVariants: Variant[] = [
  {
    id: 'link',
    label: 'Linked card',
    description: 'The whole card is clickable, but only the heading is a link. Screen readers hear a short link name, not the whole card.',
    Demo: LinkCardDemo,
    html: `<ul class="cards">
  <li class="card">
    <img src="spring.jpg" alt="">
    <h3><a href="/guides/spring" class="card-link">Spring trail guide</a></h3>
    <p>Twelve walks under two hours, all step-free.</p>
    <p>8 min read</p>
  </li>
</ul>

<style>
  .card { position: relative; }
  /* Stretch the link's click area over the whole card */
  .card-link::after { content: ""; position: absolute; inset: 0; }
  .card:focus-within { outline: 2px solid; }
</style>`,
    code: `<li className="relative rounded-xl ring-1 focus-within:ring-2">
  <img src={guide.img} alt="" />
  <h3>
    <a href={guide.url} className="after:absolute after:inset-0">{guide.title}</a>
  </h3>
  <p>{guide.summary}</p>
</li>`,
  },
  {
    id: 'actions',
    label: 'With actions',
    description: 'Cards with more than one action have no stretched link. Each button names the card in hidden text, so “Save” isn’t ambiguous.',
    Demo: ActionsDemo,
    html: `<li class="card">
  <img src="spring.jpg" alt="">
  <h3>Spring trail guide</h3>
  <p>Twelve walks under two hours, all step-free.</p>
  <a href="/guides/spring" class="button">Read<span class="sr-only"> Spring trail guide</span></a>
  <button type="button">Save<span class="sr-only"> Spring trail guide</span></button>
</li>`,
    code: `<li className="rounded-xl ring-1">
  <img src={guide.img} alt="" />
  <h3>{guide.title}</h3>
  <p>{guide.summary}</p>
  <Button>Read<span className="sr-only"> {guide.title}</span></Button>
  <Button weight="light">Save<span className="sr-only"> {guide.title}</span></Button>
</li>`,
  },
];

export const card: ComponentSpec = {
  slug: 'card',
  name: 'Card',
  category: 'Content',
  summary: 'A card groups a heading, a short summary and usually an image into one unit that links to more detail. Cards usually sit in a list or grid.',
  semantics: '<li> in a list, with a heading and one link (or separate buttons)',
  whenToUse: [
    'Use cards for a set of similar items people browse, like articles, products or projects.',
    'Use a plain list when items are text only; cards add visual weight for little gain.',
    'Use a table when people compare details across items.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Linked card: one stop per card (the heading link). With actions: one stop per button.' },
    { keys: ['Enter'], action: 'Follows the link or activates the focused button.' },
  ],
  aria: [
    { attr: '<ul> / <li>', where: 'card set', usage: 'Screen readers announce “list, 6 items”, so people know how many there are.' },
    { attr: 'Heading', where: 'card title', usage: 'Lets people jump between cards by heading.' },
    { attr: 'alt=""', where: 'card image', usage: 'Usually decorative; the heading says what it is.' },
    { attr: '::after stretched link', where: 'heading link', usage: 'Makes the whole card clickable without wrapping it in <a>.' },
    { attr: 'Visually hidden text', where: 'repeated buttons', usage: 'Makes each “Save” or “Read” unique: “Save Spring trail guide”.' },
  ],
  focus: [
    'Show focus on the whole card with focus-within, since the link text alone is small.',
    'Don’t wrap the whole card in a link; everything inside gets read as one long link name.',
  ],
  screenReader: ['Linked card: “Spring trail guide, link, heading level 3”.', 'With actions: “Save Spring trail guide, button”.'],
  dos: ['Put the heading first in the HTML, even if the image is shown first.', 'Keep summaries short and the same length across cards.', 'Make the hover and focus states the same.'],
  donts: ['Don’t wrap a whole card in an <a>.', 'Don’t use “Read more” as the only link text.', 'Don’t put a stretched link and other buttons in the same card.'],
  wcag: [WCAG.infoRel, WCAG.linkPurpose, WCAG.nonText, WCAG.focusVisible, WCAG.sequence, WCAG.targetSize],
  testing: [
    'Tab through the cards and confirm one stop per card for linked cards.',
    'With a screen reader, list the links and confirm each is the card title.',
    'Navigate by headings and confirm every card is listed.',
    'Click anywhere on a linked card and confirm it opens.',
    'Zoom to 400% and confirm cards stack into one column.',
  ],
  Demo: LinkCardDemo,
  code: cardVariants[0].code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI doesn’t ship a card. This is a list item with Fluid’s surface colors and ring utilities.', 'The stretched link uses Tailwind’s after: variant, so no extra wrapper elements are needed.'],
  },
};
