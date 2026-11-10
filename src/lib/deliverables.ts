import { anatomy } from '../data/anatomy';
import { components, findComponent } from '../data/components';
import { glance } from '../data/glance';
import { htmlExamples } from '../data/html';
import { pageChecks } from '../data/pageChecks';
import { worksheets } from '../data/requirements';
import { LOCALIZATION_RULES, ariaTranslation, fieldTranslation } from './translation';
import { roles } from '../data/roles';
import type { ComponentSpec, WcagRef } from '../data/types';
import { WCAG, wcagUrl } from '../data/wcag';

/**
 * Agency deliverables: client-ready documents generated from a project scope,
 * test results, the issue log and the specs on this site. One document model
 * renders to the on-page preview, Markdown and standalone HTML (print to PDF).
 */

export type Severity = 'blocker' | 'major' | 'minor';
export type IssueSource = 'baseline' | 'delivery';
export type IssueOwner = 'agency' | 'client' | 'shared';
export type IssueStatus = 'open' | 'in-progress' | 'fixed' | 'verified' | 'retest-failed' | 'accepted';

export interface Finding {
  id: string;
  /** Sequential number, shown as A11Y-001. */
  n: number;
  source: IssueSource;
  page: string;
  issue: string;
  component: string;
  wcag: string;
  severity: Severity;
  recommendation: string;
  owner: IssueOwner;
  status: IssueStatus;
  retestDate: string;
  retestNote: string;
}

export interface TestRecord {
  automated: boolean;
  manual: boolean;
  date: string;
}

export interface AgencyProject {
  client: string;
  project: string;
  agency: string;
  contact: string;
  target: 'WCAG 2.2 AA' | 'WCAG 2.1 AA';
  pages: string;
  outOfScope: string;
  support: string[];
  components: string[];
  /** Keyed by component slug, or `page:<template name>`. */
  tests: Record<string, TestRecord>;
  findings: Finding[];
  /** ACR rows the agency has adjusted by hand, keyed by success criterion id. */
  acr: Record<string, AcrOverride>;
}

export const ACR_LEVELS = ['Supports', 'Partially Supports', 'Does Not Support', 'Not Applicable', 'Not Evaluated'] as const;
export type AcrLevel = (typeof ACR_LEVELS)[number];
export interface AcrOverride {
  level?: AcrLevel;
  remark?: string;
}

export const SUPPORT_OPTIONS = [
  'Keyboard only (Chrome, Firefox, Safari, Edge)',
  'NVDA with Chrome or Firefox (Windows)',
  'JAWS with Chrome (Windows)',
  'VoiceOver with Safari (macOS)',
  'VoiceOver with Safari (iOS)',
  'TalkBack with Chrome (Android)',
  'Zoom to 200% and 400% (reflow)',
  'Windows High Contrast (forced colors)',
];

export const SEVERITIES: { id: Severity; label: string; hint: string }[] = [
  { id: 'blocker', label: 'Blocker', hint: 'Someone can’t complete the task at all.' },
  { id: 'major', label: 'Major', hint: 'The task is possible but hard, slow or confusing.' },
  { id: 'minor', label: 'Minor', hint: 'An annoyance that doesn’t stop the task.' },
];

export const STATUSES: { id: IssueStatus; label: string; outstanding: boolean }[] = [
  { id: 'open', label: 'Open', outstanding: true },
  { id: 'in-progress', label: 'In progress', outstanding: true },
  { id: 'fixed', label: 'Fixed, awaiting retest', outstanding: true },
  { id: 'retest-failed', label: 'Retest failed', outstanding: true },
  { id: 'verified', label: 'Retest passed (closed)', outstanding: false },
  { id: 'accepted', label: 'Accepted as known limitation', outstanding: false },
];

export const SOURCES: { id: IssueSource; label: string }[] = [
  { id: 'delivery', label: 'Testing of delivered work' },
  { id: 'baseline', label: 'Baseline audit of the current site' },
];

export const ownerLabel = (o: IssueOwner, p: Pick<AgencyProject, 'agency' | 'client'>) =>
  o === 'agency' ? or(p.agency, 'Agency') : o === 'client' ? or(p.client, 'Client') : 'Shared';
export const statusLabel = (s: IssueStatus) => STATUSES.find((x) => x.id === s)?.label ?? s;
export const isOutstanding = (f: Finding) => STATUSES.find((x) => x.id === f.status)?.outstanding ?? true;
export const issueRef = (f: Finding) => `A11Y-${String(f.n).padStart(3, '0')}`;

/** The agreed split of who fixes what. */
export const responsibility = (p: Pick<AgencyProject, 'agency' | 'client'>) => [
  `${or(p.agency, 'The agency')} addresses accessibility defects attributable to its design specifications, code and deliverables, within the agreed project scope.`,
  `${or(p.client, 'The client')} validates the integrated website and addresses issues introduced during its own implementation and content integration.`,
];

export const emptyProject = (): AgencyProject => ({
  client: '',
  project: '',
  agency: '',
  contact: '',
  target: 'WCAG 2.2 AA',
  pages: '',
  outOfScope: '',
  support: SUPPORT_OPTIONS.slice(0, 5),
  components: [],
  tests: {},
  findings: [],
  acr: {},
});

/** Fill in fields added since a project was saved, so older project files still open. */
export function normalizeProject(raw: Partial<AgencyProject>): AgencyProject {
  const base = { ...emptyProject(), ...raw, tests: raw.tests ?? {}, acr: raw.acr ?? {} };
  const saved = (raw.findings ?? []) as Partial<Finding>[];
  let next = Math.max(0, ...saved.map((f) => f.n ?? 0));
  base.findings = saved.map((f) => ({
    source: 'baseline',
    owner: 'agency',
    status: 'open',
    retestDate: '',
    retestNote: '',
    recommendation: '',
    page: '',
    component: '',
    wcag: '',
    severity: 'major',
    ...f,
    n: f.n ?? ++next,
  })) as Finding[];
  return base;
}

export type DeliverableId = 'components' | 'testsummary' | 'issuelog' | 'conformance' | 'devhandoff' | 'acr' | 'audit' | 'scope' | 'testplan' | 'statement';

