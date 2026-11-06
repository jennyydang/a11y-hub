import { useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { TextField } from '../ui';

interface Pattern {
  name: string;
  formula: string;
  examples: string[];
  avoid?: string;
}

const GROUPS: { title: string; intro: string; patterns: Pattern[] }[] = [
  {
    title: 'Buttons',
    intro: 'Start with a verb. Say what happens, not how to trigger it.',
    patterns: [
      { name: 'Action', formula: '[Verb] [object]', examples: ['Save changes', 'Download invoice', 'Add to basket'], avoid: 'Submit, OK, Click here' },
      { name: 'Icon-only (accessible name)', formula: '[Verb] [object] [which one, if repeated]', examples: ['Delete invoice INV-204', 'Close dialog', 'Edit shipping address'], avoid: 'Trash, X, Pencil icon' },
      { name: 'Destructive confirmation', formula: '[Verb] [exact thing]', examples: ['Delete project', 'Cancel subscription'], avoid: 'Yes, Continue' },
      { name: 'Keep / back out', formula: 'Keep [thing] or Don’t [verb]', examples: ['Keep project', 'Don’t cancel'], avoid: 'No, Cancel (when “Cancel” is also the action)' },
    ],
  },
  {
    title: 'Links',
    intro: 'Link text must make sense on its own, because screen reader users often hear links as a list.',
    patterns: [
      { name: 'Destination', formula: '[Name of the page or thing]', examples: ['Accessibility statement', 'Read the 2026 report'], avoid: 'Click here, Read more, Learn more' },
      { name: 'Download', formula: '[Name] ([type], [size])', examples: ['Annual report (PDF, 2.4 MB)'] },
      { name: 'New tab', formula: '[Name] (opens in a new tab)', examples: ['Fluid UI docs (opens in a new tab)'] },
    ],
  },
  {
    title: 'Labels and hints',
    intro: 'Labels are short nouns. Hints explain the format or why you’re asking.',
    patterns: [
      { name: 'Field label', formula: '[What to enter]', examples: ['Email address', 'Date of birth', 'Card number'], avoid: 'Please enter your email:' },
      { name: 'Format hint', formula: 'For example, [real example]', examples: ['For example, 27 3 2007', 'For example, name@example.com'] },
      { name: 'Why we ask', formula: 'We’ll use this to [purpose].', examples: ['We’ll only use this to send your receipt.'] },
      { name: 'Optional field', formula: '[Label] (optional)', examples: ['Company name (optional)'], avoid: 'Marking required fields with color alone' },
      { name: 'Length limit', formula: 'You can enter up to [n] characters', examples: ['You can enter up to 500 characters'] },
    ],
  },
  {
    title: 'Error messages',
    intro: 'Say what went wrong and how to fix it. Use the same words inline and in the error summary.',
    patterns: [
      { name: 'Missing (required)', formula: 'Enter [your/a] [thing]', examples: ['Enter your full name', 'Select how we should contact you'], avoid: 'Required, This field is required' },
      { name: 'Wrong format', formula: 'Enter [thing] in the format [format]', examples: ['Enter an email address in the format name@example.com'], avoid: 'Invalid email' },
      { name: 'Too long or short', formula: '[Thing] must be [n] characters or fewer/more', examples: ['Description must be 500 characters or fewer', 'Password must be 12 characters or more'] },
      { name: 'Out of range', formula: '[Thing] must be between [a] and [b]', examples: ['Quantity must be between 1 and 99'] },
      { name: 'Date', formula: '[Thing] must be in the past/future', examples: ['Date of birth must be in the past', 'Start date must be today or later'] },
      { name: 'File', formula: '[File name] [problem]', examples: ['report.docx is not a PDF or JPG', 'photo.jpg is larger than 10 MB'] },
      { name: 'Summary heading', formula: 'There is a problem', examples: ['There is a problem'], avoid: 'Error!, Oops' },
    ],
  },
  {
    title: 'Status and confirmation',
    intro: 'Short and specific. These are often announced by screen readers without moving focus.',
    patterns: [
      { name: 'Success', formula: '[Thing] [past-tense verb]', examples: ['Changes saved', 'Invoice sent to priya@example.com'], avoid: 'Success!' },
      { name: 'Loading', formula: '[Verb]ing [thing]…', examples: ['Uploading report.pdf…', 'Loading results…'], avoid: 'Please wait' },
      { name: 'Done loading', formula: '[Thing] [done]', examples: ['Upload complete', '24 results loaded'] },
      { name: 'Failure', formula: 'Couldn’t [verb]. [How to fix].', examples: ['Couldn’t save. Check your connection and try again.'], avoid: 'Something went wrong' },
      { name: 'Result count', formula: '[n] results', examples: ['5 results available', 'No results for “Narn”. Check the spelling.'] },
    ],
  },
  {
    title: 'Empty states',
    intro: 'Explain why it’s empty and what to do next.',
    patterns: [
      { name: 'Nothing yet', formula: 'You haven’t [verb]ed any [things] yet. [Action]', examples: ['You haven’t saved any searches yet. Save a search to see it here.'] },
      { name: 'Nothing matches', formula: 'No [things] match [filter]. [Action]', examples: ['No invoices match “overdue”. Clear filters'] },
    ],
  },
  {
    title: 'Alt text',
    intro: 'Describe purpose, not pixels. Use the decision tool above when unsure.',
    patterns: [
      { name: 'Photo', formula: '[Who/what] [doing what] [where, if it matters]', examples: ['Volunteers planting trees along the riverbank'], avoid: 'Image of people' },
      { name: 'Linked logo', formula: '[Organization] home', examples: ['Acme home'], avoid: 'Acme logo' },
      { name: 'Chart', formula: '[Chart type] of [data], described below', examples: ['Line chart of monthly sign-ups, described below'] },
      { name: 'Decorative', formula: 'alt="" (empty)', examples: ['alt=""'] },
    ],
  },
];

function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="xs"
      weight="light"
      color="gray"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? 'Copied' : 'Copy'}
      <span className="sr-only"> “{text}”</span>
    </Button>
  );
}

