import type { Variant } from '../types';
import { accordion } from '../components/accordion';

export const accordionVariants: Variant[] = [
  {
    id: 'scripted',
    label: 'Button + heading',
    description: 'Each header is a button inside a real heading, so people can jump between sections by heading.',
    Demo: accordion.Demo,
    html: `<h3>
  <button type="button" aria-expanded="true" aria-controls="faq-1">What is your return policy?</button>
</h3>
<div id="faq-1">Return unused items within 30 days for a full refund.</div>

<h3>
  <button type="button" aria-expanded="false" aria-controls="faq-2">Do you ship internationally?</button>
</h3>
<div id="faq-2" hidden>Yes, to over 40 countries.</div>

<script>
  document.querySelectorAll('button[aria-expanded][aria-controls]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });
</script>`,
    code: accordion.code,
  },
  {
    id: 'details',
    label: 'Native <details>',
    description: 'No JavaScript at all. The trade-off: <summary> can’t sit inside a heading, so it won’t show up in heading navigation.',
    Demo: () => (
      <div className="w-full max-w-lg space-y-2">
        {[
          ['What is your return policy?', 'Return unused items within 30 days for a full refund.'],
          ['Do you ship internationally?', 'Yes, to over 40 countries. Duties are calculated at checkout.'],
        ].map(([q, a]) => (
          <details key={q} className="group rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-800/60">
            <summary className="cursor-pointer rounded py-1 font-medium focus-ring">{q}</summary>
            <p className="pb-2 pt-1 text-sm leading-6">{a}</p>
          </details>
        ))}
      </div>
    ),
    html: `<details>
  <summary>What is your return policy?</summary>
  <p>Return unused items within 30 days for a full refund.</p>
</details>
<details>
  <summary>Do you ship internationally?</summary>
  <p>Yes, to over 40 countries.</p>
</details>`,
    code: `<details>
  <summary>What is your return policy?</summary>
  <p>Return unused items within 30 days for a full refund.</p>
</details>`,
  },
];
