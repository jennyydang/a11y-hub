import { Button } from '@fluid-design/fluid-ui';
import { Tooltip } from '../../ui';
import type { Variant } from '../types';

const Copy = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
    <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.88a1.5 1.5 0 0 1 1.06.44l3.12 3.12A1.5 1.5 0 0 1 17 6.62V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.38a3 3 0 0 0-.88-2.12L10.5 5.38A3 3 0 0 0 8.38 4.5H7v-1Z" />
    <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.88a1.5 1.5 0 0 0-.44-1.06L9.44 6.44A1.5 1.5 0 0 0 8.38 6H4.5Z" />
  </svg>
);

const script = `<script>
  const wrap = document.querySelector('.tooltip-wrap');
  const tip = wrap.querySelector('[role="tooltip"]');
  const trigger = wrap.querySelector('button');
  let t;
  const show = () => { clearTimeout(t); tip.hidden = false; };
  const hide = () => { t = setTimeout(() => (tip.hidden = true), 120); };
  trigger.addEventListener('focus', show);
  trigger.addEventListener('blur', hide);
  wrap.addEventListener('pointerenter', show); // stays open over the tooltip too
  wrap.addEventListener('pointerleave', hide);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && (tip.hidden = true));
</script>`;

export const tooltipVariants: Variant[] = [
  {
    id: 'label',
    label: 'As the name',
    description: 'For icon-only buttons. aria-labelledby makes the tooltip text the button’s accessible name.',
    Demo: () => (
      <Tooltip content="Copy link" relationship="label">
        <Button iconOnly icon={Copy} weight="light" color="gray" />
      </Tooltip>
    ),
    html: `<span class="tooltip-wrap">
  <button type="button" aria-labelledby="tip-copy">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  </button>
  <span role="tooltip" id="tip-copy" hidden>Copy link</span>
</span>

${script}`,
  },
  {
    id: 'description',
    label: 'As a description',
    description: 'For controls that already have a name. aria-describedby reads the tooltip after the name.',
    Demo: () => (
      <Tooltip content="Drafts are deleted after 30 days" relationship="description" placement="bottom">
        <Button weight="outline" color="gray">Save draft</Button>
      </Tooltip>
    ),
    html: `<span class="tooltip-wrap">
  <button type="button" aria-describedby="tip-draft">Save draft</button>
  <span role="tooltip" id="tip-draft" hidden>Drafts are deleted after 30 days</span>
</span>

${script}`,
  },
];
