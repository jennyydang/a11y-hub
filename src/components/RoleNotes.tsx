import { Link } from 'react-router-dom';
import { componentRoles, roles } from '../data/roles';

export function RoleNotes({ slug }: { slug: string }) {
  const notes = componentRoles[slug];
  if (!notes) return null;
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {roles.map((r) => (
        <li key={r.id} className="surface flex flex-col p-5">
          <h3 className="font-semibold">{r.name}</h3>
          <ul className="mt-2 flex-1 space-y-2 text-sm leading-6">
            {notes[r.id].map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <Link to={`/roles/${r.id}`} className="link mt-3 text-sm">
            {r.name} guide
          </Link>
        </li>
      ))}
    </ul>
  );
}
