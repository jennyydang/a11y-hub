import { ProgressBar, Spinner } from '../../ui';
import type { Variant } from '../types';
import { progress } from '../components/progress';

export const progressVariants: Variant[] = [
  {
    id: 'determinate',
    label: 'Determinate',
    description: 'A known percentage. The value is exposed with aria-valuenow, and only start and finish are announced.',
    Demo: progress.Demo,
    html: `<label for="upload">Uploading vacation.zip</label>
<progress id="upload" max="100" value="0">0%</progress>
<p id="upload-status" role="status"></p>

<script>
  const bar = document.getElementById('upload');
  const status = document.getElementById('upload-status');
  const timer = setInterval(() => {
    bar.value += 10;
    bar.textContent = bar.value + '%';
    if (bar.value >= 100) {
      clearInterval(timer);
      status.textContent = 'Upload complete.';
    }
  }, 500);
</script>`,
  },
  {
    id: 'indeterminate',
    label: 'Indeterminate',
    description: 'Unknown duration. Leave out the value attributes so screen readers don’t report a fake percentage.',
    Demo: () => <ProgressBar className="w-full max-w-sm" label="Preparing your export" />,
    html: `<label for="export">Preparing your export</label>
<progress id="export"></progress> <!-- no value = indeterminate -->`,
  },
  {
    id: 'spinner',
    label: 'Spinner',
    description: 'A short wait. Visible text in a status region says what’s loading; the animation is decorative.',
    Demo: () => <Spinner label="Loading comments" />,
    html: `<p role="status">
  <svg class="spin" aria-hidden="true" focusable="false" viewBox="0 0 24 24">…</svg>
  Loading comments…
</p>

<style>
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
</style>`,
  },
];
