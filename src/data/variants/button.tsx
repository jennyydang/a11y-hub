import { useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { Variant } from '../types';

const Trash = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.44c-.8.08-1.58.18-2.36.3a.75.75 0 1 0 .22 1.49l.15-.02.84 10.52A2.75 2.75 0 0 0 7.59 19h4.82a2.75 2.75 0 0 0 2.74-2.52l.84-10.52.15.02a.75.75 0 0 0 .22-1.49c-.78-.12-1.57-.22-2.36-.3v-.44A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.67.03 2.5.08v-.33c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.33C8.33 4.03 9.16 4 10 4Z" clipRule="evenodd" />
  </svg>
);

function Standard() {
  return (
    <>
      <Button className="btn-bold-primary">Save changes</Button>
      <Button weight="outline" color="gray">Cancel</Button>
    </>
  );
}

function Toggle() {
  const [muted, setMuted] = useState(false);
  return (
    <Button weight="light" color="gray" className="aria-pressed:!bg-primary-700 aria-pressed:!text-white dark:aria-pressed:!bg-primary-300 dark:aria-pressed:!text-gray-900" aria-pressed={muted} onClick={() => setMuted((m) => !m)}>
      Mute notifications
    </Button>
  );
}

function IconOnly() {
  return <Button iconOnly icon={Trash} color="red" weight="light" sr="Delete draft" />;
}

function Loading() {
  const [saving, setSaving] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        className="btn-bold-primary"
        isLoading={saving}
        aria-disabled={saving || undefined}
        onClick={() => {
          if (saving) return;
          setSaving(true);
          window.setTimeout(() => setSaving(false), 2000);
        }}
      >
        {saving ? 'Saving' : 'Save changes'}
      </Button>
      <p role="status" className="min-h-[1.25rem] text-sm text-muted">{saving ? 'Saving your changes…' : ''}</p>
    </div>
  );
}

function Unavailable() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button className="btn-bold-primary opacity-60" aria-disabled="true" aria-describedby="publish-why" onClick={(e: React.MouseEvent) => e.preventDefault()}>
        Publish
      </Button>
      <p id="publish-why" className="text-sm text-muted">Add a title before publishing.</p>
    </div>
  );
}

export const buttonVariants: Variant[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'A text button. Its visible label is its accessible name.',
    Demo: Standard,
    html: `<button type="button">Save changes</button>
<button type="button">Cancel</button>`,
  },
  {
    id: 'toggle',
    label: 'Toggle',
    description: 'aria-pressed turns a button into an on/off toggle. The label stays the same and the state is announced.',
    Demo: Toggle,
    html: `<button type="button" aria-pressed="false" id="mute">Mute notifications</button>

<script>
  const mute = document.getElementById('mute');
  mute.addEventListener('click', () => {
    const pressed = mute.getAttribute('aria-pressed') === 'true';
    mute.setAttribute('aria-pressed', String(!pressed));
  });
</script>`,
  },
  {
    id: 'icon-only',
    label: 'Icon only',
    description: 'The icon is hidden from assistive tech and visually hidden text names the button.',
    Demo: IconOnly,
    html: `<button type="button">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  <span class="sr-only">Delete draft</span>
</button>`,
  },
  {
    id: 'loading',
    label: 'Loading',
    description: 'The label changes to “Saving”, a status message announces progress, and aria-disabled blocks repeat clicks while keeping focus.',
    Demo: Loading,
    html: `<button type="button" id="save">Save changes</button>
<p id="save-status" role="status"></p>

<script>
  const save = document.getElementById('save');
  const status = document.getElementById('save-status');
  save.addEventListener('click', () => {
    if (save.getAttribute('aria-disabled') === 'true') return;
    save.setAttribute('aria-disabled', 'true');
    save.textContent = 'Saving';
    status.textContent = 'Saving your changes…';
    // …when the request finishes:
    // save.removeAttribute('aria-disabled'); save.textContent = 'Save changes'; status.textContent = 'Changes saved.';
  });
</script>`,
  },
  {
    id: 'unavailable',
    label: 'Unavailable',
    description: 'aria-disabled keeps the button focusable so people can find it and hear why it can’t be used yet.',
    Demo: Unavailable,
    html: `<button type="button" aria-disabled="true" aria-describedby="publish-why">Publish</button>
<p id="publish-why">Add a title before publishing.</p>

<script>
  // aria-disabled doesn't block clicks, so guard the handler
  document.querySelector('[aria-describedby="publish-why"]').addEventListener('click', (e) => {
    if (e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });
</script>`,
  },
];
