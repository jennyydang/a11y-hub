/**
 * Plain-language accessibility basics for anyone who makes or publishes
 * content: marketers, editors, occasional designers and developers.
 * Organized by what people are making, not by component. No jargon.
 */

export interface BasicsTask {
  id: string;
  title: string;
  /** Why it matters, in one sentence. */
  why: string;
  dos: string[];
  example: { instead: string; write: string; label?: string };
  /** One quick way to check your own work. */
  check: string;
  links: { label: string; to: string }[];
}

export const basicsTasks: BasicsTask[] = [
  {
    id: 'writing',
    title: 'Writing and headings',
    why: 'Most people skim. Screen reader users skim too, by jumping from heading to heading.',
    dos: [
      'Give the page one main title.',
      'Use your editor’s heading styles (Heading 2, Heading 3) for sections. Don’t just make text big and bold.',
      'Keep headings in order. Don’t skip from Heading 2 to Heading 4.',
      'Use short sentences, everyday words and lists for steps.',
      'Spell out abbreviations the first time you use them.',
    ],
    example: { label: 'A section title', instead: 'Big bold text that looks like a heading', write: 'The same words, set as Heading 2' },
    check: 'Read only your headings, top to bottom. They should work as a table of contents.',
    links: [
      { label: 'Plain language checker', to: '/tools/reading-level' },
      { label: 'Copy patterns', to: '/tools/copy-patterns' },
    ],
  },
  {
    id: 'links',
    title: 'Links and buttons',
    why: 'Many people scan a list of links on their own, without the sentence around them.',
    dos: [
      'Make the link text say where it goes or what it does.',
      'Avoid “click here”, “read more” and “learn more” on their own.',
      'Say when a link opens a file, and its type and size: “Annual report (PDF, 2 MB)”.',
      'Don’t paste long web addresses into text. Link real words instead.',
      'Use a button style only for actions, like “Sign up”. Use a link for going somewhere.',
    ],
    example: { instead: 'To see our prices, click here.', write: 'See our prices.' },
    check: 'Read just the links on the page. Each one should still make sense.',
    links: [
      { label: 'Link guidance', to: '/components/link' },
      { label: 'Copy patterns', to: '/tools/copy-patterns' },
    ],
  },
  {
    id: 'images',
    title: 'Images, charts and alt text',
    why: 'Alt text is what people hear or read when they can’t see the image.',
    dos: [
      'Describe what the image is there to say, not every detail of how it looks.',
      'Mark purely decorative images as decorative, so they’re skipped.',
      'Don’t start with “Image of” or “Picture of”. Screen readers already say it’s an image.',
      'If the image contains words, put those words in the alt text or nearby.',
      'Give charts a one-sentence summary of what they show, and the data in a table or text.',
    ],
    example: { label: 'Alt text for a photo', instead: 'IMG_2041.jpg', write: 'Volunteers planting trees along the river path' },
    check: 'Read the page with the images hidden. Is anything missing?',
    links: [
      { label: 'Decorative or informative?', to: '/tools/alt-text' },
      { label: 'Image guidance', to: '/components/image' },
    ],
  },
  {
    id: 'color',
    title: 'Color, contrast and layout',
    why: 'Pale text is hard to read for many people, especially on a phone outside.',
    dos: [
      'Use dark text on a light background, or the reverse. Check pairs you’re unsure of.',
      'Don’t rely on color alone. Add a word, icon or pattern: “Required”, not just a red star.',
      'Avoid putting text over busy photos. Add a solid panel behind it.',
      'Nothing should flash more than three times a second.',
      'Left-align body text. Avoid long lines in all capitals or italics.',
    ],
    example: { label: 'Showing a required field', instead: 'Required fields are in red.', write: 'Fields marked “Required” must be filled in.' },
    check: 'Look at it in grayscale, and on your phone at arm’s length.',
    links: [
      { label: 'Contrast checker', to: '/tools/contrast-checker' },
      { label: 'Palette contrast grid', to: '/tools/palette-grid' },
    ],
  },
  {
    id: 'video',
    title: 'Video and audio',
    why: 'Captions help deaf people and anyone watching with the sound off, which is most people on social media.',
    dos: [
      'Add accurate captions. Automatic captions are a start, but correct them.',
      'Provide a transcript for podcasts and audio.',
      'If something important is only shown, not said, say it in the narration or a description.',
      'Don’t autoplay video with sound.',
      'Make sure people can pause anything that moves for more than five seconds.',
    ],
    example: { label: 'In the video', instead: '“As you can see here…”', write: '“The chart shows sign-ups doubled in March…”' },
    check: 'Watch it once with the sound off, and listen once without looking.',
    links: [{ label: 'Video guidance', to: '/components/video' }],
  },
  {
    id: 'documents',
    title: 'Documents, PDFs and slides',
    why: 'PDFs are often the hardest thing on a site to use with a screen reader or on a phone.',
    dos: [
      'Ask whether it could be a web page instead. Usually it can.',
      'In Word, Google Docs or PowerPoint, use the built-in headings, lists and slide layouts.',
      'Give every slide a unique title, and add alt text to images.',
      'Export a tagged, accessible PDF, not a scan or a “print to PDF” of an image.',
      'Set the document title and language in its properties.',
    ],
    example: { label: 'A file name and title', instead: 'final_v3_FINAL.pdf', write: 'Annual report 2026 (title set in document properties)' },
    check: 'Run the built-in accessibility checker in Word, PowerPoint or Acrobat before you share.',
    links: [
      { label: 'Document starter and PDF export steps', to: '/tools/templates' },
      { label: 'Text, zoom & reflow', to: '/foundations/text' },
    ],
  },
  {
    id: 'social',
    title: 'Social media posts',
    why: 'Screen readers read every emoji out by name, run lowercase hashtags together, and often can’t read “fancy” fonts at all.',
    dos: [
      'Capitalize each word in hashtags: #AccessibilityMatters, not #accessibilitymatters.',
      'Use the platform’s alt text option for every image.',
      'Use emoji sparingly, and put them at the end. Each one is read out, like “clapping hands”.',
      'Don’t use “fancy” Unicode letters. Screen readers can’t read them.',
      'Caption videos, and burn in captions for platforms that don’t support them.',
    ],
    example: { label: 'A hashtag', instead: '#goodfoodfestival 🎉🎉🎉', write: 'Join us this weekend! #GoodFoodFestival 🎉' },
    check: 'Read the post out loud exactly as written, including every emoji’s name.',
    links: [
      { label: 'Social post checker', to: '/tools/social-post-checker' },
      { label: 'Decorative or informative?', to: '/tools/alt-text' },
    ],
  },
  {
    id: 'email',
    title: 'Emails and newsletters',
    why: 'Many email apps block images, and people read on small screens with zoom.',
    dos: [
      'Put your message in real text, not a single image of text.',
      'Add alt text to images, and mark spacers and decorations as decorative.',
      'Use headings and short sections. Keep the most important thing first.',
      'Make buttons and links say what they do: “Book your place”, not “Click here”.',
      'Check contrast, and keep text at least 14px.',
    ],
    example: { label: 'The main call to action', instead: 'An image of a button that says “Register”', write: 'A real text button: “Register for the webinar”' },
    check: 'Send yourself a test with images turned off. Can you still tell what to do?',
    links: [
      { label: 'Email template', to: '/tools/templates' },
      { label: 'Copy patterns', to: '/tools/copy-patterns' },
    ],
  },
  {
    id: 'forms',
    title: 'Forms and surveys',
    why: 'If someone can’t fill in your form, they can’t sign up, buy or tell you what they think.',
    dos: [
      'Give every question a visible label. Placeholder text inside the box isn’t enough.',
      'Write “Required” or “Optional” in words, not just a star.',
      'Explain the format you need, like “For example, 07700 900 123”.',
      'Make error messages say what to fix: “Enter an email address, like name@example.com”.',
      'Don’t add time limits unless you really need them.',
    ],
    example: { label: 'An error message', instead: 'Invalid input', write: 'Enter a date of birth in the past' },
    check: 'Fill it in using only your keyboard: Tab to move, Space to tick, Enter to send.',
    links: [
      { label: 'Text input guidance', to: '/components/text-input' },
      { label: 'Error summary', to: '/components/error-summary' },
    ],
  },
];

export const beforeYouPublish = [
  'I used real headings, in order.',
  'Every link says where it goes.',
  'Every image has alt text, or is marked decorative.',
  'Text is easy to read: good contrast, and not over a busy image.',
  'Nothing relies on color alone.',
  'Videos have accurate captions, and audio has a transcript.',
  'I used plain words and short sentences.',
  'I checked it on a phone and zoomed in to 200%.',
];
