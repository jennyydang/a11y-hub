import { Link } from 'react-router-dom';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

/** Newest first. Add an entry whenever guidance, a page or a tool changes. */
const CHANGES: { date: string; title: string; detail: string; to?: string }[] = [
  { date: '2026-11-06', title: 'Subtle motion', detail: 'Pages fade in, cards lift on hover, focus rings settle into place and panels ease open. All of it turns off when your device is set to reduce motion.', to: '/foundations/motion' },
  { date: '2026-11-06', title: 'Common problems and fixes', detail: 'Search by what you noticed, like “I can’t see where I am when I press Tab”, and get the cause and fix.', to: '/fixes' },
  { date: '2026-11-06', title: 'Tools for writers, designers and developers', detail: 'Social post checker, plain language checker, email and document templates, palette contrast grid and an automated test kit.', to: '/tools' },
  { date: '2026-11-06', title: 'Term tips and short versions', detail: 'Jargon is underlined with a plain-language tip, and every component and foundation page starts with the three rules that matter most.' },
  { date: '2026-11-06', title: 'Accessibility basics', detail: 'Plain-language guidance by task for anyone who writes, publishes or markets, with a “Before you publish” checklist.', to: '/basics' },
  { date: '2026-11-06', title: 'Agency playbook and deliverables builder', detail: 'Generate component documentation, a testing summary, an issue log, a conformance summary, an ACR and developer handoff notes.', to: '/agency' },
  { date: '2026-11-06', title: 'Pages tailored to your role', detail: 'Pick content, design, frontend or QA to see the sections you need first. The menu is now grouped and collapsible.' },
  { date: '2026-11-05', title: 'Good and bad examples on every component', detail: 'What people experience with each version: what a screen reader says, what happens with a keyboard, what people see.', to: '/components' },
  { date: '2026-11-05', title: 'Annotated page examples', detail: 'Sign-up, search results, dashboard and content pages, with where each part goes and why.', to: '/examples' },
  { date: '2026-11-05', title: 'Breadcrumbs move inside main', detail: 'Breadcrumbs now go first inside the main landmark, above the page heading.', to: '/components/breadcrumbs' },
  { date: '2026-11-04', title: 'Handoff worksheets', detail: 'Every component has a shared worksheet with content, design, frontend and QA tabs.', to: '/components' },
  { date: '2026-11-04', title: 'A11y Hub launched', detail: 'Component specs with live examples, foundations, role guides and testing checklists.' },
];

export function ChangelogPage() {
  usePageTitle('What’s new');
  return (
    <article className="max-w-3xl">
      <PageHeader eyebrow="Reference" title="What’s new">
        <p>Changes to the guidance, pages and tools, newest first.</p>
      </PageHeader>
      <ol className="space-y-6 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
        {CHANGES.map((c) => (
          <li key={c.title} className="relative">
            <span aria-hidden="true" className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-primary-700 dark:bg-primary-300" />
            <p className="text-sm text-muted">
              <time dateTime={c.date}>{new Date(`${c.date}T12:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
            </p>
            <h2 className="text-lg font-semibold">{c.to ? <Link to={c.to} className="link">{c.title}</Link> : c.title}</h2>
            <p className="leading-7">{c.detail}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}
