import type { Variant } from '../types';

const box = 'rounded-lg bg-white p-4 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700';

function Photo({ label }: { label?: string }) {
  return (
    <svg role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} viewBox="0 0 240 140" className="w-full max-w-xs rounded-lg">
      <rect width="240" height="140" className="fill-sky-200 dark:fill-sky-900" />
      <circle cx="190" cy="35" r="16" className="fill-amber-300" />
      <path d="M0 140 70 60l40 45 30-30 100 65Z" className="fill-emerald-600 dark:fill-emerald-500" />
    </svg>
  );
}

export const imageVariants: Variant[] = [
  {
    id: 'informative',
    label: 'Informative',
    description: 'The image adds information, so the alt text conveys it.',
    Demo: () => (
      <figure className="space-y-2">
        <Photo label="Green hills under a clear sky with the sun in the top right" />
        <figcaption className="text-sm text-muted">alt describes what the image shows.</figcaption>
      </figure>
    ),
    html: `<img src="hills.jpg" alt="Green hills under a clear sky with the sun in the top right">`,
  },
  {
    id: 'decorative',
    label: 'Decorative',
    description: 'The image is only decoration. An empty alt removes it from the accessibility tree.',
    Demo: () => (
      <div className={`${box} flex max-w-sm items-center gap-3`}>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-amber-600 dark:text-amber-300">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5Z" />
        </svg>
        <span className="font-medium">Favorite projects</span>
      </div>
    ),
    html: `<img src="divider.svg" alt="">

<!-- Decorative inline icon next to text -->
<span><svg aria-hidden="true" focusable="false">…</svg> Favorite projects</span>`,
  },
  {
    id: 'complex',
    label: 'Chart',
    description: 'A complex image gets a short name plus a description of what it shows.',
    Demo: () => (
      <figure className="w-full max-w-xs space-y-2">
        <svg role="img" aria-labelledby="v-chart-t v-chart-d" viewBox="0 0 200 110" className={box}>
          <title id="v-chart-t">Monthly signups</title>
          <desc id="v-chart-d">Signups rose from 120 in January to 310 in April.</desc>
          {[120, 180, 240, 310].map((v, i) => (
            <rect key={i} x={20 + i * 45} y={100 - v / 4} width="30" height={v / 4} rx="3" className="fill-primary-600 dark:fill-primary-300" />
          ))}
        </svg>
        <figcaption className="text-sm text-muted">Monthly signups, January to April</figcaption>
      </figure>
    ),
    html: `<figure>
  <svg role="img" aria-labelledby="chart-title chart-desc" viewBox="0 0 200 110">
    <title id="chart-title">Monthly signups</title>
    <desc id="chart-desc">Signups rose from 120 in January to 310 in April.</desc>
    …
  </svg>
  <figcaption>Monthly signups, January to April</figcaption>
</figure>`,
  },
  {
    id: 'link',
    label: 'Image link',
    description: 'When an image is the only content of a link, its alt text is the link name. Describe the destination.',
    Demo: () => (
      <a href="#/" className="inline-flex items-center gap-2 rounded-md p-1 focus-ring">
        <svg role="img" aria-label="A11y Hub home" viewBox="0 0 32 32" className="h-10 w-10">
          <rect width="32" height="32" rx="9" className="fill-primary-600 dark:fill-primary-400" />
          <circle cx="16" cy="8.5" r="2.6" fill="white" />
          <path d="M8 12.5h16v2.4h-5.4V26h-2.4v-6h-0.4v6h-2.4V14.9H8z" fill="white" />
        </svg>
      </a>
    ),
    html: `<a href="/"><img src="logo.svg" alt="A11y Hub home"></a>`,
  },
];
