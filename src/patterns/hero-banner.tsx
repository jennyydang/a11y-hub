import { useEffect, useId, useState } from 'react';
import { WCAG } from '../data/wcag';
import type { Pattern } from './types';

function Demo() {
  const id = useId();
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [playing, setPlaying] = useState(!reduced);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const h = window.setInterval(() => setT((n) => (n + 1) % 360), 80);
    return () => window.clearInterval(h);
  }, [playing]);

  return (
    <section aria-labelledby={`${id}-h`} className="relative overflow-hidden rounded-xl bg-gray-900 text-white">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <rect width="600" height="240" fill="#0f172a" />
        <path d={`M0 ${190 + 10 * Math.sin((t * Math.PI) / 180)} Q150 ${130 + 15 * Math.cos((t * Math.PI) / 90)} 300 170 T600 150 V240 H0Z`} fill="#134e4a" />
        <path d="M0 210 Q200 170 420 200 T600 190 V240 H0Z" fill="#115e59" />
        <circle cx={480 + 20 * Math.cos((t * Math.PI) / 180)} cy="60" r="28" fill="#fbbf24" opacity=".8" />
      </svg>
      {/* A scrim keeps text contrast at 4.5:1 or more wherever the image shifts. */}
      <div className="relative bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/20 p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Autumn collection</p>
        <h3 id={`${id}-h`} className="mt-1 max-w-md text-2xl font-bold sm:text-3xl">
          Made for the long way round
        </h3>
        <p className="mt-2 max-w-md text-gray-100">Trail shoes and layers tested on 400 miles of coast path.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="#" onClick={(e) => e.preventDefault()} className="rounded-md bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300">
            Shop the collection
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="rounded-md px-4 py-2 font-semibold text-white underline hover:no-underline focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300">
            Read the trail journal
          </a>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="absolute bottom-3 right-3 rounded-md bg-gray-950/80 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
      >
        {playing ? 'Pause animation' : 'Play animation'}
      </button>
    </section>
  );
}

