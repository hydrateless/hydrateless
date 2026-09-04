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
    await expect(dialog).toHaveAttribute('data-hl-side', 'end');

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
    const trigger = page.locator('#dd-trigger');
    const menu = page.locator('#dd-menu');
    const items = page.locator('[role="menuitem"]');

    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('aria-controls', 'dd-menu');
    // Checkable items get an explicit aria-checked, and every item leaves the tab order.
    await expect(page.locator('[role="menuitemcheckbox"]')).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await expect(items.first()).toHaveAttribute('tabindex', '-1');

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
    await expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-hl-combobox]')).toHaveAttribute('data-hl-ready', '');

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

  test('disclosure: native exclusivity plus observable open state', async ({ page }) => {
    await gotoFixture(page, 'disclosure');
    const details = page.locator('details');
    await page.locator('#s1').click();
    await expect(details.nth(0)).toHaveJSProperty('open', true);
    await expect(page.locator('#result')).toHaveText('open:true');

    await page.locator('#s2').click();
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expect(details.nth(0)).toHaveJSProperty('open', false);
    await expectNoAxeViolations(page);
  });

  test('accordion: opening one panel closes the others, hl:change fires', async ({ page }) => {
    await gotoFixture(page, 'accordion');
    const details = page.locator('details');

    await page.locator('#a1').click();
    await expect(details.nth(0)).toHaveJSProperty('open', true);
    await expect(page.locator('#result')).toHaveText('value:shipping');

    await page.locator('#a2').click();
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expect(details.nth(0)).toHaveJSProperty('open', false);
    await expect(page.locator('#result')).toHaveText('value:returns');
    await expectNoAxeViolations(page);
  });

  test('menu: menubar semantics, top-layer submenu, keyboard selection', async ({ page }) => {
    await gotoFixture(page, 'menu');
    const menubar = page.locator('[data-hl-menu]').first();
    const file = page.locator('#file');
    const submenu = menubar.locator('[data-hl-submenu]');
    const value = page.locator('#value');

    await expect(menubar).toHaveAttribute('role', 'menubar');
    await expect(menubar).toHaveAttribute('data-hl-ready', '');
    await expect(file).toHaveAttribute('aria-haspopup', 'menu');
    await expect(file).toHaveAttribute('aria-expanded', 'false');
    await expect(submenu).toBeHidden();

    await file.click();
    await expect(submenu).toBeVisible();
    await expect(file).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[role="menuitem"]', { hasText: 'New' })).toBeFocused();
    // The open submenu is the menu's value, reported through hl:change.
    await expect(value).toHaveText('value:file');
    if (await supportsPopover(page)) {
      // The submenu is promoted to a native popover so it renders in the top layer.
      await expect(submenu).toHaveAttribute('popover', 'manual');
      expect(await submenu.evaluate((el) => el.matches(':popover-open'))).toBe(true);
    }
    await expectNoAxeViolations(page);

    // ArrowDown skips the disabled "Print" item and lands on "Open".
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator('#result')).toHaveText('selected:open');
    await expect(submenu).toBeHidden();
    await expect(value).toHaveText('value:null');

    // Escape closes the submenu and restores focus to its trigger.
    await file.click();
    await expect(submenu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(submenu).toBeHidden();
    await expect(file).toBeFocused();
  });

  test('command palette: filters, shows the empty state, and runs on Enter', async ({ page }) => {
    await gotoFixture(page, 'command-palette');
    const input = page.locator('#cmd-input');
    const options = page.locator('[role="option"]:visible');
    const empty = page.locator('[data-hl-command-empty]');

    await expect(input).toHaveAttribute('role', 'combobox');
    await expect(options).toHaveCount(3);

    // Filtering matches text and data-hl-keywords; empty groups collapse.
    await input.fill('dark');
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveText(/Toggle theme/);
    await expectNoAxeViolations(page);

    await input.fill('zzz');
    await expect(options).toHaveCount(0);
    await expect(empty).toBeVisible();

    await input.fill('open');
    await expect(options).toHaveCount(1);
    await page.keyboard.press('Enter');
    await expect(page.locator('#result')).toHaveText('ran:open-file');
  });

  test('toast: trigger shows a toast, close button dismisses it', async ({ page }) => {
    await gotoFixture(page, 'toast');
    const region = page.locator('[data-hl-toast-region]');
    await expect(region).toHaveAttribute('role', 'status');
    await expect(region).toHaveAttribute('aria-live', 'polite');

    await page.locator('#show').click();
    const toast = page.locator('[data-hl-toast][data-hl-intent="success"]');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveText(/Saved!/);
    await expect(toast).not.toHaveAttribute('role', 'alert');
    await expectNoAxeViolations(page);

    await toast.locator('[data-hl-toast-close]').click();
    await expect(toast).toHaveCount(0);

    // Danger toasts interrupt: they carry role="alert" for assertive announcement.
    await page.locator('#show-danger').click();
    const danger = page.locator('[data-hl-toast][data-hl-intent="danger"]');
    await expect(danger).toBeVisible();
    await expect(danger).toHaveAttribute('role', 'alert');
    await expectNoAxeViolations(page);
    await danger.locator('[data-hl-toast-close]').click();
    await expect(danger).toHaveCount(0);

    // The delegated close handler also covers the server-rendered toast.
    await page.locator('#server-toast [data-hl-toast-close]').click();
    await expect(page.locator('#server-toast')).toHaveCount(0);
  });

  test('toc: builds a nested list of anchor links from the headings', async ({ page }) => {
    await gotoFixture(page, 'toc');
    const nav = page.locator('[data-hl-toc]');
    const links = nav.locator('a');

    // h1 is excluded; h2/h3 produce a nested list.
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveText('Getting started');
    await expect(links.nth(1)).toHaveText('Installation');
    await expect(links.nth(2)).toHaveText('Theming');
    await expect(nav.locator('ul ul a')).toHaveText(['Installation']);
    await expect(page.locator('#toc-placeholder')).toHaveCount(0);

    // Every link resolves to a real heading id.
    for (const href of await links.evaluateAll((as) =>
      as.map((a) => a.getAttribute('href') ?? ''),
    )) {
      expect(href).toMatch(/^#.+/);
      await expect(page.locator(href)).toBeVisible();
    }
    await expectNoAxeViolations(page);
  });

  test('table: sortable headers reorder rows and expose aria-sort', async ({ page }) => {
    await gotoFixture(page, 'table');
    const name = page.locator('th[data-hl-sort="name"]');
    const joined = page.locator('th[data-hl-sort="joined"]');
    const firstCells = page.locator('tbody tr td:first-child');
    const result = page.locator('#result');

    await expect(name).toHaveAttribute('aria-sort', 'none');
    await expect(name).toHaveAttribute('tabindex', '0');
    await expect(page.locator('th', { hasText: 'Role' })).not.toHaveAttribute('aria-sort', /.+/);
    await expect(firstCells).toHaveText(['Grace Hopper', 'Ada Lovelace', 'Margaret Hamilton']);

    await name.click();
    await expect(name).toHaveAttribute('aria-sort', 'ascending');
    await expect(firstCells).toHaveText(['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton']);
    await expect(result).toHaveText('sort:name:ascending');
    await expectNoAxeViolations(page);

    await name.click();
    await expect(name).toHaveAttribute('aria-sort', 'descending');
    await expect(firstCells).toHaveText(['Margaret Hamilton', 'Grace Hopper', 'Ada Lovelace']);

    // Keyboard: Enter on another header sorts it numerically and clears the first.
    await joined.focus();
    await page.keyboard.press('Enter');
    await expect(joined).toHaveAttribute('aria-sort', 'ascending');
    await expect(name).toHaveAttribute('aria-sort', 'none');
    await expect(firstCells).toHaveText(['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton']);
    await expect(result).toHaveText('sort:joined:ascending');
  });

  test('pagination: in-page controls, arrow keys, and rendered ranges', async ({ page }) => {
    await gotoFixture(page, 'pagination');
    const authored = page.locator('#authored');
    const rendered = page.locator('#rendered');
    const result = page.locator('#result');

    // Authored links: the current page and end controls are marked up.
    await expect(authored.locator('[aria-current="page"]')).toHaveText('2');
    await expect(authored.locator('[data-hl-page="prev"]')).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await authored.locator('[data-hl-page="3"]').click();
    await expect(authored.locator('[aria-current="page"]')).toHaveText('3');
    await expect(result).toHaveText('authored:3');
    // Hash links are in-page controls, so the URL is left alone.
    expect(new URL(page.url()).hash).toBe('');

    await authored.locator('[data-hl-page="1"]').click();
    await expect(authored.locator('[data-hl-page="prev"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await page.keyboard.press('ArrowRight');
    await expect(authored.locator('[data-hl-page="2"]')).toBeFocused();
    await page.keyboard.press('End');
    await expect(authored.locator('[data-hl-page="9"]')).toBeFocused();

    // Rendered controls: page 10 of 20 with one sibling and one boundary each side.
    const pages = rendered.locator('[data-hl-page]');
    await expect(pages).toHaveText(['‹', '1', '9', '10', '11', '20', '›']);
    await expect(rendered.locator('.hl-pagination-ellipsis')).toHaveCount(2);
    await expect(rendered.locator('[aria-current="page"]')).toHaveText('10');
    await expectNoAxeViolations(page);

    await rendered.locator('[data-hl-page="next"]').click();
    await expect(rendered.locator('[aria-current="page"]')).toHaveText('11');
    await expect(result).toHaveText('rendered:11');
    await rendered.locator('[data-hl-page="20"]').click();
    await expect(rendered.locator('[data-hl-page="next"]')).toBeDisabled();
  });

  test('slider: output, aria-valuetext, and the progress variable track the value', async ({
    page,
  }) => {
    await gotoFixture(page, 'slider');
    const slider = page.locator('#volume');
    const output = page.locator('output');

    await expect(output).toHaveText('40%');
    await expect(slider).toHaveAttribute('aria-valuetext', '40%');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('41');
    await expect(output).toHaveText('41%');
    await expect(slider).toHaveAttribute('aria-valuetext', '41%');
    await expect(slider).toHaveCSS('--hl-slider-progress', '41%');
    await expectNoAxeViolations(page);
  });

  test('checkbox group: master box mirrors and drives the group', async ({ page }) => {
    await gotoFixture(page, 'checkbox');
    const all = page.locator('#all');
    const cheese = page.locator('#cheese');
    const olives = page.locator('#olives');
    const result = page.locator('#result');

    // One of two checked: the master shows the mixed state.
    await expect(all).toHaveJSProperty('indeterminate', true);
    await expect(all).not.toBeChecked();

    await olives.check();
    await expect(all).toBeChecked();
    await expect(all).toHaveJSProperty('indeterminate', false);
    await expect(result).toHaveText('value:cheese,olives');
    await expectNoAxeViolations(page);

    await all.uncheck();
    await expect(cheese).not.toBeChecked();
    await expect(olives).not.toBeChecked();
    await expect(result).toHaveText('value:');
  });

  test('alert: dismiss button hides the alert after its exit transition', async ({ page }) => {
    await gotoFixture(page, 'alert');
    const alert = page.locator('#dismissible');
    const result = page.locator('#result');

    await expect(alert).toBeVisible();
    await page.locator('#dismiss').click();
    await expect(alert).toBeHidden();
    await expect(alert).not.toHaveAttribute('data-hl-alert-closing', /.*/);
    await expect(result).toHaveText('open:false');
    await expectNoAxeViolations(page);
  });

  test('segmented control: radios report, buttons gain radio-group semantics', async ({ page }) => {
    await gotoFixture(page, 'segmented-control');
    const result = page.locator('#result');
    const buttons = page.locator('#buttons .hl-segmented-item');

    await page.locator('#radios .hl-segmented-item', { hasText: 'Grid' }).click();
    await expect(page.locator('input[value="grid"]')).toBeChecked();
    await expect(result).toHaveText('radios:grid');

    await expect(page.locator('#buttons')).toHaveAttribute('role', 'radiogroup');
    await expect(buttons.nth(0)).toHaveAttribute('role', 'radio');
    await expect(buttons.nth(0)).toHaveAttribute('aria-checked', 'true');
    await expect(buttons.nth(0)).not.toHaveAttribute('aria-pressed', /.*/);
    await expect(buttons.nth(1)).toHaveAttribute('tabindex', '-1');
    await expectNoAxeViolations(page);

    await buttons.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(buttons.nth(1)).toBeFocused();
    await expect(buttons.nth(1)).toHaveAttribute('aria-checked', 'true');
    await expect(buttons.nth(0)).toHaveAttribute('aria-checked', 'false');
    await expect(result).toHaveText('buttons:week');

    await buttons.nth(2).click();
    await expect(buttons.nth(2)).toHaveAttribute('aria-checked', 'true');
    await expect(result).toHaveText('buttons:month');
  });
});
