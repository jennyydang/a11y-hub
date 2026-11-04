import { Button } from '@fluid-design/fluid-ui';

interface Marker {
  id: string;
  label: string;
  sample: string;
  color: string;
  shape: 'circle' | 'tag';
  means: string;
  write: string;
}

/** Colors are chosen to stay distinct for common color-vision types, and every marker also has text. */
const MARKERS: Marker[] = [
  { id: 'focus', label: 'Focus order', sample: '1', color: '#1549de', shape: 'circle', means: 'The order Tab moves through interactive elements.', write: 'Number every interactive element on complex screens, starting at 1.' },
  { id: 'heading', label: 'Heading level', sample: 'H2', color: '#7c3aed', shape: 'tag', means: 'Text that is a heading, and its level in the outline.', write: 'Mark the level, not the size. Skip no levels: H1, then H2, then H3.' },
  { id: 'landmark', label: 'Landmark', sample: 'nav', color: '#0f766e', shape: 'tag', means: 'A page region screen reader users can jump to.', write: 'Use header, nav, main, aside, footer, or region with a name. Name it if there are two of the same.' },
  { id: 'name', label: 'Accessible name', sample: 'Name', color: '#b45309', shape: 'tag', means: 'What a screen reader says for a control with no visible text, or different text.', write: 'Write the exact words, like Name: “Close dialog”.' },
  { id: 'alt', label: 'Alt text', sample: 'Alt', color: '#be123c', shape: 'tag', means: 'The text alternative for an informative image.', write: 'Write the alt text, or mark it decorative.' },
  { id: 'decorative', label: 'Decorative', sample: 'alt=""', color: '#4b5563', shape: 'tag', means: 'An image or icon screen readers should skip.', write: 'Use on icons next to visible text, and on images that add nothing.' },
  { id: 'live', label: 'Announcement', sample: 'Live', color: '#c2410c', shape: 'tag', means: 'Text that changes and should be announced without moving focus.', write: 'Say polite (status) or assertive (alert), and give the exact message.' },
  { id: 'key', label: 'Keyboard behavior', sample: 'Key', color: '#0369a1', shape: 'tag', means: 'Custom keys beyond Tab and Enter, like arrows in tabs.', write: 'List the keys and what each does, like “← → move between tabs”.' },
  { id: 'focus-move', label: 'Focus moves to', sample: '→', color: '#1549de', shape: 'circle', means: 'Where focus goes after an action, like opening or closing a dialog.', write: 'Draw an arrow from the trigger to where focus lands, and back.' },
  { id: 'hidden', label: 'Hidden from screen readers', sample: 'Hide', color: '#4b5563', shape: 'tag', means: 'Visible content that should be skipped, such as a duplicate.', write: 'Explain why it’s hidden. Never hide something interactive.' },
  { id: 'target', label: 'Target size', sample: '24', color: '#15803d', shape: 'tag', means: 'The minimum clickable area in pixels.', write: 'Mark small targets with their size. Minimum 24×24, 44×44 for touch.' },
];

function MarkerSample({ m }: { m: Marker }) {
  return m.shape === 'circle' ? (
    <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white" style={{ background: m.color }}>
      {m.sample}
    </span>
  ) : (
    <span aria-hidden="true" className="inline-flex h-7 items-center rounded-md px-2 font-mono text-xs font-bold text-white ring-2 ring-white" style={{ background: m.color }}>
      {m.sample}
    </span>
  );
}

function stickerSheet() {
  const rowH = 64;
  const width = 520;
  const rows = MARKERS.map((m, i) => {
    const y = 40 + i * rowH;
    const shape =
      m.shape === 'circle'
        ? `<circle cx="36" cy="${y + 18}" r="16" fill="${m.color}" stroke="#fff" stroke-width="3"/><text x="36" y="${y + 23}" font-size="14" font-weight="700" text-anchor="middle" fill="#fff" font-family="Inter, Arial, sans-serif">${m.sample}</text>`
        : `<rect x="16" y="${y + 4}" width="${Math.max(40, m.sample.length * 10 + 16)}" height="28" rx="6" fill="${m.color}" stroke="#fff" stroke-width="3"/><text x="${16 + Math.max(40, m.sample.length * 10 + 16) / 2}" y="${y + 23}" font-size="13" font-weight="700" text-anchor="middle" fill="#fff" font-family="ui-monospace, Menlo, monospace">${m.sample.replace(/"/g, '&quot;')}</text>`;
    return `<g id="${m.id}">${shape}<text x="110" y="${y + 16}" font-size="15" font-weight="700" fill="#111827" font-family="Inter, Arial, sans-serif">${m.label}</text><text x="110" y="${y + 36}" font-size="12" fill="#374151" font-family="Inter, Arial, sans-serif">${m.means.replace(/&/g, '&amp;')}</text></g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${60 + MARKERS.length * rowH}" viewBox="0 0 ${width} ${60 + MARKERS.length * rowH}"><rect width="100%" height="100%" fill="#ffffff"/><text x="16" y="26" font-size="18" font-weight="700" fill="#111827" font-family="Inter, Arial, sans-serif">A11y Hub annotation kit</text>${rows.join('')}</svg>`;
}

export function AnnotationKit() {
  const download = () => {
    const url = URL.createObjectURL(new Blob([stickerSheet()], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'a11y-annotation-kit.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button className="btn-bold-primary" onClick={download}>
          Download sticker sheet (SVG)
        </Button>
        <p className="text-sm text-muted">Drag it into Figma or Sketch and ungroup to use each marker.</p>
      </div>
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <caption className="sr-only">Annotation markers and how to use them</caption>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['Marker', 'What it means', 'What to write'].map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {MARKERS.map((m) => (
              <tr key={m.id}>
                <th scope="row" className="px-4 py-3 text-left align-top font-medium">
                  <span className="flex items-center gap-3">
                    <MarkerSample m={m} />
                    {m.label}
                  </span>
                </th>
                <td className="px-4 py-3 align-top">{m.means}</td>
                <td className="px-4 py-3 align-top">{m.write}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