export function CopyPatterns() {
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();
  const match = (p: Pattern) => !q || [p.name, p.formula, ...p.examples, p.avoid ?? ''].join(' ').toLowerCase().includes(q);
  const groups = GROUPS.map((g) => ({ ...g, patterns: g.patterns.filter(match) })).filter((g) => g.patterns.length);
  const count = groups.reduce((n, g) => n + g.patterns.length, 0);

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <TextField label="Filter patterns" hint="For example: error, date, button, loading." value={filter} onChange={(e) => setFilter(e.target.value)} />
        <p role="status" className="mt-1 text-sm text-muted">
          {q ? `${count} ${count === 1 ? 'pattern' : 'patterns'} match` : ''}
        </p>
      </div>
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="text-lg font-semibold">{g.title}</h3>
          <p className="mb-3 text-sm text-muted">{g.intro}</p>
          <ul className="grid gap-3 md:grid-cols-2">
            {g.patterns.map((p) => (
              <li key={p.name} className="surface space-y-2 p-4 text-sm">
                <p className="font-semibold">{p.name}</p>
                <p>
                  <span className="text-muted">Pattern: </span>
                  <code className="font-mono text-[0.9em]">{p.formula}</code>
                </p>
                <ul className="space-y-1.5">
                  {p.examples.map((e) => (
                    <li key={e} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-1.5 dark:bg-gray-800/60">
                      <span>{e}</span>
                      <CopyChip text={e} />
                    </li>
                  ))}
                </ul>
                {p.avoid && (
                  <p>
                    <span className="font-semibold text-red-700 dark:text-red-300">Avoid: </span>
                    {p.avoid}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
