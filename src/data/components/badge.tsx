import { useState } from 'react';
import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';

const BellIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
    <path d="M10 2a6 6 0 0 0-6 6v2.6l-1.3 2.6A1 1 0 0 0 3.6 15h12.8a1 1 0 0 0 .9-1.4L16 10.6V8a6 6 0 0 0-6-6Zm0 16a2.5 2.5 0 0 1-2.4-2h4.8a2.5 2.5 0 0 1-2.4 2Z" />
  </svg>
);

const STATUS = {
  paid: { label: 'Paid', cls: 'bg-emerald-100 text-emerald-900 ring-emerald-700/40 dark:bg-emerald-900/60 dark:text-emerald-50 dark:ring-emerald-300/40', icon: 'M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z' },
  due: { label: 'Due soon', cls: 'bg-amber-100 text-amber-900 ring-amber-700/40 dark:bg-amber-900/60 dark:text-amber-50 dark:ring-amber-300/40', icon: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4v4.6l3 1.8-1 1.7-4-2.4V6h2Z' },
  overdue: { label: 'Overdue', cls: 'bg-red-100 text-red-900 ring-red-700/40 dark:bg-red-900/60 dark:text-red-50 dark:ring-red-300/40', icon: 'M10 2 1 18h18L10 2Zm-1 6h2v5H9V8Zm0 6h2v2H9v-2Z' },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${s.cls}`}>
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d={s.icon} />
      </svg>
      {s.label}
    </span>
  );
}

function StatusDemo() {
  const rows: [string, string, keyof typeof STATUS][] = [
    ['INV-1042', '£240.00', 'paid'],
    ['INV-1043', '£95.50', 'due'],
    ['INV-1044', '£1,120.00', 'overdue'],
  ];
  return (
    <table className="w-full max-w-md text-left text-sm">
      <caption className="mb-2 text-left font-semibold">Recent invoices</caption>
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th scope="col" className="py-2 pr-4">Invoice</th>
          <th scope="col" className="py-2 pr-4">Amount</th>
          <th scope="col" className="py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([id, amount, status]) => (
          <tr key={id} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2 pr-4">{id}</td>
            <td className="py-2 pr-4">{amount}</td>
            <td className="py-2">
              <StatusBadge status={status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CountDemo() {
  const [count, setCount] = useState(3);
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setCount(0)}
        className="relative rounded-full p-2 text-gray-800 ring-1 ring-gray-300 hover:bg-gray-100 focus-ring dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-800"
      >
        <BellIcon />
        <span className="sr-only">Notifications{count ? `, ${count} unread` : ''}</span>
        {count > 0 && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-700 px-1 text-xs font-bold text-white ring-2 ring-white dark:ring-gray-900">
            {count}
          </span>
        )}
      </button>
      <button type="button" onClick={() => setCount((c) => c + 1)} className="link text-sm">
        Simulate a new notification
      </button>
    </div>
  );
}

export const badgeVariants: Variant[] = [
  {
    id: 'status',
    label: 'Status',
    description: 'A text label for a state, like Paid or Overdue. The text carries the meaning; color and icon only reinforce it.',
    Demo: StatusDemo,
    html: `<td>
  <span class="badge badge-danger">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
    Overdue
  </span>
</td>`,
  },
  {
    id: 'count',
    label: 'Count',
    description: 'A number on an icon button, like unread notifications. The number goes into the button’s name; the visual dot is hidden.',
    Demo: CountDemo,
    html: `<button type="button" class="icon-button">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  <!-- The count is part of the button's name -->
  <span class="sr-only">Notifications, 3 unread</span>
  <!-- The visual badge is hidden so it isn't read twice -->
  <span class="badge-count" aria-hidden="true">3</span>
</button>`,
  },
];

export const badge: ComponentSpec = {
  slug: 'badge',
  name: 'Badge',
  category: 'Feedback',
  summary: 'A badge is a small label that shows a status or a count, like “Overdue” or “3 unread”. It isn’t interactive on its own.',
  semantics: 'Plain text in a <span>; counts go into the parent control’s accessible name',
  whenToUse: [
    'Use a status badge to label the state of an item in a list or table.',
    'Use a count badge to show how many new or unread items there are.',
    'Use an alert instead when the status needs people’s attention right now.',
  ],
  keyboard: [{ keys: ['—'], action: 'Badges aren’t focusable. If a badge sits on a button or link, it’s announced as part of that control’s name.' }],
  aria: [
    { attr: 'Visible text', where: 'status badge', usage: 'The word itself (“Overdue”) carries the meaning. No ARIA needed.' },
    { attr: 'aria-hidden="true"', where: 'badge icon, count dot', usage: 'Hides decoration or a number that’s already in the control’s name.' },
    { attr: 'Visually hidden text', where: 'icon button with a count', usage: 'Gives the full name, like “Notifications, 3 unread”.' },
    { attr: 'role="status"', where: 'separate live region (optional)', usage: 'Announce “1 new notification” when the count goes up while people are on the page.' },
  ],
  focus: ['Badges never take focus themselves. Don’t add tabindex to make them “readable”; screen reader users reach them by reading.'],
  screenReader: [
    'Status announced as part of the row or text: “Overdue”.',
    'Count button announced as: “Notifications, 3 unread, button”.',
  ],
  dos: ['Use a word, not only a color or dot.', 'Keep badge text to one or two words.', 'Put the count in the control’s accessible name.'],
  donts: ['Don’t rely on red, amber and green alone.', 'Don’t make a badge look like a button if it isn’t one.', 'Don’t announce every count change if they happen often.'],
  wcag: [WCAG.useOfColor, WCAG.contrast, WCAG.nonTextContrast, WCAG.nameRoleValue, WCAG.statusMessages],
  testing: [
    'Turn on grayscale and confirm every status is still clear.',
    'Check badge text has 4.5:1 contrast against the badge fill.',
    'With a screen reader, focus the icon button and confirm the count is in its name and not read twice.',
    'Zoom to 200% and confirm badges wrap rather than overlap text.',
  ],
  Demo: StatusDemo,
};
