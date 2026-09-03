import { test, expect, type Locator } from '@playwright/test';
import { gotoFixture, openDialog, supportsPopover } from './helpers.js';

/**
 * Motion policy. Entry transitions are on by default and must collapse to
 * nothing under `prefers-reduced-motion: reduce`: no spinning arcs, no fades,
 * no slides. "Collapse" is checked on computed style, since a zeroed duration
 * and a removed animation are equally acceptable ways to honor the preference.
 */

/** Every comma-separated time in a computed `*-duration` list, in seconds. */
function durations(target: Locator, property: 'transition' | 'animation'): Promise<number[]> {
  return target.evaluate((el, prop) => {
    const value = getComputedStyle(el).getPropertyValue(`${prop}-duration`);
    return value.split(',').map((part) => {
      const trimmed = part.trim();
      return trimmed.endsWith('ms') ? parseFloat(trimmed) / 1000 : parseFloat(trimmed);
    });
  }, property);
}

/** Whether an element is effectively not animating: no keyframes or zero duration. */
async function isStill(target: Locator): Promise<boolean> {
  const name = await target.evaluate((el) => getComputedStyle(el).animationName);
  if (name === 'none') return true;
  return (await durations(target, 'animation')).every((d) => d === 0);
}

test.describe('reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('spinner: the arc stops spinning', async ({ page }) => {
    await gotoFixture(page, 'spinner', 'baseline');
    const spinners = page.locator('.hl-spinner');
    await expect(spinners).toHaveCount(2);
    for (const spinner of await spinners.all()) {
      expect(await isStill(spinner)).toBe(true);
    }
  });

  test('popover: opens instantly, with no transition', async ({ page }) => {
    await gotoFixture(page, 'popover');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const pop = page.locator('#pop');

    await page.locator('#trigger').click();
    await expect(pop).toBeVisible();
    for (const d of await durations(pop, 'transition')) expect(d).toBe(0);
    // With no transition to wait out, the popover is fully opaque on the first frame.
    expect(await pop.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });

  test('drawer: the slide is disabled', async ({ page }) => {
    await gotoFixture(page, 'drawer');
    await openDialog(page, '#open', '#dr');
    const drawer = page.locator('#dr');
    for (const d of await durations(drawer, 'transition')) expect(d).toBe(0);
    expect(await isStill(drawer)).toBe(true);
  });
});

test.describe('motion enabled', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('spinner: the arc animates', async ({ page }) => {
    await gotoFixture(page, 'spinner', 'baseline');
    expect(await isStill(page.locator('.hl-spinner').first())).toBe(false);
  });

  test('popover: has an entry transition that also runs on display', async ({ page }) => {
    await gotoFixture(page, 'popover');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const pop = page.locator('#pop');
    await page.locator('#trigger').click();
    await expect(pop).toBeVisible();

    expect((await durations(pop, 'transition')).some((d) => d > 0)).toBe(true);
    // Discrete `display`/`overlay` transitions are what let the exit animate too.
    expect(
      await pop.evaluate((el) => getComputedStyle(el).getPropertyValue('transition-behavior')),
    ).toContain('allow-discrete');
  });
});
