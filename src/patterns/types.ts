import type { ComponentType } from 'react';
import type { RoleId } from '../data/roles';
import type { Source } from '../data/sources';
import type { AriaRow, KeyBinding, WcagRef } from '../data/types';

/**
 * A section or template-level pattern: several components working together as one part of a page,
 * like a site's main navigation or a product gallery. Sits between components and full page examples.
 */
export type PatternCategory = 'Navigation' | 'Commerce' | 'Marketing';

export interface PatternPart {
  /** What the part is, in plain words. */
  part: string;
  /** The element, landmark or role it's built on. */
  element: string;
  notes: string;
}

export interface PatternContent {
  label: string;
  /** Where it goes in the markup. Drives the translation marking. */
  target: string;
  guidance: string;
  good: string;
}

export interface Pattern {
  slug: string;
  name: string;
  category: PatternCategory;
  summary: string;
  /** Component slugs it's built from. */
  uses: string[];
  whenToUse: string[];
  /** The landmark and heading structure, top to bottom. */
  structure: PatternPart[];
  keyboard: KeyBinding[];
  aria: AriaRow[];
  content: PatternContent[];
  design: string[];
  /** What a screen reader user hears, moving through it. */
  screenReader: string[];
  mistakes: string[];
  testing: string[];
  wcag: WcagRef[];
  sources: Source[];
  roles: Record<RoleId, string[]>;
  Demo: ComponentType;
  /** A minimal HTML skeleton of the structure. */
  html: string;
}