export const DELIVERABLES: { id: DeliverableId; name: string; when: string; required: boolean; description: string }[] = [
  {
    id: 'components',
    name: 'Component accessibility documentation',
    when: 'Delivery',
    required: true,
    description: 'WCAG requirements, interaction behavior, keyboard and focus, semantic HTML and ARIA, and acceptance criteria for every component, ready for the pattern library.',
  },
  {
    id: 'testsummary',
    name: 'Accessibility testing summary',
    when: 'Delivery',
    required: true,
    description: 'Automated and manual testing performed on delivered components and templates: methods, coverage, results and issues found.',
  },
  {
    id: 'issuelog',
    name: 'Accessibility issue and remediation log',
    when: 'Delivery',
    required: true,
    description: 'Every defect found in delivered work, with severity, owner, remediation status, retest results and what’s still outstanding.',
  },
  {
    id: 'conformance',
    name: 'WCAG conformance summary',
    when: 'Delivery',
    required: true,
    description: 'Each applicable success criterion evaluated against the delivered components and templates, with results and known limitations.',
  },
  {
    id: 'devhandoff',
    name: 'Developer handoff documentation',
    when: 'Delivery',
    required: true,
    description: 'Implementation guidance, what not to break, regression checks and open issues, so the client’s frontend team can keep components accessible.',
  },
  {
    id: 'acr',
    name: 'Accessibility Conformance Report (VPAT format)',
    when: 'Delivery',
    required: false,
    description: 'Every WCAG A and AA criterion in the VPAT 2.5 table format, filled in from your test results and issue log.',
  },
  {
    id: 'audit',
    name: 'Baseline audit report',
    when: 'Discovery',
    required: false,
    description: 'What’s wrong with the current site, by severity and WCAG criterion, with a recommendation for each finding.',
  },
  {
    id: 'scope',
    name: 'Accessibility requirements and scope',
    when: 'Kickoff',
    required: false,
    description: 'Conformance target, supported browsers and assistive tech, pages and components in scope, and who owns what.',
  },
  {
    id: 'testplan',
    name: 'Test plan and sign-off sheet',
    when: 'QA',
    required: false,
    description: 'Test environments, page-level and per-component checks with result columns, and a sign-off table.',
  },
  {
    id: 'statement',
    name: 'Accessibility statement (draft)',
    when: 'Launch',
    required: false,
    description: 'A starting draft of the public accessibility statement for the client’s new site.',
  },
];

// ---------- Document model ----------

export type Block =
  | { t: 'h'; level: 1 | 2 | 3; text: string }
  | { t: 'p'; text: string }
  | { t: 'meta'; rows: [string, string][] }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'code'; lang: string; text: string }
  | { t: 'note'; text: string };

export interface Doc {
  id: DeliverableId;
  title: string;
  blocks: Block[];
}

const allWcag = Object.values(WCAG) as WcagRef[];
const wcagById = (id: string) => allWcag.find((w) => w.id === id);
const PAGE_LEVEL_WCAG = ['1.3.1', '1.4.3', '1.4.10', '1.4.11', '2.1.1', '2.4.1', '2.4.2', '2.4.3', '2.4.7', '2.4.11', '3.1.1', '4.1.2'];
const TBD = '[to be confirmed]';

function or(v: string, fallback: string) {
  return v.trim() ? v.trim() : fallback;
}
export const lines = (v: string) =>
  v
    .split('\n')
    .map((l) => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
const today = () => new Date().toISOString().slice(0, 10);
const specsFor = (p: AgencyProject): ComponentSpec[] =>
  components.filter((c) => p.components.includes(c.slug)).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
/** Criteria that are new in WCAG 2.2, so out of scope for a 2.1 target. */
const NEW_IN_22 = ['2.4.11', '2.5.7', '2.5.8', '3.2.6', '3.3.7', '3.3.8'];
const inTarget = (p: AgencyProject, w: WcagRef) => w.level !== 'AAA' && !(p.target === 'WCAG 2.1 AA' && NEW_IN_22.includes(w.id));
const wcagText = (id: string) => {
  const w = wcagById(id);
  return w ? `${w.id} ${w.name}` : id || '—';
};
const sevLabel = (s: Severity) => SEVERITIES.find((x) => x.id === s)?.label ?? s;
const location = (f: Finding) => [f.page, findComponent(f.component)?.name].filter(Boolean).join(' · ') || '—';
const delivery = (p: AgencyProject) => p.findings.filter((f) => f.source === 'delivery');
const yes = (b: boolean) => (b ? 'Yes' : 'No');

type Result = 'Not tested' | 'Partly tested' | 'Pass' | 'Pass after fixes' | 'Fail';
/** A component or template's result, from its test record and the delivery issues logged against it. */
function resultFor(p: AgencyProject, key: string, match: (f: Finding) => boolean): Result {
  const t = p.tests[key];
  if (!t || (!t.automated && !t.manual)) return 'Not tested';
  if (!t.automated || !t.manual) return 'Partly tested';
  const issues = delivery(p).filter(match);
  if (issues.some(isOutstanding)) return 'Fail';
  return issues.length ? 'Pass after fixes' : 'Pass';
}
const componentResult = (p: AgencyProject, slug: string) => resultFor(p, slug, (f) => f.component === slug);
const pageResult = (p: AgencyProject, page: string) => resultFor(p, `page:${page}`, (f) => !f.component && f.page.trim().toLowerCase() === page.toLowerCase());

function header(p: AgencyProject, title: string, extra: [string, string][] = []): Block[] {
  return [
    { t: 'h', level: 1, text: title },
    {
      t: 'meta',
      rows: [
        ['Client', or(p.client, TBD)],
        ['Project', or(p.project, TBD)],
        ['Prepared by', or(p.agency, TBD)],
        ['Date', today()],
        ['Standard', p.target],
        ...extra,
      ],
    },
  ];
}

function scopeDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const pages = lines(p.pages);
  const out = lines(p.outOfScope);
  return {
    id: 'scope',
    title: 'Accessibility requirements and scope',
    blocks: [
      ...header(p, 'Accessibility requirements and scope'),
      { t: 'h', level: 2, text: '1. Conformance target' },
      {
        t: 'p',
        text: `The redesigned site will conform to ${p.target}. Every page and component in scope must meet all Level A and Level AA success criteria before launch. Automated testing alone is not enough: each item is also tested by hand with a keyboard and the assistive technology listed below.`,
      },
      { t: 'h', level: 2, text: '2. Supported browsers and assistive technology' },
      { t: 'ul', items: p.support.length ? p.support : [TBD] },
      { t: 'h', level: 2, text: '3. Pages and templates in scope' },
      { t: 'ul', items: pages.length ? pages : [TBD] },
      { t: 'h', level: 2, text: '4. Components in scope' },
      specs.length
        ? { t: 'table', head: ['Component', 'Category', 'Built on'], rows: specs.map((s) => [s.name, s.category, s.semantics]) }
        : { t: 'p', text: TBD },
      { t: 'h', level: 2, text: '5. Out of scope' },
      { t: 'ul', items: out.length ? out : ['Third-party embeds and services the client does not control, unless listed above.'] },
      { t: 'h', level: 2, text: '6. Responsibilities' },
      { t: 'ul', items: responsibility(p) },
      {
        t: 'table',
        head: ['Role', 'Owns'],
        rows: roles.map((r) => [r.short, r.owns.join('; ')]),
      },
      { t: 'h', level: 2, text: '7. Definition of done' },
      {
        t: 'ol',
        items: [
          'The component spec’s keyboard, ARIA and focus behavior is implemented.',
          'Content (labels, alt text, errors) is supplied by content design and used verbatim.',
          'Design meets contrast, focus visibility and target size requirements.',
          'Every acceptance criterion in the test plan passes in each supported environment.',
          'No open Blocker or Major accessibility issues.',
        ],
      },
      { t: 'h', level: 2, text: '8. Deliverables at handoff' },
      { t: 'ol', items: DELIVERABLES.filter((d) => d.required).map((d) => `${d.name}: ${d.description}`) },
    ],
  };
}

function componentsDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const blocks: Block[] = [
    ...header(p, 'Component accessibility documentation', [['Components', String(specs.length)]]),
    {
      t: 'p',
      text: `Accessibility requirements for every component delivered in this project, aligned to ${p.target}. Each section is written to drop into the component and pattern library documentation: purpose, expected interaction behavior, keyboard and focus, semantic HTML and ARIA, content and design requirements, the success criteria it supports, and acceptance criteria.`,
    },
  ];
  if (!specs.length) blocks.push({ t: 'note', text: 'No components selected yet.' });
  specs.forEach((s) => {
    const g = glance[s.slug];
    const a = anatomy[s.slug];
    const ws = worksheets[s.slug];
    const html = htmlExamples[s.slug];
    blocks.push(
      { t: 'h', level: 2, text: s.name },
      { t: 'p', text: s.summary },
      { t: 'meta', rows: [['Category', s.category], ['Built on', s.semantics]] },
      { t: 'h', level: 3, text: 'When to use' },
      { t: 'ul', items: [...s.whenToUse, ...(g?.instead ?? []).map((i) => `Use ${findComponent(i.slug)?.name ?? i.slug} instead when ${i.when}.`)] },
    );
    if (a) {
      blocks.push(
        { t: 'h', level: 3, text: 'Interaction behavior and states' },
        { t: 'table', head: ['State', 'What people see', 'What a screen reader announces'], rows: a.states.map((x) => [x.state, x.looks, x.announced]) },
        { t: 'h', level: 3, text: 'Anatomy' },
        { t: 'table', head: ['Part', 'Required', 'Notes'], rows: a.parts.map((x) => [x.name, yes(x.required), x.note]) },
      );
    }
    blocks.push(
      { t: 'h', level: 3, text: 'Keyboard' },
      { t: 'table', head: ['Keys', 'Action'], rows: s.keyboard.map((k) => [k.keys.join(' / '), k.action]) },
      { t: 'h', level: 3, text: 'Focus' },
      { t: 'ul', items: s.focus },
      { t: 'h', level: 3, text: 'Semantic HTML and ARIA' },
      { t: 'table', head: ['Attribute or element', 'Where', 'Usage', 'Translate?'], rows: s.aria.map((x) => [x.attr, x.where, x.usage, ariaTranslation(x).action]) },
      ...(html ? [{ t: 'code' as const, lang: 'html', text: html }] : []),
      { t: 'h', level: 3, text: 'Screen reader behavior' },
      { t: 'ul', items: s.screenReader },
    );
    if (ws?.content.length) {
      blocks.push(
        { t: 'h', level: 3, text: 'Content requirements' },
        { t: 'table', head: ['Content', 'Goes in', 'Required', 'Translate?', 'Guidance'], rows: ws.content.map((c) => [c.label, c.target, yes(c.required), translateLabel(c), c.guidance]) },
      );
    }
    if (ws?.design.length) {
      blocks.push({ t: 'h', level: 3, text: 'Design requirements' }, { t: 'table', head: ['Requirement', 'How to check'], rows: ws.design.map((d) => [d.text, d.check]) });
    }
    blocks.push(
      { t: 'h', level: 3, text: 'Do and don’t' },
      { t: 'table', head: ['Do', 'Don’t'], rows: Array.from({ length: Math.max(s.dos.length, s.donts.length) }, (_, i) => [s.dos[i] ?? '', s.donts[i] ?? '']) },
      { t: 'h', level: 3, text: 'WCAG success criteria' },
      { t: 'ul', items: s.wcag.filter((w) => inTarget(p, w)).map((w) => `${w.id} ${w.name} (Level ${w.level})`) },
      { t: 'h', level: 3, text: 'Acceptance criteria' },
      { t: 'ol', items: s.testing },
    );
  });
  return { id: 'components', title: 'Component accessibility documentation', blocks };
}

function testSummaryDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const pages = lines(p.pages);
  const issues = delivery(p);
  const cRes = specs.map((s) => componentResult(p, s.slug));
  const pRes = pages.map((pg) => pageResult(p, pg));
  const all = [...cRes, ...pRes];
  const n = (r: Result) => all.filter((x) => x === r).length;
  const tested = all.length - n('Not tested');
  const row = (name: string, key: string, res: Result, open: number) => {
    const t = p.tests[key];
    return [name, yes(Boolean(t?.automated)), yes(Boolean(t?.manual)), t?.date || '—', res, String(open)];
  };
  const blocks: Block[] = [
    ...header(p, 'Accessibility testing summary'),
    { t: 'h', level: 2, text: 'Summary' },
    {
      t: 'p',
      text: `${tested} of ${all.length} delivered components and templates were tested. ${n('Pass') + n('Pass after fixes')} pass, ${n('Fail')} fail, ${n('Partly tested')} are partly tested and ${n('Not tested')} are not yet tested. Testing found ${issues.length} issue${issues.length === 1 ? '' : 's'} in delivered work, of which ${issues.filter(isOutstanding).length} ${issues.filter(isOutstanding).length === 1 ? 'is' : 'are'} outstanding.`,
    },
    { t: 'h', level: 2, text: 'Methods' },
    {
      t: 'table',
      head: ['Method', 'What it covers'],
      rows: [
        ['Automated: axe-core (WCAG 2.2 A and AA rules)', 'Missing names and labels, invalid ARIA, color contrast of text, duplicate IDs, landmark and heading structure. Catches roughly a third of issues.'],
        ['Manual: keyboard only', 'Every interaction works with Tab, Shift+Tab, Enter, Space, arrows and Escape; focus order, visibility and no traps.'],
        ['Manual: screen readers', 'Names, roles, states and announcements in each supported screen reader and browser pairing.'],
        ['Manual: zoom, reflow and text spacing', 'Content at 200% and 400% zoom and 320px wide, with WCAG text-spacing overrides.'],
        ['Manual: visual review', 'Contrast of icons, borders and focus rings; states that don’t rely on color; target sizes.'],
      ],
    },
    { t: 'h', level: 2, text: 'Environments' },
    { t: 'ul', items: p.support.length ? p.support : [TBD] },
    { t: 'h', level: 2, text: 'Coverage and results: components' },
    specs.length
      ? {
          t: 'table',
          head: ['Component', 'Automated', 'Manual', 'Date', 'Result', 'Outstanding issues'],
          rows: specs.map((s, i) => row(s.name, s.slug, cRes[i], issues.filter((f) => f.component === s.slug && isOutstanding(f)).length)),
        }
      : { t: 'note', text: 'No components in scope yet.' },
    { t: 'h', level: 2, text: 'Coverage and results: templates' },
    pages.length
      ? {
          t: 'table',
          head: ['Template', 'Automated', 'Manual', 'Date', 'Result', 'Outstanding issues'],
          rows: pages.map((pg, i) => row(pg, `page:${pg}`, pRes[i], issues.filter((f) => !f.component && f.page.trim().toLowerCase() === pg.toLowerCase() && isOutstanding(f)).length)),
        }
      : { t: 'note', text: 'No templates listed yet.' },
    { t: 'p', text: 'Result key: Pass means automated and manual testing found no issues. Pass after fixes means every issue found was fixed and passed retest. Fail means at least one issue is outstanding.' },
    { t: 'h', level: 2, text: 'Issues identified' },
  ];
  blocks.push(
    issues.length
      ? {
          t: 'table',
          head: ['ID', 'Severity', 'Location', 'Issue', 'WCAG', 'Status'],
          rows: issues.map((f) => [issueRef(f), sevLabel(f.severity), location(f), f.issue, wcagText(f.wcag), statusLabel(f.status)]),
        }
      : { t: 'note', text: 'No issues logged from testing of delivered work.' },
    { t: 'p', text: 'Full remediation detail, owners and retest results are in the accessibility issue and remediation log.' },
  );
  return { id: 'testsummary', title: 'Accessibility testing summary', blocks };
}

