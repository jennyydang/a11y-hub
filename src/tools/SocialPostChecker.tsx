import { useState } from 'react';
import { Finding, TextArea, type Level } from './shared';

const SAMPLE = '𝗕𝗜𝗚 news!! 🎉🎉🎉 our #summerfestival tickets are live 🔥 grab yours before they go 👉 link in bio #festival #SummerFun';

/** Letters from the Unicode "math" and enclosed blocks that people paste as fancy fonts. Screen readers read them as symbols or skip them. */
const FANCY = /[\u{1D400}-\u{1D7FF}\u{1F130}-\u{1F189}\u{24B6}-\u{24E9}\u{FF21}-\u{FF5A}]/u;
const EMOJI = /\p{Extended_Pictographic}/gu;

export interface SocialCheck {
  level: Level;
  title: string;
  detail: string;
}

export function checkPost(text: string, hasImage: boolean, hasVideo: boolean): SocialCheck[] {
  const out: SocialCheck[] = [];
  const tags = text.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  const lowerTags = tags.filter((t) => t.length > 6 && t.slice(1) === t.slice(1).toLowerCase() && /\p{L}/u.test(t));
  out.push(
    lowerTags.length
      ? {
          level: 'fail',
          title: `Capitalize each word in ${lowerTags.length === 1 ? 'this hashtag' : 'these hashtags'}: ${lowerTags.join(', ')}`,
          detail: 'Screen readers run lowercase words together. #SummerFestival is read as two words; #summerfestival is not.',
        }
      : { level: 'ok', title: tags.length ? 'Hashtags use capitals for each word' : 'No hashtags to check', detail: '' },
  );

  const emoji = text.match(EMOJI) ?? [];
  // Emoji anywhere but the end of the post (ignoring trailing hashtags) break up the sentence when read aloud.
  const body = text.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/[\s\p{Extended_Pictographic}\uFE0F\u200D]+$/u, '');
  const midEmoji = (body.match(EMOJI) ?? []).length;
  const repeated = /(\p{Extended_Pictographic})️?(\s*\1){1,}/u.test(text);
  if (emoji.length > 3 || repeated || midEmoji > 1) {
    out.push({
      level: 'warn',
      title: `${emoji.length} emoji${repeated ? ', some repeated' : ''}${midEmoji > 1 ? ', several mid-sentence' : ''}`,
      detail: 'Each emoji is read out by name, like “party popper, party popper, party popper”. Use one or two, at the end, and don’t use them in place of words.',
    });
  } else {
    out.push({ level: 'ok', title: emoji.length ? `${emoji.length} emoji, used lightly` : 'No emoji', detail: '' });
  }

  out.push(
    FANCY.test(text)
      ? { level: 'fail', title: 'Fancy Unicode letters found', detail: 'Bold or script “fonts” pasted from generators are math symbols. Screen readers read them letter by letter as symbols, or skip them, and search can’t find them.' }
      : { level: 'ok', title: 'No fancy Unicode letters', detail: '' },
  );

  const caps = (text.match(/\b[A-Z]{4,}\b/g) ?? []).filter((w) => !['NASA', 'HTML', 'WCAG', 'ARIA'].includes(w));
  if (caps.length) out.push({ level: 'warn', title: `Words in all capitals: ${caps.join(', ')}`, detail: 'Some screen readers spell out words in capitals letter by letter, and capitals are harder to read. Use normal case for emphasis.' });

  if (/\b(click here|link in bio|tap here)\b/i.test(text) && !/https?:\/\//.test(text))
    out.push({ level: 'warn', title: 'Vague call to action', detail: 'Say what people get: “Tickets are on our website” or a descriptive link, instead of “click here”.' });

  if (hasImage) out.push({ level: 'warn', title: 'Add alt text to the image', detail: 'Use the platform’s alt text option. Describe what the image is there to say. If it has words in it, include them.' });
  if (hasVideo) out.push({ level: 'warn', title: 'Caption the video', detail: 'Turn on captions and check them. On platforms without captions, burn them into the video. Describe anything important that is only shown.' });
  return out;
}

export function SocialPostChecker() {
  const [text, setText] = useState(SAMPLE);
  const [image, setImage] = useState(true);
  const [video, setVideo] = useState(false);
  const results = checkPost(text, image, video);
  const issues = results.filter((r) => r.level !== 'ok').length;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <TextArea label="Your post" hint="Paste a draft. Nothing leaves your browser." value={text} onChange={setText} />
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">The post includes</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-primary-700" checked={image} onChange={(e) => setImage(e.target.checked)} />
            An image or GIF
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-primary-700" checked={video} onChange={(e) => setVideo(e.target.checked)} />A video
          </label>
        </fieldset>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold" aria-live="polite">
          {issues ? `${issues} thing${issues === 1 ? '' : 's'} to check` : 'Looks good'}
        </h3>
        <ul className="space-y-2">
          {results.map((r) => (
            <Finding key={r.title} level={r.level} title={r.title}>
              {r.detail || undefined}
            </Finding>
          ))}
        </ul>
      </div>
    </div>
  );
}
