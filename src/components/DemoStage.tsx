import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { announce, inspect, type InspectResult } from '../lib/a11yInspect';
import { cx } from '../ui';

const SIMULATIONS = [
  { value: 'none', label: 'No simulation' },
  { value: 'protanopia', label: 'Protanopia (red-blind)' },
  { value: 'deuteranopia', label: 'Deuteranopia (green-blind)' },
  { value: 'tritanopia', label: 'Tritanopia (blue-blind)' },
  { value: 'achromatopsia', label: 'Achromatopsia (no color)' },
  { value: 'blur', label: 'Low acuity (blur)' },
];

/** SVG color matrices for the color-vision simulations (Machado et al. 2009, severity 1.0). */
function SimulationFilters() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
      <defs>
        <filter id="sim-protanopia">
          <feColorMatrix type="matrix" values="0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0" />
        </filter>
        <filter id="sim-deuteranopia">
          <feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0" />
        </filter>
        <filter id="sim-tritanopia">
          <feColorMatrix type="matrix" values="1.256 -0.077 -0.179 0 0  -0.078 0.931 0.148 0 0  0.005 0.691 0.304 0 0  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>
  );
}

interface LogEntry {
  id: number;
  kind: 'focus' | 'live';
  text: string;
}

const LIVE_SELECTOR = '[aria-live]:not([aria-live="off"]), [role="status"], [role="alert"], [role="log"]';

export function DemoStage({ children, title = 'Live example' }: { children: ReactNode; title?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [sim, setSim] = useState('none');
  const [showInspector, setShowInspector] = useState(true);
  const [current, setCurrent] = useState<InspectResult | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const counter = useRef(0);
  const ids = useId();

  const push = (kind: LogEntry['kind'], text: string) => {
    counter.current += 1;
    const id = counter.current;
    setLog((l) => [{ id, kind, text }, ...l].slice(0, 6));
  };

  // Track focus inside the stage.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onFocus = (e: FocusEvent) => {
      const target = e.target as Element;
      const r = inspect(target);
      setCurrent(r);
      push('focus', announce(r));
    };
    // Refresh the panel (without logging) when the focused element's state changes.
    const refresh = () => {
      const active = document.activeElement;
      if (active && stage.contains(active)) {
        window.requestAnimationFrame(() => setCurrent(inspect(active)));
      }
    };
    stage.addEventListener('focusin', onFocus);
    stage.addEventListener('input', refresh);
    stage.addEventListener('click', refresh);
    stage.addEventListener('keyup', refresh);
    return () => {
      stage.removeEventListener('focusin', onFocus);
      stage.removeEventListener('input', refresh);
      stage.removeEventListener('click', refresh);
      stage.removeEventListener('keyup', refresh);
    };
  }, []);

  // Approximate live-region announcements anywhere on the page while this demo is mounted.
  // (Toasts and dialogs portal to <body>, so we observe the whole document.)
  useEffect(() => {
    const seen = new WeakMap<Element, string>();
    const observer = new MutationObserver((mutations) => {
      const regions = new Set<Element>();
      for (const m of mutations) {
        const node = m.target instanceof Element ? m.target : m.target.parentElement;
        const region = node?.closest(LIVE_SELECTOR);
        if (region) regions.add(region);
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          // A live region inserted together with its content is generally not announced,
          // except role="alert", which screen readers announce on insertion.
          const inserted = [n, ...Array.from(n.querySelectorAll(LIVE_SELECTOR))].filter((r) => r.matches(LIVE_SELECTOR));
          inserted.forEach((r) => {
            if (r.getAttribute('role') === 'alert') regions.add(r);
            else seen.set(r, (r.textContent || '').replace(/\s+/g, ' ').trim());
          });
        });
      }
      regions.forEach((region) => {
        if (region.closest('[data-inspector]')) return;
        const text = (region.textContent || '').replace(/\s+/g, ' ').trim();
        if (text && seen.get(region) !== text) {
          seen.set(region, text);
          const politeness =
            region.getAttribute('aria-live') ?? (region.getAttribute('role') === 'alert' ? 'assertive' : 'polite');
          push('live', `[${politeness}] ${text}`);
        }
      });
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="surface overflow-hidden">
      <SimulationFilters />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor={`${ids}-sim`} className="text-sm text-muted">
            Simulate
          </label>
          <select
            id={`${ids}-sim`}
            value={sim}
            onChange={(e) => setSim(e.target.value)}
            className="rounded-md border-0 bg-gray-50 py-1.5 pl-3 pr-8 text-sm ring-1 ring-gray-300 focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:ring-gray-600 dark:focus-visible:ring-primary-300"
          >
            {SIMULATIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              role="switch"
              checked={showInspector}
              onChange={(e) => setShowInspector(e.target.checked)}
              className="h-4 w-4 accent-primary-600 dark:accent-primary-300"
            />
            Screen reader inspector
          </label>
        </div>
      </div>

      <div
        ref={stageRef}
        className={cx(
          'bg-grid-gray-200/30 relative flex min-h-[12rem] flex-wrap items-center justify-center gap-4 p-6 sm:p-10 dark:bg-grid-gray-700/25',
          sim !== 'none' && `sim-${sim}`,
        )}
      >
        {children}
      </div>

      {showInspector && (
        <div data-inspector className="grid gap-4 border-t border-gray-100 bg-gray-50/70 p-4 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] dark:border-gray-800 dark:bg-gray-800/40">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Focused element</h4>
            {current ? (
              <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1">
                <dt className="text-muted">Role</dt>
                <dd className="font-mono">{current.role}</dd>
                <dt className="text-muted">Name</dt>
                <dd>
                  {current.name ? (
                    <span className="font-medium">“{current.name}”</span>
                  ) : (
                    <span className="font-semibold text-red-700 dark:text-red-300">Missing accessible name</span>
                  )}
                  <span className="ml-1 text-xs text-muted">via {current.nameSource}</span>
                </dd>
                {current.description && (
                  <>
                    <dt className="text-muted">Description</dt>
                    <dd>{current.description}</dd>
                  </>
                )}
                <dt className="text-muted">States</dt>
                <dd>{current.states.length ? current.states.join(', ') : '—'}</dd>
              </dl>
            ) : (
              <p className="text-muted">
                Press <kbd className="kbd">Tab</kbd> to move into the example. Its role, name and states show here.
              </p>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Approximate announcements</h4>
            {log.length ? (
              <ol className="space-y-1">
                {log.map((entry) => (
                  <li key={entry.id} className="flex gap-2">
                    <span
                      className={cx(
                        'chip flex-none',
                        entry.kind === 'focus'
                          ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100',
                      )}
                    >
                      {entry.kind === 'focus' ? 'focus' : 'live'}
                    </span>
                    <span className="min-w-0 break-words">{entry.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted">Nothing announced yet.</p>
            )}
            <p className="mt-2 text-xs text-muted">
              A simplified model of the accessibility tree. Always confirm with a real screen reader.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
