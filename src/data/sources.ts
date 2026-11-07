/**
 * Extra sources for each component, beyond the APG pattern and WCAG criteria already on its spec.
 * Every component page lists its sources so readers can check the guidance and go deeper.
 * When you add or change guidance, cite where it came from here. See /process.
 */
export interface Source {
  title: string;
  url: string;
  /** Who published it. */
  by: string;
  /** What it supports, in a few words. */
  note?: string;
}

export interface Review {
  /** ISO date of the last full review against the definition of done. */
  date: string;
  /** Roles that signed off, for example ['Accessibility lead', 'Frontend']. */
  by: string[];
}

const govuk = (path: string, name: string): Source => ({
  title: `${name} component`,
  url: `https://design-system.service.gov.uk/components/${path}/`,
  by: 'GOV.UK Design System',
  note: 'Researched with disabled users; includes known issues and assistive technology notes.',
});

export const componentSources: Record<string, Source[]> = {
  accordion: [govuk('accordion', 'Accordion')],
  'back-link': [govuk('back-link', 'Back link')],
  breadcrumbs: [govuk('breadcrumbs', 'Breadcrumbs')],
  button: [govuk('button', 'Button')],
  'character-count': [govuk('character-count', 'Character count')],
  checkbox: [govuk('checkboxes', 'Checkboxes')],
  'cookie-banner': [govuk('cookie-banner', 'Cookie banner')],
  disclosure: [govuk('details', 'Details')],
  'error-summary': [govuk('error-summary', 'Error summary')],
  fieldset: [govuk('fieldset', 'Fieldset')],
  'file-upload': [govuk('file-upload', 'File upload')],
  pagination: [govuk('pagination', 'Pagination')],
  password: [govuk('password-input', 'Password input')],
  'radio-group': [govuk('radios', 'Radios')],
  select: [govuk('select', 'Select')],
  'skip-link': [govuk('skip-link', 'Skip link')],
  'summary-list': [govuk('summary-list', 'Summary list')],
  table: [govuk('table', 'Table')],
  tabs: [govuk('tabs', 'Tabs')],
  tags: [govuk('tag', 'Tag')],
  'text-input': [govuk('text-input', 'Text input')],
  textarea: [govuk('textarea', 'Textarea')],
  image: [{ title: 'Images tutorial and alt text decision tree', url: 'https://www.w3.org/WAI/tutorials/images/', by: 'W3C WAI' }],
  'site-navigation': [{ title: 'Menus tutorial', url: 'https://www.w3.org/WAI/tutorials/menus/', by: 'W3C WAI' }],
  'data-grid': [{ title: 'Tables tutorial', url: 'https://www.w3.org/WAI/tutorials/tables/', by: 'W3C WAI' }],
  carousel: [{ title: 'Carousels tutorial', url: 'https://www.w3.org/WAI/tutorials/carousels/', by: 'W3C WAI' }],
};

/** Last full review per component. Components without an entry show "Not yet reviewed". */
export const reviews: Record<string, Review> = {};

/** How often guidance should be reviewed again, in months. */
export const REVIEW_EVERY_MONTHS = 12;
