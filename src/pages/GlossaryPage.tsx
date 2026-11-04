import { useState } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../components/Section';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';
import { TextField } from '../ui';

interface Term {
  term: string;
  plain: string;
  why: string;
  see?: { label: string; to: string };
}

const TERMS: Term[] = [
  { term: 'Accessible name', plain: 'What a screen reader says to identify a control, like “Save changes” for a button.', why: 'Without one, a control is announced as just “button” and people can’t tell what it does.', see: { label: 'Button', to: '/components/button' } },
  { term: 'Accessible description', plain: 'Extra information read after the name, like a field’s hint or error.', why: 'It gives context without making the name long.', see: { label: 'Text input', to: '/components/text-input' } },
  { term: 'Alt text', plain: 'The text alternative for an image, written in the alt attribute.', why: 'It’s the only way people who can’t see the image get its meaning.', see: { label: 'Image & icon', to: '/components/image' } },
  { term: 'ARIA', plain: 'Extra HTML attributes that tell assistive technology what a custom element is and what state it’s in.', why: 'It fills gaps when native HTML can’t. Wrong ARIA is worse than none.', see: { label: 'Semantics & ARIA', to: '/foundations/semantics' } },
  { term: 'Assistive technology', plain: 'Software or hardware people use to access computers, like screen readers, magnifiers, switch devices and voice control.', why: 'Your interface has to work with all of them, not just a mouse.' },
  { term: 'Color contrast', plain: 'How different two colors are in brightness, written as a ratio like 4.5:1.', why: 'Low contrast is hard to read for people with low vision and in bright light.', see: { label: 'Color & contrast', to: '/foundations/color' } },
  { term: 'Decorative image', plain: 'An image that adds nothing the text doesn’t already say. It gets an empty alt (alt="").', why: 'Screen readers skip it, so people don’t hear noise.', see: { label: 'Image & icon', to: '/components/image' } },
  { term: 'Focus', plain: 'The element that receives keyboard input right now.', why: 'Keyboard users need to see where they are and move through the page in a sensible order.', see: { label: 'Focus management', to: '/foundations/focus' } },
  { term: 'Focus indicator', plain: 'The visible outline or ring around the focused element.', why: 'Without it, keyboard users are lost.', see: { label: 'Focus management', to: '/foundations/focus' } },
  { term: 'Focus order', plain: 'The order Tab moves through interactive elements.', why: 'It should follow the visual reading order.' },
  { term: 'Focus trap', plain: 'Keeping Tab inside one area, like an open dialog.', why: 'Right for modal dialogs. Anywhere else it strands keyboard users.', see: { label: 'Dialog', to: '/components/dialog' } },
  { term: 'Heading level', plain: 'The rank of a heading, from h1 (page title) to h6.', why: 'Screen reader users jump by headings to skim, like reading a table of contents.' },
  { term: 'Keyboard trap', plain: 'A place you can Tab into but not out of.', why: 'It’s a WCAG failure that can make a page unusable.' },
  { term: 'Label', plain: 'Visible text that names a form field, linked to it in code.', why: 'Clicking it focuses the field, and screen readers read it with the field.', see: { label: 'Text input', to: '/components/text-input' } },
  { term: 'Landmark', plain: 'A named region of the page, like header, navigation, main or footer.', why: 'Screen reader users jump between landmarks to find content fast.' },
  { term: 'Live region', plain: 'An area whose changes are read out automatically, without moving focus.', why: 'It’s how status messages like “Saved” reach screen reader users.', see: { label: 'Toast', to: '/components/toast' } },
  { term: 'Polite and assertive', plain: 'How urgently a live region speaks: polite waits for a pause, assertive interrupts.', why: 'Use assertive only for errors and urgent alerts.', see: { label: 'Alert', to: '/components/alert' } },
  { term: 'Reduced motion', plain: 'A system setting asking apps to minimize animation.', why: 'Motion can cause dizziness and nausea for some people.', see: { label: 'Motion & animation', to: '/foundations/motion' } },
  { term: 'Reflow', plain: 'Content rearranging to fit a narrow screen or high zoom without sideways scrolling.', why: 'People who zoom to 400% need to read without scrolling in two directions.', see: { label: 'Text, zoom & reflow', to: '/foundations/text' } },
  { term: 'Role', plain: 'What kind of thing an element is, like button, link, checkbox or tab.', why: 'It tells people how to interact with it.' },
  { term: 'Roving tabindex', plain: 'A technique where a group (like tabs) is one Tab stop, and arrow keys move inside it.', why: 'It keeps Tab short and matches how native controls behave.', see: { label: 'Tabs', to: '/components/tabs' } },
  { term: 'Screen reader', plain: 'Software that reads the screen aloud or to a braille display, like VoiceOver, NVDA or JAWS.', why: 'Blind and many low-vision people use one to navigate.', see: { label: 'QA guide', to: '/roles/qa' } },
  { term: 'Semantic HTML', plain: 'Using the HTML element that matches the meaning, like <button> for buttons and <nav> for navigation.', why: 'It gives keyboard and screen reader support for free.', see: { label: 'Semantics & ARIA', to: '/foundations/semantics' } },
  { term: 'State', plain: 'A changing condition of a control, like checked, expanded, pressed or selected.', why: 'It must be announced, not just shown with color.' },
  { term: 'Target size', plain: 'The size of the area you can click or tap.', why: 'Small targets are hard for people with tremors or on touch screens. Minimum 24×24px.' },
  { term: 'Visually hidden', plain: 'Text hidden on screen but still read by screen readers, often with a class like sr-only.', why: 'It adds context, like “(opens in a new tab)”, without cluttering the design.' },
  { term: 'WCAG', plain: 'The Web Content Accessibility Guidelines: the international standard, with levels A, AA and AAA.', why: 'Most laws and policies require Level AA.' },
];

export function GlossaryPage() {
  usePageTitle('Glossary');
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();
  const shown = TERMS.filter((t) => !q || `${t.term} ${t.plain}`.toLowerCase().includes(q));

  return (
    <article className="max-w-3xl">
      <PageHeader eyebrow="Reference" title="Glossary">
        <p>Plain-language definitions of the terms used across A11y Hub, and why each one matters.</p>
      </PageHeader>
      <div className="mb-6 max-w-md">
        <TextField label="Filter terms" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <p role="status" className="mt-1 text-sm text-muted">
          {q ? `${shown.length} ${shown.length === 1 ? 'term' : 'terms'} match` : ''}
        </p>
      </div>
      <dl className="divide-y divide-gray-200 dark:divide-gray-800">
        {shown.map((t) => (
          <div key={t.term} id={slugify(t.term)} className="scroll-mt-24 py-5">
            <dt className="text-lg font-semibold">{t.term}</dt>
            <dd className="mt-1 space-y-1 leading-7">
              <p>{t.plain}</p>
              <p className="text-muted">
                <strong className="text-gray-900 dark:text-gray-50">Why it matters:</strong> {t.why}
              </p>
              {t.see && (
                <p className="text-sm">
                  See{' '}
                  <Link to={t.see.to} className="link">
                    {t.see.label}
                  </Link>
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