function issueLogDoc(p: AgencyProject): Doc {
  const issues = delivery(p);
  const outstanding = issues.filter(isOutstanding);
  const owners: IssueOwner[] = ['agency', 'client', 'shared'];
  return {
    id: 'issuelog',
    title: 'Accessibility issue and remediation log',
    blocks: [
      ...header(p, 'Accessibility issue and remediation log', [['Issues', String(issues.length)], ['Outstanding', String(outstanding.length)]]),
      { t: 'h', level: 2, text: 'Ownership' },
      { t: 'ul', items: responsibility(p) },
      { t: 'h', level: 2, text: 'Status summary' },
      { t: 'table', head: ['Status', 'Issues'], rows: STATUSES.map((s) => [s.label, String(issues.filter((f) => f.status === s.id).length)]) },
      {
        t: 'table',
        head: ['Owner', 'Outstanding', 'Blocker', 'Major', 'Minor'],
        rows: owners.map((o) => {
          const mine = outstanding.filter((f) => f.owner === o);
          return [ownerLabel(o, p), String(mine.length), ...(['blocker', 'major', 'minor'] as Severity[]).map((s) => String(mine.filter((f) => f.severity === s).length))];
        }),
      },
      { t: 'h', level: 2, text: 'Outstanding issues' },
      outstanding.length
        ? {
            t: 'table',
            head: ['ID', 'Severity', 'Location', 'Issue', 'Owner', 'Status'],
            rows: outstanding.map((f) => [issueRef(f), sevLabel(f.severity), location(f), f.issue, ownerLabel(f.owner, p), statusLabel(f.status)]),
          }
        : { t: 'note', text: 'No outstanding issues.' },
      { t: 'h', level: 2, text: 'Full log' },
      issues.length
        ? {
            t: 'table',
            head: ['ID', 'Severity', 'Location', 'Issue', 'WCAG', 'Remediation', 'Owner', 'Status', 'Retest'],
            rows: issues.map((f) => [
              issueRef(f),
              sevLabel(f.severity),
              location(f),
              f.issue,
              wcagText(f.wcag),
              f.recommendation || '—',
              ownerLabel(f.owner, p),
              statusLabel(f.status),
              [f.retestDate, f.retestNote].filter(Boolean).join(': ') || '—',
            ]),
          }
        : { t: 'note', text: 'No issues logged from testing of delivered work yet.' },
    ],
  };
}

type Support = 'Supports' | 'Partially supports' | 'Does not support' | 'Not evaluated';

interface Evaluation {
  w: WcagRef;
  appliesTo: string;
  level: Support;
  live: Finding[];
}

/** Evaluate one success criterion against the delivered scope, from test records and delivery issues. */
function evaluate(p: AgencyProject, w: WcagRef): Evaluation {
  const specs = specsFor(p);
  const pages = lines(p.pages);
  const used = specs.filter((s) => s.wcag.some((x) => x.id === w.id));
  const page = PAGE_LEVEL_WCAG.includes(w.id);
  const live = delivery(p).filter((f) => f.wcag === w.id && (isOutstanding(f) || f.status === 'accepted'));
  const fullyTested = used.every((s) => p.tests[s.slug]?.manual) && (!page || pages.some((pg) => p.tests[`page:${pg}`]?.manual));
  let level: Support;
  if (live.some((f) => f.severity === 'blocker' && f.status !== 'accepted')) level = 'Does not support';
  else if (live.length) level = 'Partially supports';
  else if (fullyTested && (used.length || page)) level = 'Supports';
  else level = 'Not evaluated';
  return { w, appliesTo: [page ? 'All templates' : '', ...used.map((s) => s.name)].filter(Boolean).join(', '), level, live };
}

const limitationText = (e: Evaluation) => e.live.map((f) => `${e.w.id}: ${location(f)}: ${f.issue.trim().replace(/\.$/, '')} (${issueRef(f)}, ${statusLabel(f.status).toLowerCase()}).`);

function conformanceDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const ids = new Set<string>(PAGE_LEVEL_WCAG);
  specs.forEach((s) => s.wcag.forEach((w) => ids.add(w.id)));
  const criteria = [...ids]
    .map(wcagById)
    .filter((w): w is WcagRef => Boolean(w) && inTarget(p, w!))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  const evals = criteria.map((w) => evaluate(p, w));
  const limitations = evals.flatMap(limitationText);
  const rows = evals.map((e) => [`${e.w.id} ${e.w.name}`, e.w.level, e.appliesTo, e.level, e.live.length ? e.live.map(issueRef).join(', ') : '—']);
  const count = (l: Support) => rows.filter((r) => r[3] === l).length;
  return {
    id: 'conformance',
    title: `${p.target.replace(' AA', '')} AA conformance summary`,
    blocks: [
      ...header(p, `${p.target} conformance summary`),
      { t: 'h', level: 2, text: 'Summary' },
      {
        t: 'p',
        text: `${rows.length} success criteria apply to the delivered components and templates. ${count('Supports')} supported, ${count('Partially supports')} partially supported, ${count('Does not support')} not supported and ${count('Not evaluated')} not yet evaluated.`,
      },
      {
        t: 'p',
        text: `Scope: this summary covers the components and templates delivered by ${or(p.agency, 'the agency')}. It does not cover the integrated website, which ${or(p.client, 'the client')} validates after implementation and content integration.`,
      },
      {
        t: 'table',
        head: ['Result', 'Meaning'],
        rows: [
          ['Supports', 'Tested by hand and automatically, with no outstanding issues.'],
          ['Partially supports', 'Some content or functionality does not meet the criterion. See known limitations.'],
          ['Does not support', 'A blocker means the criterion is not met.'],
          ['Not evaluated', 'Not all of the components or templates it applies to have been tested by hand yet.'],
        ],
      },
      { t: 'h', level: 2, text: 'Results by success criterion' },
      { t: 'table', head: ['Success criterion', 'Level', 'Applies to', 'Result', 'Related issues'], rows },
      { t: 'h', level: 2, text: 'Known limitations' },
      limitations.length ? { t: 'ul', items: limitations } : { t: 'p', text: 'None recorded.' },
      { t: 'note', text: 'Criteria not listed (for example, captions when there is no video) do not apply to the delivered scope. Re-check this list if scope changes.' },
    ],
  };
}

