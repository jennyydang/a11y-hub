import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@fluid-design/fluid-ui';
import { Code } from '../components/Code';

type ResultId = 'functional' | 'text' | 'complex' | 'informative' | 'mood' | 'decorative';

interface Question {
  id: string;
  ask: string;
  help: string;
  examples: { yes: string; no: string };
  yes: string | ResultId;
  no: string | ResultId;
}

interface Result {
  title: string;
  verdict: 'Informative' | 'Decorative';
  what: string;
  write: string[];
  markup: string;
  example?: string;
  variant: 'informative' | 'decorative' | 'complex' | 'link';
}

const QUESTIONS: Record<string, Question> = {
  action: {
    id: 'action',
    ask: 'Is the image the only thing inside a link or button?',
    help: 'For example, a logo that links home, or an icon with no visible text that opens a menu.',
    examples: { yes: 'A magnifying glass icon that submits search', no: 'An icon sitting next to the visible word “Search”' },
    yes: 'functional',
    no: 'text',
  },
  text: {
    id: 'text',
    ask: 'Does the image contain words that aren’t also written out as real text nearby?',
    help: 'Think of a banner with a headline baked in, a scanned sign, or a quote set as a graphic.',
    examples: { yes: 'A promo banner that says “50% off this weekend”', no: 'A photo with the same headline written above it in HTML' },
    yes: 'text',
    no: 'complex',
  },
  complex: {
    id: 'complex',
    ask: 'Is it a chart, graph, diagram, map or infographic?',
    help: 'Images whose information takes more than a sentence or two to explain.',
    examples: { yes: 'A line chart of sign-ups by month', no: 'A product photo' },
    yes: 'complex',
    no: 'meaning',
  },
  meaning: {
    id: 'meaning',
    ask: 'If you removed the image, would someone miss information they need?',
    help: 'Read the page without it. If the text still tells the whole story, the answer is no.',
    examples: { yes: 'A photo showing which port is the charging port', no: 'A stock photo of people smiling at a laptop' },
    yes: 'informative',
    no: 'repeat',
  },
  repeat: {
    id: 'repeat',
    ask: 'Does the image set a tone or show something the page relies on, even though the text covers the facts?',
    help: 'For example, a campaign hero image chosen to convey a specific feeling, or a portrait in a staff profile. Generic visual interest doesn’t count.',
    examples: { yes: 'A photo of the flooded street in a news story', no: 'An avatar next to the person’s name' },
    yes: 'mood',
    no: 'decorative',
  },
};

const RESULTS: Record<ResultId, Result> = {
  functional: {
    title: 'Functional image',
    verdict: 'Informative',
    what: 'The image is doing the job of link or button text, so its alt text is that text.',
    write: ['Describe where the link goes or what the button does, not what the image looks like.', 'For a logo that links home, use the organization’s name, or “[Name] home”.'],
    markup: '<a href="/">\n  <img src="logo.svg" alt="Acme home">\n</a>',
    example: 'Acme home',
    variant: 'link',
  },
  text: {
    title: 'Image of text',
    verdict: 'Informative',
    what: 'People who can’t see the image would miss the words in it.',
    write: ['Put the exact words from the image in the alt text.', 'Better still, ask design to use real text instead. Images of text don’t resize or reflow.'],
    markup: '<img src="sale-banner.png" alt="50% off everything this weekend">',
    example: '50% off everything this weekend',
    variant: 'informative',
  },
  complex: {
    title: 'Complex image',
    verdict: 'Informative',
    what: 'There’s too much information for alt text alone.',
    write: [
      'Short alt text: say what it is and that a description follows.',
      'Long description: give the key facts or trends in text nearby, or as a data table.',
    ],
    markup:
      '<figure>\n  <img src="signups.png" alt="Line chart of monthly sign-ups, described below"\n       aria-describedby="signups-desc">\n  <figcaption id="signups-desc">Sign-ups grew from 1,200 in January\n    to 4,800 in June, with the sharpest rise in April.</figcaption>\n</figure>',
    example: 'Line chart of monthly sign-ups, described below',
    variant: 'complex',
  },
  informative: {
    title: 'Informative image',
    verdict: 'Informative',
    what: 'The image adds information that isn’t in the text.',
    write: [
      'Describe what the image tells people in this context, in a sentence or less.',
      'Don’t start with “Image of” or “Picture of”. Screen readers already say it’s an image.',
    ],
    markup: '<img src="port.jpg" alt="The USB-C charging port on the left side of the headset">',
    example: 'The USB-C charging port on the left side of the headset',
    variant: 'informative',
  },
  mood: {
    title: 'Informative image (tone)',
    verdict: 'Informative',
    what: 'The facts are in the text, but the image carries meaning the page relies on.',
    write: ['Keep it short and describe what the image conveys, not every detail.', 'Don’t repeat what the caption or nearby text already says.'],
    markup: '<img src="flood.jpg" alt="Cars half under water on Main Street">',
    example: 'Cars half under water on Main Street',
    variant: 'informative',
  },
  decorative: {
    title: 'Decorative image',
    verdict: 'Decorative',
    what: 'The image adds nothing that the text doesn’t already say, so screen readers should skip it.',
    write: [
      'Don’t write alt text. Ask frontend to use an empty alt (alt="") so screen readers ignore it.',
      'Never leave the alt attribute out entirely. Some screen readers then read the file name.',
    ],
    markup: '<img src="divider-swirl.svg" alt="">',
    variant: 'decorative',
  },
};

