import { test, expect, type Page } from '@playwright/test';
import { gotoFixture, supportsPopover } from './helpers.js';

/**
 * Keyboard matrices per component, following the WAI-ARIA APG patterns each
 * enhancer implements. The enhanced spec covers the happy path for every
 * component; these tests cover the edges: Home/End, typeahead, disabled items,
 * checkable menu items, manual activation, and the keys a pattern must leave
 * alone (Home/End in an editable combobox).
 */

/** Text of the currently focused element, trimmed, so matrices can name items. */
function focusedText(page: Page): Promise<string | undefined> {
  return page.evaluate(() => document.activeElement?.textContent?.trim());
}

test.describe('keyboard: dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, 'dropdown');
    test.skip(!(await supportsPopover(page)), 'Popover API unsupported');
    await page.locator('#dd-trigger').click();
    await expect(page.locator('#dd-menu')).toBeVisible();
    await expect.poll(() => focusedText(page)).toBe('Edit');
  });

  test('Home and End jump to the first and last enabled item', async ({ page }) => {
    await page.keyboard.press('End');
    await expect.poll(() => focusedText(page)).toBe('Delete');
    await page.keyboard.press('Home');
    await expect.poll(() => focusedText(page)).toBe('Edit');
  });

  test('ArrowUp from the first item wraps to the last', async ({ page }) => {
    await page.keyboard.press('ArrowUp');
    await expect.poll(() => focusedText(page)).toBe('Delete');
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => focusedText(page)).toBe('Edit');
  });

  test('arrow keys skip a disabled item in both directions', async ({ page }) => {
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => focusedText(page)).toBe('Duplicate');
    // "Archive" is disabled and sits between Duplicate and Pin to top.
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => focusedText(page)).toBe('Pin to top');
    await page.keyboard.press('ArrowUp');
    await expect.poll(() => focusedText(page)).toBe('Duplicate');
  });

  test('a disabled item is inert to pointer and keyboard', async ({ page }) => {
    const archive = page.locator('[role="menuitem"][data-hl-value="archive"]');
    await expect(archive).toBeDisabled();
    await archive.click({ force: true });
    await expect(page.locator('#result')).toHaveText('');
    await expect(page.locator('#dd-menu')).toBeVisible();
  });

  test('typeahead moves to the next item starting with the typed letters', async ({ page }) => {
    await page.keyboard.press('d');
    await expect.poll(() => focusedText(page)).toBe('Duplicate');
    // A second letter within the buffer window refines the match: "de" -> Delete.
    await page.keyboard.press('e');
    await expect.poll(() => focusedText(page)).toBe('Delete');
  });

  test('typeahead never lands on a disabled item', async ({ page }) => {
    // Only "Archive" starts with "a", and it's disabled.
    await page.keyboard.press('a');
    await expect.poll(() => focusedText(page)).toBe('Edit');
  });

  test('ArrowUp on the trigger opens the menu on its last item', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.locator('#dd-menu')).toBeHidden();
    await expect(page.locator('#dd-trigger')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#dd-menu')).toBeVisible();
    await expect.poll(() => focusedText(page)).toBe('Delete');
  });

  test('menuitemcheckbox toggles aria-checked and reports it in hl:select', async ({ page }) => {
    const pin = page.locator('[role="menuitemcheckbox"]');
    const menu = page.locator('#dd-menu');
    await expect(pin).toHaveAttribute('aria-checked', 'false');

    await pin.focus();
    await page.keyboard.press('Enter');
    await expect(pin).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('#result')).toHaveText('selected:pin:true');
    // closeOnSelect is the default, and focus goes back to the trigger.
    await expect(menu).toBeHidden();
    await expect(page.locator('#dd-trigger')).toBeFocused();

    // The state survives the round trip and toggles back off.
    await page.keyboard.press('ArrowDown');
    await expect(menu).toBeVisible();
    await expect(pin).toHaveAttribute('aria-checked', 'true');
    await pin.focus();
    await page.keyboard.press(' ');
    await expect(pin).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('#result')).toHaveText('selected:pin:false');
  });

  test('menuitemradio items in a group are mutually exclusive', async ({ page }) => {
    const name = page.locator('[role="menuitemradio"][data-hl-value="sort-name"]');
    const date = page.locator('[role="menuitemradio"][data-hl-value="sort-date"]');
    await expect(name).toHaveAttribute('aria-checked', 'true');
    await expect(date).toHaveAttribute('aria-checked', 'false');

    await date.focus();
    await page.keyboard.press('Enter');
    await expect(date).toHaveAttribute('aria-checked', 'true');
    await expect(name).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('#result')).toHaveText('selected:sort-date:true');

    // Re-checking the checked radio keeps it checked; radios don't toggle off.
    await page.locator('#dd-trigger').click();
    await date.click();
    await expect(date).toHaveAttribute('aria-checked', 'true');
    await expect(name).toHaveAttribute('aria-checked', 'false');
  });

  test('checking a radio leaves the checkbox item alone', async ({ page }) => {
    const pin = page.locator('[role="menuitemcheckbox"]');
    await page.locator('[role="menuitemradio"][data-hl-value="sort-date"]').click();
    await expect(pin).toHaveAttribute('aria-checked', 'false');
  });
});

