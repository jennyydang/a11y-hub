import { Keys } from '../components/Tables';

type Cell = string[] | string;

const DESKTOP: { task: string; vo: Cell; nvda: Cell; jaws: Cell }[] = [
  { task: 'Turn on or off', vo: ['Cmd+F5'], nvda: 'Ctrl+Alt+N to start, NVDA+Q to quit', jaws: 'Start the app / Insert+F4 to quit' },
  { task: 'Stop speaking', vo: ['Ctrl'], nvda: ['Ctrl'], jaws: ['Ctrl'] },
  { task: 'Read everything from here', vo: ['VO+A'], nvda: ['NVDA+Down'], jaws: ['Insert+Down'] },
  { task: 'Next item', vo: ['VO+Right'], nvda: ['Down'], jaws: ['Down'] },
  { task: 'Activate', vo: ['VO+Space'], nvda: ['Enter', 'Space'], jaws: ['Enter', 'Space'] },
  { task: 'Next heading', vo: ['VO+Cmd+H'], nvda: ['H'], jaws: ['H'] },
  { task: 'Heading at level 1–6', vo: 'Rotor, Headings', nvda: ['1–6'], jaws: ['1–6'] },
  { task: 'Next link', vo: ['VO+Cmd+L'], nvda: ['K'], jaws: ['Tab'] },
  { task: 'Next form field', vo: ['VO+Cmd+J'], nvda: ['F'], jaws: ['F'] },
  { task: 'Next landmark', vo: 'Rotor, Landmarks', nvda: ['D'], jaws: ['R'] },
  { task: 'Next table', vo: ['VO+Cmd+T'], nvda: ['T'], jaws: ['T'] },
  { task: 'Move between table cells', vo: ['VO+Arrows'], nvda: ['Ctrl+Alt+Arrows'], jaws: ['Ctrl+Alt+Arrows'] },
  { task: 'List headings, links or landmarks', vo: ['VO+U'], nvda: ['NVDA+F7'], jaws: ['Insert+F6', 'Insert+F7'] },
  { task: 'Switch to typing in a field', vo: 'Not needed', nvda: ['NVDA+Space'], jaws: 'Enter on the field' },
];

const MOBILE: { task: string; ios: string; android: string }[] = [
  { task: 'Turn on or off', ios: 'Triple-click the side button (set up in Accessibility Shortcut)', android: 'Hold both volume keys for 3 seconds' },
  { task: 'Next or previous item', ios: 'Swipe right or left', android: 'Swipe right or left' },
  { task: 'Activate', ios: 'Double-tap', android: 'Double-tap' },
  { task: 'Read everything from the top', ios: 'Swipe up with two fingers', android: 'TalkBack menu, Read from top' },
  { task: 'Stop speaking', ios: 'Tap with two fingers', android: 'Tap with two fingers' },
  { task: 'Jump by headings, links or form fields', ios: 'Rotor: turn two fingers, then swipe up or down', android: 'Swipe up or down to change, then swipe to move' },
  { task: 'Scroll', ios: 'Swipe with three fingers', android: 'Swipe with two fingers' },
];

const PAIRS = [
  { sr: 'VoiceOver', with: 'Safari on macOS and iOS' },
  { sr: 'NVDA', with: 'Chrome or Firefox on Windows' },
  { sr: 'JAWS', with: 'Chrome or Edge on Windows' },
  { sr: 'TalkBack', with: 'Chrome on Android' },
];

const th = 'px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200';
const td = 'px-4 py-2.5 align-top text-sm';

function Value({ v }: { v: Cell }) {
  return typeof v === 'string' ? <span className="text-muted">{v}</span> : <Keys keys={v} />;
}

export function ScreenReaderCheatSheet() {
  return (
    <div className="space-y-6">
      <div className="surface p-5 text-sm leading-6">
        <h3 className="font-semibold">Test with these pairs</h3>
        <p className="text-muted">Screen readers behave differently in each browser. These are the pairings people use most.</p>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {PAIRS.map((p) => (
            <li key={p.sr}>
              <strong>{p.sr}</strong> with {p.with}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted">
          <strong className="text-gray-900 dark:text-gray-50">VO</strong> means Control+Option. <strong className="text-gray-900 dark:text-gray-50">NVDA</strong> means Insert
          (or Caps Lock, if set). NVDA and JAWS single-letter keys work in browse mode, outside form fields.
        </p>
      </div>

      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse">
          <caption className="border-b border-gray-100 px-4 py-3 text-left font-semibold dark:border-gray-800">Desktop screen readers</caption>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className={th}>Task</th>
              <th scope="col" className={th}>VoiceOver (Mac)</th>
              <th scope="col" className={th}>NVDA (Windows)</th>
              <th scope="col" className={th}>JAWS (Windows)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {DESKTOP.map((r) => (
              <tr key={r.task}>
                <th scope="row" className={`${td} text-left font-medium`}>{r.task}</th>
                <td className={td}><Value v={r.vo} /></td>
                <td className={td}><Value v={r.nvda} /></td>
                <td className={td}><Value v={r.jaws} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse">
          <caption className="border-b border-gray-100 px-4 py-3 text-left font-semibold dark:border-gray-800">Mobile screen readers</caption>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className={th}>Task</th>
              <th scope="col" className={th}>VoiceOver (iOS)</th>
              <th scope="col" className={th}>TalkBack (Android)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {MOBILE.map((r) => (
              <tr key={r.task}>
                <th scope="row" className={`${td} text-left font-medium`}>{r.task}</th>
                <td className={td}>{r.ios}</td>
                <td className={td}>{r.android}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
