import { useId, useState } from 'react';
import { WCAG } from '../data/wcag';
import { cx } from '../ui';
import type { Pattern } from './types';

/** Simple drawn product shots, so the demo needs no image files. */
const shot = (bg: string, body: string, view: 'front' | 'side' | 'sole' | 'detail') => {
  const shapes = {
    front: `<path d="M40 70h120l-10 40H50Z" fill="${body}"/><rect x="60" y="55" width="80" height="18" rx="6" fill="${body}" opacity=".7"/>`,
    side: `<path d="M20 95c20-30 60-45 110-40 25 3 40 15 50 40Z" fill="${body}"/><rect x="20" y="95" width="160" height="10" rx="4" fill="#1f2937"/>`,
    sole: `<ellipse cx="100" cy="75" rx="70" ry="28" fill="#1f2937"/><path d="M45 75h110" stroke="${body}" stroke-width="6" stroke-dasharray="10 8"/>`,
    detail: `<circle cx="100" cy="70" r="40" fill="${body}"/><path d="M80 70h40M100 50v40" stroke="#fff" stroke-width="5"/>`,
  }[view];
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140"><rect width="200" height="140" fill="${bg}"/>${shapes}</svg>`);
};

const IMAGES = [
  { src: shot('#e0f2fe', '#0f766e', 'side'), alt: 'Trail runner in teal, side view, with a chunky black sole', label: 'Side view' },
  { src: shot('#fef3c7', '#0f766e', 'front'), alt: 'Front view showing the wide toe box and padded tongue', label: 'Front view' },
  { src: shot('#f3e8ff', '#0f766e', 'sole'), alt: 'Underside showing deep zigzag lugs for grip on mud', label: 'Sole' },
  { src: shot('#ecfccb', '#0f766e', 'detail'), alt: 'Close-up of the quick-lace toggle', label: 'Lace detail' },
];

