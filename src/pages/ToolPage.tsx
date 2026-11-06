import { Link, useParams } from 'react-router-dom';
import { findTool } from '../data/tools';
import { roles } from '../data/roles';
import { Section } from '../components/Section';
import { ChoosePage } from './ChoosePage';
import { CheckerPage } from './CheckerPage';
import { NotFound } from './NotFound';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function ToolUsedBy({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
      <span className="text-muted">Useful for</span>
      {roles
        .filter((r) => ids.includes(r.id))
        .map((r) => (
          <Link key={r.id} to={`/roles/${r.id}`} className="chip bg-primary-50 px-3 py-1 text-primary-800 hover:bg-primary-100 focus-ring dark:bg-primary-900/50 dark:text-primary-100">
            {r.name}
          </Link>
        ))}
    </div>
  );
}

export function ToolPage() {
  const { id = '' } = useParams();
  const tool = findTool(id);
  usePageTitle(tool ? tool.name : 'Not found');
  if (!tool) return <NotFound />;
  if (tool.id === 'component-picker') return <ChoosePage usedBy={<ToolUsedBy ids={tool.roles} />} />;
  if (tool.id === 'markup-checker') return <CheckerPage usedBy={<ToolUsedBy ids={tool.roles} />} />;
  const { Tool } = tool;

  return (
    <article className="max-w-5xl">
      <PageHeader eyebrow="Tools" title={tool.name} meta={<ToolUsedBy ids={tool.roles} />}>
        <p>{tool.description}</p>
      </PageHeader>
      {Tool && (tool.ownHeadings ? <Tool /> : <Section title={tool.heading ?? tool.name}><Tool /></Section>)}
    </article>
  );
}
