const CANDIDATES = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

function isVisible(el: HTMLElement) {
  if (!el.getClientRects().length) return false;
  const style = getComputedStyle(el);
  return style.visibility !== 'hidden' && style.display !== 'none';
}

function isTabbable(el: HTMLElement) {
  if (el.tabIndex < 0) return false;
  if ((el as HTMLButtonElement).disabled) return false;
  if (el instanceof HTMLInputElement && el.type === 'hidden') return false;
  if (el.closest('[inert]')) return false;
  // Content inside a closed <details> isn't reachable, except its <summary>.
  const details = el.closest('details');
  if (details && !details.open && !(el.tagName === 'SUMMARY' && el.parentElement === details)) return false;
  return isVisible(el);
}

/**
 * The elements Tab would visit inside `root`, in order.
 * Positive tabindex values come first, then everything else in DOM order.
 * Only one radio per group is a tab stop: the checked one, or the first.
 */
export function focusStops(root: HTMLElement): HTMLElement[] {
  const all = Array.from(root.querySelectorAll<HTMLElement>(CANDIDATES)).filter(isTabbable);

  const radioSeen = new Set<string>();
  const stops = all.filter((el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== 'radio' || !el.name) return true;
    const key = `${el.form?.id ?? ''}|${el.name}`;
    if (radioSeen.has(key)) return false;
    const group = all.filter((r): r is HTMLInputElement => r instanceof HTMLInputElement && r.type === 'radio' && r.name === el.name);
    const checked = group.find((r) => r.checked);
    if (checked && checked !== el) return false;
    radioSeen.add(key);
    return true;
  });

  const positive = stops.filter((el) => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
  return [...positive, ...stops.filter((el) => el.tabIndex === 0)];
}
