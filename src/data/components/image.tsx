import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <figure className="space-y-2">
        <svg role="img" aria-labelledby="chart-title chart-desc" viewBox="0 0 200 110" className="w-full rounded-lg bg-white p-3 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          <title id="chart-title">Monthly signups</title>
          <desc id="chart-desc">Signups rose from 120 in January to 310 in April.</desc>
          {[120, 180, 240, 310].map((v, i) => (
            <rect key={i} x={20 + i * 45} y={100 - v / 4} width="30" height={v / 4} rx="3" className="fill-primary-600 dark:fill-primary-300" />
          ))}
        </svg>
        <figcaption className="text-sm text-muted">Informative image: has a text alternative.</figcaption>
      </figure>
      <figure className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg bg-white p-4 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-amber-600 dark:text-amber-300">
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5Z" />
          </svg>
          <span className="font-medium">Favorite projects</span>
        </div>
        <figcaption className="text-sm text-muted">Decorative icon next to text: hidden from assistive tech.</figcaption>
      </figure>
    </div>
  );
}

export const image: ComponentSpec = {
  slug: 'image',
  name: 'Image & icon',
  category: 'Content',
  summary: 'Images, icons and charts need a text alternative that matches their purpose, or should be hidden when they’re decorative.',
  semantics: '<img alt> / <svg role="img">',
  whenToUse: [
    'Informative images need alt text that conveys the same information.',
    'Decorative images get alt="" (or aria-hidden on SVG) so screen readers skip them.',
    'Complex images like charts need a short name plus a longer description nearby.',
  ],
  keyboard: [{ keys: ['—'], action: 'Images aren’t focusable unless they are links or buttons. Then the alt text becomes the link or button name.' }],
  aria: [
    { attr: 'alt', where: '<img>', usage: 'Required on every <img>. Use an empty alt for decoration.' },
    { attr: 'role="img"', where: '<svg>', usage: 'Treats the SVG as a single image.' },
    { attr: 'aria-labelledby → <title> <desc>', where: '<svg>', usage: 'Gives inline SVGs a name and description.' },
    { attr: 'aria-hidden="true"', where: 'decorative <svg>', usage: 'Removes the icon from the accessibility tree.' },
    { attr: '<figure> + <figcaption>', where: 'wrapper', usage: 'Associates a visible caption with the image.' },
  ],
  focus: ['Icon-only links and buttons take their name from the image. Write the action, not a description of the picture.'],
  screenReader: ['Informative chart: “Monthly signups, image, Signups rose from 120 in January to 310 in April.”', 'Decorative icon: not announced.'],
  dos: [
    'Describe the purpose: for a logo link, write “Acme home”, not “Acme logo”.',
    'Keep alt text concise. Put long descriptions in visible text.',
    'Give icons that carry meaning 3:1 contrast.',
  ],
  donts: [
    'Don’t start alt text with “Image of”. Screen readers already say “image”.',
    'Don’t use images of text.',
    'Don’t leave the alt attribute off. Screen readers may read the file name instead.',
  ],
  wcag: [WCAG.nonText, WCAG.infoRel, WCAG.nonTextContrast, WCAG.useOfColor],
  testing: [
    'Check every <img> has an alt attribute.',
    'Read the page with images turned off and confirm nothing important is lost.',
    'Confirm decorative icons aren’t announced.',
  ],
  Demo,
  code: `<img src="team.jpg" alt="Our five-person support team at the Lisbon office" />
<img src="divider.svg" alt="" />

<svg role="img" aria-labelledby="t d">
  <title id="t">Monthly signups</title>
  <desc id="d">Signups rose from 120 in January to 310 in April.</desc>
  …
</svg>

<StarIcon aria-hidden="true" /> Favorite projects`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI’s components mark their internal icons aria-hidden. Do the same for icons you pass in.'],
  },
};
