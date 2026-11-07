import { Link } from 'react-router-dom';
import { Checklist } from '../components/Checklist';
import { basicsTasks, beforeYouPublish } from '../data/basics';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function BasicsPage() {
  usePageTitle('Accessibility basics');
  return (
    <article className="max-w-4xl">
      <PageHeader eyebrow="For everyone" title="Accessibility basics">
        <p>
          You don’t need to be an expert. If you write, design, publish or market anything, these habits make it work for more people, including people who use a screen reader,
          zoom in, can’t hear the sound or are reading on a phone in the sun.
        </p>
      </PageHeader>

      <nav aria-labelledby="making" className="mb-12">
        <h2 id="making" className="text-lg font-semibold">
          What are you making?
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {basicsTasks.map((t) => (
            <li key={t.id}>
              <Link to={`#${t.id}`} className="surface flex h-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium focus-ring">
                {t.title}
                <span aria-hidden="true" className="nudge-down inline-block">↓</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="before-you-publish" className="mb-14 scroll-mt-24 space-y-3">
        <h2 id="before-you-publish" className="text-2xl font-bold tracking-tight">
          Before you publish
        </h2>
        <p className="text-muted">Eight quick checks for any page, post, email or document. Your ticks are saved in this browser.</p>
        <Checklist scope="basics" items={beforeYouPublish} title="Before you publish" />
      </section>

      <div className="space-y-14">
        {basicsTasks.map((t) => (
          <section key={t.id} id={t.id} aria-labelledby={`${t.id}-title`} className="scroll-mt-24 space-y-4 border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 id={`${t.id}-title`} className="text-2xl font-bold tracking-tight">
              {t.title}
            </h2>
            <p className="text-lg leading-8 text-muted">{t.why}</p>
            <ul className="list-disc space-y-2 pl-5 leading-7">
              {t.dos.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <figure className="grid gap-3 sm:grid-cols-2">
              {t.example.label && <figcaption className="text-sm font-semibold sm:col-span-2">Example: {t.example.label.toLowerCase()}</figcaption>}
              <div className="rounded-xl border-l-4 border-red-700 bg-red-50 p-4 dark:border-red-400 dark:bg-red-950/30">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-800 dark:text-red-200">Instead of</p>
                <p className="mt-1">{t.example.instead}</p>
              </div>
              <div className="rounded-xl border-l-4 border-emerald-700 bg-emerald-50 p-4 dark:border-emerald-400 dark:bg-emerald-950/30">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">Try</p>
                <p className="mt-1">{t.example.write}</p>
              </div>
            </figure>
            <p className="rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800/70">
              <span className="font-semibold">Check it: </span>
              {t.check}
            </p>
            <p className="text-sm">
              <span className="text-muted">Helpful: </span>
              {t.links.map((l, i) => (
                <span key={l.to}>
                  {i > 0 && <span className="text-muted"> · </span>}
                  <Link to={l.to} className="link">
                    {l.label}
                  </Link>
                </span>
              ))}
            </p>
          </section>
        ))}
      </div>

      <section aria-labelledby="going-further" className="mt-16 rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-200 dark:bg-primary-900/20 dark:ring-primary-800/60">
        <h2 id="going-further" className="text-lg font-semibold">
          Want to go further?
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 leading-7">
          <li>
            Stuck on a word like “alt text” or “contrast”? The{' '}
            <Link to="/glossary" className="link">
              glossary
            </Link>{' '}
            explains it in plain words.
          </li>
          <li>
            Building or designing interface parts like menus, tabs or dialogs?{' '}
            <Link to="/components" className="link">
              Browse the components
            </Link>
            .
          </li>
          <li>
            Accessibility is part of your job title?{' '}
            <Link to="/roles/content" className="link">
              Pick your role guide
            </Link>
            .
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted">These basics cover the most common issues in the Web Content Accessibility Guidelines (WCAG), the standard most organizations follow.</p>
      </section>
    </article>
  );
}