test.describe('keyboard: menu', () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, 'menu');
  });

  test('horizontal: Left/Right, Home, and End move between top-level items', async ({ page }) => {
    const file = page.locator('#file');
    const edit = page.locator('#edit');
    // Only the active top-level item is in the tab sequence (roving tabindex).
    await expect(file).toHaveAttribute('tabindex', '0');
    await expect(edit).toHaveAttribute('tabindex', '-1');

    await file.focus();
    await page.keyboard.press('ArrowRight');
    await expect(edit).toBeFocused();
    await expect(edit).toHaveAttribute('tabindex', '0');
    await expect(file).toHaveAttribute('tabindex', '-1');
    await page.keyboard.press('ArrowRight');
    await expect(file).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(edit).toBeFocused();
    await page.keyboard.press('Home');
    await expect(file).toBeFocused();
    await page.keyboard.press('End');
    await expect(edit).toBeFocused();
  });

  test('horizontal: ArrowDown opens the submenu, arrows skip disabled, Enter selects', async ({
    page,
  }) => {
    const file = page.locator('#file');
    const submenu = page.locator('[data-hl-submenu]').first();

    await file.focus();
    await page.keyboard.press('ArrowDown');
    await expect(submenu).toBeVisible();
    await expect(file).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#value')).toHaveText('value:file');
    await expect.poll(() => focusedText(page)).toBe('New');

    // "Print" is disabled: Down skips it, Up wraps past it too.
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => focusedText(page)).toBe('Open');
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => focusedText(page)).toBe('New');
    await page.keyboard.press('ArrowUp');
    await expect.poll(() => focusedText(page)).toBe('Open');
    await page.keyboard.press('End');
    await expect.poll(() => focusedText(page)).toBe('Open');
    await page.keyboard.press('Home');
    await expect.poll(() => focusedText(page)).toBe('New');

    await page.keyboard.press('Enter');
    await expect(page.locator('#result')).toHaveText('selected:new');
    await expect(submenu).toBeHidden();
    await expect(page.locator('#value')).toHaveText('value:null');
    await expect(file).toBeFocused();
  });

  test('horizontal: ArrowUp on the trigger opens the submenu on its last item', async ({
    page,
  }) => {
    await page.locator('#file').focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('[data-hl-submenu]').first()).toBeVisible();
    await expect.poll(() => focusedText(page)).toBe('Open');
  });

  test('horizontal: Escape closes the submenu and restores focus to its trigger', async ({
    page,
  }) => {
    const file = page.locator('#file');
    const submenu = page.locator('[data-hl-submenu]').first();

    await file.focus();
    await page.keyboard.press('Enter');
    await expect(submenu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(submenu).toBeHidden();
    await expect(file).toBeFocused();
    await expect(file).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#value')).toHaveText('value:null');
  });

  test('horizontal: ArrowRight inside a submenu moves to the next top-level item', async ({
    page,
  }) => {
    await page.locator('#file').focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => focusedText(page)).toBe('New');
    await page.keyboard.press('ArrowRight');
    // "Edit" has no submenu, so focus lands on it and nothing opens.
    await expect(page.locator('#edit')).toBeFocused();
    await expect(page.locator('[data-hl-submenu]').first()).toBeHidden();
  });

  test('horizontal: a disabled leaf item does not fire hl:select', async ({ page }) => {
    await page.locator('#file').click();
    const print = page.locator('[role="menuitem"][data-hl-value="print"]');
    await expect(print).toBeDisabled();
    await print.click({ force: true });
    await expect(page.locator('#result')).toHaveText('');
  });

  test('vertical: Up/Down move between items, Right opens, Left closes', async ({ page }) => {
    const view = page.locator('#v-view');
    const help = page.locator('#v-help');
    const submenu = page.locator('[data-hl-menu][aria-orientation="vertical"] [role="menu"]');

    await view.focus();
    await page.keyboard.press('ArrowDown');
    await expect(help).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(view).toBeFocused();

    // In a vertical menubar Right opens the flyout (Down moves between items).
    await page.keyboard.press('ArrowRight');
    await expect(submenu).toBeVisible();
    await expect(view).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#v-zoom-in')).toBeFocused();
    await expect(page.locator('#value')).toHaveText('value:view');

    await page.keyboard.press('ArrowDown');
    await expect.poll(() => focusedText(page)).toBe('Zoom out');

    // Left walks back to the trigger and closes the flyout.
    await page.keyboard.press('ArrowLeft');
    await expect(submenu).toBeHidden();
    await expect(view).toBeFocused();
    await expect(view).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#value')).toHaveText('value:null');
  });

  test('vertical: Enter and Space open the submenu too', async ({ page }) => {
    const submenu = page.locator('[data-hl-menu][aria-orientation="vertical"] [role="menu"]');
    await page.locator('#v-view').focus();
    await page.keyboard.press('Enter');
    await expect(submenu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(submenu).toBeHidden();
    await expect(page.locator('#v-view')).toBeFocused();
    await page.keyboard.press(' ');
    await expect(submenu).toBeVisible();
  });
});

