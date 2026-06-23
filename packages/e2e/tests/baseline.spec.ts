import { test, expect } from '@playwright/test';
import {
  gotoFixture,
  expectNoAxeViolations,
  supportsInvokers,
  supportsPopover,
} from './helpers.js';

/**
 * The no-JavaScript baseline: every fixture loads with `?js=off`, so only
 * semantic HTML and the published CSS are in play. This is the library's core
 * promise, proven in real engines (not jsdom): components are usable and
 * accessible before a single enhancer runs.
 */
test.describe('baseline (no JS)', () => {
  test('popover: native popovertarget toggles the surface', async ({ page }) => {
    await gotoFixture(page, 'popover', 'baseline');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const pop = page.locator('#pop');

    await expect(pop).toBeHidden();
    await page.locator('#trigger').click();
    await expect(pop).toBeVisible();
    await expectNoAxeViolations(page);

    await page.keyboard.press('Escape');
    await expect(pop).toBeHidden();
  });

  test('dropdown: native popover menu opens', async ({ page }) => {
    await gotoFixture(page, 'dropdown', 'baseline');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const menu = page.locator('#dd-menu');

    await expect(menu).toBeHidden();
    await page.locator('[data-hl-dropdown-trigger]').click();
    await expect(menu).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test('tabs: :has() switches panels with checked radios', async ({ page }) => {
    await gotoFixture(page, 'tabs', 'baseline');
    await expect(page.locator('#panel-overview')).toBeVisible();
    await expect(page.locator('#panel-pricing')).toBeHidden();

    await page.locator('label.hl-tab', { hasText: 'Pricing' }).click();
    await expect(page.locator('#panel-pricing')).toBeVisible();
    await expect(page.locator('#panel-overview')).toBeHidden();
    await expectNoAxeViolations(page);
  });

  test('disclosure: native <details> toggles, no exclusivity', async ({ page }) => {
    await gotoFixture(page, 'disclosure', 'baseline');
    const details = page.locator('details');

    await expect(details.nth(0)).toHaveJSProperty('open', false);
    await page.locator('#s1').click();
    await expect(details.nth(0)).toHaveJSProperty('open', true);

    await page.locator('#s2').click();
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expect(details.nth(0)).toHaveJSProperty('open', true);
    await expectNoAxeViolations(page);
  });

  test('tooltip: hover reveals the tip via CSS', async ({ page }) => {
    await gotoFixture(page, 'tooltip', 'baseline');
    const tip = page.locator('#tip');

    await expect(tip).toBeHidden();
    await page.locator('#trigger').hover();
    await expect(tip).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test('combobox: an accessible, labelled text input', async ({ page }) => {
    await gotoFixture(page, 'combobox', 'baseline');
    await expect(page.locator('#cb-input')).toBeVisible();
    await expect(page.locator('[role="listbox"]')).toBeHidden();
    await expectNoAxeViolations(page);
  });

  test('modal: command/commandfor opens and closes declaratively', async ({ page }) => {
    await gotoFixture(page, 'modal', 'baseline');
    test.skip(!(await supportsInvokers(page)), 'Invoker Commands unsupported');
    const dialog = page.locator('#dlg');

    await expect(dialog).toHaveJSProperty('open', false);
    await page.locator('#open').click();
    await expect(dialog).toHaveJSProperty('open', true);
    await expectNoAxeViolations(page);

    await page.locator('#cancel').click();
    await expect(dialog).toHaveJSProperty('open', false);
  });

  test('drawer: command/commandfor opens and closes declaratively', async ({ page }) => {
    await gotoFixture(page, 'drawer', 'baseline');
    test.skip(!(await supportsInvokers(page)), 'Invoker Commands unsupported');
    const dialog = page.locator('#dr');

    await expect(dialog).toHaveJSProperty('open', false);
    await page.locator('#open').click();
    await expect(dialog).toHaveJSProperty('open', true);
    await expectNoAxeViolations(page);

    await page.locator('#close').click();
    await expect(dialog).toHaveJSProperty('open', false);
  });
});
