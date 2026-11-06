import { useEffect, useId, useState } from 'react';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';

const scene = (sky: string, ground: string, sun: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140"><rect width="320" height="140" fill="${sky}"/><circle cx="250" cy="40" r="20" fill="${sun}"/><path d="M0 140 90 60l50 50 40-35 140 65Z" fill="${ground}"/></svg>`,
  );

const SLIDES = [
  { title: 'Spring trail guide', text: 'Twelve walks under two hours, all step-free.', alt: 'Green hills under a pale blue sky', src: scene('#bae6fd', '#15803d', '#fcd34d') },
  { title: 'Coastal cycling', text: 'Flat routes with places to stop every few miles.', alt: 'Sandy shoreline at sunset', src: scene('#fed7aa', '#d97706', '#f97316') },
  { title: 'Night sky events', text: 'Join a guided stargazing walk this autumn.', alt: 'Dark hills under a night sky with a full moon', src: scene('#1e1b4b', '#312e81', '#e5e7eb') },
];

const ctl =
  'grid h-10 w-10 place-items-center rounded-full bg-white text-gray-900 ring-1 ring-gray-400 hover:bg-gray-100 focus-ring dark:bg-gray-900 dark:text-gray-50 dark:ring-gray-500 dark:hover:bg-gray-800';

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
    <path d={dir === 'left' ? 'M12.8 4.2a1 1 0 0 1 0 1.4L8.4 10l4.4 4.4a1 1 0 1 1-1.4 1.4l-5.1-5.1a1 1 0 0 1 0-1.4l5.1-5.1a1 1 0 0 1 1.4 0Z' : 'M7.2 15.8a1 1 0 0 1 0-1.4L11.6 10 7.2 5.6a1 1 0 1 1 1.4-1.4l5.1 5.1a1 1 0 0 1 0 1.4l-5.1 5.1a1 1 0 0 1-1.4 0Z'} />
  </svg>
);

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Carousel({ auto = false }: { auto?: boolean }) {
  const id = useId();
  const [index, setIndex] = useState(0);
  // Auto-rotation never starts for people who asked for reduced motion
  const [playing, setPlaying] = useState(auto && !reducedMotion());
  const [paused, setPaused] = useState(false); // hover or focus inside
  const rotating = auto && playing && !paused;
  const go = (d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (!rotating) return;
    const t = window.setInterval(() => go(1), 5000);
    return () => window.clearInterval(t);
  }, [rotating]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured guides"
      className="w-full max-w-md space-y-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
    >
      <div className="flex items-center gap-2">
        {auto && (
          <button type="button" className={ctl} onClick={() => setPlaying((p) => !p)}>
            {playing ? (
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6 4h3v12H6zM11 4h3v12h-3z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6 4v12l10-6z" />
              </svg>
            )}
            <span className="sr-only">{playing ? 'Stop slide rotation' : 'Start slide rotation'}</span>
          </button>
        )}
        <button type="button" className={ctl} aria-controls={`${id}-slides`} onClick={() => go(-1)}>
          <Chevron dir="left" />
          <span className="sr-only">Previous slide</span>
        </button>
        <button type="button" className={ctl} aria-controls={`${id}-slides`} onClick={() => go(1)}>
          <Chevron dir="right" />
          <span className="sr-only">Next slide</span>
        </button>
        <p aria-hidden="true" className="ml-auto text-sm text-muted">
          {index + 1} / {SLIDES.length}
        </p>
      </div>
      {/* Live only when people change slides themselves, never while auto-rotating */}
      <div id={`${id}-slides`} aria-live={rotating ? 'off' : 'polite'}>
        {SLIDES.map((s, i) => (
          <div key={s.title} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${SLIDES.length}`} hidden={i !== index} className="overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-700">
            <img src={s.src} alt={s.alt} className="h-36 w-full object-cover" />
            <div className="space-y-1 p-4">
              {/* h4 because the example sits under the page's h3 */}
              <h4 className="font-semibold">{s.title}</h4>
              <p className="text-sm text-muted">{s.text}</p>
              <a href="#" onClick={(e) => e.preventDefault()} className="link text-sm">
                Read the {s.title.toLowerCase()}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const manualHtml = `<section aria-roledescription="carousel" aria-label="Featured guides">
  <button type="button" aria-controls="slides">
    <svg aria-hidden="true" focusable="false">…</svg><span class="sr-only">Previous slide</span>
  </button>
  <button type="button" aria-controls="slides">
    <svg aria-hidden="true" focusable="false">…</svg><span class="sr-only">Next slide</span>
  </button>

  <!-- polite: the new slide is read when people press Previous or Next -->
  <div id="slides" aria-live="polite">
    <div role="group" aria-roledescription="slide" aria-label="1 of 3">
      <img src="hills.jpg" alt="Green hills under a pale blue sky">
      <h3>Spring trail guide</h3>
      <p>Twelve walks under two hours, all step-free.</p>
      <a href="/guides/spring">Read the spring trail guide</a>
    </div>
    <div role="group" aria-roledescription="slide" aria-label="2 of 3" hidden>…</div>
    <div role="group" aria-roledescription="slide" aria-label="3 of 3" hidden>…</div>
  </div>
</section>`;

export const carouselVariants: Variant[] = [
  {
    id: 'manual',
    label: 'Manual',
    description: 'Slides change only when people press Previous or Next. The new slide is announced politely. This is the safer default.',
    Demo: () => <Carousel />,
    html: manualHtml,
    code: `<section aria-roledescription="carousel" aria-label="Featured guides">
  <button aria-controls="slides" onClick={() => go(-1)}><span className="sr-only">Previous slide</span>…</button>
  <button aria-controls="slides" onClick={() => go(1)}><span className="sr-only">Next slide</span>…</button>
  <div id="slides" aria-live="polite">
    {slides.map((s, i) => (
      <div key={s.id} role="group" aria-roledescription="slide"
           aria-label={\`\${i + 1} of \${slides.length}\`} hidden={i !== index}>
        <img src={s.src} alt={s.alt} />
        <h3>{s.title}</h3>
        …
      </div>
    ))}
  </div>
</section>`,
  },
  {
    id: 'auto',
    label: 'Auto-rotating',
    description: 'Rotates every 5 seconds, with a Stop button first in the tab order. Rotation pauses on hover and focus, never starts with reduced motion, and isn’t announced.',
    Demo: () => <Carousel auto />,
    html: manualHtml
      .replace(
        '  <button type="button" aria-controls="slides">\n    <svg aria-hidden="true" focusable="false">…</svg><span class="sr-only">Previous',
        '  <!-- First control: lets people stop the movement -->\n  <button type="button">\n    <svg aria-hidden="true" focusable="false">…</svg><span class="sr-only">Stop slide rotation</span>\n  </button>\n  <button type="button" aria-controls="slides">\n    <svg aria-hidden="true" focusable="false">…</svg><span class="sr-only">Previous',
      )
      .replace('<!-- polite: the new slide is read when people press Previous or Next -->\n  <div id="slides" aria-live="polite">', '<!-- off while rotating, so it doesn\'t interrupt; polite once stopped -->\n  <div id="slides" aria-live="off">'),
    code: `const [playing, setPlaying] = useState(!prefersReducedMotion());
const [paused, setPaused] = useState(false); // hover or focus inside
const rotating = playing && !paused;

useEffect(() => {
  if (!rotating) return;
  const t = setInterval(() => go(1), 5000);
  return () => clearInterval(t);
}, [rotating]);

<section aria-roledescription="carousel" aria-label="Featured guides"
  onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
  onFocus={() => setPaused(true)} onBlur={…}>
  <button onClick={() => setPlaying(!playing)}>
    <span className="sr-only">{playing ? 'Stop slide rotation' : 'Start slide rotation'}</span>
  </button>
  …
  <div id="slides" aria-live={rotating ? 'off' : 'polite'}>…</div>
</section>`,
  },
];

export const carousel: ComponentSpec = {
  slug: 'carousel',
  name: 'Carousel',
  category: 'Content',
  summary: 'A carousel shows one slide at a time from a set, with buttons to move between them. Many people miss later slides, so use it sparingly.',
  semantics: '<section aria-roledescription="carousel"> with role="group" slides and button controls',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/carousel/',
  whenToUse: [
    'Use a carousel for a small set of related, non-essential items, like featured guides.',
    'Prefer a simple list or grid when every item matters; people rarely look past the first slide.',
    'Avoid auto-rotation. If you must, give a Stop button and pause on hover and focus.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to the Stop button, Previous, Next, then into the current slide’s content.' },
    { keys: ['Enter', 'Space'], action: 'Activates Stop/Start, Previous or Next.' },
  ],
  aria: [
    { attr: 'aria-roledescription="carousel"', where: '<section>', usage: 'Announced instead of “region”. Give it an aria-label too.' },
    { attr: 'role="group" + aria-roledescription="slide"', where: 'each slide', usage: 'Announced as “slide”, with aria-label “1 of 3”.' },
    { attr: 'hidden', where: 'inactive slides', usage: 'Keeps hidden slides out of the tab order and reading order.' },
    { attr: 'aria-live', where: 'slide container', usage: '"polite" for manual changes, "off" while auto-rotating.' },
    { attr: 'aria-controls', where: 'Previous and Next', usage: 'Points to the slide container.' },
  ],
  focus: [
    'Put the Stop rotation button first, so it’s reached before the moving content.',
    'Pause rotation while anything inside has focus or the pointer is over it.',
    'Keep focus on Previous or Next when they’re pressed; don’t move it into the slide.',
  ],
  screenReader: [
    'Announced as: “Featured guides, carousel”.',
    'After Next: “2 of 3, slide, Coastal cycling…”.',
    'While auto-rotating, nothing is announced.',
  ],
  dos: ['Show controls visibly, not only on hover.', 'Make every slide reachable without waiting.', 'Write alt text for each slide image as you would for any image.'],
  donts: ['Don’t auto-rotate without a visible Stop button.', 'Don’t rely on swipe gestures alone.', 'Don’t put essential information only on later slides.'],
  wcag: [WCAG.pause, WCAG.nonText, WCAG.keyboard, WCAG.nameRoleValue, WCAG.focusOrder, WCAG.dragging, WCAG.targetSize],
  testing: [
    'Tab into the carousel and confirm rotation pauses and the Stop button comes first.',
    'Press Next and confirm the new slide is announced with “2 of 3”.',
    'Confirm hidden slides can’t be reached with Tab or the reading cursor.',
    'Turn on reduced motion and confirm it doesn’t auto-rotate.',
    'Confirm every slide image has appropriate alt text.',
    'At 320px wide, confirm the controls are at least 24×24px and nothing is cut off.',
  ],
  Demo: () => <Carousel />,
  code: carouselVariants[0].code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI doesn’t ship a carousel. This follows the WAI-ARIA carousel pattern with plain buttons.',
      'Slides switch instantly with hidden rather than sliding, which avoids motion and keeps hidden slides out of the tab order.',
    ],
  },
};
