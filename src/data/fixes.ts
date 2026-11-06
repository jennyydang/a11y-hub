/** Common accessibility problems described the way people notice them, with the usual cause and fix. */
export interface Fix {
  symptom: string;
  noticedBy: string;
  cause: string;
  fix: string;
  link: { label: string; to: string };
}

export const fixes: Fix[] = [
  {
    symptom: 'The screen reader just says “button”, with no name',
    noticedBy: 'Screen reader testing',
    cause: 'An icon-only button has no text, aria-label or visually hidden label.',
    fix: 'Add a visually hidden label or aria-label that says what it does, like “Close” or “Search”. Mark the icon aria-hidden.',
    link: { label: 'Button', to: '/components/button' },
  },
  {
    symptom: 'I can’t see where I am when I press Tab',
    noticedBy: 'Keyboard testing',
    cause: 'Focus outlines were removed with outline: none and not replaced, or the focus color has too little contrast.',
    fix: 'Restore a visible focus indicator at least 2px thick with 3:1 contrast. Use :focus-visible to show it for keyboard users.',
    link: { label: 'Focus management', to: '/foundations/focus' },
  },
  {
    symptom: 'Tab skips a control, or I can’t reach it at all',
    noticedBy: 'Keyboard testing',
    cause: 'It’s a div or span with a click handler, not a button or link.',
    fix: 'Use a <button> for actions and an <a href> for navigation. They are focusable and work with Enter and Space for free.',
    link: { label: 'Semantics & ARIA', to: '/foundations/semantics' },
  },
  {
    symptom: 'Tab jumps around the page in a strange order',
    noticedBy: 'Keyboard testing',
    cause: 'Positive tabindex values, or a visual order created with CSS that doesn’t match the HTML order.',
    fix: 'Remove tabindex values above 0, and change the HTML order to match the visual order.',
    link: { label: 'Keyboard navigation', to: '/foundations/keyboard' },
  },
  {
    symptom: 'I get stuck inside a pop-up and can’t Tab out, or Escape does nothing',
    noticedBy: 'Keyboard testing',
    cause: 'A focus trap without a way out, or a dialog built without a close action.',
    fix: 'Modal dialogs keep focus inside but close with Escape and a visible Close button, then return focus to what opened them.',
    link: { label: 'Dialog', to: '/components/dialog' },
  },
  {
    symptom: 'Focus disappears behind a sticky header or cookie banner',
    noticedBy: 'Keyboard testing',
    cause: 'Fixed elements cover the focused element.',
    fix: 'Add scroll-padding-top equal to the header height, and make sure banners don’t cover the content people tab through.',
    link: { label: 'Cookie banner', to: '/components/cookie-banner' },
  },
  {
    symptom: 'Nothing is announced when the form saves or an error appears',
    noticedBy: 'Screen reader testing',
    cause: 'The message appears visually but isn’t in a live region, and focus doesn’t move.',
    fix: 'Put status messages in a role="status" region that exists before the message is added. On submit errors, move focus to an error summary.',
    link: { label: 'Toast', to: '/components/toast' },
  },
  {
    symptom: 'The error message isn’t read with the field',
    noticedBy: 'Screen reader testing',
    cause: 'The error isn’t linked to the input.',
    fix: 'Give the error an id, reference it with aria-describedby on the input, and set aria-invalid="true".',
    link: { label: 'Text input', to: '/components/text-input' },
  },
  {
    symptom: 'Clicking a label doesn’t put the cursor in the field',
    noticedBy: 'Anyone with a mouse',
    cause: 'The label isn’t connected to the input, or the “label” is a placeholder.',
    fix: 'Use <label for="id"> matching the input’s id. Keep labels visible; placeholders disappear when you type.',
    link: { label: 'Text input', to: '/components/text-input' },
  },
  {
    symptom: 'The screen reader reads a file name or “image” for a picture',
    noticedBy: 'Screen reader testing',
    cause: 'Missing alt text, so the file name is read, or alt text that just says “image”.',
    fix: 'Write alt text that says what the image is there to say, or alt="" if it’s decorative.',
    link: { label: 'Decorative or informative?', to: '/tools/alt-text' },
  },
  {
    symptom: 'Lots of links all say “Read more” or “Click here”',
    noticedBy: 'Screen reader testing, content review',
    cause: 'Link text depends on the sentence or card around it.',
    fix: 'Make each link make sense alone, like “Read more about pricing”, or link the card’s heading instead.',
    link: { label: 'Link', to: '/components/link' },
  },
  {
    symptom: 'Text is hard to read on a phone outside, or looks faded',
    noticedBy: 'Anyone, design review',
    cause: 'Text contrast is below 4.5:1, often light gray on white or text on a photo.',
    fix: 'Darken the text or lighten the background until it passes. Put text over photos on a solid panel.',
    link: { label: 'Palette contrast grid', to: '/tools/palette-grid' },
  },
  {
    symptom: 'The page scrolls sideways when I zoom in or use a phone',
    noticedBy: 'Zoom testing',
    cause: 'Fixed widths, wide tables or long unbroken strings.',
    fix: 'Use flexible widths, let content wrap, and put wide tables in a scrollable region with a label.',
    link: { label: 'Text, zoom & reflow', to: '/foundations/text' },
  },
  {
    symptom: 'I can only tell what’s required or wrong by the red color',
    noticedBy: 'Color blind users, grayscale check',
    cause: 'Color is the only signal.',
    fix: 'Add a word or icon: “Required”, “Error:” or a symbol, as well as the color.',
    link: { label: 'Color & contrast', to: '/foundations/color' },
  },
  {
    symptom: 'Animations make me dizzy, or a carousel won’t stop',
    noticedBy: 'People sensitive to motion',
    cause: 'Motion ignores the reduced motion setting, or auto-advancing content has no pause.',
    fix: 'Respect prefers-reduced-motion, and give anything that moves for over five seconds a pause button.',
    link: { label: 'Motion & animation', to: '/foundations/motion' },
  },
  {
    symptom: 'Hashtags or emoji sound like nonsense with a screen reader',
    noticedBy: 'Screen reader users on social media',
    cause: 'Lowercase hashtags run together, and every emoji is read by name.',
    fix: 'Capitalize each word in hashtags and use one or two emoji at the end.',
    link: { label: 'Social post checker', to: '/tools/social-post-checker' },
  },
  {
    symptom: 'A PDF reads in the wrong order or not at all',
    noticedBy: 'Screen reader testing',
    cause: 'The PDF is untagged, scanned, or exported as an image.',
    fix: 'Export a tagged PDF from an accessible source file, then run Acrobat’s accessibility check. Better still, publish a web page.',
    link: { label: 'PDF export steps', to: '/tools/templates' },
  },
];
