/** Checks that apply to every page, whatever components it uses. Used by the testing checklist and agency deliverables. */
export const pageChecks = [
  'Every page has a unique, descriptive <title>.',
  'The page has a lang attribute on <html>.',
  'A skip link is the first focusable element and works.',
  'Landmarks (header, nav, main, footer) are present and labelled when repeated.',
  'Headings form a logical outline with one h1.',
  'All functionality works with the keyboard alone, with no traps.',
  'Focus is always visible and never hidden behind sticky elements.',
  'Text meets 4.5:1 contrast. Icons and borders meet 3:1.',
  'Nothing relies on color alone.',
  'Content reflows at 320px wide without horizontal scrolling.',
  'Animations respect prefers-reduced-motion.',
  'Status messages are announced without moving focus.',
];