test.describe('keyboard: tabs', () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, 'tabs');
  });

  test('Home and End move focus to the first and last tab', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toBeFocused();

    await page.keyboard.press('End');
    await expect(tabs.nth(2)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tabs.nth(0)).toBeFocused();
  });

  test('manual activation: arrows only move focus until Enter or Space', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await tabs.nth(0).focus();

    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-overview')).toBeVisible();
    await expect(page.locator('#panel-pricing')).toBeHidden();

    await page.keyboard.press(' ');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator('#panel-pricing')).toBeVisible();

    await page.keyboard.press('End');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Enter');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-faq')).toBeVisible();
  });

  test('arrows wrap at both ends', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.nth(2)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(0)).toBeFocused();
  });

  test('only the selected tab is in the tab sequence', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.nth(0)).toHaveAttribute('tabindex', '0');
    await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1');
    await expect(tabs.nth(2)).toHaveAttribute('tabindex', '-1');
    // The radios that drive the CSS baseline are out of the way once JS owns the tabs.
    await expect(page.locator('[role="tab"] input[type="radio"]:not([hidden])')).toHaveCount(0);
  });
});

test.describe('keyboard: accordion', () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, 'accordion');
  });

  test('ArrowDown and ArrowUp move between headers and wrap', async ({ page }) => {
    await page.locator('#a1').focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#a2')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#a3')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#a1')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#a3')).toBeFocused();
  });

  test('Home and End jump to the first and last header', async ({ page }) => {
    await page.locator('#a2').focus();
    await page.keyboard.press('End');
    await expect(page.locator('#a3')).toBeFocused();
    await page.keyboard.press('Home');
    await expect(page.locator('#a1')).toBeFocused();
  });

  test('moving focus does not open panels; Enter still toggles natively', async ({ page }) => {
    const details = page.locator('details');
    await page.locator('#a1').focus();
    await page.keyboard.press('ArrowDown');
    await expect(details.nth(1)).toHaveJSProperty('open', false);
    await expect(details.nth(0)).toHaveJSProperty('open', false);

    await page.keyboard.press('Enter');
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expect(page.locator('#result')).toHaveText('value:returns');
  });
});

