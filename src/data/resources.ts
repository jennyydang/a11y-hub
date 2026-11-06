import type { RoleId } from './roles';

/** Where SMEs keep learning after the hub: courses, references, videos, communities and certifications. */
export type ResourceKind = 'Course' | 'Reference' | 'Video' | 'Community' | 'Tool';
export type Cost = 'Free' | 'Paid' | 'Free to audit';

export interface Resource {
  title: string;
  url: string;
  by: string;
  kind: ResourceKind;
  cost: Cost;
  /** Empty means everyone. */
  roles: RoleId[];
  start?: boolean;
  description: string;
}

export const resources: Resource[] = [
  // Everyone
  {
    title: 'Introduction to Web Accessibility',
    url: 'https://www.edx.org/learn/web-accessibility/the-world-wide-web-consortium-w3c-introduction-to-web-accessibility',
    by: 'W3C WAI on edX',
    kind: 'Course',
    cost: 'Free to audit',
    roles: [],
    start: true,
    description: 'Self-paced, about four weeks. Covers who is affected, the principles and the standards, for technical and non-technical people. A verified certificate is optional and paid.',
  },
  {
    title: 'Web Accessibility Perspectives videos',
    url: 'https://www.w3.org/WAI/perspective-videos/',
    by: 'W3C WAI',
    kind: 'Video',
    cost: 'Free',
    roles: [],
    start: true,
    description: 'Short videos showing how captions, keyboard support, contrast, layout and more affect real people. A good one to share with a whole team.',
  },
  {
    title: 'Easy Checks: a first review',
    url: 'https://www.w3.org/WAI/test-evaluate/preliminary/',
    by: 'W3C WAI',
    kind: 'Reference',
    cost: 'Free',
    roles: [],
    start: true,
    description: 'Simple checks anyone can do on a page in a few minutes: titles, alt text, headings, contrast, zoom and keyboard.',
  },
  {
    title: 'WebAIM articles',
    url: 'https://webaim.org/articles/',
    by: 'WebAIM',
    kind: 'Reference',
    cost: 'Free',
    roles: [],
    description: 'Clear, practical articles on alt text, links, forms, color, screen readers and more. The WebAIM Million report shows the most common failures on real sites.',
  },
  {
    title: 'The A11Y Project checklist',
    url: 'https://www.a11yproject.com/checklist/',
    by: 'The A11Y Project',
    kind: 'Reference',
    cost: 'Free',
    roles: [],
    description: 'A plain-language WCAG checklist with links to explanations. Useful as a quick review before release.',
  },
  {
    title: 'Microsoft Inclusive Design',
    url: 'https://inclusive.microsoft.design/',
    by: 'Microsoft',
    kind: 'Reference',
    cost: 'Free',
    roles: ['design', 'content'],
    description: 'Toolkits and activities on designing for permanent, temporary and situational disabilities.',
  },
  {
    title: 'axe-con talks',
    url: 'https://www.deque.com/axe-con/',
    by: 'Deque',
    kind: 'Video',
    cost: 'Free',
    roles: [],
    description: 'A free yearly online conference with tracks for design, development, content and organizations. Past talks are available on demand.',
  },
  {
    title: 'Inclusive Design 24',
    url: 'https://www.inclusivedesign24.org/',
    by: 'Knowbility',
    kind: 'Video',
    cost: 'Free',
    roles: [],
    description: '24 hours of free accessibility talks once a year, with recordings of past sessions.',
  },

  // Content
  {
    title: 'Writing for accessibility',
    url: 'https://styleguide.mailchimp.com/writing-for-accessibility/',
    by: 'Mailchimp Content Style Guide',
    kind: 'Reference',
    cost: 'Free',
    roles: ['content'],
    start: true,
    description: 'Short, practical rules for headings, links, alt text, plain language and formatting.',
  },
  {
    title: 'Content design guidance',
    url: 'https://www.gov.uk/guidance/content-design',
    by: 'GOV.UK',
    kind: 'Reference',
    cost: 'Free',
    roles: ['content'],
    description: 'How the UK government writes for everyone: plain English, how people read online, and writing for user needs.',
  },
  {
    title: 'Alternative text decision tree and image tutorial',
    url: 'https://www.w3.org/WAI/tutorials/images/',
    by: 'W3C WAI',
    kind: 'Reference',
    cost: 'Free',
    roles: ['content', 'design'],
    description: 'How to decide what alt text an image needs, with examples for informative, decorative, functional and complex images.',
  },

  // Design
  {
    title: 'Accessibility in the Human Interface Guidelines',
    url: 'https://developer.apple.com/design/human-interface-guidelines/accessibility',
    by: 'Apple',
    kind: 'Reference',
    cost: 'Free',
    roles: ['design'],
    description: 'Guidance on text size, contrast, motion, target size and supporting assistive technology, with a focus on apps.',
  },
  {
    title: 'GOV.UK Design System',
    url: 'https://design-system.service.gov.uk/',
    by: 'GOV.UK',
    kind: 'Reference',
    cost: 'Free',
    roles: ['design', 'frontend'],
    description: 'Components and patterns that have been researched and tested with disabled people, with notes on why each works the way it does.',
  },
  {
    title: 'Inclusive Components',
    url: 'https://inclusive-components.design/',
    by: 'Heydon Pickering',
    kind: 'Reference',
    cost: 'Free',
    roles: ['design', 'frontend'],
    description: 'Deep walk-throughs of building common components, like toggles, menus, tabs and cards, so they work for everyone.',
  },

  // Frontend and QA
  {
    title: 'Learn Accessibility',
    url: 'https://web.dev/learn/accessibility',
    by: 'Google web.dev',
    kind: 'Course',
    cost: 'Free',
    roles: ['frontend'],
    start: true,
    description: 'A free, structured course on semantics, ARIA, focus, forms, color, motion, testing and more.',
  },
  {
    title: 'Accessibility on MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
    by: 'MDN',
    kind: 'Reference',
    cost: 'Free',
    roles: ['frontend'],
    description: 'Reference for every ARIA role, state and property, plus guides on HTML semantics and keyboard support.',
  },
  {
    title: 'ARIA Authoring Practices Guide (APG)',
    url: 'https://www.w3.org/WAI/ARIA/apg/',
    by: 'W3C WAI',
    kind: 'Reference',
    cost: 'Free',
    roles: ['frontend', 'qa'],
    start: true,
    description: 'The expected keyboard behavior and ARIA for widgets like tabs, menus, comboboxes and dialogs, with working examples.',
  },
  {
    title: 'Understanding WCAG 2.2',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/',
    by: 'W3C WAI',
    kind: 'Reference',
    cost: 'Free',
    roles: ['frontend', 'qa', 'design'],
    description: 'The intent, benefits and examples behind each success criterion. Read this when a criterion’s wording isn’t clear.',
  },
  {
    title: 'How to Meet WCAG (Quick Reference)',
    url: 'https://www.w3.org/WAI/WCAG22/quickref/',
    by: 'W3C WAI',
    kind: 'Reference',
    cost: 'Free',
    roles: ['frontend', 'qa'],
    description: 'Every success criterion with its techniques and failures, filterable by level and technology.',
  },
  {
    title: 'A11ycasts',
    url: 'https://www.youtube.com/@ChromeDevs/search?query=a11ycasts',
    by: 'Chrome for Developers on YouTube',
    kind: 'Video',
    cost: 'Free',
    roles: ['frontend'],
    description: 'Short episodes on focus, ARIA, screen readers, modal dialogs and testing with DevTools.',
  },
  {
    title: 'Practical Accessibility',
    url: 'https://practical-accessibility.today/',
    by: 'Sara Soueidan',
    kind: 'Course',
    cost: 'Paid',
    roles: ['frontend', 'design'],
    description: 'An in-depth video course on building accessible interfaces with HTML, CSS, ARIA and screen reader testing.',
  },
  {
    title: 'Deque University',
    url: 'https://dequeuniversity.com/',
    by: 'Deque',
    kind: 'Course',
    cost: 'Paid',
    roles: ['frontend', 'qa', 'design', 'content'],
    description: 'Self-paced courses by role, plus prep material for the IAAP exams.',
  },
  {
    title: 'Accessibility Insights',
    url: 'https://accessibilityinsights.io/',
    by: 'Microsoft',
    kind: 'Tool',
    cost: 'Free',
    roles: ['frontend', 'qa'],
    description: 'A browser extension with automated checks and a guided manual assessment that walks you through every WCAG AA requirement.',
  },
  {
    title: 'Adrian Roselli’s blog',
    url: 'https://adrianroselli.com/',
    by: 'Adrian Roselli',
    kind: 'Reference',
    cost: 'Free',
    roles: ['frontend', 'qa'],
    description: 'Detailed testing of real patterns with screen readers, and what actually works.',
  },
  {
    title: 'Scott O’Hara’s blog',
    url: 'https://www.scottohara.me/',
    by: 'Scott O’Hara',
    kind: 'Reference',
    cost: 'Free',
    roles: ['frontend'],
    description: 'Deep dives on HTML and ARIA semantics from someone who works on the specs.',
  },

  // Communities
  {
    title: 'WebAIM discussion list',
    url: 'https://webaim.org/discussion/',
    by: 'WebAIM',
    kind: 'Community',
    cost: 'Free',
    roles: [],
    description: 'A long-running email list where practitioners answer accessibility questions.',
  },
  {
    title: 'CSUN Assistive Technology Conference',
    url: 'https://www.csun.edu/cod/conference',
    by: 'California State University, Northridge',
    kind: 'Community',
    cost: 'Paid',
    roles: [],
    description: 'The largest yearly gathering of accessibility professionals and assistive technology makers.',
  },
];

