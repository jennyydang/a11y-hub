import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  return (
    <div className="space-y-3">
      <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 rounded text-sm font-medium text-gray-900 underline underline-offset-2 hover:decoration-2 focus-ring dark:text-gray-50">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M12.8 4.2a1 1 0 0 1 0 1.4L8.4 10l4.4 4.4a1 1 0 1 1-1.4 1.4l-5.1-5.1a1 1 0 0 1 0-1.4l5.1-5.1a1 1 0 0 1 1.4 0Z" />
        </svg>
        Back<span className="sr-only"> to delivery</span>
      </a>
      {/* h4 because the example sits under the page's h3 */}
      <h4 className="text-xl font-semibold">Payment</h4>
    </div>
  );
}

const code = `<a href="/checkout/delivery" className="inline-flex items-center gap-1 underline">
  <ChevronLeft aria-hidden="true" />
  Back<span className="sr-only"> to delivery</span>
</a>
<h1>Payment</h1>`;

export const backLink: ComponentSpec = {
  slug: 'back-link',
  name: 'Back link',
  category: 'Navigation',
  summary: 'A back link takes people to the previous step in a journey, like a multi-page form. It’s a real link with a real URL.',
  semantics: '<a href> to the previous step',
  whenToUse: [
    'Use it in step-by-step journeys, at the top of each step.',
    'Use breadcrumbs instead to go up a level in a site’s structure.',
    'Don’t rely on it alone; the browser’s Back button should also work.',
  ],
  keyboard: [{ keys: ['Enter'], action: 'Follows the link.' }],
  aria: [
    { attr: '<a href>', where: 'link', usage: 'A real URL, not history.back(), so it works when opened directly and people know where it goes.' },
    { attr: 'Visually hidden text', where: 'link', usage: 'Optional: “Back to delivery” for screen reader link lists.' },
    { attr: 'aria-hidden="true"', where: 'chevron', usage: 'Decorative.' },
  ],
  focus: ['It’s usually the first focusable item in main, before the heading.'],
  screenReader: ['“Back to delivery, link.”'],
  dos: ['Place it at the top left, above the heading.', 'Keep entered answers when people go back.', 'Underline it like other links.'],
  donts: ['Don’t use JavaScript history to decide the destination.', 'Don’t style it as a big button.', 'Don’t use it on the first step.'],
  wcag: [WCAG.linkPurpose, WCAG.focusOrder, WCAG.consistentNav],
  testing: ['Confirm it goes to the previous step and keeps answers.', 'Open a step in a new tab and confirm Back still works.', 'With a screen reader, list links and confirm the destination is clear.'],
  Demo,
  code,
  fluid: { source: 'Native HTML + Fluid styles', notes: ['A native link with an inline chevron, using the same underline style as other links on this site.'] },
};
