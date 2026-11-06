import { components, findComponent } from '../data/components';
import { pageChecks } from '../data/pageChecks';
import { roles } from '../data/roles';
import type { ComponentSpec, WcagRef } from '../data/types';
import { WCAG, wcagUrl } from '../data/wcag';

/**
 * Agency deliverables: client-ready documents generated from a project scope
 * and the specs on this site. One document model renders to the on-page
 * preview, Markdown and standalone HTML (print to PDF).
 */

export type Severity = 'blocker' | 'major' | 'minor';

export interface Finding {
  id: string;
  page: string;
  issue: string;
  component: string;
  wcag: string;
  severity: Severity;
  recommendation: string;
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
  findings: Finding[];
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
  findings: [],
});

export type DeliverableId = 'scope' | 'specs' | 'matrix' | 'testplan' | 'audit' | 'statement';

export const DELIVERABLES: { id: DeliverableId; name: string; when: string; description: string }[] = [
  {
    id: 'audit',
    name: 'Baseline audit report',
    when: 'Discovery',
    description: 'What’s wrong with the current site, by severity and WCAG criterion, with a recommendation for each finding.',
  },
  {
    id: 'scope',
    name: 'Accessibility requirements and scope',
    when: 'Kickoff',
    description: 'Conformance target, supported browsers and assistive tech, pages and components in scope, and who owns what.',
  },
  {
    id: 'specs',
    name: 'Component accessibility specs',
    when: 'Design and build',
    description: 'Keyboard, ARIA, focus and screen reader behavior for every component in scope, with acceptance criteria.',
  },
  {
    id: 'matrix',
    name: 'WCAG coverage matrix',
    when: 'Design and build',
    description: 'Every success criterion in play, the components it applies to, and how it will be verified.',
  },
  {
    id: 'testplan',
    name: 'Test plan and sign-off sheet',
    when: 'QA and launch',
    description: 'Test environments, page-level and per-component checks with result columns, and a sign-off table.',
  },
  {
    id: 'statement',
    name: 'Accessibility statement (draft)',
    when: 'Launch',
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

const or = (v: string, fallback: string) => (v.trim() ? v.trim() : fallback);
const lines = (v: string) =>
  v
    .split('\n')
    .map((l) => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
const today = () => new Date().toISOString().slice(0, 10);
const specsFor = (p: AgencyProject): ComponentSpec[] =>
  components.filter((c) => p.components.includes(c.slug)).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
/** Criteria that are new in WCAG 2.2, so out of scope for a 2.1 target. */
const NEW_IN_22 = ['2.4.11', '2.5.7', '2.5.8', '3.2.6', '3.3.8'];
const inTarget = (p: AgencyProject, w: WcagRef) => w.level !== 'AAA' && !(p.target === 'WCAG 2.1 AA' && NEW_IN_22.includes(w.id));

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
    ],
  };
}

function specsDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const blocks: Block[] = [
    ...header(p, 'Component accessibility specs', [['Components', String(specs.length)]]),
    { t: 'p', text: 'One spec per component in scope. Each lists what it must be built on, the keys it must support, the ARIA it needs, focus and screen reader behavior, and the acceptance criteria QA will test.' },
  ];
  if (!specs.length) blocks.push({ t: 'note', text: 'No components selected yet.' });
  specs.forEach((s) => {
    blocks.push(
      { t: 'h', level: 2, text: s.name },
      { t: 'p', text: s.summary },
      { t: 'meta', rows: [['Category', s.category], ['Built on', s.semantics]] },
      { t: 'h', level: 3, text: 'Keyboard' },
      { t: 'table', head: ['Keys', 'Action'], rows: s.keyboard.map((k) => [k.keys.join(' / '), k.action]) },
      { t: 'h', level: 3, text: 'ARIA' },
      { t: 'table', head: ['Attribute', 'Where', 'Usage'], rows: s.aria.map((a) => [a.attr, a.where, a.usage]) },
      { t: 'h', level: 3, text: 'Focus' },
      { t: 'ul', items: s.focus },
      { t: 'h', level: 3, text: 'Screen readers' },
      { t: 'ul', items: s.screenReader },
      { t: 'h', level: 3, text: 'WCAG criteria' },
      { t: 'ul', items: s.wcag.filter((w) => inTarget(p, w)).map((w) => `${w.id} ${w.name} (${w.level})`) },
      { t: 'h', level: 3, text: 'Acceptance criteria' },
      { t: 'ol', items: s.testing },
    );
  });
  return { id: 'specs', title: 'Component accessibility specs', blocks };
}

function matrixDoc(p: AgencyProject): Doc {
  const specs = specsFor(p);
  const ids = new Set<string>(PAGE_LEVEL_WCAG);
  specs.forEach((s) => s.wcag.forEach((w) => ids.add(w.id)));
  const rows = [...ids]
    .map(wcagById)
    .filter((w): w is WcagRef => Boolean(w) && inTarget(p, w!))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    .map((w) => {
      const used = specs.filter((s) => s.wcag.some((x) => x.id === w.id)).map((s) => s.name);
      const page = PAGE_LEVEL_WCAG.includes(w.id);
      return [
        `${w.id} ${w.name}`,
        w.level,
        [page ? 'Every page' : '', ...used].filter(Boolean).join(', '),
        ['2.1.1', '2.1.2', '2.4.3', '2.4.7', '2.4.11'].includes(w.id)
          ? 'Manual: keyboard'
          : ['4.1.2', '4.1.3', '1.3.1', '2.5.3'].includes(w.id)
            ? 'Manual: screen reader; automated: axe-core'
            : ['1.4.3', '1.4.11'].includes(w.id)
              ? 'Automated: axe-core; manual: contrast checker'
              : 'Manual review',
        '',
      ];
    });
  return {
    id: 'matrix',
    title: 'WCAG coverage matrix',
    blocks: [
      ...header(p, 'WCAG coverage matrix'),
      {
        t: 'p',
        text: `The ${p.target} success criteria that apply to the pages and components in scope, where each applies, and how it will be verified. The Status column is filled in during QA.`,
      },
      { t: 'table', head: ['Success criterion', 'Level', 'Applies to', 'How it’s verified', 'Status'], rows },
      { t: 'note', text: 'Criteria not listed (for example, captions when there is no video) are not applicable to the current scope. Re-check this list when scope changes.' },
    ],
  };
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
  const f = p.findings;
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
        : 'No findings recorded yet. Add findings in the deliverables builder as you audit the current site.',
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
  const open = p.findings.filter((x) => x.severity !== 'minor');
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
    case 'specs':
      return specsDoc(p);
    case 'matrix':
      return matrixDoc(p);
    case 'testplan':
      return testplanDoc(p);
    case 'audit':
      return auditDoc(p);
    case 'statement':
      return statementDoc(p);
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
