import type { RoleId } from './roles';

/**
 * Which component page sections each role sees when they filter the page
 * to "their" sections. Everyone still gets every section with "Everyone".
 * Keep this in sync when adding a new section to ComponentPage.
 */
export type SectionKey =
  | 'live'
  | 'code'
  | 'when'
  | 'anatomy'
  | 'keyboard'
  | 'aria'
  | 'focus'
  | 'placement'
  | 'practices'
  | 'goodbad'
  | 'tool'
  | 'wcag'
  | 'fluid'
  | 'owners'
  | 'worksheet'
  | 'testing';

export const roleSections: Record<RoleId, SectionKey[]> = {
  content: ['live', 'when', 'placement', 'practices', 'goodbad', 'tool', 'worksheet'],
  design: ['live', 'when', 'anatomy', 'keyboard', 'focus', 'placement', 'practices', 'goodbad', 'tool', 'wcag', 'worksheet'],
  frontend: ['live', 'code', 'when', 'anatomy', 'keyboard', 'aria', 'focus', 'practices', 'goodbad', 'tool', 'wcag', 'fluid', 'worksheet', 'testing'],
  qa: ['live', 'anatomy', 'keyboard', 'aria', 'focus', 'goodbad', 'tool', 'wcag', 'worksheet', 'testing'],
};

/** With a role chosen, "Who owns what" ('owners') is left out: the "Your part" panel near the top replaces it. */
export function showsSection(role: RoleId | null, key: SectionKey) {
  if (!role) return true;
  return roleSections[role].includes(key);
}
