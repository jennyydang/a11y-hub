import { useState } from 'react';
import { Finding, TextArea } from './shared';

const SAMPLE =
  'In order to facilitate the utilization of our new portal, users are required to commence the registration process prior to the deadline. Applications that were submitted after the deadline will not be considered by the committee. Sign up today. It takes five minutes.';

/** Wordy terms and plainer swaps. */
const PLAIN: Record<string, string> = {
  utilize: 'use',
  utilization: 'use',
  facilitate: 'help',
  commence: 'start',
  'prior to': 'before',
  'in order to': 'to',
  approximately: 'about',
  assistance: 'help',
  purchase: 'buy',
  terminate: 'end',
  'in the event that': 'if',
  endeavor: 'try',
  sufficient: 'enough',
  additional: 'more',
  leverage: 'use',
  'at this point in time': 'now',
  'is required to': 'must',
  'are required to': 'must',
  demonstrate: 'show',
  obtain: 'get',
  regarding: 'about',
  subsequently: 'later',
};

function syllables(word: string) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

export function analyze(text: string) {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => /[a-z]/i.test(s));
  const words = text.match(/[A-Za-z’']+/g) ?? [];
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  const wps = words.length / Math.max(1, sentences.length);
  const grade = words.length ? Math.max(0, 0.39 * wps + 11.8 * (syl / words.length) - 15.59) : 0;
  const long = sentences.filter((s) => (s.match(/[A-Za-z’']+/g) ?? []).length > 25);
  const passive = sentences.filter((s) => /\b(is|are|was|were|be|been|being)\s+(\w+ly\s+)?\w+(ed|en)\b/i.test(s));
  const lower = text.toLowerCase();
  const wordy = Object.entries(PLAIN).filter(([k]) => new RegExp(`\\b${k}\\b`).test(lower));
  return { sentences: sentences.length, words: words.length, wps, grade, long, passive, wordy };
}

export function ReadingLevel() {
  const [text, setText] = useState(SAMPLE);
  const r = analyze(text);
  const grade = Math.round(r.grade * 10) / 10;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <TextArea label="Your text" hint="Paste a paragraph or a whole page. Nothing leaves your browser." value={text} onChange={setText} rows={10} />
      <div className="space-y-4">
        <dl className="grid grid-cols-3 gap-3 text-center">
          <div className="surface p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Reading grade</dt>
            <dd className="text-2xl font-bold" aria-live="polite">
              {r.words ? grade : '—'}
            </dd>
          </div>
          <div className="surface p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Words per sentence</dt>
            <dd className="text-2xl font-bold">{r.words ? Math.round(r.wps) : '—'}</dd>
          </div>
          <div className="surface p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Words</dt>
            <dd className="text-2xl font-bold">{r.words}</dd>
          </div>
        </dl>
        <ul className="space-y-2">
          <Finding level={!r.words ? 'ok' : grade <= 8 ? 'ok' : grade <= 11 ? 'warn' : 'fail'} title={grade <= 8 ? 'Easy to read for most adults' : `Grade ${grade}: aim for grade 8 or lower`}>
            A Flesch-Kincaid estimate. Grade 8 is readable for about 80% of adults. Shorter sentences and shorter words bring it down.
          </Finding>
          <Finding level={r.long.length ? 'warn' : 'ok'} title={r.long.length ? `${r.long.length} sentence${r.long.length === 1 ? '' : 's'} over 25 words` : 'No sentences over 25 words'}>
            {r.long.length > 0 && (
              <ul className="list-disc space-y-1 pl-5">
                {r.long.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </Finding>
          <Finding level={r.passive.length ? 'warn' : 'ok'} title={r.passive.length ? `${r.passive.length} sentence${r.passive.length === 1 ? '' : 's'} may be passive` : 'No passive sentences spotted'}>
            {r.passive.length > 0 && (
              <>
                <p>Say who does what: “The committee won’t consider late applications.”</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {r.passive.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </>
            )}
          </Finding>
          <Finding level={r.wordy.length ? 'warn' : 'ok'} title={r.wordy.length ? `${r.wordy.length} wordy phrase${r.wordy.length === 1 ? '' : 's'} with plainer options` : 'No wordy phrases spotted'}>
            {r.wordy.length > 0 && (
              <ul className="list-disc space-y-1 pl-5">
                {r.wordy.map(([k, v]) => (
                  <li key={k}>
                    “{k}” → “{v}”
                  </li>
                ))}
              </ul>
            )}
          </Finding>
        </ul>
      </div>
    </div>
  );
}
