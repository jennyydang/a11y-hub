import { useEffect, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { ProgressBar, Spinner } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

function Demo() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          setRunning(false);
          return 100;
        }
        return v + 10;
      });
    }, 500);
    return () => window.clearInterval(t);
  }, [running]);
  return (
    <div className="w-full max-w-sm space-y-5">
      <ProgressBar label="Uploading vacation.zip" value={value} />
      <div className="flex items-center gap-3">
        <Button
          className="btn-bold-primary"
          onClick={() => {
            setValue(0);
            setRunning(true);
          }}
          disabled={running}
        >
          {value === 100 ? 'Upload again' : 'Start upload'}
        </Button>
        <p role="status" className="text-sm text-muted">
          {value === 100 ? 'Upload complete.' : ''}
        </p>
      </div>
      <Spinner label="Loading comments" />
    </div>
  );
}

export const progress: ComponentSpec = {
  slug: 'progress',
  name: 'Progress & spinner',
  category: 'Feedback',
  summary: 'Progress bars show how far along a task is. Spinners show that something is happening when the duration is unknown.',
  semantics: 'role="progressbar" (or <progress>) + role="status"',
  apgPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/meter/',
  whenToUse: ['Use a determinate progress bar when you know the percentage.', 'Use a spinner for waits under a few seconds with unknown length.'],
  keyboard: [{ keys: ['—'], action: 'Not interactive. Don’t make progress indicators focusable.' }],
  aria: [
    { attr: 'role="progressbar"', where: 'bar', usage: 'Exposes the indicator. Native <progress> does this for you.' },
    { attr: 'aria-valuenow / min / max', where: 'bar', usage: 'The current value. Leave them out for an indeterminate bar.' },
    { attr: 'aria-labelledby', where: 'bar', usage: 'Names what is in progress.' },
    { attr: 'role="status"', where: 'spinner text / completion', usage: 'Announces “Loading…” and “Upload complete” politely.' },
    { attr: 'aria-busy="true"', where: 'region being updated', usage: 'Tells assistive tech a region is loading.' },
  ],
  focus: ['When loading finishes and content appears, keep focus where it was. Don’t yank it to the new content.'],
  screenReader: [
    'Screen readers read the value when users navigate to the bar. They don’t announce every change.',
    'Announce start and completion with a status message.',
  ],
  dos: ['Pair spinners with visible text.', 'Respect prefers-reduced-motion. Slow or stop spinning animations.'],
  donts: ['Don’t announce every percentage step. It floods the speech queue.', 'Don’t use a progress bar as a decorative meter. Use <meter> for that.'],
  wcag: [WCAG.statusMessages, WCAG.nameRoleValue, WCAG.pause, WCAG.nonTextContrast],
  testing: ['Navigate to the bar and confirm its name and value are read.', 'Confirm completion is announced once.', 'Turn on reduced motion in your OS and check the animation stops.'],
  Demo,
  code: `<span id="upload-label">Uploading vacation.zip</span>
<div role="progressbar" aria-labelledby="upload-label"
     aria-valuemin={0} aria-valuemax={100} aria-valuenow={60} />

<p role="status">{done ? 'Upload complete.' : ''}</p>`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI’s spinner is only used inside its Button (isLoading). These indicators use Fluid’s primary color with a reduced-motion fallback.'],
  },
};