/** Every WCAG 2.2 Level A and AA success criterion, for the ACR. 4.1.1 Parsing is listed for 2.1 targets only. */
const WCAG_ALL: [string, string, 'A' | 'AA'][] = [
  ['1.1.1', 'Non-text Content', 'A'], ['1.2.1', 'Audio-only and Video-only (Prerecorded)', 'A'], ['1.2.2', 'Captions (Prerecorded)', 'A'],
  ['1.2.3', 'Audio Description or Media Alternative (Prerecorded)', 'A'], ['1.2.4', 'Captions (Live)', 'AA'], ['1.2.5', 'Audio Description (Prerecorded)', 'AA'],
  ['1.3.1', 'Info and Relationships', 'A'], ['1.3.2', 'Meaningful Sequence', 'A'], ['1.3.3', 'Sensory Characteristics', 'A'], ['1.3.4', 'Orientation', 'AA'],
  ['1.3.5', 'Identify Input Purpose', 'AA'], ['1.4.1', 'Use of Color', 'A'], ['1.4.2', 'Audio Control', 'A'], ['1.4.3', 'Contrast (Minimum)', 'AA'],
  ['1.4.4', 'Resize Text', 'AA'], ['1.4.5', 'Images of Text', 'AA'], ['1.4.10', 'Reflow', 'AA'], ['1.4.11', 'Non-text Contrast', 'AA'], ['1.4.12', 'Text Spacing', 'AA'],
  ['1.4.13', 'Content on Hover or Focus', 'AA'], ['2.1.1', 'Keyboard', 'A'], ['2.1.2', 'No Keyboard Trap', 'A'], ['2.1.4', 'Character Key Shortcuts', 'A'],
  ['2.2.1', 'Timing Adjustable', 'A'], ['2.2.2', 'Pause, Stop, Hide', 'A'], ['2.3.1', 'Three Flashes or Below Threshold', 'A'], ['2.4.1', 'Bypass Blocks', 'A'],
  ['2.4.2', 'Page Titled', 'A'], ['2.4.3', 'Focus Order', 'A'], ['2.4.4', 'Link Purpose (In Context)', 'A'], ['2.4.5', 'Multiple Ways', 'AA'],
  ['2.4.6', 'Headings and Labels', 'AA'], ['2.4.7', 'Focus Visible', 'AA'], ['2.4.11', 'Focus Not Obscured (Minimum)', 'AA'], ['2.5.1', 'Pointer Gestures', 'A'],
  ['2.5.2', 'Pointer Cancellation', 'A'], ['2.5.3', 'Label in Name', 'A'], ['2.5.4', 'Motion Actuation', 'A'], ['2.5.7', 'Dragging Movements', 'AA'],
  ['2.5.8', 'Target Size (Minimum)', 'AA'], ['3.1.1', 'Language of Page', 'A'], ['3.1.2', 'Language of Parts', 'AA'], ['3.2.1', 'On Focus', 'A'], ['3.2.2', 'On Input', 'A'],
  ['3.2.3', 'Consistent Navigation', 'AA'], ['3.2.4', 'Consistent Identification', 'AA'], ['3.2.6', 'Consistent Help', 'A'], ['3.3.1', 'Error Identification', 'A'],
  ['3.3.2', 'Labels or Instructions', 'A'], ['3.3.3', 'Error Suggestion', 'AA'], ['3.3.4', 'Error Prevention (Legal, Financial, Data)', 'AA'], ['3.3.7', 'Redundant Entry', 'A'],
  ['3.3.8', 'Accessible Authentication (Minimum)', 'AA'], ['4.1.1', 'Parsing', 'A'], ['4.1.2', 'Name, Role, Value', 'A'], ['4.1.3', 'Status Messages', 'AA'],
];

/** ACR conformance terms, as defined in the VPAT 2.5 template. */
const ACR_TERM: Record<Support, string> = {
  Supports: 'Supports',
  'Partially supports': 'Partially Supports',
  'Does not support': 'Does Not Support',
  'Not evaluated': 'Not Evaluated',
};

export interface AcrRow {
  id: string;
  name: string;
  level: 'A' | 'AA';
  /** What the builder works out from test results and issues. */
  auto: AcrLevel;
  autoRemark: string;
  /** What goes in the report, after any adjustment. */
  result: AcrLevel;
  remark: string;
  adjusted: boolean;
}

/** Every ACR row for the project's target, worked out from test results and issues, then any hand adjustments. */
export function acrRows(p: AgencyProject): AcrRow[] {
  const is21 = p.target === 'WCAG 2.1 AA';
  const list = WCAG_ALL.filter(([id]) => (is21 ? !NEW_IN_22.includes(id) : id !== '4.1.1'));
  const specs = specsFor(p);
  const covered = new Set<string>([...PAGE_LEVEL_WCAG, ...specs.flatMap((s) => s.wcag.map((w) => w.id)), ...delivery(p).map((f) => f.wcag)]);
  return list.map(([id, name, level]) => {
    let auto: AcrLevel;
    let autoRemark: string;
    if (is21 && id === '4.1.1') {
      auto = 'Supports';
      autoRemark = 'Obsolete in WCAG 2.2 and treated as always satisfied for HTML.';
    } else if (!covered.has(id)) {
      auto = 'Not Evaluated';
      autoRemark = 'Not covered by the delivered component specifications. Evaluate on the integrated site, or mark Not Applicable if no such content exists.';
    } else {
      const e = evaluate(p, { id, name, level });
      auto = ACR_TERM[e.level] as AcrLevel;
      autoRemark =
        e.level === 'Supports'
          ? `Tested on: ${e.appliesTo}. No outstanding issues.`
          : e.level === 'Not evaluated'
            ? `Applies to: ${e.appliesTo}. Manual testing not yet complete.`
            : limitationText(e).join(' ');
    }
    const o = p.acr?.[id] ?? {};
    const result = o.level ?? auto;
    const remark = o.remark?.trim() || (o.level === 'Not Applicable' ? 'The product has no content of this kind.' : o.level && o.level !== auto ? '' : autoRemark);
    return { id, name, level, auto, autoRemark, result, remark, adjusted: Boolean(o.level || o.remark?.trim()) };
  });
}