test.describe('keyboard: combobox', () => {
  const highlighted = (page: Page) =>
    page.locator('[role="option"][aria-selected="true"]:not([hidden])');

  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, 'combobox');
  });

  test('Alt+ArrowDown expands the listbox without highlighting an option', async ({ page }) => {
    const input = page.locator('#cb-input');
    await input.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toBeFocused();

    await page.keyboard.press('Alt+ArrowDown');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).not.toHaveAttribute('aria-activedescendant', /.+/);
    await expect(highlighted(page)).toHaveCount(0);

    // A plain ArrowDown then highlights the first option.
    await page.keyboard.press('ArrowDown');
    await expect(highlighted(page)).toHaveText('Apple');
    await expect(input).toHaveAttribute('aria-activedescendant', /.+/);
  });

  test('Home and End are left to the text caret', async ({ page }) => {
    const input = page.locator('#cb-input');
    // Whether each key's default was consumed, observed after the enhancer's own
    // input listener has run. What the caret then does with Home/End is up to
    // the platform (macOS engines scroll instead), so the contract under test is
    // only that the combobox doesn't claim the keys.
    await page.evaluate(() => {
      const consumed: Record<string, boolean> = {};
      document.addEventListener('keydown', (e) => {
        consumed[e.key] = e.defaultPrevented;
        document.documentElement.dataset.hlConsumed = JSON.stringify(consumed);
      });
    });

    await input.click();
    await input.pressSequentially('ap');
    await expect(input).toHaveValue('ap');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(highlighted(page)).toHaveText('Apple');

    await page.keyboard.press('Home');
    await page.keyboard.press('End');
    // Control: a key the pattern does own is consumed.
    await page.keyboard.press('ArrowDown');
    await expect(highlighted(page)).toHaveText('Apricot');

    const consumed = JSON.parse(
      (await page.locator('html').getAttribute('data-hl-consumed')) ?? '{}',
    ) as Record<string, boolean>;
    expect(consumed).toMatchObject({ Home: false, End: false, ArrowDown: true });
  });

  test('arrow navigation skips a disabled option', async ({ page }) => {
    const input = page.locator('#cb-input');
    await input.click();
    for (let i = 0; i < 4; i += 1) await page.keyboard.press('ArrowDown');
    await expect(highlighted(page)).toHaveText('Cherry');
    // "Durian" is aria-disabled and sits between Cherry and Elderberry.
    await page.keyboard.press('ArrowDown');
    await expect(highlighted(page)).toHaveText('Elderberry');
    await page.keyboard.press('ArrowUp');
    await expect(highlighted(page)).toHaveText('Cherry');
  });

  test('a disabled option cannot be selected with the pointer', async ({ page }) => {
    const input = page.locator('#cb-input');
    await input.click();
    // `force` bypasses Playwright's own aria-disabled guard so the click reaches the page.
    await page.locator('[role="option"][aria-disabled="true"]').click({ force: true });
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
  });

  test('PageDown and PageUp jump through the options', async ({ page }) => {
    const input = page.locator('#cb-input');
    await input.click();
    await page.keyboard.press('PageDown');
    // Fewer than a page of options: PageDown lands on the last enabled one.
    await expect(highlighted(page)).toHaveText('Elderberry');
    await page.keyboard.press('PageUp');
    await expect(highlighted(page)).toHaveText('Apple');
  });

  test('Escape collapses the listbox and Tab leaves it closed', async ({ page }) => {
    const input = page.locator('#cb-input');
    await input.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[role="listbox"]')).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(page.locator('[role="listbox"]')).toBeHidden();
  });
});

test.describe('keyboard: command palette', () => {
  const active = (page: Page) => page.locator('[role="option"][aria-selected="true"]:visible');

  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, 'command-palette');
    await page.locator('#cmd-input').focus();
  });

  test('PageDown and PageUp jump to the last and first visible command', async ({ page }) => {
    await expect(active(page)).toHaveText(/New file/);
    await page.keyboard.press('PageDown');
    await expect(active(page)).toHaveText(/Toggle theme/);
    await page.keyboard.press('PageUp');
    await expect(active(page)).toHaveText(/New file/);
  });

  test('ArrowUp from the first command wraps to the last', async ({ page }) => {
    await page.keyboard.press('ArrowUp');
    await expect(active(page)).toHaveText(/Toggle theme/);
    await page.keyboard.press('ArrowDown');
    await expect(active(page)).toHaveText(/New file/);
  });

  test('Escape clears a non-empty query and restores the full list', async ({ page }) => {
    const input = page.locator('#cmd-input');
    const options = page.locator('[role="option"]:visible');

    await input.fill('dark');
    await expect(options).toHaveCount(1);
    await expect(page.locator('#query')).toHaveText('query:dark');

    await page.keyboard.press('Escape');
    await expect(input).toHaveValue('');
    await expect(options).toHaveCount(3);
    await expect(page.locator('[data-hl-command-empty]')).toBeHidden();
    await expect(page.locator('#query')).toHaveText('query:');
    // The first command is active again, ready for Enter.
    await expect(active(page)).toHaveText(/New file/);
  });

  test('Escape with an empty query outside a dialog is a no-op', async ({ page }) => {
    const input = page.locator('#cmd-input');
    await expect(input).toHaveValue('');
    await page.keyboard.press('Escape');
    await expect(input).toBeFocused();
    await expect(page.locator('[role="option"]:visible')).toHaveCount(3);
  });
});
