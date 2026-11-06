import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  return (
    <div className="max-w-md space-y-3 text-base leading-7">
      <p>
        Read the{' '}
        <a className="link" href="#/foundations/color">
          color and contrast guidelines
        </a>{' '}
        before picking brand colors.
      </p>
      <p>
        <a className="link" href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer">
          WCAG overview
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="ml-1 inline h-4 w-4 align-[-2px]">
            <path d="M11 3a1 1 0 1 0 0 2h2.59l-6.3 6.3a1 1 0 1 0 1.42 1.4L15 6.42V9a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-5Z" />
            <path d="M5 5a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 0 0 0-2H5Z" />
          </svg>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
      <p>
        Quarterly report:{' '}
        <a className="link" href="#/components/link" aria-describedby="report-meta">
          Download Q3 results
        </a>{' '}
        <span id="report-meta" className="text-sm text-muted">
          PDF, 2 MB
        </span>
      </p>
    </div>
  );
}

export const link: ComponentSpec = {
  slug: 'link',
  name: 'Link',
  category: 'Navigation',
  summary: 'Links take people to another page, another place on the same page, or a file.',
  semantics: '<a href>',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/link/',
  whenToUse: [
    'Use a link when the result is navigation and the URL changes.',
    'Use a button for actions, even when the action looks like a link visually.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the next link.' },
    { keys: ['Enter'], action: 'Follows the link. Unlike a button, Space scrolls the page and does not follow the link.' },
  ],
  aria: [
    { attr: 'href', where: '<a>', usage: 'Required. An <a> without href is not focusable and is not exposed as a link.' },
    { attr: 'aria-current="page"', where: 'nav link', usage: 'Marks the link for the page the user is on.' },
    { attr: 'aria-describedby', where: '<a>', usage: 'Adds extra details, like file type and size, without bloating the link name.' },
  ],
  focus: [
    'Links need a focus indicator as clear as buttons have.',
    'Skip links (“Skip to main content”) should be the first focusable thing on the page and become visible on focus.',
  ],
  screenReader: [
    'Screen reader users often pull up a list of all links on the page, so every link must make sense out of context.',
    'Say when a link opens a new tab or downloads a file, either in the text or with visually hidden text.',
  ],
  dos: [
    'Write link text that describes the destination: “color and contrast guidelines”.',
    'Underline links in body text, or make sure they have 3:1 contrast with surrounding text plus another cue on hover and focus.',
    'Keep link text short and put the important words first.',
  ],
  donts: [
    'Don’t use “click here”, “read more” or a bare URL as the only link text.',
    'Don’t open new tabs without warning.',
    'Don’t use javascript:void(0) links to trigger actions. Use a button.',
  ],
  wcag: [WCAG.linkPurpose, WCAG.useOfColor, WCAG.focusVisible, WCAG.nameRoleValue, WCAG.bypass],
  testing: [
    'List all links with your screen reader’s rotor or elements list and check each makes sense on its own.',
    'Check that in-text links are distinguishable without color.',
    'Confirm links that open new tabs or download files say so.',
  ],
  Demo,
  code: `<a className="link" href="/guidelines/color">color and contrast guidelines</a>

<a className="link" href="https://example.com" target="_blank" rel="noreferrer">
  WCAG overview
  <ExternalIcon aria-hidden="true" />
  <span className="sr-only"> (opens in a new tab)</span>
</a>`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI has no link component. Its Button supports weight="link", but that still renders a <button>, so use it only for actions.',
      'This site uses a .link utility built on Fluid’s primary palette, with an underline and a focus ring.',
    ],
  },
};