function acrDoc(p: AgencyProject): Doc {
  const rows = acrRows(p);
  const table = (lvl: 'A' | 'AA') => rows.filter((r) => r.level === lvl).map((r) => [`${r.id} ${r.name} (Level ${r.level})`, r.result, r.remark]);
  const unevaluated = rows.filter((r) => r.result === 'Not Evaluated').length;
  return {
    id: 'acr',
    title: 'Accessibility Conformance Report (VPAT 2.5 format)',
    blocks: [
      { t: 'h', level: 1, text: `${or(p.project, 'Product')} Accessibility Conformance Report` },
      { t: 'p', text: `International Edition style, based on VPAT® Version 2.5. WCAG section only.` },
      {
        t: 'meta',
        rows: [
          ['Name of product/version', or(p.project, TBD)],
          ['Report date', today()],
          ['Product description', `Components and templates delivered to ${or(p.client, 'the client')}.`],
          ['Contact information', or(p.contact, TBD)],
          ['Prepared by', or(p.agency, TBD)],
        ],
      },
      { t: 'h', level: 2, text: 'Evaluation methods used' },
      { t: 'p', text: `Automated testing with axe-core, and manual testing with: ${p.support.join('; ') || TBD}.` },
      { t: 'h', level: 2, text: 'Applicable standards and guidelines' },
      { t: 'table', head: ['Standard/Guideline', 'Included in report'], rows: [[`Web Content Accessibility Guidelines ${p.target === 'WCAG 2.1 AA' ? '2.1' : '2.2'}`, 'Level A (Yes), Level AA (Yes), Level AAA (No)']] },
      { t: 'h', level: 2, text: 'Terms' },
      {
        t: 'ul',
        items: [
          'Supports: the functionality has at least one method that meets the criterion without known defects.',
          'Partially Supports: some functionality does not meet the criterion.',
          'Does Not Support: the majority of functionality does not meet the criterion.',
          'Not Applicable: the criterion is not relevant to the product.',
          'Not Evaluated: the product has not been evaluated against the criterion.',
        ],
      },
      ...(unevaluated ? [{ t: 'note', text: `${unevaluated} criteria are Not Evaluated. Review them before publishing, and mark a criterion Not Applicable only when the product has no content of that kind.` } as Block] : []),
      { t: 'h', level: 2, text: 'Table 1: Success Criteria, Level A' },
      { t: 'table', head: ['Criteria', 'Conformance Level', 'Remarks and Explanations'], rows: table('A') },
      { t: 'h', level: 2, text: 'Table 2: Success Criteria, Level AA' },
      { t: 'table', head: ['Criteria', 'Conformance Level', 'Remarks and Explanations'], rows: table('AA') },
      { t: 'p', text: '“Voluntary Product Accessibility Template” and “VPAT” are registered service marks of the Information Technology Industry Council (ITI).' },
    ],
  };
}

const translateLabel = (c: { target: string }) => {
  const t = fieldTranslation(c);
  return t.translate ? (t.audience === 'Visible' ? 'Yes' : `Yes, ${t.audience.toLowerCase()}`) : 'No, fixed token';
};

export interface TranslationRow {
  component: string;
  string: string;
  goesIn: string;
  seenBy: string;
  translate: string;
  note: string;
  example: string;
}

