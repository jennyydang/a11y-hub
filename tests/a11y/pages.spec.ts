import { test, expect } from '@playwright/test';
import { allRoutes, expectNoViolations, go } from './helpers';

/** The route list is collected once, then every page is scanned in light and dark mode. */
let routes: string[] = [];

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  routes = await allRoutes(page);
  await page.close();
});

for (const theme of ['light', 'dark'] as const) {
  test(`every page has no WCAG 2.2 A/AA violations (${theme} mode)`, async ({ page }) => {
    test.setTimeout(10 * 60_000);
    expect(routes.length, 'routes found in the navigation').toBeGreaterThan(50);
    await page.addInitScript((t) => localStorage.setItem('a11y-hub:theme', t), theme);
    const failures: string[] = [];
    for (const route of routes) {
      await test.step(route, async () => {
        await go(page, route);
        try {
          await expectNoViolations(page, `${route} (${theme})`);
        } catch (e) {
          failures.push((e as Error).message.split('\n').slice(0, 12).join('\n'));
        }
      });
    }
    expect(failures, failures.join('\n\n')).toEqual([]);
  });
}

test('no page scrolls sideways at 320px wide (WCAG 1.4.10 Reflow)', async ({ page }) => {
  test.setTimeout(5 * 60_000);
  await page.setViewportSize({ width: 320, height: 640 });
  const wide: string[] = [];
  for (const route of routes) {
    await go(page, route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) wide.push(`${route}: ${overflow}px`);
  }
  expect(wide).toEqual([]);
});