function Demo() {
  const id = useId();
  const [i, setI] = useState(0);
  const [announce, setAnnounce] = useState('');
  const show = (n: number) => {
    const next = (n + IMAGES.length) % IMAGES.length;
    setI(next);
    setAnnounce(`Image ${next + 1} of ${IMAGES.length}: ${IMAGES[next].label}`);
  };
  const img = IMAGES[i];
  return (
    <section aria-labelledby={`${id}-h`} className="max-w-xl space-y-3">
      <h3 id={`${id}-h`} className="text-lg font-semibold">
        Ridgeline trail runner: photos
      </h3>
      <figure className="space-y-2">
        <div className="relative overflow-hidden rounded-lg ring-1 ring-gray-200 dark:ring-gray-700">
          <img src={img.src} alt={img.alt} className="block aspect-[10/7] w-full" />
          <div className="absolute inset-x-0 bottom-0 flex justify-between p-2">
            <button type="button" onClick={() => show(i - 1)} className="rounded-full bg-white/95 p-2 text-gray-900 shadow ring-1 ring-gray-400 focus-ring">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Previous image</span>
            </button>
            <button type="button" onClick={() => show(i + 1)} className="rounded-full bg-white/95 p-2 text-gray-900 shadow ring-1 ring-gray-400 focus-ring">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Next image</span>
            </button>
          </div>
        </div>
        <figcaption className="text-sm text-muted">
          {img.label} · Image {i + 1} of {IMAGES.length}
        </figcaption>
      </figure>
      <ul aria-label="Choose an image" className="flex flex-wrap gap-2">
        {IMAGES.map((im, n) => (
          <li key={im.label}>
            <button
              type="button"
              aria-pressed={n === i}
              onClick={() => show(n)}
              className={cx('block overflow-hidden rounded-md ring-offset-2 focus-ring dark:ring-offset-gray-900', n === i ? 'ring-[3px] ring-primary-700 dark:ring-primary-300' : 'ring-1 ring-gray-400')}
            >
              <img src={im.src} alt="" className="block h-12 w-16" />
              <span className="sr-only">{im.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <p role="status" className="sr-only">
        {announce}
      </p>
    </section>
  );
}

export const productGallery: Pattern = {
  slug: 'product-gallery',
  name: 'Product gallery',
  category: 'Commerce',
  summary:
    'A large product image with previous and next buttons and a row of thumbnails. Every image has its own alt text, and changing the image never moves focus or happens on its own.',
  uses: ['image', 'button', 'carousel'],
  whenToUse: [
    'On a product page with several photos of the same item.',
    'When people need to compare views, like front, side and detail.',
    'Not for promotional slides. Those are a carousel, which has extra rules for auto-rotation.',
  ],
  structure: [
    { part: 'Gallery section', element: '<section aria-labelledby>', notes: 'Optional heading, often visually hidden, like “Photos”. Groups the gallery for screen reader users.' },
    { part: 'Main image', element: '<figure> with <img alt>', notes: 'The alt text describes what this view shows, not the file name or “product image”.' },
    { part: 'Position', element: '<figcaption>', notes: 'Visible “Image 2 of 4” and the view’s name.' },
    { part: 'Previous and next', element: '<button>', notes: 'Icon buttons with names. They don’t cover the product.' },
    { part: 'Thumbnails', element: '<ul> of <button aria-pressed>', notes: 'Each thumbnail is a button named after its view. The thumbnail image itself has alt="" because the button already has a name.' },
    { part: 'Announcement', element: 'role="status"', notes: 'Says which image is showing after a change, without moving focus.' },
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to Previous, Next, then each thumbnail.' },
    { keys: ['Enter', 'Space'], action: 'Shows the previous or next image, or the chosen thumbnail’s image. Focus stays on the button.' },
  ],
  aria: [
    { attr: 'alt', where: 'main image', usage: 'Describes this view of the product. Changes with the image.' },
    { attr: 'alt=""', where: 'thumbnail images', usage: 'Empty, because the thumbnail button already has a name. Otherwise the alt would be read twice.' },
    { attr: 'aria-pressed', where: 'thumbnail buttons', usage: 'Marks the thumbnail that’s showing. aria-current="true" also works.' },
    { attr: 'Visually hidden text', where: 'icon and thumbnail buttons', usage: 'Names like “Next image” and “Side view”.' },
    { attr: 'role="status"', where: 'visually hidden message', usage: 'Announces “Image 2 of 4: Side view” after a change.' },
    { attr: 'aria-label', where: 'thumbnail list', usage: 'Names the list, like “Choose an image”.' },
  ],
  content: [
    { label: 'Alt text for each image', target: 'alt', guidance: 'What this view shows that the others don’t: color, angle, detail. Don’t start with “Image of”.', good: 'Underside showing deep zigzag lugs for grip on mud' },
    { label: 'Short view names', target: 'Visually hidden text', guidance: 'Two or three words for each thumbnail button and the caption.', good: 'Sole' },
    { label: 'Button names', target: 'Visually hidden text', guidance: 'Say what the button does.', good: 'Next image' },
    { label: 'Position message', target: 'role="status" (visually hidden)', guidance: 'Number, total and view name.', good: 'Image 2 of 4: Front view' },
    { label: 'Gallery heading', target: 'Heading', guidance: 'The product name and “photos”. Can be visually hidden.', good: 'Ridgeline trail runner: photos' },
  ],
  design: [
    'Previous and next buttons have 3:1 contrast against every image they sit on. Use a solid backing.',
    'The selected thumbnail has a thick outline or a marker, not just a color change.',
    'Thumbnails and arrows are at least 24×24px; 44×44px on touch screens.',
    'Swipe is optional extra: buttons do the same job (WCAG 2.5.7).',
    'Zoom, if offered, opens a dialog with its own close button. Hover-to-zoom alone isn’t enough.',
    'Nothing changes on its own. No auto-advancing images.',
  ],
  screenReader: [
    '“Ridgeline trail runner: photos, heading level 3.”',
    '“Trail runner in teal, side view, with a chunky black sole, image.” Then “Side view · Image 1 of 4.”',
    '“Next image, button.” Press Enter: “Image 2 of 4: Front view.”',
    '“Choose an image, list, 4 items. Side view, toggle button, pressed.”',
  ],
  mistakes: [
    'The same alt text on every image, like the product name, so screen reader users can’t tell the views apart.',
    'Alt text on thumbnails and the main image, so each view is described twice.',
    'Thumbnails as images with click handlers, not buttons, so keyboard users can’t choose them.',
    'Moving focus to the main image on every change.',
    'Swipe-only galleries with no buttons, or arrows that only appear on hover.',
    'Zoom that follows the mouse and can’t be used with a keyboard.',
  ],
  testing: [
    'Every image has unique, meaningful alt text; thumbnail images have alt="".',
    'Previous, Next and every thumbnail work with Enter and Space and keep focus where it is.',
    'A screen reader announces the new image’s position after each change.',
    'The selected thumbnail is announced as pressed or current, and is visible without color.',
    'Arrow buttons have 3:1 contrast on every image.',
    'At 320px the gallery fits without sideways scrolling and thumbnails wrap.',
  ],
  wcag: [WCAG.nonText, WCAG.infoRel, WCAG.keyboard, WCAG.nonTextContrast, WCAG.useOfColor, WCAG.focusVisible, WCAG.dragging, WCAG.targetSize, WCAG.nameRoleValue, WCAG.statusMessages],
  sources: [
    { title: 'Images tutorial', url: 'https://www.w3.org/WAI/tutorials/images/', by: 'W3C WAI', note: 'Informative images, functional images and alt="" for redundant images.' },
    { title: 'Carousel pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/carousel/', by: 'W3C WAI ARIA Authoring Practices', note: 'Previous and next controls, picker buttons and announcing slide changes.' },
    { title: 'Toggle button (aria-pressed)', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', by: 'W3C WAI ARIA Authoring Practices' },
  ],
  roles: {
    content: ['Write alt text for each view, unique to that view.', 'Write short view names and the position message.'],
    design: ['Make arrows readable on every photo.', 'Mark the selected thumbnail without relying on color.', 'Size targets for touch.'],
    frontend: ['Use buttons for arrows and thumbnails, with names.', 'Keep focus in place and announce changes with role="status".', 'Swap alt with the image.'],
    qa: ['Check each image’s alt in a screen reader.', 'Test arrows and thumbnails with keyboard only.', 'Check contrast of arrows on light and dark photos.'],
  },
  Demo,
  html: `<section aria-labelledby="gallery-h">
  <h2 id="gallery-h" class="visually-hidden">Ridgeline trail runner: photos</h2>
  <figure>
    <img src="side.jpg" alt="Trail runner in teal, side view, with a chunky black sole">
    <figcaption>Side view · Image 1 of 4</figcaption>
  </figure>
  <button type="button"><svg aria-hidden="true">…</svg><span class="visually-hidden">Previous image</span></button>
  <button type="button"><svg aria-hidden="true">…</svg><span class="visually-hidden">Next image</span></button>
  <ul aria-label="Choose an image">
    <li><button type="button" aria-pressed="true"><img src="side-thumb.jpg" alt=""><span class="visually-hidden">Side view</span></button></li>
    <li><button type="button" aria-pressed="false"><img src="front-thumb.jpg" alt=""><span class="visually-hidden">Front view</span></button></li>
  </ul>
  <p role="status" class="visually-hidden"></p>
</section>`,
};
