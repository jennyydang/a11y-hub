/**
 * How the accessibility lead and the content, design, frontend and QA SMEs add a component or section to A11y Hub.
 * Shown on /process, and mirrored in CONTRIBUTING.md and the GitHub templates.
 */
export type ProcessRole = 'lead' | 'content' | 'design' | 'frontend' | 'qa';

export const PROCESS_ROLES: { id: ProcessRole; name: string; short: string }[] = [
  { id: 'lead', name: 'Accessibility lead', short: 'Lead' },
  { id: 'design', name: 'Design SME', short: 'Design' },
  { id: 'content', name: 'Content SME', short: 'Content' },
  { id: 'frontend', name: 'Frontend SME', short: 'Frontend' },
  { id: 'qa', name: 'QA SME', short: 'QA' },
];

export interface Stage {
  id: string;
  name: string;
  /** Who leads this stage. */
  owner: ProcessRole;
  goal: string;
  steps: string[];
  /** What exists when the stage is done. */
  output: string;
  /** What each role does in this stage. Missing roles aren't needed. */
  roles: Partial<Record<ProcessRole, string>>;
}

export const stages: Stage[] = [
  {
    id: 'propose',
    name: 'Propose',
    owner: 'lead',
    goal: 'Agree that the hub needs it, and that nothing already covers it.',
    steps: [
      'Anyone opens a “New component or section” request on GitHub, with the problem it solves and where it’s used.',
      'Search the hub first. If an existing page nearly covers it, propose a variation or an update instead.',
      'The accessibility lead accepts it, sets a priority and names one SME per role.',
    ],
    output: 'An accepted request with a named person for each role and a target date.',
    roles: {
      lead: 'Triage the request, check for overlap, assign people.',
      design: 'Share where it appears in designs, with screenshots.',
      content: 'Note the words it needs: labels, messages, alt text.',
      frontend: 'Check whether Fluid UI or Headless UI already provides it.',
      qa: 'Flag known defects with similar patterns.',
    },
  },
  {
    id: 'research',
    name: 'Research and cite',
    owner: 'lead',
    goal: 'Ground the guidance in sources, before anyone writes it.',
    steps: [
      'Find the ARIA Authoring Practices pattern, if there is one. If there isn’t, say so and explain the native HTML you’ll use.',
      'List the WCAG 2.2 success criteria that apply.',
      'Find at least one tested reference implementation, such as the GOV.UK Design System or Inclusive Components.',
      'Note known screen reader or browser support gaps, with the versions tested.',
      'Record every source in src/data/sources.ts with its title, publisher and URL.',
    ],
    output: 'A short research note in the request, and the sources entry.',
    roles: {
      lead: 'Lead the research and decide where sources disagree.',
      frontend: 'Check APG behavior and current assistive technology support.',
      design: 'Collect reference designs and research findings.',
      content: 'Find content guidance, like style guides and plain language rules.',
      qa: 'Find known failures and test techniques for the criteria.',
    },
  },
  {
    id: 'draft',
    name: 'Draft, by role',
    owner: 'frontend',
    goal: 'Each SME writes their part at the same time, on one branch.',
    steps: [
      'Design: anatomy, states, focus indicator, contrast, target size and placement.',
      'Content: when to use it, labels, messages and the handoff worksheet’s content fields, including screen reader only text that needs translating.',
      'Frontend: semantics, keyboard map, ARIA table, the live demo, code and Fluid UI notes.',
      'QA: the testing checklist and acceptance criteria, written so they can pass or fail.',
      'Write in plain language. Define new jargon in the glossary.',
    ],
    output: 'A pull request with the component data, demo, worksheet and sources.',
    roles: {
      design: 'Anatomy, states, focus, contrast, target size, placement, do and don’t.',
      content: 'When to use, worksheet content, error and status messages, plain language.',
      frontend: 'Spec data, demo, code, keyboard and ARIA tables, Fluid notes.',
      qa: 'Testing checklist and acceptance criteria.',
      lead: 'Answer questions and unblock decisions.',
    },
  },
  {
    id: 'review',
    name: 'Review across roles',
    owner: 'lead',
    goal: 'Catch gaps between roles, not just within them.',
    steps: [
      'Each SME reviews one other role’s part: design reviews content, content reviews frontend, frontend reviews QA and QA reviews design.',
      'The accessibility lead reviews the whole page against the definition of done.',
      'Disagreements are settled with sources, and the decision is noted in the pull request.',
    ],
    output: 'An approved pull request with every review comment resolved.',
    roles: {
      lead: 'Final review against the definition of done. Approves or sends back.',
      design: 'Review the content part.',
      content: 'Review the frontend part for wording and plain language.',
      frontend: 'Review the QA checklist for accuracy.',
      qa: 'Review the design part for testable requirements.',
    },
  },
  {
    id: 'test',
    name: 'Test',
    owner: 'qa',
    goal: 'Prove the demo and the guidance work with real assistive technology.',
    steps: [
      'Automated: npm test passes, including axe on every page in light and dark mode.',
      'Keyboard only: every interaction in the keyboard map works, and focus is always visible.',
      'Screen readers: test with at least two, such as NVDA with Firefox and VoiceOver with Safari. Record versions.',
      'Zoom to 400% and check reflow at 320px wide. Check with reduced motion on.',
      'Fix what fails, or document it as a known issue on the page.',
    ],
    output: 'Test results recorded in the pull request.',
    roles: {
      qa: 'Run and record the manual tests.',
      frontend: 'Fix defects, keep npm test green.',
      design: 'Check zoom, contrast and forced colors.',
      content: 'Check what the screen reader says matches the worksheet.',
      lead: 'Spot-check the results.',
    },
  },
  {
    id: 'publish',
    name: 'Publish',
    owner: 'lead',
    goal: 'Ship it and tell people.',
    steps: [
      'Merge the pull request. The site deploys itself.',
      'Add an entry to What’s new.',
      'Add the review date to src/data/sources.ts.',
      'Tell the team, and link the new page from related pages.',
    ],
    output: 'The page is live, with a last-reviewed date.',
    roles: {
      lead: 'Merge, announce, set the review date.',
      content: 'Write the What’s new entry.',
      frontend: 'Link it from related components and role guides.',
    },
  },
  {
    id: 'maintain',
    name: 'Maintain',
    owner: 'lead',
    goal: 'Keep guidance accurate as standards, browsers and our products change.',
    steps: [
      'Review every page at least once a year, or sooner when WCAG, the APG or assistive technology support changes.',
      'Anyone can report a problem from the page’s “Sources and review” section.',
      'Re-run this process from “Research and cite” for any substantial change.',
    ],
    output: 'An updated review date, and a What’s new entry for anything that changed.',
    roles: {
      lead: 'Own the review calendar.',
      design: 'Flag design system changes.',
      content: 'Flag style guide changes.',
      frontend: 'Flag library and browser changes.',
      qa: 'Flag recurring defects that the guidance should prevent.',
    },
  },
];

