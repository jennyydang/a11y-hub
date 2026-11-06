import type { ComponentType } from 'react';
import type { RoleId } from './roles';
import { AltDecision } from '../tools/AltDecision';
import { AnnotationKit } from '../tools/AnnotationKit';
import { ContrastChecker } from '../tools/ContrastChecker';
import { CopyPatterns } from '../tools/CopyPatterns';
import { DeliverablesBuilder } from '../tools/DeliverablesBuilder';
import { ScreenReaderCheatSheet } from '../tools/ScreenReaderCheatSheet';

export interface ToolInfo {
  id: string;
  name: string;
  /** One sentence on what it helps with. */
  description: string;
  roles: RoleId[];
  /** Which roles get it, and why, shown on role guides. */
  why: Partial<Record<RoleId, string>>;
  /** Embedded tools render inside the generic tool page under this heading. */
  Tool?: ComponentType;
  heading?: string;
  /** The tool brings its own h2 headings. */
  ownHeadings?: boolean;
}

export const tools: ToolInfo[] = [
  {
    id: 'component-picker',
    name: 'Which component should I use?',
    description: 'Answer a question or two to find the right component, and why.',
    roles: ['content', 'design', 'frontend', 'qa'],
    why: {
      content: 'Know which component you’re writing for before you write.',
      design: 'Settle button vs link, select vs radio and dialog vs toast early.',
      frontend: 'Check the design is using the right element before you build.',
      qa: 'Spot when the wrong component was used for the job.',
    },
  },
  {
    id: 'alt-text',
    name: 'Decorative or informative?',
    description: 'Decide whether an image needs alt text, and what to write.',
    roles: ['content', 'design'],
    why: { content: 'Work out the alt text for every image in your copy.', design: 'Mark images as decorative or informative in the design file.' },
    Tool: AltDecision,
    heading: 'Answer the questions',
  },
  {
    id: 'copy-patterns',
    name: 'Copy patterns',
    description: 'Reusable wording for buttons, links, labels, errors and messages.',
    roles: ['content'],
    why: { content: 'Start from proven wording for labels, errors and status messages.' },
    Tool: CopyPatterns,
    heading: 'Patterns',
  },
  {
    id: 'contrast-checker',
    name: 'Contrast checker',
    description: 'Check two colors against WCAG contrast minimums.',
    roles: ['design', 'frontend', 'qa'],
    why: { design: 'Check text, icons and focus rings as you pick colors.', frontend: 'Verify tokens and one-off colors before shipping.', qa: 'Confirm a suspected contrast failure.' },
    Tool: ContrastChecker,
    ownHeadings: true,
  },
  {
    id: 'annotation-kit',
    name: 'Annotation kit',
    description: 'Standard markers for focus order, headings, landmarks and more on design files.',
    roles: ['design'],
    why: { design: 'Annotate designs so frontend knows exactly what to build.' },
    Tool: AnnotationKit,
    heading: 'Markers',
  },
  {
    id: 'markup-checker',
    name: 'Markup checker',
    description: 'Paste HTML and check it against WCAG 2.2 AA with axe-core.',
    roles: ['frontend', 'qa'],
    why: { frontend: 'Check a snippet before you open a pull request.', qa: 'Run a quick automated check on markup from a bug.' },
  },
  {
    id: 'screen-reader-cheat-sheet',
    name: 'Screen reader cheat sheet',
    description: 'Testing commands for VoiceOver, NVDA, JAWS and TalkBack, side by side.',
    roles: ['qa', 'frontend'],
    why: { qa: 'The commands you need for every screen reader test.', frontend: 'Check your work with a screen reader before handing it to QA.' },
    Tool: ScreenReaderCheatSheet,
    heading: 'Commands',
  },
  {
    id: 'deliverables',
    name: 'Client deliverables builder',
    description: 'Scope a client redesign and export its audit, requirements, component specs, WCAG matrix, test plan and accessibility statement.',
    roles: ['content', 'design', 'frontend', 'qa'],
    why: {
      content: 'Hand the client a statement draft and content requirements for every component in scope.',
      design: 'Agree the conformance target and components in scope before design starts.',
      frontend: 'Give developers one spec document for every component in the redesign.',
      qa: 'Export a test plan with result columns and a sign-off sheet.',
    },
    Tool: DeliverablesBuilder,
    ownHeadings: true,
  },
];

export const findTool = (id: string) => tools.find((t) => t.id === id);
export const toolsFor = (role: RoleId) => tools.filter((t) => t.roles.includes(role));
export const toolPath = (id: string) => `/tools/${id}`;
