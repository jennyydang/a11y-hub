import { Tab } from '@fluid-design/fluid-ui';
import type { Variant } from '../types';
import { tabs } from '../components/tabs';

const panels = [
  { title: 'Overview', content: <p className="p-4 text-sm leading-6">Arrow keys move between tabs. Tab moves into this panel.</p> },
  { title: 'Specs', content: <p className="p-4 text-sm leading-6">Weight 1.2 kg · Battery 12 h · USB-C charging.</p> },
  { title: 'Reviews', content: <p className="p-4 text-sm leading-6">4.6 out of 5 stars from 212 reviews.</p> },
];

const htmlMarkup = (extra = '') => `<div role="tablist" aria-label="Product details"${extra}>
  <button type="button" role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">Overview</button>
  <button type="button" role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">Specs</button>
  <button type="button" role="tab" id="tab-3" aria-selected="false" aria-controls="panel-3" tabindex="-1">Reviews</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">…</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0" hidden>…</div>
<div role="tabpanel" id="panel-3" aria-labelledby="tab-3" tabindex="0" hidden>…</div>`;

export const tabsVariants: Variant[] = [
  {
    id: 'automatic',
    label: 'Automatic',
    description: 'Arrow keys move focus and show the panel straight away. Best when panels render instantly.',
    Demo: tabs.Demo,
    html: `${htmlMarkup()}

<script>
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length]);
    });
  });
</script>`,
  },
  {
    id: 'manual',
    label: 'Manual',
    description: 'Arrow keys only move focus. Enter or Space shows the panel. Use when panels are slow to load.',
    Demo: () => (
      <div className="w-full max-w-lg">
        <Tab manual tabs={panels} />
      </div>
    ),
    html: `${htmlMarkup()}

<script>
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab)); // Enter and Space fire click on a <button>
    tab.addEventListener('keydown', (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      tabs[(next + tabs.length) % tabs.length].focus(); // focus only, no selection
    });
  });
</script>`,
  },
  {
    id: 'vertical',
    label: 'Vertical',
    description: 'aria-orientation="vertical" tells screen readers to expect Up and Down arrows instead of Left and Right.',
    Demo: () => (
      <div className="w-full max-w-lg">
        <Tab vertical tabs={panels} />
      </div>
    ),
    html: `${htmlMarkup(' aria-orientation="vertical"')}

<script>
  // Same as automatic tabs, but with ArrowDown / ArrowUp
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length]);
    });
  });
</script>`,
  },
];