/** The checklist a new component must pass before it's merged. */
export const definitionOfDone: string[] = [
  'Summary, when to use it, and when not to, in plain language',
  'Live demo built on the semantics in the spec, working with keyboard and screen readers',
  'Keyboard map and ARIA table that match the demo',
  'Focus behavior described, with a visible focus indicator at 3:1 contrast',
  'Anatomy, states and placement guidance from design',
  'Do and don’t examples, and good and bad examples',
  'Handoff worksheet entry with content fields and design requirements (src/data/requirements.ts)',
  'Every string that needs translation is a worksheet content field, including aria-label, aria-valuetext, alt and visually hidden text',
  'Role notes for content, design, frontend and QA (componentRoles in src/data/roles.ts)',
  'Testing checklist with pass/fail acceptance criteria',
  'WCAG 2.2 criteria listed',
  'Sources cited: APG pattern or native HTML rationale, plus at least one tested reference (src/data/sources.ts)',
  'New jargon added to the glossary',
  'npm test passes, plus manual keyboard, two screen readers, 400% zoom and reduced motion',
  'Reviewed by another role for each part, and by the accessibility lead',
  'What’s new entry and a last-reviewed date',
];

/** For a new page or section that isn't a component, like a foundation, tool or guide. */
export const sectionSteps: string[] = [
  'Propose it, with who it’s for and what they’ll do with it.',
  'Cite the sources the guidance is based on, on the page itself.',
  'Write for the audience: plain language for everyone, technical detail where specialists need it.',
  'If it adds a section to component pages, add it to src/data/roleSections.ts for the roles who need it.',
  'Link it from the sidebar so the automated tests scan it.',
  'Have one SME from another role and the accessibility lead review it.',
  'Add a What’s new entry.',
];

/** What counts as a source, best first. */
export const sourceRules: { kind: string; examples: string; use: string }[] = [
  { kind: 'Standards', examples: 'WCAG 2.2 and Understanding docs, HTML and ARIA specs', use: 'What is required. Always cite these for requirements.' },
  { kind: 'Authoring practices', examples: 'ARIA Authoring Practices Guide (APG)', use: 'Expected keyboard and ARIA behavior for widgets.' },
  { kind: 'Tested design systems', examples: 'GOV.UK Design System, other systems that publish user research', use: 'Patterns proven with disabled users, and known issues.' },
  { kind: 'Expert testing', examples: 'Articles that test with named screen readers and versions', use: 'Real-world support and gaps. Note the date; support changes.' },
  { kind: 'Our own testing', examples: 'Results recorded in the pull request', use: 'What we verified ourselves, with tools and versions.' },
];