const COMMON: { what: string; verdict: string; alt: string }[] = [
  { what: 'Logo that links to the home page', verdict: 'Functional', alt: '“Acme home”' },
  { what: 'Icon next to visible text, like a trash can beside “Delete”', verdict: 'Decorative', alt: 'Empty (alt="")' },
  { what: 'Icon-only button', verdict: 'Functional', alt: 'The action, like “Delete invoice”' },
  { what: 'Avatar next to the person’s name', verdict: 'Decorative', alt: 'Empty (alt="")' },
  { what: 'Staff photo on its own profile page', verdict: 'Informative', alt: '“Priya Shah”, or a short description if appearance matters' },
  { what: 'Generic stock photo for visual interest', verdict: 'Decorative', alt: 'Empty (alt="")' },
  { what: 'Product photo in a shop', verdict: 'Informative', alt: 'What a buyer needs to know, like color and style' },
  { what: 'Screenshot in a how-to guide', verdict: 'Informative', alt: 'What the step shows, like “Settings menu with Privacy selected”' },
  { what: 'Chart or diagram', verdict: 'Complex', alt: 'Short alt plus a full description in text' },
  { what: 'Banner with words in the image', verdict: 'Image of text', alt: 'The exact words' },
];

const START = 'action';

export function AltDecision() {
  const [path, setPath] = useState<{ q: string; answer: 'Yes' | 'No' }[]>([]);
  const [current, setCurrent] = useState<string>(START);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Move focus to the new question or result so keyboard and screen reader users keep their place.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [current]);

  const answer = (q: Question, a: 'Yes' | 'No') => {
    moved.current = true;
    setPath((p) => [...p, { q: q.id, answer: a }]);
    setCurrent(a === 'Yes' ? q.yes : q.no);
  };
  const back = () => {
    moved.current = true;
    const last = path[path.length - 1];
    setPath((p) => p.slice(0, -1));
    setCurrent(last?.q ?? START);
  };
  const restart = () => {
    moved.current = true;
    setPath([]);
    setCurrent(START);
  };

  const question = QUESTIONS[current];
  const result = !question ? RESULTS[current as ResultId] : undefined;
  const step = path.length + 1;

  return (
    <div className="space-y-6">
      <div className="surface overflow-hidden">
        {path.length > 0 && (
          <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
            <h3 className="sr-only">Your answers so far</h3>
            <ol className="flex flex-wrap gap-2 text-xs">
              {path.map((p, i) => (
                <li key={p.q} className="chip bg-gray-100 font-normal text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                  <span className="font-semibold">{i + 1}.</span> {QUESTIONS[p.q].ask.replace(/\?$/, '')}: <strong>{p.answer}</strong>
                </li>
              ))}
            </ol>
          </div>
        )}

        {question && (
          <div className="space-y-4 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">Question {step}</p>
            <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold leading-7 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded">
              {question.ask}
            </h3>
            <p className="text-sm leading-6 text-muted">{question.help}</p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <dt className="font-semibold">Yes, like</dt>
                <dd>{question.examples.yes}</dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <dt className="font-semibold">No, like</dt>
                <dd>{question.examples.no}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button className="btn-bold-primary" onClick={() => answer(question, 'Yes')}>
                Yes
              </Button>
              <Button weight="light" color="gray" onClick={() => answer(question, 'No')}>
                No
              </Button>
              {path.length > 0 && (
                <Button weight="clear" color="gray" onClick={back}>
                  Back
                </Button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4 p-5">
            <p>
              <span
                className={
                  result.verdict === 'Decorative'
                    ? 'chip bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
                    : 'chip bg-primary-100 text-primary-900 dark:bg-primary-900/60 dark:text-primary-50'
                }
              >
                {result.verdict}
              </span>
            </p>
            <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded">
              Result: {result.title}
            </h3>
            <p className="leading-7">{result.what}</p>
            <div>
              <h4 className="mb-1 text-sm font-semibold">What to write</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
                {result.write.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
            {result.example && (
              <p className="text-sm">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Example alt text: </span>
                {result.example}
              </p>
            )}
            <div>
              <h4 className="mb-1 text-sm font-semibold">Markup for frontend</h4>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-[13px] leading-6 text-gray-50" tabIndex={0} aria-label="Markup example">
                <Code code={result.markup} language="html" />
              </pre>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/components/image?variant=${result.variant}&sheet=content`} className="link text-sm">
                Fill in the Image worksheet for this case
              </Link>
              <Button weight="light" color="gray" size="sm" onClick={back}>
                Back
              </Button>
              <Button weight="clear" color="gray" size="sm" onClick={restart}>
                Check another image
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Common cases</h3>
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Common images and how to treat them</caption>
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th scope="col" className="px-4 py-2 font-semibold">
                  Image
                </th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  Treat as
                </th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  Alt text
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {COMMON.map((c) => (
                <tr key={c.what}>
                  <th scope="row" className="px-4 py-2 font-normal">
                    {c.what}
                  </th>
                  <td className="px-4 py-2 font-medium">{c.verdict}</td>
                  <td className="px-4 py-2">{c.alt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
