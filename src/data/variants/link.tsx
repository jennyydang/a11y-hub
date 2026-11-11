import type { Variant } from '../types';

const External = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="ml-1 inline h-4 w-4 align-[-2px]">
    <path d="M11 3a1 1 0 1 0 0 2h2.59l-6.3 6.3a1 1 0 1 0 1.42 1.4L15 6.42V9a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-5Z" />
    <path d="M5 5a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 0 0 0-2H5Z" />
  </svg>
);

export const linkVariants: Variant[] = [
  {
    id: 'inline',
    label: 'Inline',
    description: 'A link inside a sentence. It is underlined so it doesn’t rely on color alone.',
    Demo: () => (
      <p className="max-w-md text-base leading-7">
        Read the <a className="link" href="#/foundations/color">color and contrast guidelines</a> before picking brand colors.
      </p>
    ),
    html: `<p>Read the <a href="/guidelines/color">color and contrast guidelines</a> before picking brand colors.</p>`,
  },
  {
    id: 'external',
    label: 'New tab',
    description: 'Visually hidden text warns screen reader users; the icon warns everyone else.',
    Demo: () => (
      <a className="link" href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer">
        WCAG overview
        <External />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ),
    html: `<a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer">
  WCAG overview
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  <span class="sr-only">(opens in a new tab)</span>
</a>`,
  },
  {
    id: 'download',
    label: 'Download',
    description: 'File type and size are linked with aria-describedby, so they’re read after the link name.',
    Demo: () => (
      <p className="text-base">
        <a className="link" href="#/components/link" aria-describedby="dl-meta">Download Q3 results</a>{' '}
        <span id="dl-meta" className="text-sm text-muted">PDF, 2 MB</span>
      </p>
    ),
    html: `<a href="/q3-results.pdf" aria-describedby="dl-meta">Download Q3 results</a>
<span id="dl-meta">PDF, 2 MB</span>`,
  },
];
