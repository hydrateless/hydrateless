import { test, expect } from '@playwright/test';
import {
  gotoFixture,
  expectNoAxeViolations,
  supportsInvokers,
  supportsPopover,
} from './helpers.js';

/**
 * Enhanced behavior: the CDN auto bundle is loaded, so each component is
 * upgraded with the ARIA and keyboard support the platform can't express alone.
 * These assertions run on every engine in the matrix.
 */
test.describe('enhanced (JS on)', () => {
  test('modal: labelled by its header, focus-trapped, Escape closes', async ({ page }) => {
    await gotoFixture(page, 'modal');
    const dialog = page.locator('#dlg');
    await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);
    await expect(dialog).toHaveJSProperty('open', false);

    if (await supportsInvokers(page)) {
      await page.locator('#open').click();
    } else {
      await dialog.evaluate((d) => (d as HTMLDialogElement).showModal());
    }

    await expect(dialog).toHaveJSProperty('open', true);
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.closest('dialog')?.id))
      .toBe('dlg');
    await expectNoAxeViolations(page);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveJSProperty('open', false);
  });

  test('drawer: labelled, opens to the side, Escape closes', async ({ page }) => {
    await gotoFixture(page, 'drawer');
    const dialog = page.locator('#dr');
    await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);

    if (await supportsInvokers(page)) {
      await page.locator('#open').click();
    } else {
      await dialog.evaluate((d) => (d as HTMLDialogElement).showModal());
    }

    await expect(dialog).toHaveJSProperty('open', true);
    await expectNoAxeViolations(page);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveJSProperty('open', false);
  });

  test('popover: invoker toggles it and aria-expanded mirrors state', async ({ page }) => {
    await gotoFixture(page, 'popover');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const trigger = page.locator('#trigger');
    const pop = page.locator('#pop');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(pop).toBeHidden();

    await trigger.click();
    await expect(pop).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expectNoAxeViolations(page);

    await page.keyboard.press('Escape');
    await expect(pop).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('dropdown: menu-button semantics, roving focus, selection', async ({ page }) => {
    await gotoFixture(page, 'dropdown');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const trigger = page.locator('[data-hl-dropdown-trigger]');
    const menu = page.locator('#dd-menu');
    const items = page.locator('[role="menuitem"]');

    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await expect(items.first()).toBeFocused();
    await expectNoAxeViolations(page);

    await page.keyboard.press('ArrowDown');
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#result')).toHaveText('selected:duplicate');
    await expect(menu).toBeHidden();
  });

  test('tooltip: focus reveals the tip, Escape dismisses it', async ({ page }) => {
    await gotoFixture(page, 'tooltip');
    const trigger = page.locator('#trigger');
    const tip = page.locator('#tip');

    await expect(trigger).toHaveAttribute('aria-describedby', 'tip');
    await expect(tip).toBeHidden();

    await trigger.focus();
    await expect(tip).toBeVisible();
    await expectNoAxeViolations(page);

    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
  });

  test('tabs: APG roles, click and arrow-key selection', async ({ page }) => {
    await gotoFixture(page, 'tabs');
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-overview')).toBeVisible();

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-pricing')).toBeVisible();
    await expect(page.locator('#panel-overview')).toBeHidden();

    await tabs.nth(1).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-faq')).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test('combobox: expands, filters, and commits via the keyboard', async ({ page }) => {
    await gotoFixture(page, 'combobox');
    const input = page.locator('#cb-input');
    await expect(input).toHaveAttribute('role', 'combobox');
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    await input.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const listbox = page.locator('[role="listbox"]');
    await expect(listbox).toBeVisible();

    await input.fill('ap');
    const visibleOptions = page.locator('[role="option"]:visible');
    await expect(visibleOptions).toHaveCount(2);
    await expectNoAxeViolations(page);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('Apricot');
    await expect(listbox).toBeHidden();
  });

  test('disclosure: opening one collapses the others', async ({ page }) => {
    await gotoFixture(page, 'disclosure');
    const details = page.locator('details');
    await page.locator('#s1').click();
    await expect(details.nth(0)).toHaveJSProperty('open', true);

    await page.locator('#s2').click();
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expect(details.nth(0)).toHaveJSProperty('open', false);
    await expectNoAxeViolations(page);
  });
});
