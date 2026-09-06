import { test, expect } from '@playwright/test';
import { gotoFixture, openDialog, supportsInvokers, supportsPopover } from './helpers.js';

/**
 * Focus management for the overlay components. Where an overlay closes from
 * the keyboard or by choosing an item, focus must land back on the control
 * that opened it (WAI-ARIA APG, "Keyboard Interaction" for dialogs and menu
 * buttons). Where the user dismisses by clicking elsewhere, focus follows the
 * pointer instead and must not be yanked back.
 */
test.describe('focus management', () => {
  test('modal: closing with Escape returns focus to the invoker', async ({ page }) => {
    await gotoFixture(page, 'modal');
    const dialog = page.locator('#dlg');
    const invoker = page.locator('#open');

    await openDialog(page, '#open', '#dlg');
    // Focus is trapped inside while open.
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.closest('dialog')?.id))
      .toBe('dlg');

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveJSProperty('open', false);
    await expect(invoker).toBeFocused();
  });

  test('modal: closing with a command button returns focus to the invoker', async ({ page }) => {
    await gotoFixture(page, 'modal');
    test.skip(!(await supportsInvokers(page)), 'Invoker Commands unsupported');
    const dialog = page.locator('#dlg');

    await openDialog(page, '#open', '#dlg');
    // Move focus deeper into the dialog so the return isn't trivially "already there".
    await page.locator('#learn').focus();
    await expect(page.locator('#learn')).toBeFocused();

    await page.locator('#confirm').click();
    await expect(dialog).toHaveJSProperty('open', false);
    await expect(page.locator('#open')).toBeFocused();
  });

  test('drawer: closing with Escape returns focus to the invoker', async ({ page }) => {
    await gotoFixture(page, 'drawer');
    await openDialog(page, '#open', '#dr');
    await page.keyboard.press('Escape');
    await expect(page.locator('#dr')).toHaveJSProperty('open', false);
    await expect(page.locator('#open')).toBeFocused();
  });

  test.describe('dropdown', () => {
    test.beforeEach(async ({ page }) => {
      await gotoFixture(page, 'dropdown');
      test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    });

    test('Escape returns focus to the trigger', async ({ page }) => {
      const trigger = page.locator('#dd-trigger');
      const menu = page.locator('#dd-menu');

      await trigger.click();
      await expect(menu).toBeVisible();
      await expect(page.locator('[role="menuitem"]').first()).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test('activating an item returns focus to the trigger', async ({ page }) => {
      const trigger = page.locator('#dd-trigger');
      const menu = page.locator('#dd-menu');

      await trigger.click();
      await expect(menu).toBeVisible();
      // Native popover visibility precedes its queued toggle/focus event.
      await expect(page.locator('[role="menuitem"]').first()).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      await expect(page.locator('#result')).toHaveText('selected:duplicate');
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test('Tab closes the menu and focus leaves the items', async ({ page }) => {
      const trigger = page.locator('#dd-trigger');
      const menu = page.locator('#dd-menu');

      await trigger.click();
      await expect(menu).toBeVisible();
      await expect(page.locator('[role="menuitem"]').first()).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(menu).toBeHidden();
      // The items are out of the tab sequence, so focus must not be left on one.
      await expect(page.locator('#dd-menu :focus')).toHaveCount(0);
    });

    test('an outside click closes the menu without moving focus to the trigger', async ({
      page,
    }) => {
      const trigger = page.locator('#dd-trigger');
      const menu = page.locator('#dd-menu');

      await trigger.click();
      await expect(menu).toBeVisible();

      // Light dismiss: the pointer decides where focus goes, not the enhancer.
      await page.locator('h1').click();
      await expect(menu).toBeHidden();
      await expect(trigger).not.toBeFocused();
    });
  });

  test('popover: Escape returns focus to the invoker', async ({ page }) => {
    await gotoFixture(page, 'popover');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    const trigger = page.locator('#trigger');
    const pop = page.locator('#pop');

    // Open from the keyboard so the invoker is the focused element on show; the
    // Popover API records that element as the one to return focus to.
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(pop).toBeVisible();

    await page.locator('#signout').focus();
    await expect(page.locator('#signout')).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(pop).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('tooltip: Escape hides the tip and keeps focus on the trigger', async ({ page }) => {
    await gotoFixture(page, 'tooltip');
    const trigger = page.locator('#trigger');
    const tip = page.locator('#tip');

    await trigger.focus();
    await expect(tip).toBeVisible();
    await expect(tip).toHaveAttribute('data-hl-tooltip-open', '');

    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
    await expect(tip).not.toHaveAttribute('data-hl-tooltip-open', '');
    await expect(trigger).toBeFocused();
  });
});
