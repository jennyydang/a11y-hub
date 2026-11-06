import { useEffect, useId, useState } from 'react';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';
import videoSrc from '../../assets/trail-tip.webm';
import captionsText from '../../assets/trail-tip.vtt?raw';

const TRANSCRIPT = [
  '[Birdsong]',
  'Narrator: Start at the visitor centre car park.',
  'Follow the red markers along the flat river path.',
  'The loop takes about an hour and is step-free.',
];

/** Native video with captions, a transcript and no autoplay. */
function Demo() {
  const id = useId();
  const [tracks, setTracks] = useState<string>();
  useEffect(() => {
    // A blob URL keeps the captions same-origin in every host
    const url = URL.createObjectURL(new Blob([captionsText], { type: 'text/vtt' }));
    setTracks(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <figure className="w-full max-w-md space-y-3">
      <video controls preload="metadata" aria-describedby={`${id}-cap`} className="w-full rounded-lg bg-gray-900">
        <source src={videoSrc} type="video/webm" />
        {tracks && <track kind="captions" src={tracks} srcLang="en" label="English" default />}
        Your browser can’t play this video. <a href="#transcript">Read the transcript</a>.
      </video>
      <figcaption id={`${id}-cap`} className="text-sm text-muted">
        Riverside loop: how to find the start (9 seconds). The demo has no sound; captions show the narration.
      </figcaption>
      <details className="rounded-lg ring-1 ring-gray-200 dark:ring-gray-700">
        <summary className="cursor-pointer rounded-lg px-4 py-2 font-semibold focus-ring">Transcript</summary>
        <div className="space-y-1 px-4 pb-3 text-sm leading-6">
          {TRANSCRIPT.map((l) => (
            <p key={l}>{l}</p>
          ))}
          <p className="text-muted">Visual: a red-roofed hut moves along a green river path under a blue sky.</p>
        </div>
      </details>
    </figure>
  );
}

const code = `<figure>
  <video controls preload="metadata" aria-describedby="video-cap">
    <source src={video} type="video/webm" />
    <track kind="captions" src="/captions/trail-tip.en.vtt" srcLang="en" label="English" default />
  </video>
  <figcaption id="video-cap">Riverside loop: how to find the start (9 seconds)</figcaption>
  <details>
    <summary>Transcript</summary>
    <p>Narrator: Start at the visitor centre car park.</p>
    …
  </details>
</figure>`;

export const video: ComponentSpec = {
  slug: 'video',
  name: 'Video',
  category: 'Content',
  summary: 'Video needs captions for speech and sounds, a transcript, and audio description when important things are only shown on screen. Use the browser’s own controls.',
  semantics: '<video controls> with <track kind="captions"> and a transcript',
  whenToUse: [
    'Use video when showing is clearer than telling, like how to find a trailhead.',
    'Always pair it with captions and a transcript; some people can’t hear, some can’t watch, many watch muted.',
    'Use text and images instead when the video would only show someone talking.',
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to the video controls.' },
    { keys: ['Space', 'K'], action: 'Plays or pauses (native controls).' },
    { keys: ['←', '→'], action: 'Seeks back or forward (most browsers).' },
  ],
  aria: [
    { attr: 'controls', where: '<video>', usage: 'Native controls are keyboard and screen reader accessible.' },
    { attr: '<track kind="captions">', where: 'inside <video>', usage: 'WebVTT captions, with srclang and label. Include sounds, like [Birdsong].' },
    { attr: 'aria-describedby', where: '<video>', usage: 'Links the caption that says what the video is and how long it is.' },
    { attr: '<details>', where: 'transcript', usage: 'A native disclosure, right below the video.' },
    { attr: 'No autoplay', where: '<video>', usage: 'Never start playing on load, especially with sound.' },
  ],
  focus: ['Don’t move focus into the video on load.', 'If you build custom controls, every control needs a name and a visible focus ring.'],
  screenReader: ['“Video. Riverside loop: how to find the start, 9 seconds.” Then the play button and other controls.'],
  dos: ['Write captions with speaker names and sound cues.', 'Put the transcript right below the video.', 'Add audio description if key information is only visible.'],
  donts: ['Don’t autoplay.', 'Don’t rely on auto-generated captions without checking them.', 'Don’t flash more than 3 times a second.'],
  wcag: [WCAG.pause, WCAG.flashes, WCAG.captions, WCAG.mediaAlt, WCAG.audioDescription, WCAG.keyboard],
  testing: [
    'Play with captions on and check they match the speech and include sounds.',
    'Use only the keyboard to play, pause and turn captions on and off.',
    'Read the transcript without the video and confirm nothing important is missing.',
    'Confirm the video doesn’t play on load.',
  ],
  Demo,
  code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI doesn’t ship a player. The native <video> element gives accessible controls, captions menu and keyboard support for free.', 'The transcript uses a native <details>, styled to match Fluid’s disclosure.'],
  },
};

