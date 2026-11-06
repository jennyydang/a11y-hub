import { components } from '../data/components';
import type { Finding, IssueOwner, IssueSource, IssueStatus, Severity } from './deliverables';

/** An issue read from a file, before it gets an id and number in the log. */
export type ImportedIssue = Omit<Finding, 'id' | 'n'>;

const base = (source: IssueSource): ImportedIssue => ({
  source,
  page: '',
  issue: '',
  component: '',
  wcag: '',
  severity: 'major',
  recommendation: '',
  owner: 'agency',
  status: 'open',
  retestDate: '',
  retestNote: '',
});

/** "wcag143" → "1.4.3"; "wcag2411" → "2.4.11". */
function wcagFromTag(tag: string): string {
  const m = tag.match(/^wcag(\d)(\d)(\d{1,2})$/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : '';
}

const IMPACT: Record<string, Severity> = { critical: 'blocker', serious: 'major', moderate: 'minor', minor: 'minor' };

interface AxeViolation {
  id: string;
  impact?: string;
  help?: string;
  description?: string;
  helpUrl?: string;
  tags?: string[];
  nodes?: { target?: unknown[] }[];
}
interface AxeResult {
  url?: string;
  violations?: AxeViolation[];
}

/** Results from axe-core, @axe-core/playwright, axe DevTools exports or Lighthouse's axe audits. */
export function fromAxe(json: unknown, source: IssueSource): ImportedIssue[] {
  const results: AxeResult[] = Array.isArray(json) ? json : [json as AxeResult];
  return results.flatMap((r) =>
    (r.violations ?? []).map((v) => {
      const targets = (v.nodes ?? []).map((n) => (n.target ?? []).join(' ')).filter(Boolean);
      return {
        ...base(source),
        page: r.url ?? '',
        issue: `${v.help ?? v.description ?? v.id} (axe: ${v.id}; ${targets.length} element${targets.length === 1 ? '' : 's'}${targets.length ? `, e.g. ${targets.slice(0, 2).join(', ')}` : ''})`,
        wcag: (v.tags ?? []).map(wcagFromTag).find(Boolean) ?? '',
        severity: IMPACT[v.impact ?? ''] ?? 'major',
        recommendation: v.helpUrl ? `See ${v.helpUrl}` : '',
      };
    }),
  );
}

/** A small CSV parser that handles quoted fields, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

const pick = <T extends string>(value: string, options: Record<string, T>, fallback: T): T => {
  const v = value.trim().toLowerCase();
  return Object.entries(options).find(([k]) => v.startsWith(k))?.[1] ?? fallback;
};

/**
 * A spreadsheet exported as CSV with a header row. Recognized columns (any order, case ignored):
 * issue or description, page or url, component, wcag or criterion, severity or impact,
 * recommendation or remediation, owner, status.
 */
export function fromCsv(text: string, source: IssueSource): ImportedIssue[] {
  const [head, ...rows] = parseCsv(text);
  if (!head) return [];
  const col = (...names: string[]) => head.findIndex((h) => names.some((n) => h.trim().toLowerCase().startsWith(n)));
  const c = {
    issue: col('issue', 'description', 'summary', 'title', 'problem'),
    page: col('page', 'url', 'location', 'template'),
    component: col('component'),
    wcag: col('wcag', 'criterion', 'success criterion', 'sc'),
    severity: col('severity', 'impact', 'priority'),
    rec: col('recommendation', 'remediation', 'fix', 'solution'),
    owner: col('owner', 'assigned'),
    status: col('status'),
  };
  if (c.issue < 0) throw new Error('No “Issue” or “Description” column found.');
  const at = (r: string[], i: number) => (i >= 0 ? (r[i] ?? '').trim() : '');
  return rows
    .filter((r) => at(r, c.issue))
    .map((r) => {
      const comp = at(r, c.component).toLowerCase();
      return {
        ...base(source),
        issue: at(r, c.issue),
        page: at(r, c.page),
        component: components.find((x) => x.slug === comp || x.name.toLowerCase() === comp)?.slug ?? '',
        wcag: at(r, c.wcag).match(/\d\.\d\.\d{1,2}/)?.[0] ?? '',
        severity: pick<Severity>(at(r, c.severity), { block: 'blocker', critical: 'blocker', high: 'major', major: 'major', serious: 'major', medium: 'major', minor: 'minor', low: 'minor', moderate: 'minor' }, 'major'),
        recommendation: at(r, c.rec),
        owner: pick<IssueOwner>(at(r, c.owner), { agency: 'agency', vendor: 'agency', client: 'client', shared: 'shared', both: 'shared' }, 'agency'),
        status: pick<IssueStatus>(
          at(r, c.status),
          { open: 'open', new: 'open', 'in progress': 'in-progress', progress: 'in-progress', fixed: 'fixed', resolved: 'fixed', verified: 'verified', closed: 'verified', 'retest failed': 'retest-failed', reopened: 'retest-failed', accepted: 'accepted', "won't": 'accepted', deferred: 'accepted' },
          'open',
        ),
      };
    });
}

/** Read a .json (axe) or .csv file into issues. */
export async function importIssues(file: File, source: IssueSource): Promise<ImportedIssue[]> {
  const text = await file.text();
  if (/\.json$/i.test(file.name) || text.trim().startsWith('{') || text.trim().startsWith('[')) {
    const issues = fromAxe(JSON.parse(text), source);
    if (!issues.length) throw new Error('No axe violations found in that file.');
    return issues;
  }
  return fromCsv(text, source);
}
