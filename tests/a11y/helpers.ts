import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Every route the hub links to, collected from the sidebar, the tools index and the examples index. */
export async function allRoutes(page: Page): Promise<string[]> {
  const found = new Set<string>(['/']);
  for (const start of ['/', '/tools', '/examples', '/patterns']) {
    await page.goto(`#${start}`);
    await page.locator('main h1').waitFor();
    const hrefs = await page.locator('a[href^="#/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
    hrefs.forEach((h) => found.add(h.slice(1).split('#')[0]));
  }
  return [...found].sort();
}

/** Fails with a readable list of each violation and the elements it affects. */
export async function expectNoViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const report = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(' ')).join('\n    ')}`);
  expect(report, `axe violations on ${label}`).toEqual([]);
}

export async function go(page: Page, route: string) {
  await page.goto(`#${route}`);
  await page.locator('main h1').first().waitFor();
  // Let the page fade-in and any lazy demos settle before scanning.
  await page.waitForTimeout(300);
}
