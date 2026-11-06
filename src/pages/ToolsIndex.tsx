import { Link } from 'react-router-dom';
import { tools, toolPath } from '../data/tools';
import { roles } from '../data/roles';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function ToolsIndex() {
  usePageTitle('Tools');
  return (
    <div className="max-w-5xl">
      <PageHeader eyebrow="Tools" title="Tools">
        <p>Interactive helpers for every role. Each role guide also lists the tools that help that role.</p>
      </PageHeader>
      <ul className="grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <li key={t.id}>
            <Link to={toolPath(t.id)} className="surface group flex h-full flex-col p-5 transition hover:shadow-md focus-ring">
              <span className="text-lg font-semibold group-hover:text-primary-700 dark:group-hover:text-primary-200">{t.name}</span>
              <span className="mt-1 flex-1 text-sm leading-6 text-muted">{t.description}</span>
              <span className="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-200">
                For {roles.filter((r) => t.roles.includes(r.id)).map((r) => r.name).join(', ')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
