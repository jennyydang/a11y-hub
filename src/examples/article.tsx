import { useId } from 'react';
import { Accordion, cx } from '../ui';
import { A, Logo, M, R, SkipLink, useView, type Example } from './kit';

const hero =
  'data:image/svg+xml,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140"><rect width="320" height="140" fill="#bae6fd"/><circle cx="260" cy="36" r="18" fill="#fcd34d"/><path d="M0 140 80 60l50 45 40-30 150 65Z" fill="#15803d"/><rect x="120" y="96" width="70" height="30" fill="#78350f"/><path d="M115 98h80l-40-22Z" fill="#b91c1c"/></svg>');

function Page() {
  const { mobile } = useView();
  const id = useId();
  return (
    <div className="space-y-5">
      <SkipLink target={`${id}-main`} />
      <R tag="<header>">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <Logo name="Trailmate" />
          <span className="flex items-center gap-4 text-sm">
            <M n={1} />
            <A>Trails</A>
            <A current>Visit</A>
            <A>Shop</A>
          </span>
        </div>
      </R>
      <R tag="<main>" className="mx-4">
        <div id={`${id}-main`} tabIndex={-1} className={cx('space-y-5 rounded p-1 outline-none', !mobile && 'max-w-xl')}>
          <R tag="<nav> breadcrumbs">
            <div className="flex items-center text-sm">
              <M n={2} />
              <ol className="flex flex-wrap items-center gap-1">
                <li>
                  <A>Home</A>
                  <span aria-hidden="true" className="mx-1 text-muted">/</span>
                </li>
                <li>
                  <A>Visit</A>
                  <span aria-hidden="true" className="mx-1 text-muted">/</span>
                </li>
                <li aria-current="page">Plan your visit</li>
              </ol>
            </div>
          </R>
          <h3 className="text-2xl font-bold">Plan your visit</h3>
          <p className="text-lg leading-8">
            <M n={3} />
            The visitor centre is open every day from 9am to 5pm. All main paths are step-free, and there’s free parking for blue badge holders.
          </p>
          <figure className="space-y-2">
            <div className="flex items-start">
              <M n={4} />
              <img src={hero} alt="The visitor centre, a small red-roofed building at the foot of green hills" className="w-full rounded-lg" />
            </div>
            <figcaption className="text-sm text-muted">The visitor centre sits at the start of three trails.</figcaption>
          </figure>
          <p className="leading-7">
            Check the{' '}
            <M n={5} />
            <A>access guide for each trail</A> before you set off. It lists gradients, surfaces and where the benches are.
          </p>
          <div className="space-y-3">
            <h4 className="flex items-center text-xl font-semibold">
              <M n={6} />
              Common questions
            </h4>
            <Accordion
              headingLevel={5}
              items={[
                { title: 'Can I bring my dog?', content: 'Yes, on a lead. Water bowls are by the café door.' },
                { title: 'Is there a wheelchair to borrow?', content: 'Two all-terrain wheelchairs are free to borrow. Book a day ahead.' },
                { title: 'Where can I eat?', content: 'The café serves hot food until 4pm. Picnic tables are by the car park.' },
              ]}
            />
          </div>
        </div>
      </R>
      <R tag="<footer>">
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 px-4 py-3 text-sm dark:border-gray-700">
          <M n={7} />
          <A>Accessibility statement</A>
          <A>Contact us</A>
          <A>Privacy</A>
        </div>
      </R>
    </div>
  );
}

export const article: Example = {
  id: 'article',
  name: 'Content page',
  summary: 'An information page with an image, inline links and frequently asked questions. The most common layout on most sites.',
  uses: ['site-navigation', 'breadcrumbs', 'image', 'link', 'accordion'],
  notes: [
    { n: 1, slug: 'site-navigation', title: 'Main navigation in the header', why: 'Same place on every page, with the current section marked. People don’t have to relearn it.' },
    { n: 2, slug: 'breadcrumbs', title: 'Breadcrumbs first inside main', why: 'Three levels deep, so they help people see where they are and step back up. In their own labelled nav, above the heading.' },
    { n: 3, slug: 'link', title: 'Key facts first', why: 'People read the start of a page most. Opening times and access come before anything else.' },
    { n: 4, slug: 'image', title: 'Informative image with alt text and a caption', why: 'It shows something useful (what the building looks like), so the alt describes it. The caption adds context for everyone, without repeating the alt.' },
    { n: 5, slug: 'link', title: 'Inline link that describes where it goes', why: 'Makes sense out of context, so it works in a screen reader’s links list.' },
    { n: 6, slug: 'accordion', title: 'Accordion for optional questions, at the end', why: 'Most people only need one or two answers. Each question is a heading, so they can be found by heading navigation.' },
    { n: 7, slug: 'link', title: 'Accessibility statement in the footer', why: 'People who need it look for it in the footer of every page.' },
  ],
  Page,
};
