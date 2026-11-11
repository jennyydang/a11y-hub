import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '@fluid-design/fluid-ui';
import { TextField } from '../../ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

type Field = 'name' | 'email' | 'phone';
const labels: Record<Field, string> = { name: 'Full name', email: 'Email address', phone: 'Phone number' };

function Demo() {
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const refs = { name: useRef<HTMLInputElement>(null), email: useRef<HTMLInputElement>(null), phone: useRef<HTMLInputElement>(null) };

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) e.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Enter an email address in the format name@example.com.';
    if (values.phone && !/^[\d\s()+-]{7,}$/.test(values.phone)) e.phone = 'Enter a phone number using digits only, like 020 7946 0000.';
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    flushSync(() => {
      setErrors(e);
      setDone(Object.keys(e).length === 0);
    });
    if (Object.keys(e).length) summaryRef.current?.focus();
  };

  const list = Object.entries(errors) as [Field, string][];

  return (
    <form noValidate onSubmit={submit} className="w-full max-w-md space-y-4">
      {list.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="err-summary-title"
          className="rounded-lg bg-red-50 p-4 ring-2 ring-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 dark:bg-red-900/40 dark:ring-red-400"
        >
          <h4 id="err-summary-title" className="font-semibold text-red-900 dark:text-red-100">
            There {list.length === 1 ? 'is a problem' : `are ${list.length} problems`} with your details
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {list.map(([field, msg]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="font-medium text-red-900 underline underline-offset-2 dark:text-red-100"
                  onClick={(e) => {
                    e.preventDefault();
                    refs[field].current?.focus();
                  }}
                >
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {(Object.keys(labels) as Field[]).map((f) => (
        <TextField
          key={f}
          ref={refs[f]}
          label={labels[f] + (f === 'phone' ? ' (optional)' : '')}
          type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
          autoComplete={f === 'name' ? 'name' : f === 'email' ? 'email' : 'tel'}
          value={values[f]}
          error={errors[f]}
          onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
        />
      ))}
      <Button as="button" type="submit" className="btn-bold-primary">
        Continue
      </Button>
      <p role="status" className="text-sm text-emerald-800 dark:text-emerald-200">
        {done ? 'Details saved.' : ''}
      </p>
    </form>
  );
}

export const errorSummary: ComponentSpec = {
  slug: 'error-summary',
  name: 'Error summary',
  category: 'Forms',
  summary: 'An error summary lists every problem in a form at the top, with links that jump to each field.',
  semantics: 'focusable container + list of in-page links',
  whenToUse: ['Use an error summary on any form with more than one or two fields, after the user submits.', 'Pair it with inline errors on each field. The summary gives the overview and the inline messages give the detail.'],
  keyboard: [
    { keys: ['Enter'], action: 'On a summary link: moves focus to the field with that error.' },
    { keys: ['Tab'], action: 'Moves through the summary links, then on into the form.' },
  ],
  aria: [
    { attr: 'tabindex="-1"', where: 'summary container', usage: 'Lets script move focus to the summary after a failed submit, without adding it to the tab order.' },
    { attr: 'role="alert"', where: 'summary container', usage: 'Gets the summary announced even on screen readers that don’t read focused containers.' },
    { attr: 'aria-labelledby', where: 'summary container', usage: 'Names it after its heading.' },
    { attr: '<a href="#field">', where: 'each error', usage: 'Each link moves focus to its field. Use the same wording as the inline error.' },
    { attr: 'aria-invalid + aria-describedby', where: 'each invalid field', usage: 'Marks the field invalid and links its inline message.' },
  ],
  focus: [
    'On a failed submit, move focus to the summary, so the first thing people hear is what went wrong.',
    'Each link must move focus into the field itself, not just scroll the page.',
    'Update the page title too, like “Error: Your details”, so the problem is clear in tab lists and history.',
  ],
  screenReader: ['Announced as: “There are 2 problems with your details, alert. Enter your full name, link…”.'],
  dos: ['Write each error so it says how to fix the problem.', 'List errors in the same order as the fields.', 'Keep the summary until the errors are fixed and the form is submitted again.'],
  donts: ['Don’t show a generic “Something went wrong” with no detail.', 'Don’t validate and show the summary before the first submit.'],
  wcag: [WCAG.errorId, WCAG.errorSuggest, WCAG.labels, WCAG.focusOrder, WCAG.statusMessages],
  testing: [
    'Submit the empty form and confirm focus moves to the summary and it is announced.',
    'Activate each link and confirm focus lands in the matching field.',
    'Fix the errors, submit again and confirm the summary disappears.',
  ],
  Demo,
};
