import type { ContentField } from '../data/requirements';
import type { AriaRow } from '../data/types';

/**
 * Which copy needs translating. Screen reader users on a translated page hear every string we hand them,
 * so hidden text and ARIA values must be translated with the visible copy. ARIA tokens must never be.
 */

export type Audience = 'Visible' | 'Screen reader only' | 'Visible or screen reader only';

export interface FieldTranslation {
  translate: boolean;
  audience: Audience;
  note: string;
}

const HIDDEN = /aria-label(?!ledby)|aria-valuetext|aria-roledescription|aria-description|aria-placeholder|\balt\b|visually hidden|hidden text|sr-only|role="status" \(visually hidden\)/i;

/** For a content field on the handoff worksheet. */
export function fieldTranslation(f: Pick<ContentField, 'target'>): FieldTranslation {
  const t = f.target;
  if (/^autocomplete$/i.test(t.trim())) {
    return { translate: false, audience: 'Visible', note: 'The autocomplete value is a fixed token, like "email". Never translate it.' };
  }
  const hidden = HIDDEN.test(t);
  // Status and alert messages are often visually hidden, so treat them as possibly screen reader only.
  const live = /role="(status|alert)"|aria-live/i.test(t) && !hidden;
  const either = live || (hidden && /\bor\b/i.test(t));
  const audience: Audience = either ? 'Visible or screen reader only' : hidden ? 'Screen reader only' : 'Visible';
  return {
    translate: true,
    audience,
    note:
      audience === 'Screen reader only'
        ? 'Not on screen, so it’s easy to miss. Send it to translation with the visible copy.'
        : audience === 'Visible or screen reader only'
          ? 'Translate it either way. If it ends up hidden, make sure it still goes to translation.'
          : 'Translate with the rest of the page copy.',
  };
}

export type AriaAction = 'Translate the value' | 'Translate the text it points to' | 'Don’t translate';

export interface AriaTranslation {
  action: AriaAction;
  note: string;
}

/** For a row of a component's ARIA table. */
export function ariaTranslation(row: Pick<AriaRow, 'attr'>): AriaTranslation {
  const a = row.attr;
  if (/alt=""/.test(a)) return { action: 'Don’t translate', note: 'Empty on purpose: the image is decorative.' };
  if (/aria-label(?!ledby)|aria-valuetext|aria-roledescription|aria-description(?!dby)|aria-placeholder|\balt\b|\btitle\b|visually hidden|sr-only|placeholder/i.test(a)) {
    return { action: 'Translate the value', note: 'Screen readers read this text aloud. Translate it with the visible copy.' };
  }
  if (/aria-labelledby|aria-describedby|<label|<legend|<caption|<output|heading|role="(status|alert|tooltip)"|aria-live/i.test(a)) {
    return { action: 'Translate the text it points to', note: 'The text it contains or references is translated. IDs and attribute names stay as they are.' };
  }
  return { action: 'Don’t translate', note: 'A fixed token or attribute. Screen readers announce it in the user’s own language.' };
}

/** Localization rules that apply to every page. */
export const LOCALIZATION_RULES = [
  'Set lang on <html> for each translated page, and lang on any passage in another language (WCAG 3.1.1 and 3.1.2).',
  'Translate every string a screen reader reads, not just what’s on screen: aria-label, aria-valuetext, aria-roledescription, alt text, visually hidden text and status messages.',
  'Never translate ARIA tokens or IDs, like role="dialog", aria-expanded="true", aria-live="polite" or autocomplete="email". Screen readers announce those in the user’s language already.',
  'Keep the accessible name matching the visible label in every language, so voice control still works (WCAG 2.5.3).',
  'Allow for longer text: many languages run 30% or more longer than English. Labels wrap; they don’t truncate.',
  'Support right-to-left languages: use logical CSS properties and mirror direction-dependent icons.',
  'Give translators context: where the string appears, whether it’s visible, and any length limit.',
];
