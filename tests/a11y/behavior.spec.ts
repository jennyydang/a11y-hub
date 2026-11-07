import { test, expect } from '@playwright/test';
import { expectNoViolations, go } from './helpers';

test('skip link moves focus to the main content', async ({ page }) => {
  await go(page, '/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /skip to/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('changing page moves focus to the new heading', async ({ page }) => {
  await go(page, '/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Components' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('term tips open on click, stay open, and close with Escape', async ({ page }) => {
  await go(page, '/foundations/focus');
  const tip = page.locator('main button[aria-expanded]').filter({ hasNot: page.locator('svg') }).first();
  await tip.click();
  await expect(tip).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(tip).toHaveAttribute('aria-expanded', 'false');
});

test('reduced motion turns off animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await go(page, '/components');
  const name = await page.locator('.page-enter').evaluate((e) => getComputedStyle(e).animationName);
  expect(name).toBe('none');
  await ctx.close();
});

test('deliverables builder imports issues and exports an ACR', async ({ page }) => {
  await go(page, '/tools/deliverables');
  await page.getByRole('textbox', { name: 'Client', exact: true }).fill('Example Client');
  await page.getByRole('button', { name: /Add Sign-up form components/ }).click();
  const csv = 'Issue,Page,WCAG,Severity,Owner\n"Focus hidden under sticky header",Sign-up,2.4.11,Critical,Agency\n';
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Import .csv or axe .json' }).click();
  await (await chooser).setFiles({ name: 'issues.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect(page.getByText('1 issue imported from issues.csv.')).toBeVisible();
  await page.locator('select:has(option[value=acr])').selectOption('acr');
  const row = page.getByRole('row', { name: /2\.4\.11 Focus Not Obscured/ }).last();
  await expect(row).toContainText('Does Not Support');

  // Mark a criterion Not Applicable by hand; the ACR picks it up with a default remark.
  await page.getByRole('checkbox', { name: /Accessibility Conformance Report/ }).check();
  await page.getByText('Adjust ACR rows').click();
  await page.getByRole('combobox', { name: /1\.2\.1 Audio-only/ }).selectOption('Not Applicable');
  const media = page.getByRole('row', { name: /1\.2\.1 Audio-only and Video-only \(Prerecorded\) \(Level A\)/ }).last();
  await expect(media).toContainText('Not Applicable');
  await expect(media).toContainText('The product has no content of this kind.');
  await expectNoViolations(page, 'builder with ACR editor open');
});

test('learning resources filter by role and show a certification path', async ({ page }) => {
  await go(page, '/resources?role=content');
  await expect(page.getByText('Suggested path for content: CPACC, then ADS.')).toBeVisible();
  await page.getByRole('radio', { name: 'Frontend' }).check({ force: true });
  await expect(page.getByText('Suggested path for frontend: CPACC, then WAS, then CPWA.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Learn Accessibility/ })).toBeVisible();
  await expectNoViolations(page, '/resources (frontend)');
});

test('component pages cite their sources, and the process page links stages', async ({ page }) => {
  await go(page, '/components/button');
  const sources = page.getByRole('region', { name: 'Sources and review' }).or(page.locator('section', { has: page.getByRole('heading', { name: 'Sources and review' }) }));
  await expect(sources.getByRole('link', { name: /Button component/ })).toBeVisible();
  await expect(sources.getByRole('link', { name: /ARIA Authoring Practices/ })).toBeVisible();
  await go(page, '/process');
  await page.getByRole('link', { name: /Research and cite/ }).first().click();
  await expect(page.getByRole('heading', { name: /Research and cite/, level: 2 })).toBeFocused();
});
