import { Link } from 'react-router-dom';
import { components } from '../data/components';
import { placement, REGIONS, type Region } from '../data/placement';
import { slugify } from '../components/Section';
import { cx } from '../ui';

const inRegion = (r: Region) => components.filter((c) => placement[c.slug]?.regions.includes(r)).sort((a, b) => a.name.localeCompare(b.name));

/** Where each part of the wireframe sits; the order matches reading and tab order. */
const AREA: Record<Region, string> = {
  'Page top': 'md:col-span-3 border-dashed',
  Header: 'md:col-span-3',
  Navigation: 'md:col-span-3',
  'Main content': 'md:col-span-2 md:row-span-2',
  Forms: 'md:col-span-2',
  Sidebar: 'md:row-span-1',
  Overlays: 'md:col-span-1 border-dashed',
  Footer: 'md:col-span-3',
};

/** A wireframe of a typical page. Each region lists the components that belong there. */
export function PageLayoutMap() {
  return (
    <section aria-labelledby="layout-map" className="space-y-4">
      <h2 id="layout-map" className="text-xl font-semibold sm:text-2xl">
        Page map
      </h2>
      <p className="text-muted">
        A typical page, top to bottom in reading order. Each region lists the components that belong there; select one to see its guidance. To see
        regions filled in, open the <Link className="link" to="/examples">page examples</Link>.
      </p>
      <ol className="grid gap-3 md:grid-cols-3">
        {REGIONS.map((r) => (
          <li key={r.id} id={`region-${slugify(r.id)}`} className={cx('scroll-mt-24 rounded-xl border-2 border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-900', AREA[r.id])}>
            <h3 className="font-semibold">{r.id}</h3>
            <p className="mb-3 text-sm text-muted">{r.note}</p>
            <ul className="flex flex-wrap gap-2">
              {inRegion(r.id).map((c) => (
                <li key={c.slug}>
                  <Link to={`/components/${c.slug}#placement-ux`} className="chip bg-gray-100 text-gray-900 hover:underline focus-ring dark:bg-gray-800 dark:text-gray-50">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
