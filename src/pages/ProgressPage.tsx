import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@fluid-design/fluid-ui';
import { byCategory, categories, components } from '../data/components';
import { roles, type RoleId } from '../data/roles';
import { sheetProgress, qaCases } from '../lib/worksheetItems';
import { loadWorksheet, mergeWorksheets, saveWorksheet } from '../lib/worksheetStore';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

function Meter({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="min-w-[6rem]">
      <span className="text-sm">
        {done}/{total}
        <span className="sr-only"> {label}</span>
      </span>
      <div aria-hidden="true" className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className={pct === 100 ? 'h-full bg-emerald-600 dark:bg-emerald-400' : 'h-full bg-primary-600 dark:bg-primary-300'} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ProgressPage() {
  usePageTitle('Team progress');
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  void version;

  const rows = components.map((c) => {
    const entry = loadWorksheet(c.slug);
    const per = Object.fromEntries(roles.map((r) => [r.id, sheetProgress(c, r.id, entry)])) as Record<RoleId, ReturnType<typeof sheetProgress>>;
    const failed = qaCases(c, undefined, entry).filter((q) => entry.qa[q.id]?.result === 'fail').length;
    const started = roles.some((r) => per[r.id].done > 0);
    return { c, per, failed, started, where: entry.where };
  });
  const startedCount = rows.filter((r) => r.started).length;
  const failedTotal = rows.reduce((n, r) => n + r.failed, 0);

  const exportAll = () => {
    const worksheets = Object.fromEntries(rows.filter((r) => r.started || r.where).map((r) => [r.c.slug, loadWorksheet(r.c.slug)]));
    const data = { app: 'a11y-hub', version: 1, kind: 'all-worksheets', exported: new Date().toISOString(), worksheets };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'a11y-hub-worksheets.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatus(`Exported ${Object.keys(worksheets).length} worksheets.`);
  };

  const importAll = async (file?: File) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data?.app !== 'a11y-hub') throw new Error();
      const incoming: Record<string, unknown> = data.worksheets ?? (data.component ? { [data.component]: data.worksheet } : {});
      let n = 0;
      Object.entries(incoming).forEach(([slug, ws]) => {
        if (!components.some((c) => c.slug === slug) || !ws) return;
        saveWorksheet(slug, mergeWorksheets(loadWorksheet(slug), ws as object));
        n += 1;
      });
      setVersion((v) => v + 1);
      setStatus(`Imported and combined ${n} ${n === 1 ? 'worksheet' : 'worksheets'}.`);
    } catch {
      setStatus('Couldn’t read that file. Choose a .json exported from A11y Hub.');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const th = 'px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200';

  return (
    <article className="max-w-6xl">
      <PageHeader eyebrow="Team" title="Team progress">
        <p>
          Where each role is on every component’s handoff worksheet. Progress is saved in this browser, so import your teammates’ files to see
          everyone’s work in one place.
        </p>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="surface p-4">
          <p className="text-sm text-muted">Worksheets started</p>
          <p className="text-2xl font-bold">
            {startedCount} <span className="text-base font-normal text-muted">of {components.length}</span>
          </p>
        </div>
        <div className="surface p-4">
          <p className="text-sm text-muted">Failed QA tests</p>
          <p className="text-2xl font-bold">{failedTotal}</p>
        </div>
        <div className="surface flex flex-col justify-center gap-2 p-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="btn-bold-primary" onClick={exportAll}>
              Export all worksheets
            </Button>
            <Button size="sm" weight="light" color="gray" onClick={() => fileRef.current?.click()}>
              Import files
            </Button>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => importAll(e.target.files?.[0])} />
          <p role="status" className="text-sm text-muted">
            {status}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat} className="surface overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse">
              <caption className="border-b border-gray-100 px-3 py-3 text-left font-semibold dark:border-gray-800">{cat}</caption>
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className={th}>Component</th>
                  {roles.map((r) => (
                    <th key={r.id} scope="col" className={th}>
                      {r.name}
                    </th>
                  ))}
                  <th scope="col" className={th}>Failed tests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {byCategory(cat).map((c) => {
                  const row = rows.find((r) => r.c.slug === c.slug)!;
                  return (
                    <tr key={c.slug}>
                      <th scope="row" className="px-3 py-3 text-left text-sm font-medium">
                        <Link to={`/components/${c.slug}`} className="link">
                          {c.name}
                        </Link>
                        {row.where && <span className="block text-xs font-normal text-muted">{row.where}</span>}
                      </th>
                      {roles.map((r) => (
                        <td key={r.id} className="px-3 py-3">
                          <Link to={`/components/${c.slug}?sheet=${r.id}`} className="block rounded focus-ring">
                            <span className="sr-only">
                              {c.name}, {r.name} worksheet:{' '}
                            </span>
                            <Meter done={row.per[r.id].done} total={row.per[r.id].total} label={row.per[r.id].unit} />
                          </Link>
                        </td>
                      ))}
                      <td className="px-3 py-3 text-sm">
                        {row.failed ? <span className="chip bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-50">{row.failed} failed</span> : <span className="text-muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </article>
  );
}
