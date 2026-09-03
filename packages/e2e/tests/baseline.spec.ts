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

  test('dropdown: native popover menu opens from the markup alone', async ({ page }) => {
    await gotoFixture(page, 'dropdown', 'baseline');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const menu = page.locator('#dd-menu');

    // Both halves of the invoker pair are authored, not added by JS.
    await expect(menu).toHaveAttribute('popover', '');
    await expect(page.locator('#dd-trigger')).toHaveAttribute('popovertarget', 'dd-menu');

    await expect(menu).toBeHidden();
    await page.locator('#dd-trigger').click();
    await expect(menu).toBeVisible();
    await expect(page.locator('[role="menuitemradio"][aria-checked="true"]')).toHaveText(/Name/);
    await expectNoAxeViolations(page);

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
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

  test('disclosure: native <details name> toggles with exclusivity', async ({ page }) => {
    await gotoFixture(page, 'disclosure', 'baseline');
    const details = page.locator('details');

    await expect(details.nth(0)).toHaveJSProperty('open', false);
    await page.locator('#s1').click();
    await expect(details.nth(0)).toHaveJSProperty('open', true);

    // The shared `name` attribute makes the browser itself close the sibling.
    await page.locator('#s2').click();
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expect(details.nth(0)).toHaveJSProperty('open', false);
    await expectNoAxeViolations(page);
  });

  test('accordion: independent native <details>, no exclusivity', async ({ page }) => {
    await gotoFixture(page, 'accordion', 'baseline');
    const details = page.locator('details');

    await page.locator('#a1').click();
    await page.locator('#a2').click();
    await expect(details.nth(0)).toHaveJSProperty('open', true);
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expectNoAxeViolations(page);
  });

  test('menu: top-level items render, submenus stay hidden', async ({ page }) => {
    await gotoFixture(page, 'menu', 'baseline');
    await expect(page.locator('#file')).toBeVisible();
    await expect(page.locator('#edit')).toBeVisible();
    await expect(page.locator('#v-view')).toBeVisible();
    for (const submenu of await page.locator('[data-hl-menu-submenu]').all()) {
      await expect(submenu).toBeHidden();
    }
    // Nothing has claimed the menu, so the CSS hover/focus-within baseline applies.
    await expect(page.locator('[data-hl-menu][data-hl-ready]')).toHaveCount(0);
    await expectNoAxeViolations(page);
  });

  test('command palette: labelled input and full command list render', async ({ page }) => {
    await gotoFixture(page, 'command-palette', 'baseline');
    await expect(page.locator('#cmd-input')).toBeVisible();
    await expect(page.locator('[role="option"]')).toHaveCount(3);

    // Without the enhancer, typing must not hide any commands.
    await page.locator('#cmd-input').fill('theme');
    await expect(page.locator('[role="option"]:visible')).toHaveCount(3);
    await expectNoAxeViolations(page);
  });

  test('toast: server-rendered toast is visible, trigger is inert', async ({ page }) => {
    await gotoFixture(page, 'toast', 'baseline');
    await expect(page.locator('#server-toast')).toBeVisible();

    await page.locator('#show').click();
    await expect(page.locator('[data-hl-toast]')).toHaveCount(1);
    await expectNoAxeViolations(page);
  });

  test('toc: server-rendered placeholder stays in place', async ({ page }) => {
    await gotoFixture(page, 'toc', 'baseline');
    await expect(page.locator('#toc-placeholder')).toBeVisible();
    await expect(page.locator('[data-hl-toc] a')).toHaveCount(0);
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
