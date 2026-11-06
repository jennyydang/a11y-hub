import { Link } from 'react-router-dom';
import { Button } from '@fluid-design/fluid-ui';
import { components } from '../data/components';
import { foundations } from '../data/foundations';
import { roles } from '../data/roles';
import { toolPath, toolsFor } from '../data/tools';
import { useRole } from '../lib/useRole';
import { usePageTitle } from './usePageTitle';

const principles = [
  { title: 'Perceivable', body: 'Information shows up in more than one way: text alternatives, enough contrast, and never color alone.' },
  { title: 'Operable', body: 'Every control works with a keyboard, focus is always visible, and nothing moves faster than people can follow.' },
  { title: 'Understandable', body: 'Labels are clear, behavior is predictable, and errors explain how to fix them.' },
  { title: 'Robust', body: 'Components expose the right role, name and state, so they work with today’s and tomorrow’s assistive tech.' },
];

const features = [
  { title: 'Live, keyboard-ready examples', body: 'Every component runs on Fluid UI and can be tried with a keyboard right on the page.' },
  { title: 'Screen reader inspector', body: 'See the role, name, states and live announcements of whatever you focus, as you go.' },
  { title: 'Vision simulations', body: 'Preview each example with protanopia, deuteranopia, tritanopia, no color or blur.' },
  { title: 'Saved testing checklists', body: 'Work through manual checks per component. Your progress stays in this browser.' },
];

export function Home() {
  usePageTitle('');
  const [role, setRole] = useRole();
  const mine = roles.find((r) => r.id === role);
  const tool = mine ? toolsFor(mine.id).find((t) => t.id !== 'component-picker') : undefined;
  return (
    <div className="max-w-6xl">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-gray-900 px-6 py-14 text-white sm:px-12">
        <div className="bg-grid-white/[0.06] absolute inset-0" aria-hidden="true" />
        <div className="relative max-w-2xl space-y-5">
          <p className="chip bg-white/15 text-white">Accessibility guidance for everyone who makes the web</p>
          <h1 className="text-4xl font-bold tracking-tight outline-none sm:text-5xl">Make things everyone can use.</h1>
          <p className="text-lg leading-8 text-primary-50">
            Plain-language basics for anyone who writes, designs or publishes, plus detailed specs, live examples and tools for accessibility specialists.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button as={Link} to="/basics" className="btn-bold-[#ffffff] !text-primary-800" size="lg">
              Start with the basics
            </Button>
            <Button as={Link} to="/components" weight="clear" size="lg" className="!text-white ring-1 ring-inset ring-white/80 hover:!bg-white/10">
              Browse components
            </Button>
          </div>
        </div>
      </section>


      <section aria-labelledby="start-here" className="mt-12">
        <h2 id="start-here" className="text-2xl font-bold tracking-tight">
          {mine ? `Your next steps as ${mine.name === 'QA' ? 'QA' : `a ${mine.name.toLowerCase()} specialist`}` : 'Start here: what do you do?'}
        </h2>
        {mine ? (
          <>
            <p className="mt-2 max-w-3xl text-muted">
              Component pages now show the sections you need first. You can switch back to every section at the top of any component page.
            </p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { to: `/roles/${mine.id}`, title: `Read the ${mine.name} guide`, body: `What you own, and a ${mine.checklist.length}-point review checklist.` },
                { to: '/tools/component-picker', title: 'Pick a component', body: 'Answer a question or two to find the right one, then open its page.' },
                ...(tool ? [{ to: toolPath(tool.id), title: `Try: ${tool.name}`, body: tool.why[mine.id] ?? tool.description }] : []),
              ].map((s, i) => (
                <li key={s.to}>
                  <Link to={s.to} className="surface group flex h-full flex-col p-5 transition hover:shadow-md focus-ring">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">Step {i + 1}</span>
                    <span className="mt-1 text-lg font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">{s.title}</span>
                    <span className="mt-2 text-sm leading-6 text-muted">{s.body}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm">
              Not a {mine.name === 'QA' ? 'QA' : mine.name.toLowerCase()} specialist?{' '}
              <button type="button" className="link" onClick={() => setRole(null)}>
                Choose a different role
              </button>
            </p>
          </>
        ) : (
          <>
            <Link
              to="/basics"
              onClick={() => setRole(null)}
              className="surface group mt-6 flex flex-wrap items-center justify-between gap-4 p-5 ring-2 ring-primary-200 transition hover:shadow-md focus-ring dark:ring-primary-800"
            >
              <span className="max-w-2xl">
                <span className="block text-lg font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">I write, publish or market things</span>
                <span className="mt-1 block text-sm leading-6 text-muted">
                  Posts, pages, emails, social media, slides or PDFs. Accessibility basics in plain words, with a quick checklist for before you publish. No expertise needed.
                </span>
              </span>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                Start with the basics <span aria-hidden="true">→</span>
              </span>
            </Link>
            <p className="mt-8 max-w-3xl text-muted">
              <span className="font-semibold text-gray-900 dark:text-gray-50">Accessibility is part of your job?</span> Pick your specialism. We’ll open your guide, and component pages will
              show the sections you need. You can change this at any time.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/roles/${r.id}`}
                    onClick={() => setRole(r.id)}
                    className="surface group flex h-full flex-col p-5 transition hover:shadow-md focus-ring"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">{r.short}</span>
                    <span className="mt-1 text-lg font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">I work on {r.name === 'QA' ? 'QA' : r.name.toLowerCase()}</span>
                    <span className="mt-2 text-sm leading-6 text-muted">{r.owns.slice(0, 3).join(' · ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="agency" className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary-50 px-6 py-5 ring-1 ring-primary-200 dark:bg-primary-900/20 dark:ring-primary-800/60">
        <div className="max-w-2xl">
          <h2 id="agency" className="text-lg font-semibold">
            Redesigning a site for a client?
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            The agency playbook shows what to use at each phase. The deliverables builder exports what you hand over: component documentation, a testing summary, an issue log, a conformance summary and developer handoff notes.
          </p>
        </div>
        <Button as={Link} to="/agency" weight="light">
          Open the agency playbook
        </Button>
      </section>

      <section aria-labelledby="features" className="mt-16">
        <h2 id="features" className="text-2xl font-bold tracking-tight">
          What’s on every component page
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f.title} className="surface flex gap-4 p-5">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 flex-none text-primary-600 dark:text-primary-300">
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>


      <section aria-labelledby="start" className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 id="start" className="text-2xl font-bold tracking-tight">
            Foundations
          </h2>
          <ul className="mt-4 divide-y divide-gray-200/80 dark:divide-gray-800">
            {foundations.map((f) => (
              <li key={f.slug}>
                <Link to={`/foundations/${f.slug}`} className="flex items-center justify-between rounded-md px-2 py-3 font-medium hover:bg-gray-100 focus-ring dark:hover:bg-gray-800">
                  {f.name}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Components</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {components.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/components/${c.slug}`}
                  className="inline-block rounded-full bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-gray-200 hover:ring-primary-500 focus-ring dark:bg-gray-900 dark:ring-gray-700"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="principles" className="mt-16">
        <h2 id="principles" className="text-2xl font-bold tracking-tight">
          The four principles
        </h2>
        <p className="mt-2 max-w-3xl text-muted">WCAG groups its success criteria under four principles. Every page on this site maps back to them.</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li key={p.title} className="surface p-5">
              <span className="font-mono text-sm text-primary-700 dark:text-primary-300" aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className="mt-1 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
