import { useId, useState } from 'react';
import { WCAG } from '../data/wcag';
import type { Pattern } from './types';

const swatch = (c: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect width="120" height="80" fill="#f1f5f9"/><path d="M20 58c12-18 36-27 66-24 15 2 24 9 30 24Z" fill="${c}"/><rect x="20" y="58" width="96" height="6" rx="3" fill="#1f2937"/></svg>`);

const PRODUCTS = [
  { name: 'Ridgeline trail runner', color: 'Teal', price: 120, was: 150, rating: 4.5, reviews: 212, stock: true, img: swatch('#0f766e') },
  { name: 'Summit hiker', color: 'Brown', price: 160, rating: 4.8, reviews: 98, stock: true, img: swatch('#78350f') },
  { name: 'Coastal walker', color: 'Blue', price: 95, rating: 4.1, reviews: 57, stock: false, img: swatch('#1d4ed8') },
  { name: 'Canyon sandal', color: 'Brown', price: 70, was: 85, rating: 3.9, reviews: 34, stock: true, img: swatch('#a16207') },
  { name: 'Fell racer', color: 'Teal', price: 140, rating: 4.6, reviews: 143, stock: true, img: swatch('#115e59') },
];
const COLORS = ['Teal', 'Brown', 'Blue'];
const money = (n: number) => `$${n}`;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span aria-hidden="true" className="tracking-tight text-amber-700 dark:text-amber-300">
        {'★'.repeat(Math.round(rating))}
        {'☆'.repeat(5 - Math.round(rating))}
      </span>
      <span className="sr-only">Rated {rating} out of 5</span>
    </span>
  );
}

function Demo() {
  const id = useId();
  const [colors, setColors] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('popular');
  const shown = PRODUCTS.filter((p) => (!colors.length || colors.includes(p.color)) && (!inStock || p.stock)).sort((a, b) =>
    sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : b.reviews - a.reviews,
  );
  const toggle = (c: string) => setColors((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));

  return (
    <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
      <section aria-labelledby={`${id}-fh`} className="space-y-4">
        <h3 id={`${id}-fh`} className="font-semibold">
          Filter
        </h3>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Color</legend>
          {COLORS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-primary-700" checked={colors.includes(c)} onChange={() => toggle(c)} />
              {c}
            </label>
          ))}
        </fieldset>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-primary-700" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock only
        </label>
        {(colors.length > 0 || inStock) && (
          <button
            type="button"
            onClick={() => {
              setColors([]);
              setInStock(false);
            }}
            className="rounded text-sm font-medium text-primary-700 underline focus-ring dark:text-primary-300"
          >
            Clear filters
          </button>
        )}
      </section>

      <section aria-labelledby={`${id}-rh`} className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id={`${id}-rh`} className="font-semibold">
              Trail shoes
            </h3>
            <p role="status" className="text-sm text-muted">
              {shown.length} {shown.length === 1 ? 'product' : 'products'}
              {colors.length || inStock ? ', filtered' : ''}
            </p>
          </div>
          <div className="space-y-1">
            <label htmlFor={`${id}-sort`} className="block text-sm font-semibold">
              Sort by
            </label>
            <select id={`${id}-sort`} value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-gray-500 bg-white px-2 py-1.5 text-sm dark:bg-gray-900">
              <option value="popular">Most popular</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="surface p-4 text-sm">No shoes match these filters. Try removing a color.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {shown.map((p) => (
              <li key={p.name} className="surface relative flex flex-col gap-1 p-3 focus-within:ring-2 focus-within:ring-primary-600">
                <img src={p.img} alt="" className="mb-1 block w-full rounded" />
                <h4 className="font-semibold">
                  <a href="#" onClick={(e) => e.preventDefault()} className="rounded after:absolute after:inset-0 hover:underline focus:outline-none">
                    {p.name}
                  </a>
                </h4>
                <p className="text-sm text-muted">{p.color}</p>
                <p className="text-sm">
                  {p.was ? (
                    <>
                      <span className="font-semibold">
                        <span className="sr-only">Sale price </span>
                        {money(p.price)}
                      </span>{' '}
                      <s className="text-muted">
                        <span className="sr-only">was </span>
                        {money(p.was)}
                      </s>
                    </>
                  ) : (
                    <span className="font-semibold">{money(p.price)}</span>
                  )}
                </p>
                <p className="flex flex-wrap items-center gap-1">
                  <Stars rating={p.rating} />
                  <span className="text-sm text-muted">({p.reviews} reviews)</span>
                </p>
                {!p.stock && <p className="text-sm font-semibold">Out of stock</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export const productListing: Pattern = {
  slug: 'product-listing',
  name: 'Product listing with filters',
  category: 'Commerce',
  summary:
    'A category page section: filters, a sort control, a live count of results and a grid of product cards. Filtering updates the results without moving focus, and each card has one link.',
  uses: ['checkbox', 'fieldset', 'select', 'card', 'pagination', 'empty-state'],
  whenToUse: [
    'Category and search results pages where people narrow down many products.',
    'When filters apply instantly. If they need an Apply button, see the notes on submitting filters.',
  ],
  structure: [
    { part: 'Page heading', element: '<h1>', notes: 'The category name, like “Trail shoes”.' },
    { part: 'Filters', element: '<section aria-labelledby> with <h2>', notes: 'Each filter group is a <fieldset> with a <legend>. On mobile, filters can sit behind a “Filter” disclosure button.' },
    { part: 'Results count', element: 'role="status"', notes: 'Announces the new count after each change, like “3 products, filtered”.' },
    { part: 'Sort', element: '<label> + <select>', notes: 'A native select. Changing it re-orders the results without moving focus.' },
    { part: 'Results', element: '<ul> of <li>', notes: 'Screen readers announce the number of products.' },
    { part: 'Product card', element: '<li> with <h3><a>', notes: 'The product name is the only link. The whole card is clickable through a stretched link, so there’s one tab stop per card.' },
    { part: 'Empty result', element: '<p>', notes: 'Says nothing matches and how to fix it.' },
    { part: 'Pagination', element: '<nav aria-label="Pagination">', notes: 'Or a “Load more” button that moves focus to the first new product.' },
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through filters, Clear filters, Sort, then one link per product card.' },
    { keys: ['Space'], action: 'Checks or unchecks a filter. Results update; focus stays on the checkbox.' },
    { keys: ['↑', '↓'], action: 'In the Sort select, changes the order.' },
    { keys: ['Enter'], action: 'On a product name, opens the product.' },
  ],
  aria: [
    { attr: '<fieldset> + <legend>', where: 'each filter group', usage: 'Gives every checkbox its group name, like “Color, Teal, checkbox”.' },
    { attr: 'role="status"', where: 'results count', usage: 'Announces the count after filtering without moving focus.' },
    { attr: 'aria-labelledby', where: 'filter and results sections', usage: 'Names each section from its heading.' },
    { attr: 'Visually hidden text', where: 'prices and ratings', usage: '“Sale price”, “was” and “Rated 4.5 out of 5”, because strikethrough and stars aren’t read.' },
    { attr: 'aria-hidden="true"', where: 'star characters', usage: 'Stops “black star, black star…” being read.' },
    { attr: 'alt=""', where: 'card images', usage: 'Decorative here, because the product name follows. Use real alt text if the image shows something the text doesn’t.' },
  ],
  content: [
    { label: 'Filter group names', target: '<legend>', guidance: 'One word or short phrase for each group.', good: 'Color' },
    { label: 'Results count', target: 'role="status"', guidance: 'Number and noun, and say when filters are on.', good: '3 products, filtered' },
    { label: 'Price wording', target: 'Visually hidden text', guidance: 'Words for what strikethrough and color show.', good: 'Sale price $120, was $150' },
    { label: 'Rating text', target: 'Visually hidden text', guidance: 'The number, out of what, and the review count.', good: 'Rated 4.5 out of 5 (212 reviews)' },
    { label: 'No results message', target: 'Paragraph', guidance: 'Say nothing matched and what to try.', good: 'No shoes match these filters. Try removing a color.' },
    { label: 'Sort options', target: '<option>', guidance: 'Say the direction in words.', good: 'Price: low to high' },
  ],
  design: [
    'Sale prices show the old price with strikethrough and a word like “Was”, not just red.',
    'Out of stock is written, not shown by fading the card.',
    'Cards show focus clearly when their link has focus, around the whole card.',
    'Filter checkboxes and labels are at least 24px tall.',
    'At 320px, filters collapse behind a “Filter” button above the results.',
    'Applied filters are visible, with a clear way to remove them.',
  ],
  screenReader: [
    '“Filter, heading level 3. Color, group. Teal, checkbox, not checked.”',
    'Press Space: “Checked.” Then “2 products, filtered.”',
    '“Sort by, Most popular, combo box.”',
    '“List, 2 items. Ridgeline trail runner, heading level 4, link.”',
    '“Sale price $120, was $150. Rated 4.5 out of 5, (212 reviews).”',
  ],
  mistakes: [
    'Making the image, name, price and a “View” button separate links to the same page, so every card has four tab stops.',
    'Wrapping the whole card in one <a>, so the link name is everything in the card read as one long string.',
    'Re-rendering the results and moving focus to the top of the page after each filter.',
    'No announcement after filtering, so screen reader users don’t know anything changed.',
    'Prices and ratings shown only visually: strikethrough, red text or star icons.',
    'Custom filter “chips” built from divs without checkbox semantics.',
  ],
  testing: [
    'Each filter is a real checkbox with its group name announced.',
    'Changing a filter or sort keeps focus where it is and announces the new count.',
    'Each product card has exactly one tab stop, and the link name is the product name.',
    'Sale price, old price, stock and rating make sense in a screen reader.',
    'Clear filters works and is announced.',
    'Empty results show a helpful message.',
    'At 320px and 400% zoom everything fits and filters are reachable.',
  ],
  wcag: [WCAG.infoRel, WCAG.sequence, WCAG.useOfColor, WCAG.keyboard, WCAG.focusOrder, WCAG.linkPurpose, WCAG.headings, WCAG.focusVisible, WCAG.onInput, WCAG.labels, WCAG.nameRoleValue, WCAG.statusMessages, WCAG.reflow],
  sources: [
    { title: 'Checkboxes component', url: 'https://design-system.service.gov.uk/components/checkboxes/', by: 'GOV.UK Design System', note: 'Grouping with fieldset and legend.' },
    { title: 'Understanding Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', by: 'W3C WAI', note: 'Announcing result counts without moving focus.' },
    { title: 'Cards', url: 'https://inclusive-components.design/cards/', by: 'Inclusive Components', note: 'One link per card, with the whole card clickable.' },
  ],
  roles: {
    content: ['Write filter names, the results count and the empty message.', 'Write the hidden words for sale prices and ratings.'],
    design: ['Show sale and stock without color alone.', 'Design card focus and the mobile filter layout.'],
    frontend: ['Use fieldsets, native checkboxes and select.', 'Update results without moving focus; announce the count.', 'One link per card.'],
    qa: ['Count tab stops per card.', 'Check filter and sort announcements.', 'Check prices and ratings in a screen reader.'],
  },
  Demo,
  html: `<h1>Trail shoes</h1>
<section aria-labelledby="filter-h">
  <h2 id="filter-h">Filter</h2>
  <fieldset>
    <legend>Color</legend>
    <label><input type="checkbox" name="color" value="teal"> Teal</label>
  </fieldset>
</section>
<section aria-labelledby="results-h">
  <h2 id="results-h">Results</h2>
  <p role="status">5 products</p>
  <label for="sort">Sort by</label>
  <select id="sort">…</select>
  <ul>
    <li class="card">
      <img src="ridgeline.jpg" alt="">
      <h3><a href="/ridgeline">Ridgeline trail runner</a></h3>
      <p><span class="visually-hidden">Sale price </span>$120 <s><span class="visually-hidden">was </span>$150</s></p>
      <p><span aria-hidden="true">★★★★☆</span><span class="visually-hidden">Rated 4.5 out of 5</span> (212 reviews)</p>
    </li>
  </ul>
</section>`,
};
