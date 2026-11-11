import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

/** A cookie banner at the top of the page, before the skip link. Choices are equal and clear. */
function Demo() {
  const id = useId();
  const [choice, setChoice] = useState<'accepted' | 'rejected' | null>(null);
  const [hidden, setHidden] = useState(false);
  const msgRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (choice) msgRef.current?.focus();
  }, [choice]);

  if (hidden)
    return (
      <div className="space-y-2 text-sm">
        <p className="text-muted">The banner is hidden. On a real site, it wouldn’t come back.</p>
        <Button size="sm" weight="light" color="gray" onClick={() => { setHidden(false); setChoice(null); }}>
          Show the banner again
        </Button>
      </div>
    );

  return (
    <div role="region" aria-labelledby={`${id}-title`} className="w-full max-w-xl space-y-3 rounded-lg bg-gray-100 p-4 ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-600">
      {choice ? (
        <>
          <p ref={msgRef} tabIndex={-1} className="rounded outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
            You’ve {choice} additional cookies. You can <a href="#" onClick={(e) => e.preventDefault()} className="link">change your cookie settings</a> at any time.
          </p>
          <Button size="sm" weight="light" color="gray" onClick={() => setHidden(true)}>
            Hide cookie message
          </Button>
        </>
      ) : (
        <>
          {/* h4 because the example sits under the page's h3; on a real page use h2 */}
          <h4 id={`${id}-title`} className="text-lg font-semibold">
            Cookies on Trailmate
          </h4>
          <p className="text-sm leading-6">We use some essential cookies to make this site work. We’d also like to set analytics cookies to understand how you use it.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="btn-bold-primary" onClick={() => setChoice('accepted')}>
              Accept analytics cookies
            </Button>
            <Button size="sm" className="btn-bold-primary" onClick={() => setChoice('rejected')}>
              Reject analytics cookies
            </Button>
            <a href="#" onClick={(e) => e.preventDefault()} className="link self-center text-sm">
              View cookies
            </a>
          </div>
        </>
      )}
    </div>
  );
}


export const cookieBanner: ComponentSpec = {
  slug: 'cookie-banner',
  name: 'Cookie banner',
  category: 'Feedback',
  summary: 'A cookie banner asks for consent to non-essential cookies. It sits at the very top of the page, doesn’t block anything, and gives equal Accept and Reject buttons.',
  semantics: 'role="region" with a heading, two <button>s and a link',
  whenToUse: [
    'Use it when you set non-essential cookies, like analytics.',
    'Don’t use a modal dialog; people should be able to use the page without answering.',
    'Remember the choice so the banner doesn’t return on every page.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'The banner is first in the page, so its buttons come before the skip link.' },
    { keys: ['Enter', 'Space'], action: 'Accepts or rejects. Focus moves to the confirmation message.' },
  ],
  aria: [
    { attr: 'role="region" + aria-labelledby', where: 'banner', usage: 'A named landmark people can find and skip.' },
    { attr: 'Heading', where: 'banner title', usage: '“Cookies on Trailmate”.' },
    { attr: 'tabindex="-1"', where: 'confirmation', usage: 'Lets focus move to the message after a choice.' },
  ],
  focus: ['After Accept or Reject, move focus to the confirmation so it’s announced.', 'After Hide, move focus to the start of the page (the skip link or main heading).', 'Never cover the focused element with a fixed banner.'],
  screenReader: ['“Cookies on Trailmate, region. Cookies on Trailmate, heading.”', 'After a choice: “You’ve rejected additional cookies…”'],
  dos: ['Make Accept and Reject equally prominent.', 'Put it before the skip link, in the normal page flow.', 'Link to a full cookie settings page.'],
  donts: ['Don’t block the page with a modal.', 'Don’t pre-tick non-essential cookies.', 'Don’t use a sticky banner that hides focused content.'],
  wcag: [WCAG.focusOrder, WCAG.focusNotObscured, WCAG.bypass, WCAG.headings, WCAG.reflow],
  testing: [
    'Load the page and Tab once; the first stop should be in the banner.',
    'Accept or reject and confirm the message is announced.',
    'Zoom to 400% and confirm the banner doesn’t cover content you’re tabbing through.',
    'Reload and confirm the banner doesn’t return.',
  ],
  Demo,
};
