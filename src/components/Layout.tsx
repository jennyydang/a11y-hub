import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { categories, byCategory, findComponent } from '../data/components';
import { useRole } from '../lib/useRole';
import { foundations } from '../data/foundations';
import { roles } from '../data/roles';
import { cx } from '../ui';
import { Search } from './Search';
import { tools, toolPath } from '../data/tools';
import { ThemeToggle } from './ThemeToggle';

function Logo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8">
      <rect width="32" height="32" rx="9" className="fill-primary-600 dark:fill-primary-400" />
      <circle cx="16" cy="8.5" r="2.6" fill="white" />
      <path d="M8 12.5h16v2.4h-5.4V26h-2.4v-6h-0.4v6h-2.4V14.9H8z" fill="white" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={cx('h-4 w-4 flex-none transition-transform', open && 'rotate-90')}>
      <path fillRule="evenodd" d="M7.2 14.8a.75.75 0 0 1 0-1.06L10.94 10 7.2 6.26a.75.75 0 1 1 1.06-1.06l4.27 4.27a.75.75 0 0 1 0 1.06L8.26 14.8a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
    </svg>
  );
}

/** A collapsible nav group. Open when it holds the current page, when filtering, or when the reader opens it. */
function NavGroup({
  id,
  title,
  count,
  open,
  onToggle,
  nested,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  nested?: boolean;
  children: ReactNode;
}) {
  const panel = `nav-group-${id}`;
  return (
    <div>
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          onClick={onToggle}
          className={cx(
            'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left focus-ring hover:bg-gray-100 dark:hover:bg-gray-800',
            nested
              ? 'text-sm font-medium text-gray-800 dark:text-gray-100'
              : 'text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200',
          )}
        >
          <Chevron open={open} />
          <span className="flex-1">{title}</span>
          {count !== undefined && <span className="text-xs font-normal normal-case tracking-normal text-muted">{count}</span>}
        </button>
      </h2>
      <div id={panel} hidden={!open} className={cx('mt-0.5', nested ? 'pl-4' : 'pl-3')}>
        {children}
      </div>
    </div>
  );
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const id = useId();
  const { pathname } = useLocation();
  const [role] = useRole();
  const q = query.trim().toLowerCase();
  const match = (s: string) => !q || s.toLowerCase().includes(q);

  // Which group holds the current page, so it starts open.
  const currentGroups = new Set<string>();
  if (pathname.startsWith('/roles')) currentGroups.add('roles');
  if (pathname.startsWith('/foundations')) currentGroups.add('foundations');
  if (pathname.startsWith('/tools')) currentGroups.add('tools');
  if (['/checklist', '/progress', '/examples', '/glossary'].some((p) => pathname.startsWith(p))) currentGroups.add('reference');
  if (pathname.startsWith('/components')) {
    currentGroups.add('components');
    const c = findComponent(pathname.split('/')[2] ?? '');
    if (c) currentGroups.add(`cat-${c.category}`);
  }
  const [toggled, setToggled] = useState<Record<string, boolean>>({ roles: true });
  // A newly visited group opens; groups the reader closed elsewhere stay as they were.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setToggled((t) => {
      const next = { ...t };
      currentGroups.forEach((g) => (next[g] = true));
      return next;
    });
  }
  const isOpen = (g: string) => Boolean(q) || (toggled[g] ?? currentGroups.has(g));
  const toggle = (g: string) => setToggled((t) => ({ ...t, [g]: !isOpen(g) }));

  const item = (to: string, label: string, extra?: string) => (
    <li key={to}>
      <NavLink
        to={to}
        end={to === '/' || to === '/components' || to === '/tools'}
        onClick={onNavigate}
        className={({ isActive }) =>
          cx(
            'block rounded-md px-3 py-1.5 text-sm transition-colors focus-ring',
            isActive
              ? 'bg-primary-50 font-semibold text-primary-800 dark:bg-primary-900/50 dark:text-primary-100'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white',
          )
        }
      >
        {label}
        {extra && <span className="ml-1.5 text-xs font-normal text-muted">{extra}</span>}
      </NavLink>
    </li>
  );
  const reference: [string, string][] = [
    ['/checklist', 'Testing checklist'],
    ['/progress', 'Team progress'],
    ['/examples', 'Page examples'],
    ['/glossary', 'Glossary'],
  ];
  const referenceItems = reference.filter(([, l]) => match(l));
  const foundationItems = foundations.filter((f) => match(f.name));
  const roleItems = roles.filter((r) => match(`${r.name} guide`));
  const toolItems = tools.filter((t) => match(t.name));
  const componentGroups = categories.map((cat) => [cat, byCategory(cat).filter((c) => match(c.name))] as const).filter(([, list]) => list.length);
  const componentCount = componentGroups.reduce((n, [, list]) => n + list.length, 0);
  const totalMatches = (match('Overview') ? 1 : 0) + referenceItems.length + foundationItems.length + roleItems.length + toolItems.length + componentCount;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={id} className="sr-only">
          Filter navigation
        </label>
        <input
          id={id}
          type="search"
          placeholder="Filter pages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-gray-300 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus-visible:ring-primary-300"
        />
        <p className="sr-only" role="status">
          {q ? `${totalMatches} pages match` : ''}
        </p>
      </div>
      {match('Overview') && <ul>{item('/', 'Overview')}</ul>}
      {roleItems.length > 0 && (
        <NavGroup id="roles" title="Role guides" open={isOpen('roles')} onToggle={() => toggle('roles')}>
          <ul className="space-y-0.5">{roleItems.map((r) => item(`/roles/${r.id}`, `${r.name} guide`, r.id === role ? '(you)' : undefined))}</ul>
        </NavGroup>
      )}
      {componentCount > 0 && (
        <NavGroup id="components" title="Components" count={componentCount} open={isOpen('components')} onToggle={() => toggle('components')}>
          <ul className="space-y-0.5">
            {!q && item('/components', 'All components')}
            {componentGroups.map(([cat, list]) => (
              <li key={cat}>
                <NavGroup id={`cat-${cat}`} title={cat} count={list.length} nested open={isOpen(`cat-${cat}`)} onToggle={() => toggle(`cat-${cat}`)}>
                  <ul className="space-y-0.5">{list.map((c) => item(`/components/${c.slug}`, c.name))}</ul>
                </NavGroup>
              </li>
            ))}
          </ul>
        </NavGroup>
      )}
      {foundationItems.length > 0 && (
        <NavGroup id="foundations" title="Foundations" count={foundationItems.length} open={isOpen('foundations')} onToggle={() => toggle('foundations')}>
          <ul className="space-y-0.5">{foundationItems.map((f) => item(`/foundations/${f.slug}`, f.name))}</ul>
        </NavGroup>
      )}
      {toolItems.length > 0 && (
        <NavGroup id="tools" title="Tools" count={toolItems.length} open={isOpen('tools')} onToggle={() => toggle('tools')}>
          <ul className="space-y-0.5">
            {!q && item('/tools', 'All tools')}
            {toolItems.map((t) => item(toolPath(t.id), t.name, role && t.roles.includes(role) ? '(for you)' : undefined))}
          </ul>
        </NavGroup>
      )}
      {referenceItems.length > 0 && (
        <NavGroup id="reference" title="Testing & reference" open={isOpen('reference')} onToggle={() => toggle('reference')}>
          <ul className="space-y-0.5">{referenceItems.map(([to, label]) => item(to, label))}</ul>
        </NavGroup>
      )}
      {totalMatches === 0 && <p className="px-3 text-sm text-muted">No pages match “{query}”.</p>}
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const [role] = useRole();
  const mainRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const first = useRef(true);

  // On route change: move focus to the page's h1 so screen reader users hear the new page.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (location.hash) {
      // Deep link to a section: scroll to it and move focus to its heading
      const id = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        const target = el.matches('h1, h2, h3') ? el : el.querySelector<HTMLElement>('h2, h3') ?? el;
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        el.scrollIntoView({ block: 'start' });
        target.focus({ preventScroll: true });
      });
      return;
    }
    const h1 = mainRef.current?.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only z-[100] rounded-md bg-primary-700 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-[#0f1113]/90">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-4 sm:px-6">
          <button
            ref={menuButtonRef}
            type="button"
            className="-ml-1 rounded-md p-2 text-gray-700 hover:bg-gray-100 focus-ring lg:hidden dark:text-gray-200 dark:hover:bg-gray-800"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">Navigation menu</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
              {menuOpen ? (
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              ) : (
                <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              )}
            </svg>
          </button>
          <NavLink to="/" className="flex items-center gap-2.5 rounded-md focus-ring">
            <Logo />
            <span className="text-lg font-bold tracking-tight">A11y Hub</span>
          </NavLink>
          <span className="chip hidden bg-gray-100 text-gray-700 sm:inline-flex dark:bg-gray-800 dark:text-gray-200">Styled with Fluid UI</span>
          <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
            {[
              ['/foundations/keyboard', 'Foundations', '/foundations'],
              [`/roles/${role ?? 'content'}`, 'Role guides', '/roles'],
              ['/components', 'Components', '/components'],
              ['/tools', 'Tools', '/tools'],
              ['/checklist', 'Checklist', '/checklist'],
            ].map(([to, label, prefix]) => {
              const active = location.pathname.startsWith(prefix);
              return (
                <NavLink
                  key={to}
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'rounded-md px-3 py-2 text-sm font-medium focus-ring',
                    active ? 'text-primary-700 dark:text-primary-200' : 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white',
                  )}
                >
                  {label}
                </NavLink>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-2">
            <Search />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[90rem]">
        <nav aria-label="Documentation" className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-none overflow-y-auto border-r border-gray-200/80 px-4 py-6 lg:block dark:border-gray-800">
          <SideNav />
        </nav>
        {menuOpen && (
          <nav id="mobile-nav" aria-label="Documentation" className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-white px-4 py-6 lg:hidden dark:bg-[#0f1113]">
            <SideNav onNavigate={() => setMenuOpen(false)} />
          </nav>
        )}
        <main id="main" ref={mainRef} tabIndex={-1} className="min-w-0 flex-1 px-4 py-8 outline-none sm:px-8 lg:px-12 lg:py-12">
          <Outlet />
        </main>
      </div>
      <footer className="border-t border-gray-200/80 px-4 py-8 text-center text-sm text-muted dark:border-gray-800">
        A11y Hub · Built with React, Vite and{' '}
        <a className="link" href="https://fluid-design.io/" target="_blank" rel="noreferrer">
          Fluid UI<span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </footer>
    </div>
  );
}
