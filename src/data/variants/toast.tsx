import { Button, useToast } from '@fluid-design/fluid-ui';
import type { Variant } from '../types';

function make(role: 'success' | 'error') {
  return function ToastDemo() {
    const [present] = useToast() as [(o: Record<string, unknown>) => void];
    return role === 'success' ? (
      <Button className="btn-bold-primary" onClick={() => present({ title: 'Changes saved', message: 'Your profile is up to date.', role: 'success', duration: 6000 })}>
        Save profile
      </Button>
    ) : (
      <Button weight="outline" color="gray" onClick={() => present({ title: 'Couldn’t upload photo', message: 'The file is larger than 5 MB.', role: 'error' })}>
        Upload large photo
      </Button>
    );
  };
}

const regions = `<!-- Add both regions once, empty, when the page loads -->
<div id="toast-polite" role="status" aria-live="polite" aria-atomic="true"></div>
<div id="toast-assertive" role="alert" aria-atomic="true"></div>`;

export const toastVariants: Variant[] = [
  {
    id: 'success',
    label: 'Confirmation',
    description: 'A polite announcement that waits for the screen reader to finish. It disappears after 6 seconds and pauses on hover or focus.',
    Demo: make('success'),
    html: `${regions}

<button type="button" id="save">Save profile</button>

<script>
  document.getElementById('save').addEventListener('click', () => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = 'Changes saved. Your profile is up to date.';
    document.getElementById('toast-polite').append(el);
    let timer = setTimeout(() => el.remove(), 6000);
    el.addEventListener('pointerenter', () => clearTimeout(timer));
    el.addEventListener('pointerleave', () => (timer = setTimeout(() => el.remove(), 6000)));
  });
</script>`,
  },
  {
    id: 'error',
    label: 'Error',
    description: 'An assertive announcement that interrupts. It stays until dismissed.',
    Demo: make('error'),
    html: `${regions}

<button type="button" id="upload">Upload large photo</button>

<script>
  document.getElementById('upload').addEventListener('click', () => {
    const el = document.createElement('div');
    el.className = 'toast toast-error';
    el.textContent = "Error: Couldn't upload photo. The file is larger than 5 MB. ";
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.textContent = 'Dismiss';
    dismiss.addEventListener('click', () => el.remove());
    el.append(dismiss);
    document.getElementById('toast-assertive').append(el); // no auto-dismiss
  });
</script>`,
  },
];