export const heroBanner: Pattern = {
  slug: 'hero-banner',
  name: 'Hero banner',
  category: 'Marketing',
  summary:
    'The large banner at the top of a home or landing page: one heading, a short line of copy, one or two calls to action and a background image. Text stays readable over the image, and any motion can be paused.',
  uses: ['link', 'button', 'image'],
  whenToUse: [
    'The top of a home, campaign or landing page, to say what the page is about and offer the next step.',
    'Not as a rotating carousel of several messages. If you need several, see the carousel component, and consider static tiles instead.',
  ],
  structure: [
    { part: 'Section', element: '<section aria-labelledby>', notes: 'Inside <main>. Named by its heading.' },
    { part: 'Eyebrow', element: '<p>', notes: 'Optional short label above the heading. Not a heading itself.' },
    { part: 'Heading', element: '<h1> on the home page, otherwise <h2>', notes: 'The main message, as real text, never text inside the image.' },
    { part: 'Supporting copy', element: '<p>', notes: 'One or two sentences.' },
    { part: 'Calls to action', element: '<a> links', notes: 'Links, because they go somewhere. Each makes sense on its own.' },
    { part: 'Background image', element: 'CSS background or <img alt="">', notes: 'Decorative when the text says it all. Otherwise give it real alt text.' },
    { part: 'Pause control', element: '<button>', notes: 'Needed if anything moves for more than 5 seconds, including background video.' },
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to each call to action, then the pause button.' },
    { keys: ['Enter'], action: 'Follows a call to action.' },
    { keys: ['Space', 'Enter'], action: 'On the pause button, pauses or plays the animation.' },
  ],
  aria: [
    { attr: 'aria-labelledby', where: '<section>', usage: 'Names the region from its heading, so it’s listed in landmark navigation.' },
    { attr: 'aria-hidden="true"', where: 'decorative SVG or video', usage: 'Hides artwork that adds nothing for screen readers.' },
    { attr: 'alt=""', where: 'decorative <img>', usage: 'Use alt="" when the text says everything the image does.' },
    { attr: 'alt', where: 'meaningful <img>', usage: 'When the image shows the product or offer, describe it.' },
    { attr: 'Button text', where: 'pause control', usage: 'Changes between “Pause animation” and “Play animation”. Don’t also add aria-pressed.' },
  ],
  content: [
    { label: 'Heading', target: '<h1> or <h2>', guidance: 'Say what the page or offer is. Keep it real text, not part of the image.', good: 'Made for the long way round' },
    { label: 'Call to action', target: 'Link text', guidance: 'Say where it goes. Avoid “Learn more”.', good: 'Shop the collection' },
    { label: 'Image description', target: 'alt (when the image is meaningful)', guidance: 'What the image shows that the text doesn’t.', good: 'Two walkers on a cliff path in teal trail shoes' },
    { label: 'Pause button', target: 'Button text', guidance: 'Say what it does now.', good: 'Pause animation' },
  ],
  design: [
    'Text over images has 4.5:1 contrast everywhere it sits, at every breakpoint. Use a solid or gradient scrim, not a lucky image.',
    'Large text (24px, or 18.5px bold) can use 3:1.',
    'Calls to action have a visible focus indicator with 3:1 contrast against the image.',
    'The pause control is visible, not hidden on hover, and at least 24 by 24px.',
    'With prefers-reduced-motion on, motion starts paused.',
    'At 320px, text stacks above the image instead of being cropped or overlapping.',
    'Nothing flashes more than three times a second.',
  ],
  screenReader: [
    '“Made for the long way round, region.”',
    '“Autumn collection. Made for the long way round, heading level 1.”',
    '“Trail shoes and layers tested on 400 miles of coast path.”',
    '“Shop the collection, link. Read the trail journal, link.”',
    '“Pause animation, button.”',
  ],
  mistakes: [
    'Putting the heading and offer inside the image, so it can’t be read, zoomed, translated or found by search.',
    'Testing text contrast against one crop of the image, then it fails on mobile.',
    'Using a <div> with a click handler as the call to action.',
    'Autoplaying background video with no pause control.',
    'Several identical “Learn more” links.',
    'Making the whole banner one giant link, so everything in it is read as one long link name.',
  ],
  testing: [
    'The heading is real text and at the right level.',
    'Text contrast passes at every breakpoint, over the busiest part of the image.',
    'Call to action names make sense on their own.',
    'Any motion over 5 seconds has a working, visible pause control, and starts paused with reduced motion on.',
    'At 320px wide and 400% zoom, nothing is cut off or overlapping.',
    'Decorative images are hidden; meaningful images have alt text.',
  ],
  wcag: [WCAG.nonText, WCAG.infoRel, WCAG.contrast, WCAG.resize, WCAG.reflow, WCAG.nonTextContrast, WCAG.pause, WCAG.flashes, WCAG.headings, WCAG.linkPurpose, WCAG.focusVisible, WCAG.targetSize],
  sources: [
    { title: 'Understanding Pause, Stop, Hide', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html', by: 'W3C WAI', note: 'When moving content needs a pause control.' },
    { title: 'Images tutorial: decorative images', url: 'https://www.w3.org/WAI/tutorials/images/decorative/', by: 'W3C WAI', note: 'When to use alt="".' },
    { title: 'Understanding Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', by: 'W3C WAI', note: 'Text over background images.' },
  ],
  roles: {
    content: ['Write a heading that works without the image.', 'Write specific call to action text, and alt text if the image is meaningful.'],
    design: ['Add a scrim and check contrast at every breakpoint.', 'Design the pause control and the 320px layout.'],
    frontend: ['Use a real heading and links.', 'Respect prefers-reduced-motion and add the pause control.'],
    qa: ['Check contrast over the busiest part of the image.', 'Check pause, reduced motion and reflow.'],
  },
  Demo,
  html: `<main>
  <section class="hero" aria-labelledby="hero-h">
    <p class="eyebrow">Autumn collection</p>
    <h1 id="hero-h">Made for the long way round</h1>
    <p>Trail shoes and layers tested on 400 miles of coast path.</p>
    <a class="button" href="/autumn">Shop the collection</a>
    <a href="/journal">Read the trail journal</a>
    <!-- Only if something moves for more than 5 seconds -->
    <button type="button" class="hero-pause">Pause animation</button>
  </section>
</main>`,
};
