/**
 * A deliberately small approximation of how browsers expose an element to assistive
 * technology. It covers the patterns used in this site's demos; it is not a full
 * implementation of the accname spec.
 */

export interface InspectResult {
  role: string;
  name: string;
  nameSource: string;
  description: string;
  states: string[];
  tag: string;
}

const INPUT_ROLES: Record<string, string> = {
  checkbox: 'checkbox',
  radio: 'radio',
  range: 'slider',
  search: 'searchbox',
  email: 'textbox',
  tel: 'textbox',
  text: 'textbox',
  url: 'textbox',
  password: 'textbox',
  number: 'spinbutton',
  button: 'button',
  submit: 'button',
  reset: 'button',
};

export function implicitRole(el: Element): string {
  const explicit = el.getAttribute('role');
  if (explicit) return explicit.split(' ')[0];
  const tag = el.tagName.toLowerCase();
  switch (tag) {
    case 'button':
    case 'summary':
      return 'button';
    case 'a':
      return el.hasAttribute('href') ? 'link' : 'generic';
    case 'input': {
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      if (el.hasAttribute('list')) return 'combobox';
      return INPUT_ROLES[type] ?? 'textbox';
    }
    case 'textarea':
      return 'textbox';
    case 'select':
      return (el as HTMLSelectElement).multiple ? 'listbox' : 'combobox';
    case 'img':
      return el.getAttribute('alt') === '' ? 'presentation' : 'img';
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return 'heading';
    case 'nav':
      return 'navigation';
    case 'main':
      return 'main';
    case 'dialog':
      return 'dialog';
    case 'table':
      return 'table';
    case 'th':
      return 'columnheader';
    case 'td':
      return 'cell';
    case 'li':
      return 'listitem';
    case 'ul':
    case 'ol':
      return 'list';
    case 'fieldset':
      return 'group';
    default:
      return 'generic';
  }
}

const NAME_FROM_CONTENT = new Set([
  'button',
  'link',
  'tab',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'checkbox',
  'radio',
  'switch',
  'heading',
  'cell',
  'columnheader',
  'tooltip',
  'treeitem',
]);

function textOf(el: Element | null): string {
  if (!el) return '';
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll('[aria-hidden="true"], svg, style, script').forEach((n) => n.remove());
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

function byIds(ids: string | null): string {
  if (!ids) return '';
  return ids
    .split(/\s+/)
    .map((id) => textOf(document.getElementById(id)))
    .filter(Boolean)
    .join(' ');
}

export function accessibleName(el: Element, role = implicitRole(el)): { name: string; source: string } {
  const labelledBy = byIds(el.getAttribute('aria-labelledby'));
  if (labelledBy) return { name: labelledBy, source: 'aria-labelledby' };
  const ariaLabel = el.getAttribute('aria-label')?.trim();
  if (ariaLabel) return { name: ariaLabel, source: 'aria-label' };

  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    const labels = el.labels ? Array.from(el.labels).map(textOf).filter(Boolean) : [];
    if (labels.length) return { name: labels.join(' '), source: '<label>' };
    if (el instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(el.type) && el.value) {
      return { name: el.value, source: 'value' };
    }
  }
  if (el instanceof HTMLImageElement && el.hasAttribute('alt')) {
    return { name: el.alt, source: 'alt' };
  }
  if (el.tagName === 'FIELDSET') {
    const legend = el.querySelector('legend');
    if (legend) return { name: textOf(legend), source: '<legend>' };
  }
  if (NAME_FROM_CONTENT.has(role)) {
    const t = textOf(el);
    if (t) return { name: t, source: 'contents' };
  }
  const title = el.getAttribute('title')?.trim();
  if (title) return { name: title, source: 'title' };
  const placeholder = el.getAttribute('placeholder')?.trim();
  if (placeholder) return { name: placeholder, source: 'placeholder (fragile)' };
  return { name: '', source: 'none' };
}

export function inspect(el: Element): InspectResult {
  const role = implicitRole(el);
  const { name, source } = accessibleName(el, role);
  const description = byIds(el.getAttribute('aria-describedby'));
  const states: string[] = [];

  const aria = (a: string) => el.getAttribute(a);
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    states.push(el.indeterminate ? 'mixed' : el.checked ? 'checked' : 'not checked');
  } else if (aria('aria-checked') !== null) {
    const v = aria('aria-checked');
    states.push(v === 'true' ? 'checked' : v === 'mixed' ? 'mixed' : 'not checked');
  }
  if (aria('aria-pressed') !== null) states.push(aria('aria-pressed') === 'true' ? 'pressed' : 'not pressed');
  if (aria('aria-expanded') !== null) states.push(aria('aria-expanded') === 'true' ? 'expanded' : 'collapsed');
  if (aria('aria-selected') === 'true') states.push('selected');
  if (aria('aria-current') && aria('aria-current') !== 'false') states.push(`current ${aria('aria-current')}`);
  if (aria('aria-haspopup') && aria('aria-haspopup') !== 'false') {
    states.push(`has popup${aria('aria-haspopup') === 'true' ? '' : `: ${aria('aria-haspopup')}`}`);
  }
  if ((el as HTMLButtonElement).disabled || aria('aria-disabled') === 'true') states.push('disabled');
  if (aria('aria-invalid') === 'true') states.push('invalid');
  if ((el as HTMLInputElement).required || aria('aria-required') === 'true') states.push('required');
  if (role === 'heading') {
    const lvl = aria('aria-level') ?? el.tagName.match(/^H(\d)$/)?.[1];
    if (lvl) states.push(`level ${lvl}`);
  }
  if (
    (el instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit', 'reset'].includes(el.type)) ||
    el instanceof HTMLTextAreaElement
  ) {
    if (el.value) states.push(`value "${el.value}"`);
  }
  if (el instanceof HTMLSelectElement) states.push(`value "${el.selectedOptions[0]?.text ?? ''}"`);
  if (aria('aria-valuenow') !== null) states.push(`value ${aria('aria-valuetext') ?? aria('aria-valuenow')}`);

  return { role, name, nameSource: source, description, states, tag: el.tagName.toLowerCase() };
}

/** Roughly what a screen reader might say on focus. */
export function announce(r: InspectResult): string {
  const parts = [r.name || '(no name)', r.role === 'generic' ? '' : r.role, ...r.states];
  if (r.description) parts.push(r.description);
  return parts.filter(Boolean).join(', ');
}
