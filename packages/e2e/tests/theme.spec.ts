import { test, expect } from '@playwright/test';
import { gotoFixture, bodyBackground, luminance } from './helpers.js';

/**
 * Color scheme switching. The tokens are declared with `light-dark()` and
 * `color-scheme`, so three inputs must agree: the OS preference
 * (`prefers-color-scheme`), an explicit `data-theme="dark"` override, and an
 * explicit `data-theme="light"` that opts out of a dark OS preference. Only the
 * body background is measured; it flips between the two ends of the gray ramp
 * and is the least likely token to be restyled per component.
 */
test.describe('theme', () => {
  test('data-theme="dark" darkens the body under a light OS preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoFixture(page, 'button', 'baseline');
    const light = await bodyBackground(page);

    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await expect.poll(() => bodyBackground(page)).not.toBe(light);
    const dark = await bodyBackground(page);

    expect(luminance(light)).toBeGreaterThan(0.5);
    expect(luminance(dark)).toBeLessThan(0.1);
  });

  test('prefers-color-scheme: dark applies the dark scheme with no attribute', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoFixture(page, 'button', 'baseline');
    const light = await bodyBackground(page);

    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => bodyBackground(page)).not.toBe(light);
    const dark = await bodyBackground(page);

    expect(luminance(dark)).toBeLessThan(luminance(light));
    expect(luminance(dark)).toBeLessThan(0.1);
    // The root advertises both schemes so form controls and scrollbars follow.
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
    ).toMatch(/light dark|dark/);
  });

  test('data-theme="light" stays light under a dark OS preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoFixture(page, 'button', 'baseline');
    const light = await bodyBackground(page);

    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => bodyBackground(page)).not.toBe(light);

    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await expect.poll(() => bodyBackground(page)).toBe(light);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
      'light',
    );
  });

  test('data-theme="dark" and the dark OS preference produce the same colors', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await gotoFixture(page, 'button', 'baseline');
    const fromMedia = await bodyBackground(page);

    await page.emulateMedia({ colorScheme: 'light' });
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await expect.poll(() => bodyBackground(page)).toBe(fromMedia);
  });
});