/** Every string in the selected components that translators need to see, including ARIA values and hidden text. */
export function translationRows(p: AgencyProject): TranslationRow[] {
  return specsFor(p).flatMap((s) => {
    const fields = (worksheets[s.slug]?.content ?? []).map((c) => {
      const t = fieldTranslation(c);
      return { component: s.name, string: c.label, goesIn: c.target, seenBy: t.audience, translate: translateLabel(c), note: `${t.note} ${c.guidance}`.trim(), example: c.good };
    });
    const covered = new Set(fields.map((f) => f.goesIn));
    const aria = s.aria
      .filter((a) => ariaTranslation(a).action === 'Translate the value' && !covered.has(a.attr))
      .map((a) => {
        const t = ariaTranslation(a);
        return { component: s.name, string: `${a.attr} on ${a.where}`, goesIn: a.attr, seenBy: 'Screen reader only', translate: 'Yes, screen reader only', note: `${t.note} ${a.usage}`, example: '' };
      });
    return [...fields, ...aria];
  });
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** A spreadsheet for translators: one row per string, with context and an empty column for the translation. */
export function translationCsv(p: AgencyProject): string {
  const head = ['Component', 'String', 'Goes in', 'Seen by', 'Translate?', 'Context for translators', 'Example (English)', 'Translation'];
  const rows = translationRows(p).map((r) => [r.component, r.string, r.goesIn, r.seenBy, r.translate, r.note, r.example, '']);
  return [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

function devHandoffDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const issues = delivery(p);
  const contentRole = roles.find((r) => r.id === 'content');
  const blocks: Block[] = [
    ...header(p, 'Developer handoff documentation'),
    {
      t: 'p',
      text: `How ${or(p.client, 'the client')}’s frontend team can implement, integrate and maintain the delivered components without losing accessibility. Read it with the component accessibility documentation, which has the full requirements for each component.`,
    },
    { t: 'h', level: 2, text: 'Who owns what after handoff' },
    { t: 'ul', items: responsibility(p) },
    { t: 'h', level: 2, text: 'Principles to keep' },
    {
      t: 'ol',
      items: [
        'Use the native element named under “Built on” before reaching for ARIA. A <button> already handles focus, Enter, Space and its role.',
        'Never remove focus outlines without replacing them with an indicator of at least 2px and 3:1 contrast.',
        'Keep accessible names in sync with visible labels, so voice control users can say what they see.',
        'Keep ARIA states (aria-expanded, aria-selected, aria-invalid, aria-current) updated in code whenever the visual state changes.',
        'Announce async results and errors with the live region pattern in each spec; don’t move focus unless the spec says to.',
        'Respect prefers-reduced-motion for any animation longer than a fade.',
        'Don’t add tabindex greater than 0. Change DOM order instead.',
      ],
    },
    { t: 'h', level: 2, text: 'Regression testing' },
    {
      t: 'ul',
      items: [
        'Automated: run axe-core in CI on every template, for example with @axe-core/playwright or jest-axe, and fail the build on new violations.',
        'Manual, every release: the page-level checks below, with a keyboard and at least one screen reader.',
        'Manual, when a component changes: its acceptance criteria in the component documentation.',
        `Environments: ${p.support.join('; ') || TBD}.`,
      ],
    },
    { t: 'h', level: 3, text: 'Page-level checks' },
    { t: 'ol', items: pageChecks },
    { t: 'h', level: 2, text: 'Content integration' },
    { t: 'p', text: 'Most issues introduced after handoff come from content. Check these whenever content is added or edited:' },
    { t: 'ul', items: contentRole?.checklist ?? [] },
    { t: 'h', level: 2, text: 'Translation and localization' },
    { t: 'p', text: 'Screen reader users hear every string the components expose, including text nobody sees. Translate these with the visible copy, and leave ARIA tokens alone.' },
    { t: 'ul', items: LOCALIZATION_RULES },
    ...(specs.length
      ? [
          { t: 'table' as const, head: ['Component', 'String', 'Goes in', 'Seen by', 'Translate?'], rows: translationRows(p).map((r) => [r.component, r.string, r.goesIn, r.seenBy, r.translate]) },
          { t: 'note' as const, text: 'The deliverables builder exports this table as a CSV for translators, with a column for the translation.' },
        ]
      : []),
    { t: 'h', level: 2, text: 'Component implementation notes' },
  ];
  if (!specs.length) blocks.push({ t: 'note', text: 'No components selected yet.' });
  specs.forEach((s) => {
    const ws = worksheets[s.slug];
    const open = issues.filter((f) => f.component === s.slug && (isOutstanding(f) || f.status === 'accepted'));
    blocks.push(
      { t: 'h', level: 3, text: s.name },
      { t: 'meta', rows: [['Built on', s.semantics], ['Keys to support', s.keyboard.map((k) => k.keys.join(' / ')).join(', ')]] },
      { t: 'p', text: 'Don’t break:' },
      { t: 'ul', items: [...s.donts, ...s.focus.slice(0, 2)] },
    );
    const required = ws?.content.filter((c) => c.required) ?? [];
    if (required.length) blocks.push({ t: 'p', text: 'Content the component needs every time it’s used:' }, { t: 'ul', items: required.map((c) => `${c.label} → ${c.target}`) });
    if (open.length) {
      blocks.push(
        { t: 'p', text: 'Open issues handed over:' },
        { t: 'ul', items: open.map((f) => `${issueRef(f)} (${sevLabel(f.severity)}, ${ownerLabel(f.owner, p)}): ${f.issue}`) },
      );
    }
  });
  const handed = issues.filter((f) => isOutstanding(f) || f.status === 'accepted');
  blocks.push(
    { t: 'h', level: 2, text: 'Outstanding issues at handoff' },
    handed.length
      ? {
          t: 'table',
          head: ['ID', 'Severity', 'Location', 'Issue', 'Owner', 'Status'],
          rows: handed.map((f) => [issueRef(f), sevLabel(f.severity), location(f), f.issue, ownerLabel(f.owner, p), statusLabel(f.status)]),
        }
      : { t: 'note', text: 'None. Every logged issue passed retest.' },
  );
  return { id: 'devhandoff', title: 'Developer handoff documentation', blocks };
}

function testplanDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const blocks: Block[] = [
    ...header(p, 'Test plan and sign-off sheet'),
    { t: 'h', level: 2, text: 'Test environments' },
    { t: 'table', head: ['Environment', 'Browser / AT version', 'Tester', 'Date'], rows: (p.support.length ? p.support : [TBD]).map((s) => [s, '', '', '']) },
    { t: 'h', level: 2, text: 'Page-level checks' },
    { t: 'p', text: `Run on every page or template in scope${lines(p.pages).length ? `: ${lines(p.pages).join(', ')}` : ''}.` },
    { t: 'table', head: ['#', 'Check', 'Result (Pass / Fail / N/A)', 'Notes'], rows: pageChecks.map((c, i) => [`P${i + 1}`, c, '', '']) },
  ];
  specs.forEach((s, si) => {
    blocks.push(
      { t: 'h', level: 2, text: `${s.name} checks` },
      { t: 'table', head: ['#', 'Check', 'Result (Pass / Fail / N/A)', 'Notes'], rows: s.testing.map((c, i) => [`C${si + 1}.${i + 1}`, c, '', '']) },
    );
  });
  blocks.push(
    { t: 'h', level: 2, text: 'Sign-off' },
    { t: 'p', text: 'Sign-off confirms every check above passes, or has an agreed exception recorded in the notes, and there are no open Blocker or Major issues.' },
    {
      t: 'table',
      head: ['Role', 'Name', 'Signature', 'Date'],
      rows: [
        [`${or(p.agency, 'Agency')} accessibility lead`, '', '', ''],
        [`${or(p.agency, 'Agency')} QA`, '', '', ''],
        [`${or(p.client, 'Client')} product owner`, '', '', ''],
      ],
    },
  );
  return { id: 'testplan', title: 'Test plan and sign-off sheet', blocks };
}

function auditDoc(p: AgencyProject): Doc {
  const f = p.findings.filter((x) => x.source === 'baseline');
  const count = (s: Severity) => f.filter((x) => x.severity === s).length;
  const byPrinciple = ['1 Perceivable', '2 Operable', '3 Understandable', '4 Robust'].map((name, i) => [
    name,
    String(f.filter((x) => x.wcag.startsWith(`${i + 1}.`)).length),
  ]);
  const blocks: Block[] = [
    ...header(p, 'Baseline accessibility audit', [['Findings', String(f.length)]]),
    { t: 'h', level: 2, text: 'Summary' },
    {
      t: 'p',
      text: f.length
        ? `We found ${f.length} accessibility issue${f.length === 1 ? '' : 's'} on the current site: ${count('blocker')} blocker, ${count('major')} major and ${count('minor')} minor. Blockers stop someone completing a task, so the redesign must fix them first.`
        : 'No baseline findings recorded yet. Log issues from the current site in the deliverables builder, with the source set to the baseline audit.',
    },
    { t: 'table', head: ['Severity', 'Meaning', 'Count'], rows: SEVERITIES.map((s) => [s.label, s.hint, String(count(s.id))]) },
    { t: 'h', level: 3, text: 'By WCAG principle' },
    { t: 'table', head: ['Principle', 'Findings'], rows: byPrinciple },
    { t: 'h', level: 2, text: 'Method' },
    {
      t: 'ul',
      items: [
        `Tested against ${p.target}.`,
        `Environments: ${p.support.join('; ') || TBD}.`,
        'Automated scan with axe-core, followed by manual keyboard, screen reader, zoom and contrast checks.',
        `Pages reviewed: ${lines(p.pages).join(', ') || TBD}.`,
      ],
    },
    { t: 'h', level: 2, text: 'Findings' },
  ];
  if (f.length) {
    const order: Severity[] = ['blocker', 'major', 'minor'];
    const sorted = [...f].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
    blocks.push({
      t: 'table',
      head: ['#', 'Severity', 'Page', 'Issue', 'Component', 'WCAG', 'Recommendation'],
      rows: sorted.map((x, i) => {
        const w = wcagById(x.wcag);
        return [
          String(i + 1),
          SEVERITIES.find((s) => s.id === x.severity)?.label ?? x.severity,
          x.page,
          x.issue,
          findComponent(x.component)?.name ?? (x.component || '—'),
          w ? `${w.id} ${w.name}` : x.wcag || '—',
          x.recommendation,
        ];
      }),
    });
  } else {
    blocks.push({ t: 'note', text: 'No findings yet.' });
  }
  return { id: 'audit', title: 'Baseline accessibility audit', blocks };
}

function statementDoc(p: AgencyProject): Doc {
  const open = delivery(p).filter((x) => isOutstanding(x) || x.status === 'accepted');
  const site = or(p.client, '[Organization]');
  return {
    id: 'statement',
    title: 'Accessibility statement (draft)',
    blocks: [
      { t: 'h', level: 1, text: `Accessibility statement for ${site}` },
      { t: 'note', text: `Draft prepared by ${or(p.agency, '[agency]')} on ${today()}. Review with ${site}’s legal and communications teams before publishing.` },
      { t: 'p', text: `${site} wants everyone to be able to use this website, including people who use a keyboard, a screen reader, voice control, magnification or other assistive technology.` },
      { t: 'h', level: 2, text: 'Conformance status' },
      { t: 'p', text: `This website aims to conform to ${p.target}. It was tested on ${TBD} using the methods below. [Fully conforms / Partially conforms: choose one after the final test.]` },
      { t: 'h', level: 2, text: 'How we tested' },
      { t: 'ul', items: ['Automated testing with axe-core.', ...p.support.map((s) => `Manual testing: ${s}.`)] },
      { t: 'h', level: 2, text: 'Known limitations' },
      open.length
        ? { t: 'ul', items: open.map((x) => `${x.page ? `${x.page}: ` : ''}${x.issue.trim().replace(/\.$/, '')}${x.wcag ? ` (WCAG ${x.wcag})` : ''}. [Planned fix date]`) }
        : { t: 'p', text: 'We are not aware of any content that does not meet the standard. [Update after the final test.]' },
      { t: 'h', level: 2, text: 'Feedback and contact' },
      {
        t: 'p',
        text: `If you find something on this website you can’t use, contact us at ${or(p.contact, '[email or phone]')}. Tell us the page and what you were trying to do. We aim to reply within [5] working days.`,
      },
      { t: 'p', text: `This statement was last reviewed on ${today()}.` },
    ],
  };
}

export function buildDoc(id: DeliverableId, p: AgencyProject): Doc {
  switch (id) {
    case 'scope':
      return scopeDoc(p);
    case 'testplan':
      return testplanDoc(p);
    case 'audit':
      return auditDoc(p);
    case 'statement':
      return statementDoc(p);
    case 'components':
      return componentsDoc(p);
    case 'testsummary':
      return testSummaryDoc(p);
    case 'issuelog':
      return issueLogDoc(p);
    case 'conformance':
      return conformanceDoc(p);
    case 'devhandoff':
      return devHandoffDoc(p);
    case 'acr':
      return acrDoc(p);
  }
}

// ---------- Renderers ----------

const mdCell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function toMarkdown(doc: Doc): string {
  return doc.blocks
    .map((b) => {
      switch (b.t) {
        case 'h':
          return `${'#'.repeat(b.level)} ${b.text}`;
        case 'p':
          return b.text;
        case 'note':
          return `> ${b.text}`;
        case 'code':
          return '```' + b.lang + '\n' + b.text.trim() + '\n```';
        case 'meta':
          return b.rows.map(([k, v]) => `**${k}:** ${v}  `).join('\n');
        case 'ul':
          return b.items.map((i) => `- ${i}`).join('\n');
        case 'ol':
          return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n');
        case 'table':
          return [
            `| ${b.head.map(mdCell).join(' | ')} |`,
            `| ${b.head.map(() => '---').join(' | ')} |`,
            ...b.rows.map((r) => `| ${r.map(mdCell).join(' | ')} |`),
          ].join('\n');
      }
    })
    .join('\n\n');
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function blockHtml(b: Block, shift: number): string {
  switch (b.t) {
    case 'h':
      return `<h${b.level + shift}>${esc(b.text)}</h${b.level + shift}>`;
    case 'p':
      return `<p>${esc(b.text)}</p>`;
    case 'note':
      return `<p class="note">${esc(b.text)}</p>`;
    case 'code':
      return `<pre><code>${esc(b.text.trim())}</code></pre>`;
    case 'meta':
      return `<dl class="meta">${b.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
    case 'ul':
      return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    case 'ol':
      return `<ol>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`;
    case 'table':
      return `<table><thead><tr>${b.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows
        .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
        .join('')}</tbody></table>`;
  }
}

/** A standalone, accessible HTML file. Open it and print to PDF for a client-ready document. */
export function toHtml(docs: Doc[], p: AgencyProject): string {
  const title = `${or(p.project, 'Accessibility deliverables')}${p.client.trim() ? ` · ${p.client.trim()}` : ''}`;
  // Several documents in one file: a cover h1, and each document's headings move down a level.
  const shift = docs.length > 1 ? 1 : 0;
  const cover = shift
    ? `<header class="cover"><h1>${esc(title)}</h1><p>Accessibility deliverables prepared by ${esc(or(p.agency, '[agency]'))} · ${today()}</p></header>`
    : '';
  const toc =
    docs.length > 1
      ? `<nav aria-label="Contents"><h2>Contents</h2><ol>${docs.map((d) => `<li><a href="#${d.id}">${esc(d.title)}</a></li>`).join('')}</ol></nav>`
      : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
  body { font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; color: #1a1a1a; max-width: 60rem; margin: 2rem auto; padding: 0 1.5rem; }
  h1 { font-size: 1.9rem; margin: 0 0 1rem; } h2 { font-size: 1.35rem; margin: 2rem 0 .5rem; } h3, h4 { font-size: 1.05rem; margin: 1.5rem 0 .4rem; }
  .cover { padding: 2rem 0 1rem; border-bottom: 3px solid #2f5bd3; margin-bottom: 1rem; } .cover h1 { font-size: 2.2rem; }
  section.doc > h2:first-child { font-size: 1.9rem; }
  table { border-collapse: collapse; width: 100%; margin: .75rem 0; font-size: .9rem; }
  th, td { border: 1px solid #8a8a8a; padding: .4rem .55rem; text-align: left; vertical-align: top; }
  th { background: #eef1f6; }
  .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: .25rem 1.5rem; padding: .75rem 1rem; background: #f5f6f8; border-radius: .5rem; }
  .meta dt { font-weight: 600; font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; color: #444; } .meta dd { margin: 0; }
  .note { border-left: 4px solid #2f5bd3; padding: .4rem .8rem; background: #f0f4ff; }
  section.doc { page-break-before: always; } section.doc:first-of-type { page-break-before: auto; }
  a { color: #1d4ed8; }
  pre { background: #f5f6f8; border: 1px solid #c8ccd2; border-radius: .4rem; padding: .75rem; overflow-x: auto; font-size: .82rem; white-space: pre-wrap; }
  @media print { body { margin: 0; max-width: none; } nav { page-break-after: always; } }
</style>
</head>
<body>
<main>
${cover}
${toc}
${docs.map((d) => `<section class="doc" id="${d.id}" aria-labelledby="${d.id}-title">${d.blocks.map((b, i) => (i === 0 && b.t === 'h' ? `<h${1 + shift} id="${d.id}-title">${esc(b.text)}</h${1 + shift}>` : blockHtml(b, shift))).join('\n')}</section>`).join('\n')}
<p class="note">Generated with A11y Hub. WCAG references: <a href="${wcagUrl(WCAG.keyboard).replace(/keyboard$/, '')}">Understanding WCAG 2.2</a>.</p>
</main>
</body>
</html>`;
}
