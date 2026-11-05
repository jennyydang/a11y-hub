import { useEffect, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { Checkbox, RadioGroup, TextField, cx } from '../ui';
import { A, Logo, M, R, SkipLink, useView, type Example } from './kit';

type Errors = Partial<Record<'name' | 'email' | 'plan' | 'terms', string>>;

function Page() {
  const { mobile } = useView();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const list = Object.entries(errors) as [keyof Errors, string][];

  useEffect(() => {
    if (list.length) summaryRef.current?.focus();
  }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter an email address in the correct format, like name@example.com';
    if (!plan) next.plan = 'Select a plan';
    if (!terms) next.terms = 'Agree to the terms to create an account';
    setErrors(next);
    setDone(!Object.keys(next).length);
  };
  const focusField = (k: keyof Errors) => document.getElementById(`signup-${k}`)?.querySelector<HTMLElement>('input')?.focus();

  return (
    <div className="space-y-5">
      <SkipLink target="signup-main" />
      <R tag="<header>">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <span className="flex items-center">
            <M n={1} />
            <Logo name="Trailmate" />
          </span>
          <span className="flex items-center text-sm">
            <M n={2} />
            <A>Sign in</A>
          </span>
        </div>
      </R>
      <div className="px-4">
        <R tag="<nav> breadcrumbs">
          <div className="flex items-center text-sm">
          <M n={3} />
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <A>Home</A>
              <span aria-hidden="true" className="mx-1 text-muted">/</span>
            </li>
            <li aria-current="page">Create an account</li>
          </ol>
          </div>
        </R>
      </div>
      <R tag="<main>" className="mx-4">
        <div id="signup-main" tabIndex={-1} className={cx('space-y-5 rounded p-1 outline-none', mobile ? '' : 'max-w-md')}>
          {list.length > 0 && (
            <div ref={summaryRef} tabIndex={-1} aria-labelledby="signup-errors" className="space-y-2 rounded-lg border-4 border-red-700 p-4 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-red-400">
              <h3 id="signup-errors" className="flex items-center font-semibold">
                <M n={4} />
                There is a problem
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                {list.map(([k, msg]) => (
                  <li key={k}>
                    <A className="font-semibold text-red-800 underline dark:text-red-300" onClick={() => focusField(k)}>
                      {msg}
                    </A>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h3 className="text-2xl font-bold">Create an account</h3>
          {done ? (
            <p role="status" className="rounded-lg bg-emerald-100 p-4 font-semibold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-50">
              Account created. Check your email to confirm it.
            </p>
          ) : (
            <form noValidate onSubmit={submit} className="space-y-5">
              <div id="signup-name" className="flex items-start">
                <M n={5} />
                <TextField className="flex-1" label="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
              </div>
              <div id="signup-email" className="flex items-start">
                <M n={5} />
                <TextField className="flex-1" label="Email address" type="email" autoComplete="email" hint="We’ll only use this to send your receipts." value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              </div>
              <div id="signup-plan" className="flex items-start">
                <M n={6} />
                <div className="flex-1 space-y-1.5">
                  <RadioGroup
                    legend="Plan"
                    value={plan}
                    onChange={setPlan}
                    options={[
                      { value: 'free', label: 'Free', description: '3 saved trails' },
                      { value: 'plus', label: 'Plus, £3 a month', description: 'Unlimited trails and offline maps' },
                    ]}
                  />
                  {errors.plan && <p className="text-sm font-semibold text-red-700 dark:text-red-300">Error: {errors.plan}</p>}
                </div>
              </div>
              <div id="signup-terms" className="flex items-start">
                <M n={7} />
                <div className="flex-1 space-y-1.5">
                  {errors.terms && <p className="text-sm font-semibold text-red-700 dark:text-red-300">Error: {errors.terms}</p>}
                  <Checkbox label="I agree to the terms of use" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                </div>
              </div>
              <div className="flex items-center">
                <M n={8} />
                <Button as="button" type="submit" className="btn-bold-primary">
                  Create account
                </Button>
              </div>
            </form>
          )}
        </div>
      </R>
      <R tag="<footer>">
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 px-4 py-3 text-sm dark:border-gray-700">
          <M n={9} />
          <A>Privacy</A>
          <A>Accessibility statement</A>
          <A>Contact us</A>
        </div>
      </R>
    </div>
  );
}

export const signup: Example = {
  id: 'sign-up',
  name: 'Sign-up form',
  summary: 'A short form with validation. Press Create account without filling it in to see the error summary.',
  uses: ['skip-link', 'breadcrumbs', 'error-summary', 'text-input', 'radio-group', 'checkbox', 'button', 'link'],
  notes: [
    { n: 1, slug: 'skip-link', title: 'Logo, top left, after the skip link', why: 'People expect the logo top left. The skip link comes before it, so it’s the first thing Tab reaches (press Tab inside the example to see it).' },
    { n: 2, slug: 'link', title: 'Sign in, top right', why: 'Account links live top right on most sites, so returning users find them without searching.' },
    { n: 3, slug: 'breadcrumbs', title: 'Breadcrumbs above the heading', why: 'They show where the page sits and give a one-click way back, before the content starts.' },
    { n: 4, slug: 'error-summary', title: 'Error summary at the top of main', why: 'After a failed submit, focus moves here so people hear what went wrong. Each error links to its field.' },
    { n: 5, slug: 'text-input', title: 'Labels above fields, hint below the label', why: 'One downward scan reads label, hint and field. Field width matches the expected answer.' },
    { n: 6, slug: 'radio-group', title: 'Two plans as radios', why: 'Both options are visible to compare, and only one can be chosen.' },
    { n: 7, slug: 'checkbox', title: 'Terms checkbox, error above it', why: 'A single yes/no agreement is a checkbox. The error sits right next to it.' },
    { n: 8, slug: 'button', title: 'One primary button, at the end, left-aligned', why: 'It’s where people’s eyes are after the last field, on the left edge they scan down.' },
    { n: 9, slug: 'link', title: 'Footer links', why: 'Privacy, accessibility and contact are expected in the footer of every page.' },
  ],
  Page,
};
