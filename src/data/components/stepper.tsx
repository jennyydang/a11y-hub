import { useEffect, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const STEPS = ['Your details', 'Delivery', 'Payment', 'Check and send'];

function Demo() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  return (
    <div className="w-full max-w-xl space-y-5">
      <nav aria-label="Checkout progress">
        <ol className="flex flex-wrap gap-x-2 gap-y-3 text-sm">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s} aria-current={current ? 'step' : undefined} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`grid h-7 w-7 flex-none place-items-center rounded-full text-xs font-bold ${
                    done
                      ? 'bg-primary-700 text-white dark:bg-primary-300 dark:text-gray-900'
                      : current
                        ? 'bg-white text-primary-800 ring-2 ring-primary-700 dark:bg-gray-900 dark:text-primary-200 dark:ring-primary-300'
                        : 'bg-gray-100 text-gray-700 ring-1 ring-gray-400 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className={current ? 'font-semibold' : ''}>
                  {done && <span className="sr-only">Completed: </span>}
                  {s}
                  {!done && !current && <span className="sr-only"> (not started)</span>}
                </span>
                {i < STEPS.length - 1 && <span aria-hidden="true" className="h-px w-6 bg-gray-300 dark:bg-gray-600" />}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="space-y-3 rounded-xl p-4 ring-1 ring-gray-200 dark:ring-gray-700">
        <p className="text-sm text-muted">
          Step {step + 1} of {STEPS.length}
        </p>
        {/* h4 because the example sits under the page's h3 */}
        <h4 ref={headingRef} tabIndex={-1} className="rounded text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
          {STEPS[step]}
        </h4>
        <p className="text-sm">The form fields for this step go here.</p>
        <p role="status" className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          {sent ? 'Order sent. This is a demo, so nothing was ordered.' : ''}
        </p>
        <div className="flex gap-2">
          {step > 0 && (
            <Button weight="light" color="gray" onClick={() => { setSent(false); setStep((s) => s - 1); }}>
              Back
            </Button>
          )}
          <Button className="btn-bold-primary" onClick={() => (step === STEPS.length - 1 ? setSent(true) : setStep((s) => s + 1))}>
            {step === STEPS.length - 1 ? 'Send order' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

const code = `<nav aria-label="Checkout progress">
  <ol>
    {steps.map((s, i) => (
      <li key={s} aria-current={i === step ? 'step' : undefined}>
        <span aria-hidden="true">{i < step ? '✓' : i + 1}</span>
        {i < step && <span className="sr-only">Completed: </span>}
        {s}
      </li>
    ))}
  </ol>
</nav>

<p>Step {step + 1} of {steps.length}</p>
{/* Focus moves here when the step changes */}
<h2 ref={headingRef} tabIndex={-1}>{steps[step]}</h2>`;

export const stepper: ComponentSpec = {
  slug: 'stepper',
  name: 'Step indicator',
  category: 'Navigation',
  summary: 'A step indicator shows where people are in a multi-step task, like checkout, and how many steps are left.',
  semantics: '<nav> + <ol> with aria-current="step" on the current step',
  whenToUse: [
    'Use it for tasks of 3 to 6 steps people go through in order.',
    'Skip it for 2 steps; “Step 1 of 2” text is enough.',
    'For longer or branching journeys, use a task list page people can return to.',
  ],
  keyboard: [{ keys: ['Tab'], action: 'Steps aren’t focusable unless completed steps are links back. Focus goes to the form.' }],
  aria: [
    { attr: '<nav aria-label>', where: 'wrapper', usage: 'A named landmark, like “Checkout progress”.' },
    { attr: '<ol>', where: 'steps', usage: 'An ordered list announces how many steps there are.' },
    { attr: 'aria-current="step"', where: 'current step', usage: 'Announced as “current step”.' },
    { attr: 'Visually hidden text', where: 'completed and future steps', usage: '“Completed:” and “(not started)”, so state isn’t only shown by the icon.' },
    { attr: 'aria-hidden="true"', where: 'step numbers and connectors', usage: 'The list already gives position.' },
  ],
  focus: ['When the step changes, move focus to the new step’s heading so screen reader users hear where they are.', 'Update the page title with the step name too.'],
  screenReader: ['“Checkout progress, navigation, list, 4 items. Completed: Your details. Delivery, current step.”', 'After Continue: “Payment, heading level 2”.'],
  dos: ['Show “Step 2 of 4” in text as well.', 'Let people go back without losing what they entered.', 'Keep step names short and stable.'],
  donts: ['Don’t rely on color alone for done, current and to do.', 'Don’t make future steps clickable before earlier ones are valid.', 'Don’t hide the steps on mobile; wrap them or show “Step 2 of 4: Delivery”.'],
  wcag: [WCAG.infoRel, WCAG.useOfColor, WCAG.focusOrder, WCAG.pageTitled, WCAG.headings, WCAG.reflow],
  testing: [
    'With a screen reader, confirm the current step is announced as “current step”.',
    'Press Continue and confirm focus moves to the new heading.',
    'View in grayscale and confirm done, current and future steps still look different.',
    'At 320px, confirm the steps wrap and stay readable.',
  ],
  Demo,
  code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI doesn’t ship a step indicator. This is an ordered list in a nav with Fluid’s primary color tokens.', 'Completed steps use a check mark and a filled circle, so the state isn’t carried by color alone.'],
  },
};
