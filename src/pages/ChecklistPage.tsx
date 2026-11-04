import { Link } from 'react-router-dom';
import { Accordion } from '../ui';
import { Checklist } from '../components/Checklist';
import { components } from '../data/components';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

const general = [
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

export function ChecklistPage() {
  usePageTitle('Testing checklist');
  return (
    <div className="max-w-4xl">
      <PageHeader eyebrow="Testing" title="Testing checklist">
        <p>
          Automated tools catch only some accessibility issues. Use these manual checks with a keyboard and a screen reader (NVDA or JAWS on
          Windows, VoiceOver on macOS and iOS, TalkBack on Android). Progress is saved in this browser.
        </p>
      </PageHeader>
      <div className="space-y-12">
        <section aria-labelledby="page-level" className="space-y-4">
          <h2 id="page-level" className="text-xl font-semibold">
            Page-level checks
          </h2>
          <Checklist scope="__page" items={general} title="Page-level checks" />
        </section>
        <section aria-labelledby="per-component" className="space-y-4">
          <h2 id="per-component" className="text-xl font-semibold">
            Per-component checks
          </h2>
          <Accordion
            headingLevel={3}
            items={components.map((c) => ({
              title: c.name,
              content: (
                <div className="space-y-3 py-2">
                  <Checklist scope={c.slug} items={c.testing} title={`${c.name} checks`} />
                  <Link className="link text-sm" to={`/components/${c.slug}`}>
                    Open the {c.name} spec
                  </Link>
                </div>
              ),
            }))}
          />
        </section>
      </div>
    </div>
  );
}
