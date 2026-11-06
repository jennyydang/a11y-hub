import { useId, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import { CodeBlock } from '../components/CodeBlock';
import { components, findComponent } from '../data/components';
import type { ComponentSpec } from '../data/types';
import { TextArea, fieldClass } from './shared';

const WORKFLOW = `# .github/workflows/accessibility.yml
# Runs the accessibility tests on every pull request and fails it on new violations.
name: Accessibility
on:
  pull_request:
  push:
    branches: [main]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      # Build and serve the site, then run the tests against it.
      - run: npm run build
      - run: npx playwright test tests/a11y
        env:
          BASE_URL: http://localhost:4173
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: a11y-report
          path: playwright-report
`;

function pageScan(urls: string[]) {
  return `// tests/a11y/pages.spec.ts
// npm i -D @playwright/test @axe-core/playwright
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ${JSON.stringify(urls, null, 2).replace(/\n/g, '\n')};

for (const path of pages) {
  test(\`no WCAG 2.2 A or AA violations on \${path}\`, async ({ page }) => {
    await page.goto(new URL(path, process.env.BASE_URL ?? 'http://localhost:4173').href);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    // Print each violation with the elements it affects, so the log says what to fix.
    for (const v of results.violations) {
      console.log(\`\${v.id} (\${v.impact}): \${v.help}\\n  \${v.nodes.map((n) => n.target.join(' ')).join('\\n  ')}\`);
    }
    expect(results.violations).toEqual([]);
  });
}
`;
}

const roleFor = (s: ComponentSpec) => {
  const m = s.aria.find((a) => /^role="?(\w+)/.test(a.attr))?.attr.match(/role="?(\w+)/);
  if (m) return m[1];
  if (/<button/.test(s.semantics)) return 'button';
  if (/<a /.test(s.semantics) || /<a>/.test(s.semantics)) return 'link';
  if (/checkbox/.test(s.semantics)) return 'checkbox';
  if (/radio/.test(s.semantics)) return 'radiogroup';
  if (/<select/.test(s.semantics)) return 'combobox';
  if (/<textarea|<input/.test(s.semantics)) return 'textbox';
  if (/<nav/.test(s.semantics)) return 'navigation';
  if (/<table/.test(s.semantics)) return 'table';
  return 'region';
};

const KEY: Record<string, string> = {
  Tab: 'Tab',
  'Shift + Tab': 'Shift+Tab',
  'Shift+Tab': 'Shift+Tab',
  Enter: 'Enter',
  Space: 'Space',
  Escape: 'Escape',
  Esc: 'Escape',
  Home: 'Home',
  End: 'End',
  '↓': 'ArrowDown',
  '↑': 'ArrowUp',
  '←': 'ArrowLeft',
  '→': 'ArrowRight',
  'Down Arrow': 'ArrowDown',
  'Up Arrow': 'ArrowUp',
  'Left Arrow': 'ArrowLeft',
  'Right Arrow': 'ArrowRight',
  'Page Up': 'PageUp',
  'Page Down': 'PageDown',
};

export function componentTest(s: ComponentSpec, url: string) {
  const role = roleFor(s);
  const steps = s.keyboard
    .filter((k) => !k.keys.includes('—'))
    .map((k) => {
      const key = k.keys.map((x) => KEY[x] ?? x).find((x) => Object.values(KEY).includes(x));
      const action = k.action.replace(/'/g, '’');
      return key
        ? `  await test.step('${k.keys.join(' / ')}: ${action}', async () => {
    await page.keyboard.press('${key}');
    // TODO: assert the result, for example:
    // await expect(widget).toHaveAttribute('aria-expanded', 'true');
  });`
        : `  // ${k.keys.join(' / ')}: ${action} (test by hand or add a custom step)`;
    })
    .join('\n\n');
  const criteria = s.testing.map((t) => `//  - ${t}`).join('\n');
  return `// tests/a11y/${s.slug}.spec.ts
// Keyboard and ARIA checks for the ${s.name} component, from A11y Hub.
// Acceptance criteria to cover (automate what you can, test the rest by hand):
${criteria}
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('${s.name} is accessible', async ({ page }) => {
  await page.goto(new URL('${url}', process.env.BASE_URL ?? 'http://localhost:4173').href);

  // Built on ${s.semantics.replace(/\n/g, ' ')}
  const widget = page.getByRole('${role}').first();
  await expect(widget).toBeVisible();
  // Every interactive part needs an accessible name.
  await expect(widget).toHaveAccessibleName(/.+/);

  // No automated violations inside the component.
  // Narrow the scan to the component's container, for example '#signup-form'.
  const results = await new AxeBuilder({ page }).include('main').analyze();
  expect(results.violations).toEqual([]);

  // Keyboard: reach it with Tab, then try each interaction.
  await widget.focus();
  await expect(widget).toBeFocused();

${steps}
});
`;
}

export function TestKit() {
  const id = useId();
  const [urls, setUrls] = useState('/\n/search\n/sign-up');
  const [slug, setSlug] = useState('tabs');
  const [url, setUrl] = useState('/components/tabs');
  const spec = findComponent(slug) ?? components[0];
  const pages = urls
    .split('\n')
    .map((u) => u.trim())
    .filter(Boolean);
  return (
    <div className="space-y-12">
      <section aria-labelledby={`${id}-ci`} className="space-y-3">
        <h2 id={`${id}-ci`} className="text-xl font-semibold">
          1. Run axe on every pull request
        </h2>
        <p className="leading-7 text-muted">Add this GitHub Actions workflow. It builds the site, runs the tests below and fails the pull request when there are new violations. Automated tests catch about a third of issues, so keep the manual checks too.</p>
        <CodeBlock code={WORKFLOW} language="yaml" title=".github/workflows/accessibility.yml" />
      </section>

      <section aria-labelledby={`${id}-pages`} className="space-y-3">
        <h2 id={`${id}-pages`} className="text-xl font-semibold">
          2. Scan your key pages
        </h2>
        <div className="max-w-md">
          <TextArea label="Pages to scan" hint="One path per line, one per template." value={urls} onChange={setUrls} rows={4} mono />
        </div>
        <CodeBlock code={pageScan(pages)} language="tsx" title="tests/a11y/pages.spec.ts" />
      </section>

      <section aria-labelledby={`${id}-comp`} className="space-y-3">
        <h2 id={`${id}-comp`} className="text-xl font-semibold">
          3. Test a component’s keyboard and ARIA behavior
        </h2>
        <p className="leading-7 text-muted">A starting test built from the component’s spec: its role, a name check, a scoped axe scan, a step for each key it must support, and its acceptance criteria as a to-do list.</p>
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor={`${id}-sel`} className="block text-sm font-semibold">
              Component
            </label>
            <select
              id={`${id}-sel`}
              className={fieldClass}
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setUrl(`/components/${e.target.value}`);
              }}
            >
              {components
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor={`${id}-url`} className="block text-sm font-semibold">
              Page where it appears
            </label>
            <input id={`${id}-url`} className={`${fieldClass} font-mono`} value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        </div>
        <CodeBlock code={componentTest(spec, url)} language="tsx" title={`tests/a11y/${spec.slug}.spec.ts`} />
        <Button as="a" href="https://playwright.dev/docs/accessibility-testing" target="_blank" rel="noreferrer" weight="clear" size="sm">
          Playwright accessibility testing docs<span className="sr-only"> (opens in a new tab)</span>
        </Button>
      </section>
    </div>
  );
}
