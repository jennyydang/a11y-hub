import { useId, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { cx } from '../ui';
import { contrastRatio } from './contrast';

const PRESETS: Array<{ name: string; fg: string; bg: string }> = [
  { name: 'Primary 700 on white', fg: '#1549de', bg: '#ffffff' },
  { name: 'Gray 500 on white', fg: '#6f7276', bg: '#ffffff' },
  { name: 'Gray 400 on white', fg: '#888b8f', bg: '#ffffff' },
  { name: 'Primary 300 on gray 900', fg: '#8ec3ff', bg: '#17191c' },
];

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-md border-0 bg-transparent p-0"
        />
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-32 rounded-lg bg-white px-3 py-2 font-mono text-sm ring-1 ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:ring-gray-500 dark:focus-visible:ring-primary-300"
        />
      </div>
    </div>
  );
}

function Result({ label, pass }: { label: string; pass: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
      <span>{label}</span>
      <span
        className={cx(
          'chip',
          pass ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100' : 'bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-100',
        )}
      >
        {pass ? '✓ Pass' : '✕ Fail'}
      </span>
    </li>
  );
}

export function ContrastChecker() {
  const [fg, setFg] = useState('#1549de');
  const [bg, setBg] = useState('#ffffff');
  const ratio = contrastRatio(fg, bg);
  const r = ratio ?? 0;
  return (
    <div className="surface p-5">
      <h2 className="text-lg font-semibold">Contrast checker</h2>
      <p className="mt-1 text-sm text-muted">Enter two hex colors to check them against the WCAG 2.2 contrast thresholds.</p>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <ColorInput label="Text color" value={fg} onChange={setFg} />
            <ColorInput label="Background color" value={bg} onChange={setBg} />
          </div>
          <Button
            size="sm"
            weight="light"
            color="gray"
            onClick={() => {
              setFg(bg);
              setBg(fg);
            }}
          >
            Swap colors
          </Button>
          <div>
            <p className="mb-2 text-sm font-semibold">Try a sample pair</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.name}
                  size="xs"
                  weight="outline"
                  color="gray"
                  onClick={() => {
                    setFg(p.fg);
                    setBg(p.bg);
                  }}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg p-4 ring-1 ring-gray-200 dark:ring-gray-700" style={{ color: fg, background: bg }}>
            <p className="text-2xl font-bold">Large text sample</p>
            <p className="text-sm">Body text sample, 14px regular.</p>
          </div>
          <p className="text-sm" aria-live="polite">
            Contrast ratio:{' '}
            <strong className="text-2xl tabular-nums">{ratio ? `${r.toFixed(2)}:1` : 'Enter valid hex colors'}</strong>
          </p>
          {ratio && (
            <ul className="space-y-1.5">
              <Result label="Normal text, AA (4.5:1)" pass={r >= 4.5} />
              <Result label="Large text, AA (3:1)" pass={r >= 3} />
              <Result label="UI components & graphics (3:1)" pass={r >= 3} />
              <Result label="Normal text, AAA (7:1)" pass={r >= 7} />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
