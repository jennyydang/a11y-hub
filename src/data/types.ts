import type { ComponentType } from 'react';

export type WcagLevel = 'A' | 'AA' | 'AAA';

export interface WcagRef {
  id: string;
  name: string;
  level: WcagLevel;
}

export interface KeyBinding {
  keys: string[];
  action: string;
}

export interface AriaRow {
  attr: string;
  where: string;
  usage: string;
}

export type ComponentCategory =
  | 'Actions'
  | 'Forms'
  | 'Navigation'
  | 'Overlays'
  | 'Feedback'
  | 'Content'
  | 'Data';

export interface Variant {
  id: string;
  label: string;
  /** One sentence on when to use this variation and what changes for assistive tech. */
  description: string;
  Demo: ComponentType;
  html: string;
}

export interface ComponentSpec {
  slug: string;
  name: string;
  category: ComponentCategory;
  summary: string;
  /** Which native element or ARIA role the component is built on. */
  semantics: string;
  apgPattern?: string;
  whenToUse: string[];
  keyboard: KeyBinding[];
  aria: AriaRow[];
  focus: string[];
  screenReader: string[];
  dos: string[];
  donts: string[];
  wcag: WcagRef[];
  testing: string[];
  Demo: ComponentType;
  /** Optional decision tool shown under Guidance. */
  tool?: { title: string; intro: string; Tool: ComponentType };
  /** Optional variations. When present, the first one is shown by default. */
  variants?: Variant[];
}

export interface FoundationSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface FoundationSpec {
  slug: string;
  name: string;
  summary: string;
  sections: FoundationSection[];
  wcag: WcagRef[];
  /** Optional interactive tool rendered after the intro. */
  Tool?: ComponentType;
}
