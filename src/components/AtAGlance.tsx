import { Link } from 'react-router-dom';
import type { ComponentSpec } from '../data/types';
import { glance } from '../data/glance';
import { findComponent } from '../data/components';
import { Keys } from './Tables';

export function AtAGlance({ spec }: { spec: ComponentSpec }) {
  const g = glance[spec.slug];
  if (!g) return null;
  const keys = spec.keyboard.filter((k) => !k.keys.includes('—')).slice(0, 3);
  const aria = spec.aria.slice(0, 4);

  return (
    <section aria-labelledby="at-a-glance" className="surface mb-12 overflow-hidden">
      <h2 id="at-a-glance" className="border-b border-gray-100 bg-gray-50 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200">
        At a glance
      </h2>
      <dl className="grid gap-x-8 gap-y-5 p-5 text-sm leading-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <dt className="font-semibold">What it does</dt>
          <dd className="text-base">{g.does}</dd>
        </div>
        <div>
          <dt className="font-semibold">Built on</dt>
          <dd>
            <code className="font-mono text-[0.85em]">{spec.semantics}</code>
          </dd>
        </div>
        {spec.variants && (
          <div>
            <dt className="font-semibold">{spec.variants.length} variations</dt>
            <dd>{spec.variants.map((v) => v.label).join(', ')}</dd>
          </div>
        )}
        {keys.length > 0 && (
          <div>
            <dt className="font-semibold">Keys it must support</dt>
            <dd>
              <ul className="space-y-1">
                {keys.map((k) => (
                  <li key={k.keys.join()} className="flex flex-wrap items-baseline gap-2">
                    <Keys keys={k.keys} />
                    <span className="text-muted">{k.action.split('. ')[0].replace(/\.$/, '')}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {aria.length > 0 && (
          <div>
            <dt className="font-semibold">ARIA and attributes</dt>
            <dd className="flex flex-wrap gap-1.5 pt-1">
              {aria.map((a) => (
                <code key={a.attr + a.where} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                  {a.attr}
                </code>
              ))}
            </dd>
          </div>
        )}
        <div className="md:col-span-2">
          <dt className="font-semibold">Use something else when</dt>
          <dd>
            {g.instead.length ? (
              <ul className="space-y-1">
                {g.instead.map((i) => {
                  const other = findComponent(i.slug);
                  return (
                    <li key={i.slug}>
                      When {i.when}, use{' '}
                      <Link to={`/components/${i.slug}`} className="link">
                        {other?.name ?? i.slug}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="text-muted">Nothing else does this job.</span>
            )}
            <p className="mt-2">
              Still unsure?{' '}
              <Link to="/choose" className="link">
                Find the right component
              </Link>
            </p>
          </dd>
        </div>
      </dl>
    </section>
  );
}