export interface Certification {
  name: string;
  short: string;
  by: string;
  url: string;
  cost: string;
  roles: RoleId[];
  what: string;
  goodFor: string;
}

export const certifications: Certification[] = [
  {
    name: 'Certified Professional in Accessibility Core Competencies',
    short: 'CPACC',
    by: 'IAAP',
    url: 'https://www.accessibilityassociation.org/',
    cost: 'Paid exam',
    roles: ['content', 'design', 'frontend', 'qa'],
    what: 'Disabilities and how people use technology, accessibility standards and laws, and how to manage accessibility in an organization. Not technical.',
    goodFor: 'Everyone. The usual first certification, and the best fit for content and design SMEs.',
  },
  {
    name: 'Web Accessibility Specialist',
    short: 'WAS',
    by: 'IAAP',
    url: 'https://www.accessibilityassociation.org/',
    cost: 'Paid exam',
    roles: ['frontend', 'qa'],
    what: 'Technical: WCAG, ARIA, building accessible code, and testing with tools and assistive technology.',
    goodFor: 'Frontend developers and QA testers.',
  },
  {
    name: 'Certified Professional in Web Accessibility',
    short: 'CPWA',
    by: 'IAAP',
    url: 'https://www.accessibilityassociation.org/',
    cost: 'Awarded when you hold CPACC and WAS',
    roles: ['frontend', 'qa'],
    what: 'Not a separate exam. You earn it by passing both CPACC and WAS.',
    goodFor: 'Accessibility leads and senior developers.',
  },
  {
    name: 'Accessible Document Specialist',
    short: 'ADS',
    by: 'IAAP',
    url: 'https://www.accessibilityassociation.org/',
    cost: 'Paid exam',
    roles: ['content'],
    what: 'Making documents accessible: Word, PowerPoint, Excel and PDF, including tagging and remediation.',
    goodFor: 'Content SMEs who publish documents, reports or PDFs.',
  },
  {
    name: 'Trusted Tester for Web',
    short: 'Trusted Tester',
    by: 'US Department of Homeland Security',
    url: 'https://www.dhs.gov/508-training',
    cost: 'Free',
    roles: ['qa', 'frontend'],
    what: 'A repeatable manual test process for Section 508 (based on WCAG). Self-paced online training, a practice exam and a certification exam.',
    goodFor: 'QA testers, and anyone testing for US federal work, where certified testers may be required.',
  },
];

/** A suggested order of certifications for each role. */
export const certPaths: Record<RoleId, string[]> = {
  content: ['CPACC', 'ADS'],
  design: ['CPACC'],
  frontend: ['CPACC', 'WAS', 'CPWA'],
  qa: ['Trusted Tester', 'CPACC', 'WAS'],
};
