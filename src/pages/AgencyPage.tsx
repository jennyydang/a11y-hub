import { Link } from 'react-router-dom';
import { Button } from '@fluid-design/fluid-ui';
import { Section } from '../components/Section';
import { DELIVERABLES, responsibility, type DeliverableId } from '../lib/deliverables';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

interface Phase {
  name: string;
  goal: string;
  use: [string, string][];
  deliver: DeliverableId[];
  alsoDeliver?: string[];
}

const phases: Phase[] = [
  {
    name: 'Discovery and audit',
    goal: 'Find out how accessible the client’s current site is, so the redesign fixes real problems and you can show the improvement.',
    use: [
      ['/checklist', 'Testing checklist: page-level checks to run on each current template'],
      ['/tools/markup-checker', 'Markup checker: paste HTML from the current site for an automated WCAG scan'],
      ['/tools/contrast-checker', 'Contrast checker: confirm color failures in the current brand palette'],
      ['/tools/screen-reader-cheat-sheet', 'Screen reader cheat sheet: commands for manual testing'],
    ],
    deliver: ['audit'],
  },
  {
    name: 'Kickoff and scope',
    goal: 'Agree the standard, the browsers and assistive technology you’ll support, and what’s in and out of scope, before anyone designs anything.',
    use: [
      ['/foundations/layout', 'Page layout and placement: where landmarks and common parts go'],
      ['/tools/component-picker', 'Which component should I use?: settle component choices early'],
      ['/roles/content', 'Role guides: who owns what, to staff the project'],
    ],
    deliver: ['scope'],
  },
  {
    name: 'Design',
    goal: 'Make accessibility visible in the design files, so the build team doesn’t have to guess.',
    use: [
      ['/tools/annotation-kit', 'Annotation kit: markers for focus order, headings and landmarks'],
      ['/examples', 'Page examples: annotated layouts for sign-up, search, dashboard and article pages'],
      ['/roles/design', 'Design guide: contrast, focus, target size and states'],
      ['/tools/copy-patterns', 'Copy patterns: proven wording for labels, errors and messages'],
    ],
    deliver: [],
    alsoDeliver: ['Annotated design files', 'Content and design tabs of each component’s handoff worksheet'],
  },
  {
    name: 'Build',
    goal: 'Build every component to spec, in whatever stack the client uses.',
    use: [
      ['/components', 'Component pages: the HTML tab is framework-free, so it works with any design system, not just Fluid UI'],
      ['/foundations/semantics', 'Semantics & ARIA: when native HTML is enough and when ARIA is needed'],
      ['/roles/frontend', 'Frontend guide: what developers own'],
    ],
    deliver: ['components', 'devhandoff'],
    alsoDeliver: ['Frontend tab of each component’s handoff worksheet'],
  },
  {
    name: 'QA and launch',
    goal: 'Prove the new site meets the standard, get sign-off, and publish an honest accessibility statement.',
    use: [
      ['/roles/qa', 'QA guide: how to test, and the QA tab of every worksheet with bug reports'],
      ['/progress', 'Team progress: see which components are tested'],
    ],
    deliver: ['testplan', 'testsummary', 'issuelog', 'conformance', 'statement'],
  },
];

export function AgencyPage() {
  usePageTitle('Agency playbook');
  return (
    <article className="max-w-4xl">
      <PageHeader eyebrow="For agencies" title="Use A11y Hub on a client redesign">
        <p>
          Redesigning a site for someone else? Use this hub as your accessibility reference, and the deliverables builder to turn your scope into documents the client can
          review, sign off and keep.
        </p>
      </PageHeader>

      <div className="mb-12 rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-200 dark:bg-primary-900/20 dark:ring-primary-800/60">
        <h2 className="text-lg font-semibold">Client deliverables builder</h2>
        <p className="mt-1 leading-7">
          Enter the client, the pages and components in scope, your test results and your issue log. Export the five required delivery documents, plus four supporting ones, as HTML (print to PDF) or Markdown.
        </p>
        <div className="mt-4 flex">
          <Button as={Link} to="/tools/deliverables" className="btn-bold-primary">
            Open the deliverables builder
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        <Section
          title="Required at delivery"
          intro={<p>The five documents agencies must hand over, with WCAG 2.2 AA as the baseline. The builder generates each one from the specs on this site, your test results and your issue log.</p>}
        >
          <ol className="grid gap-3 sm:grid-cols-2">
            {DELIVERABLES.filter((d) => d.required).map((d, i) => (
              <li key={d.id} className="surface p-4">
                <p className="font-semibold">
                  <span className="text-primary-700 dark:text-primary-300">{i + 1}.</span> {d.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">{d.description}</p>
              </li>
            ))}
          </ol>
          <div className="surface space-y-2 p-5 text-sm leading-6">
            <h3 className="font-semibold">Who fixes what</h3>
            <ul className="list-disc space-y-1 pl-5">
              {responsibility({ agency: 'The agency', client: 'The client' }).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="Supporting documents" intro={<p>Useful earlier in the project. The builder makes these too.</p>}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {DELIVERABLES.filter((d) => !d.required).map((d) => (
              <li key={d.id} className="surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">{d.when}</p>
                <p className="mt-1 font-semibold">{d.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{d.description}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Project phases" intro={<p>What to use from this hub at each stage of a redesign, and what to deliver at the end of it.</p>}>
          <ol className="space-y-6">
            {phases.map((ph, i) => (
              <li key={ph.name} className="surface p-5">
                <h3 className="text-lg font-semibold">
                  <span className="text-primary-700 dark:text-primary-300">{i + 1}.</span> {ph.name}
                </h3>
                <p className="mt-1 leading-7 text-muted">{ph.goal}</p>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold">Use from this hub</h4>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6">
                      {ph.use.map(([to, label]) => {
                        const [name, rest] = label.split(': ');
                        return (
                          <li key={to}>
                            <Link to={to} className="link">
                              {name}
                            </Link>
                            {rest && <span className="text-muted">: {rest}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Deliver</h4>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6">
                      {ph.deliver.map((id) => (
                        <li key={id}>
                          {DELIVERABLES.find((d) => d.id === id)?.name} <span className="text-muted">(from the builder)</span>
                        </li>
                      ))}
                      {ph.alsoDeliver?.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Working with another design system">
          <div className="surface space-y-2 p-5 leading-7">
            <p>
              The live examples here are built with Fluid UI, but the accessibility requirements are the same in any stack. Use each component’s HTML tab, keyboard table and ARIA
              table as the spec, and check that the client’s own components behave the same way.
            </p>
            <p>The “Fluid UI notes” section on each component page only applies to this site’s build. You can leave it out of client documents. The builder already does.</p>
          </div>
        </Section>
      </div>
    </article>
  );
}
