import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const ROWS = [
  ['Name', 'Amara Okafor'],
  ['Date of birth', '27 March 1990'],
  ['Email address', 'amara@example.com'],
];

/** A description list of answers, each with a Change link that names what it changes. */
function Demo() {
  return (
    <dl className="divide-y divide-gray-300 border-y border-gray-300 dark:divide-gray-600 dark:border-gray-600">
      {ROWS.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr_auto] sm:gap-4">
          <dt className="font-semibold">{k}</dt>
          <dd className="break-words">{v}</dd>
          <dd>
            <a href="#" onClick={(e) => e.preventDefault()} className="link">
              Change<span className="sr-only"> {k.toLowerCase()}</span>
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}

const code = `<dl>
  {rows.map(([key, value]) => (
    <div key={key}>
      <dt>{key}</dt>
      <dd>{value}</dd>
      <dd>
        <a href={\`/details/\${slug(key)}\`}>
          Change<span className="sr-only"> {key.toLowerCase()}</span>
        </a>
      </dd>
    </div>
  ))}
</dl>`;

export const summaryList: ComponentSpec = {
  slug: 'summary-list',
  name: 'Summary list',
  category: 'Data',
  summary: 'A summary list shows pairs of labels and values, like answers to check before submitting a form. It’s built as a description list.',
  semantics: '<dl> with <dt> and <dd> pairs',
  whenToUse: [
    'Use it to show a set of answers or properties, like on a “Check your answers” page.',
    'Use a table when people compare values across several items.',
    'Don’t use it for plain lists of one kind of thing.',
  ],
  keyboard: [{ keys: ['Tab'], action: 'Moves through the Change links.' }],
  aria: [
    { attr: '<dl> <dt> <dd>', where: 'list', usage: 'Pairs each label with its value. A div may wrap each pair.' },
    { attr: 'Visually hidden text', where: 'Change links', usage: '“Change date of birth” so every link is unique out of context.' },
  ],
  focus: ['Change links follow the reading order, one per row.', 'After changing an answer, return people to this page and the row they changed.'],
  screenReader: ['Screen readers announce a list of terms and definitions; support varies, so the hidden text in the link carries the meaning.', '“Change date of birth, link.”'],
  dos: ['Keep labels short and the same as the original questions.', 'Stack label and value on small screens.', 'Let long values like emails wrap.'],
  donts: ['Don’t use a table for one item’s properties.', 'Don’t write “Change” alone without hidden context.', 'Don’t make rows that can’t be changed look like links.'],
  wcag: [WCAG.infoRel, WCAG.linkPurpose, WCAG.reflow, WCAG.headings],
  testing: [
    'List links with a screen reader and confirm each Change link is unique.',
    'At 320px wide, confirm rows stack and long values wrap.',
    'Change an answer and confirm you return to the summary.',
  ],
  Demo,
  code,
  fluid: { source: 'Native HTML + Fluid styles', notes: ['A native description list with a grid layout on wider screens.'] },
};
