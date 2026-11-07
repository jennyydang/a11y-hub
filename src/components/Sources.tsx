import { Link } from 'react-router-dom';
import { REVIEW_EVERY_MONTHS, componentSources, reviews } from '../data/sources';
import type { ComponentSpec } from '../data/types';
import { wcagUrl } from '../data/wcag';

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

/** Where a component's guidance comes from, and when the team last reviewed it. */
export function Sources({ spec }: { spec: ComponentSpec }) {
  const extra = componentSources[spec.slug] ?? [];
  const review = reviews[spec.slug];
  let due = '';
  if (review) {
    const d = new Date(`${review.date}T12:00:00`);
    d.setMonth(d.getMonth() + REVIEW_EVERY_MONTHS);
    due = d.toISOString().slice(0, 10);
  }
  return (
    <div className="space-y-4">
      <ul className="space-y-2 leading-7">
        {spec.apgPattern && (
          <li>
            <Ext href={spec.apgPattern}>ARIA Authoring Practices: {spec.name} pattern</Ext> <span className="text-sm text-muted">W3C WAI · keyboard and ARIA behavior</span>
          </li>
        )}
        {spec.wcag.map((w) => (
          <li key={w.id}>
            <Ext href={wcagUrl(w)}>
              Understanding {w.id} {w.name}
            </Ext>{' '}
            <span className="text-sm text-muted">W3C WAI · Level {w.level}</span>
          </li>
        ))}
        {extra.map((s) => (
          <li key={s.url}>
            <Ext href={s.url}>{s.title}</Ext>{' '}
            <span className="text-sm text-muted">
              {s.by}
              {s.note ? ` · ${s.note}` : ''}
            </span>
          </li>
        ))}
      </ul>
      <p className="surface px-4 py-3 text-sm leading-6">
        {review ? (
          <>
            <strong>Last reviewed {fmt(review.date)}</strong> by {review.by.join(', ')}. Next review due {fmt(due)}.
          </>
        ) : (
          <>
            <strong>Not yet reviewed</strong> against the definition of done.
          </>
        )}{' '}
        Spot something out of date?{' '}
        <Link to="/process" className="link">
          See how we update the hub
        </Link>
        .
      </p>
    </div>
  );
}
