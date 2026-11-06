import { useRef, useState, type KeyboardEvent } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const TOOLS = [
  { id: 'bold', label: 'Bold', icon: 'M6 3h5a4 4 0 0 1 2.8 6.9A4 4 0 0 1 12 17H6V3Zm3 3v3h2a1.5 1.5 0 0 0 0-3H9Zm0 6v3h3a1.5 1.5 0 0 0 0-3H9Z', toggle: true },
  { id: 'italic', label: 'Italic', icon: 'M8 3h7v2h-2.6l-2.8 10H12v2H5v-2h2.6l2.8-10H8V3Z', toggle: true },
  { id: 'underline', label: 'Underline', icon: 'M6 3v6a4 4 0 0 0 8 0V3h-2v6a2 2 0 0 1-4 0V3H6Zm-1 13h10v2H5v-2Z', toggle: true },
  { id: 'sep' },
  { id: 'link', label: 'Insert link', icon: 'M8.5 11.5a3 3 0 0 0 4.2 0l3-3a3 3 0 0 0-4.2-4.2l-1 1 1.4 1.4 1-1a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0l-1.4 1.4Zm3-3a3 3 0 0 0-4.2 0l-3 3a3 3 0 0 0 4.2 4.2l1-1-1.4-1.4-1 1a1 1 0 0 1-1.4-1.4l3-3a1 1 0 0 1 1.4 0l1.4-1.4Z', toggle: false },
] as const;

/** WAI-ARIA toolbar: one tab stop, arrow keys between buttons, toggles use aria-pressed. */
function Demo() {
  const buttons = TOOLS.filter((t) => t.id !== 'sep');
  const [active, setActive] = useState(0);
  const [pressed, setPressed] = useState<Record<string, boolean>>({ bold: true });
  const [msg, setMsg] = useState('');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number) => {
    const n = (i + buttons.length) % buttons.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const k: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: buttons.length - 1 };
    if (e.key in k) {
      e.preventDefault();
      go(k[e.key]);
    }
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <div role="toolbar" aria-label="Text formatting" aria-controls="toolbar-editor" onKeyDown={onKeyDown} className="flex items-center gap-1 rounded-lg bg-gray-50 p-1 ring-1 ring-gray-300 dark:bg-gray-800 dark:ring-gray-600">
        {TOOLS.map((t) => {
          if (t.id === 'sep') return <div key="sep" role="separator" aria-orientation="vertical" className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />;
          const i = buttons.indexOf(t);
          const on = Boolean(pressed[t.id]);
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              tabIndex={active === i ? 0 : -1}
              aria-pressed={t.toggle ? on : undefined}
              onFocus={() => setActive(i)}
              onClick={() => (t.toggle ? setPressed((p) => ({ ...p, [t.id]: !on })) : setMsg('Link dialog would open here'))}
              title={t.label}
              className={`grid h-9 w-9 place-items-center rounded-md focus-ring ${on ? 'bg-primary-700 text-white dark:bg-primary-300 dark:text-gray-900' : 'text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700'}`}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d={t.icon} />
              </svg>
              <span className="sr-only">{t.label}</span>
            </button>
          );
        })}
      </div>
      <label htmlFor="toolbar-editor" className="sr-only">
        Message
      </label>
      <textarea
        id="toolbar-editor"
        rows={3}
        defaultValue="Thanks for joining the walk on Saturday."
        className={`block w-full rounded-lg bg-white p-3 ring-1 ring-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-900 dark:ring-gray-400 ${pressed.bold ? 'font-bold' : ''} ${pressed.italic ? 'italic' : ''} ${pressed.underline ? 'underline' : ''}`}
      />
      <p role="status" className="text-sm text-muted">
        {msg}
      </p>
    </div>
  );
}

const code = `<div role="toolbar" aria-label="Text formatting" aria-controls="editor" onKeyDown={onKeyDown}>
  {buttons.map((b, i) => (
    <button key={b.id} ref={(el) => (refs.current[i] = el)}
      tabIndex={active === i ? 0 : -1}          // one tab stop
      aria-pressed={b.toggle ? pressed[b.id] : undefined}
      onClick={() => toggle(b.id)}>
      <Icon aria-hidden="true" /><span className="sr-only">{b.label}</span>
    </button>
  ))}
</div>

// ← → move between buttons (wrapping), Home / End jump to the ends`;

export const toolbar: ComponentSpec = {
  slug: 'toolbar',
  name: 'Toolbar',
  category: 'Actions',
  summary: 'A toolbar groups related controls, like text formatting buttons, into one tab stop. Arrow keys move between the buttons.',
  semantics: 'role="toolbar" with an aria-label and roving tabindex',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
  whenToUse: [
    'Use a toolbar for 3 or more related controls used often together, like an editor’s formatting buttons.',
    'For 2 buttons, just show the buttons.',
    'Use a menu when the actions are rarely used and can be hidden.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves into the toolbar (to the last used button) and out again.' },
    { keys: ['←', '→'], action: 'Previous or next button, wrapping at the ends.' },
    { keys: ['Home', 'End'], action: 'First or last button.' },
    { keys: ['Enter', 'Space'], action: 'Activates the button, or toggles it.' },
  ],
  aria: [
    { attr: 'role="toolbar"', where: 'wrapper', usage: 'With aria-label naming the group.' },
    { attr: 'aria-pressed', where: 'toggle buttons', usage: 'true or false for Bold, Italic and so on. Leave it off action buttons.' },
    { attr: 'aria-controls', where: 'toolbar', usage: 'Optional: points to what the toolbar acts on.' },
    { attr: 'role="separator"', where: 'divider', usage: 'Separates groups; not focusable.' },
    { attr: 'tabindex="0" / "-1"', where: 'buttons', usage: 'Roving tabindex: only one button is tabbable.' },
  ],
  focus: ['The toolbar is one tab stop; remember the last focused button.', 'Every button needs a visible focus ring and a pressed style that isn’t only color.'],
  screenReader: ['“Text formatting, toolbar. Bold, toggle button, pressed.”', '“Insert link, button.”'],
  dos: ['Give every icon button a name and a tooltip.', 'Group related buttons with separators.', 'Show pressed state with a filled background and an outline change.'],
  donts: ['Don’t put text inputs in a toolbar if arrow keys are needed to edit them.', 'Don’t make each button a separate tab stop.', 'Don’t change a toggle’s label when pressed; aria-pressed carries the state.'],
  wcag: [WCAG.keyboard, WCAG.nameRoleValue, WCAG.focusVisible, WCAG.useOfColor, WCAG.nonTextContrast, WCAG.targetSize],
  testing: [
    'Tab in once and out once.',
    'Use ← → Home End to move, and confirm it wraps.',
    'Toggle Bold and confirm “pressed” and “not pressed” are announced.',
    'Confirm every button has a name, not just an icon.',
  ],
  Demo,
  code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI doesn’t ship a toolbar. These are native buttons with roving tabindex and Fluid’s primary tokens for the pressed state.', 'The title attribute gives sighted mouse users a tooltip; the hidden text is the accessible name.'],
  },
};
