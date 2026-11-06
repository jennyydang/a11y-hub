import { useState } from 'react';
import { contrastRatio, parseHex } from './contrast';
import { TextArea } from './shared';

const SAMPLE = `White #ffffff
Ink #17191c
Brand blue #1549de
Sky #8ec3ff
Coral #ff6b57
Gray #6f7276`;

interface Swatch {
  name: string;
  hex: string;
}

export function parsePalette(text: string): Swatch[] {
  return text
    .split('\n')
    .map((l) => {
      const m = l.match(/#?([0-9a-f]{6}|[0-9a-f]{3})\b/i);
      if (!m) return null;
      const hex = `#${m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]}`.toLowerCase();
      if (!parseHex(hex)) return null;
      const name = l.replace(m[0], '').replace(/[:=,\-–]+\s*$/, '').trim() || hex;
      return { name, hex };
    })
    .filter((s): s is Swatch => Boolean(s));
}

function verdict(r: number) {
  if (r >= 7) return { label: 'AAA text', short: 'AAA' };
  if (r >= 4.5) return { label: 'AA text', short: 'AA' };
  if (r >= 3) return { label: 'Large text and UI only', short: 'Large/UI' };
  return { label: 'Fails: decoration only', short: 'Fail' };
}

/** Every text and background pair in a palette, so designers can see at once which pairs can carry text. */
export function PaletteGrid() {
  const [text, setText] = useState(SAMPLE);
  const sw = parsePalette(text);
  const pairs = sw.flatMap((a, i) => sw.slice(i + 1).map((b) => ({ a, b, r: contrastRatio(a.hex, b.hex) ?? 1 })));
  const usable = pairs.filter((p) => p.r >= 4.5).length;
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <TextArea label="Your palette" hint="One color per line: a name, then a hex value. Paste from your design tokens." value={text} onChange={setText} rows={8} mono />
        <div className="space-y-2 text-sm leading-6">
          <p className="font-semibold" aria-live="polite">
            {sw.length} colors, {pairs.length} pairs. {usable} can carry body text.
          </p>
          <ul className="list-disc pl-5 text-muted">
            <li>
              <strong className="text-gray-900 dark:text-gray-50">AA text</strong>: 4.5:1, for body text.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-50">Large/UI</strong>: 3:1, for text 24px and up (or 18.66px bold), icons, borders and focus rings.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-50">Fail</strong>: use the pair only for decoration, never for text or meaning.
            </li>
          </ul>
        </div>
      </div>
      {sw.length > 1 && (
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Contrast grid">
          <table className="border-collapse text-sm">
            <caption className="mb-2 text-left font-semibold">Contrast ratio for every pair (text color in rows, background in columns)</caption>
            <thead>
              <tr>
                <td />
                {sw.map((s) => (
                  <th key={s.hex + s.name} scope="col" className="min-w-[6.5rem] px-2 py-1 text-left font-medium">
                    <span className="mr-1 inline-block h-3 w-3 rounded-sm align-middle ring-1 ring-gray-400" style={{ background: s.hex }} aria-hidden="true" />
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sw.map((fg) => (
                <tr key={fg.hex + fg.name}>
                  <th scope="row" className="whitespace-nowrap px-2 py-1 text-left font-medium">
                    {fg.name}
                  </th>
                  {sw.map((bg) => {
                    if (fg === bg) return <td key={bg.hex + bg.name} className="border border-gray-200 dark:border-gray-700" aria-label="Same color" />;
                    const r = contrastRatio(fg.hex, bg.hex) ?? 1;
                    const v = verdict(r);
                    return (
                      <td key={bg.hex + bg.name} className="border border-gray-200 p-1 dark:border-gray-700">
                        {/* Drawn as an image: the sample shows failing pairs on purpose, and the ratio below carries the information. */}
                        <svg aria-hidden="true" focusable="false" className="block h-8 w-full rounded" style={{ background: bg.hex }} viewBox="0 0 48 32" preserveAspectRatio="xMinYMid meet">
                          <text x="8" y="21" fill={fg.hex} fontSize="14" fontWeight="600" fontFamily="inherit">
                            Aa
                          </text>
                        </svg>
                        <div className="mt-1 text-xs">
                          {r.toFixed(2)}:1 <span className="font-semibold">{v.short}</span>
                          <span className="sr-only">, {v.label}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
