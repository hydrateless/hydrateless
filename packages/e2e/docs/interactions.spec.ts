import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function open(page: Page, slug: string, index = 0) {
  await page.goto(`/components/${slug}`);
  const demo = page.locator('.hl-demo-block').nth(index);
  await expect(demo).toHaveAttribute('data-demo-ready', '');
  return { demo, stage: demo.locator('.hl-demo-stage') };
}

test('reset restores native inputs, checkboxes, switches, and disclosures', async ({ page }) => {
  for (const [slug, selector, value] of [
    ['input', 'input', 'New email'],
    ['textarea', 'textarea', 'New message'],
    ['field', 'input', 'New email'],
  ]) {
    const { demo, stage } = await open(page, slug);
    await stage.locator(selector).fill(value);
    await demo.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(stage.locator(selector)).toHaveValue('');
  }
  for (const slug of ['checkbox', 'switch']) {
    const { demo, stage } = await open(page, slug);
    await stage.locator('input').first().uncheck();
    await demo.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(stage.locator('input').first()).toBeChecked();
  }
  const { demo, stage } = await open(page, 'disclosure');
  await stage.locator('summary').click();
  await expect(stage.locator('details')).toHaveAttribute('open', '');
  await demo.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(stage.locator('details')).not.toHaveAttribute('open');
});

test('accordion, tabs, and JS-off baselines retain keyboard behavior after repeated resets', async ({
  page,
}) => {
  let { demo, stage } = await open(page, 'accordion');
  await stage.locator('summary').nth(1).click();
  await expect(stage.locator('details').nth(1)).toHaveAttribute('open', '');
  await expect(stage.locator('details[open]')).toHaveCount(1);
  await stage.locator('summary').nth(1).press('ArrowDown');
  await expect(stage.locator('summary').nth(2)).toBeFocused();
  await demo.getByRole('button', { name: 'JS: On', exact: true }).press('Enter');
  await expect(demo.getByRole('button', { name: 'JS: Off', exact: true })).toBeVisible();
  await expect(stage.locator('details').first()).toHaveAttribute('open', '');
  await stage.locator('summary').nth(1).click();
  await expect(stage.locator('details[open]')).toHaveCount(2);

  ({ demo, stage } = await open(page, 'tabs'));
  for (let iteration = 0; iteration < 3; iteration++) {
    await stage.getByRole('tab', { name: 'Overview', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(stage.getByRole('tab', { name: 'Features', exact: true })).toBeFocused();
    await expect(stage.getByRole('tab', { name: 'Overview', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.keyboard.press('Enter');
    await expect(stage.getByRole('tabpanel')).toContainText('CSS-first');
    await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
    await demo.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(stage.getByRole('tab', { name: 'Overview', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  }
  ({ demo, stage } = await open(page, 'tabs', 1));
  await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
  await stage.locator('label').nth(1).click();
  await expect(stage.locator('.hl-tabpanel').nth(1)).toBeVisible();
  await expect(stage.locator('.hl-tabpanel').first()).toBeHidden();
});

test('combobox filters, skips disabled options, commits, and restores its baseline', async ({
  page,
}) => {
  const { demo, stage } = await open(page, 'combobox');
  const input = stage.getByRole('combobox');
  await input.fill('gr');
  await expect(stage.getByRole('option')).toHaveCount(1);
  await input.press('Enter');
  await expect(input).toHaveValue('grape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await demo.getByRole('button', { name: 'Reset', exact: true }).click();
  await input.press('ArrowDown');
  await input.press('ArrowDown');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('grape');
  await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
  await expect(stage.locator('input')).not.toHaveAttribute('aria-activedescendant');
  await stage.locator('input').focus();
  await expect(stage.locator('[role="listbox"]')).toBeVisible();
});

test('command filtering, empty state, execution, and escape work', async ({ page }) => {
  const { demo, stage } = await open(page, 'command-palette');
  const input = stage.getByRole('combobox');
  await input.fill('create');
  await expect(stage.getByRole('option')).toHaveText(['New File']);
  await input.fill('no matching command');
  await expect(stage.locator('[data-hl-command-empty]')).toBeVisible();
  await input.press('Escape');
  await expect(input).toHaveValue('');
  await input.fill('preferences');
  await input.press('Enter');
  await expect(demo.locator('.hl-demo-result')).toContainText('settings');
  await demo.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(input).toHaveValue('');
  await expect(stage.getByRole('option')).toHaveCount(4);
});

for (const slug of ['modal', 'drawer']) {
  test(`${slug}: native invocation, focus, backdrop, RTL, and JS-off behavior`, async ({
    page,
  }) => {
    const { demo, stage } = await open(page, slug);
    for (const js of [true, false]) {
      if (!js) await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
      const trigger = stage.getByRole('button', { name: `Open ${slug}`, exact: true });
      // Exercise keyboard focus restoration with a keyboard invoker. Safari
      // intentionally does not retain button focus on pointer activation.
      await trigger.press('Enter');
      await expect(stage.locator('dialog')).toBeVisible();
      await expect(stage.getByRole('dialog')).toHaveAccessibleName(
        slug === 'modal' ? 'Confirm action' : 'Settings',
      );
      await page.keyboard.press('Escape');
      await expect(stage.locator('dialog')).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
      await trigger.click();
      await stage
        .getByRole('button', { name: slug === 'modal' ? 'Cancel' : 'Close', exact: true })
        .click();
      await expect(stage.locator('dialog')).toBeHidden();
    }
    await demo.getByRole('button', { name: 'Reset', exact: true }).click();
    await demo.getByRole('button', { name: 'LTR', exact: true }).click();
    await stage.getByRole('button', { name: `Open ${slug}`, exact: true }).click();
    if (slug === 'drawer') expect((await stage.locator('dialog').boundingBox())!.x).toBeLessThan(2);
    await page.mouse.click(slug === 'drawer' ? 1000 : 5, 5);
    await expect(stage.locator('dialog')).toBeHidden();
  });
}

test('popover and tooltip open, anchor to the trigger, and dismiss without losing focus', async ({
  page,
}) => {
  let { demo, stage } = await open(page, 'popover');
  const trigger = stage.getByRole('button', { name: 'Toggle popover' });
  await trigger.click();
  await expect(stage.locator('[popover]')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const anchor = (await trigger.boundingBox())!;
  const panel = (await stage.locator('[popover]').boundingBox())!;
  expect(Math.abs(panel.y - anchor.y)).toBeLessThan(150);
  await page.keyboard.press('Escape');
  await expect(stage.locator('[popover]')).toBeHidden();
  await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
  await trigger.click();
  await expect(stage.locator('[popover]')).toBeVisible();

  ({ demo, stage } = await open(page, 'tooltip'));
  await stage.getByRole('button').focus();
  await expect(stage.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(stage.getByRole('tooltip')).toBeHidden();
  await expect(stage.getByRole('button')).toBeFocused();
  await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
  // The CSS baseline follows :focus-visible. Enter keyboard modality after
  // the toolbar's pointer click, then return to the trigger with Shift+Tab.
  await stage.getByRole('button').press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(stage.getByRole('tooltip')).toBeVisible();
});

test('dropdown navigation, checkable groups, menu nesting, and action feedback', async ({
  page,
}) => {
  let { demo, stage } = await open(page, 'dropdown');
  await stage.getByRole('button', { name: 'Actions' }).press('ArrowDown');
  await expect(stage.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(stage.getByRole('menuitem', { name: 'Delete', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(stage.getByRole('menu')).toBeHidden();
  await expect(demo.locator('.hl-demo-result')).toContainText('delete');
  ({ demo, stage } = await open(page, 'dropdown', 1));
  await stage.getByRole('button', { name: 'View', exact: true }).click();
  await stage.getByRole('menuitemradio', { name: 'Grid', exact: true }).click();
  await expect(stage.getByRole('menuitemradio', { name: 'Grid', exact: true })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await expect(stage.getByRole('menuitemradio', { name: 'List', exact: true })).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await stage.getByRole('menuitemcheckbox', { name: 'Show hidden files' }).click();
  await expect(stage.getByRole('menuitemcheckbox', { name: 'Show hidden files' })).toHaveAttribute(
    'aria-checked',
    'true',
  );

  ({ demo, stage } = await open(page, 'menu'));
  await stage.getByRole('menuitem', { name: 'File', exact: true }).click();
  await stage.getByRole('menuitem', { name: 'Export', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(stage.getByRole('menuitem', { name: 'PDF', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(demo.locator('.hl-demo-result')).toContainText('export-pdf');
});

test('toast and alert dismissal, JS toggles, and reset', async ({ page }) => {
  let { demo, stage } = await open(page, 'toast');
  for (let iteration = 0; iteration < 3; iteration++) {
    await stage.getByRole('button', { name: 'Danger (sticky)' }).click();
    await expect(stage.locator('[data-hl-toast]')).toHaveCount(1);
    await expect(stage.getByRole('alert')).toContainText('Upload failed.');
    await stage.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(stage.locator('[data-hl-toast]')).toHaveCount(0);
    await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
    await stage.getByRole('button', { name: 'Success', exact: true }).click();
    await expect(stage.locator('[data-hl-toast]')).toHaveCount(0);
    await demo.getByRole('button', { name: 'Reset', exact: true }).click();
  }
  ({ demo, stage } = await open(page, 'alert', 1));
  await stage.getByRole('button', { name: 'Dismiss' }).click();
  await expect(stage.locator('[data-hl-alert]')).toBeHidden();
  await demo.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(stage.locator('[data-hl-alert]')).toBeVisible();
});

test('table sorting, pagination limits, slider output, checkbox groups, and segments', async ({
  page,
}) => {
  let { demo, stage } = await open(page, 'table', 1);
  await expect(stage.locator('tbody tr td:first-child')).toHaveText([
    'Grace Hopper',
    'Ada Lovelace',
    'Alan Turing',
  ]);
  await stage.getByRole('columnheader', { name: 'Name', exact: true }).press('Enter');
  await expect(stage.locator('tbody tr td:first-child')).toHaveText([
    'Ada Lovelace',
    'Alan Turing',
    'Grace Hopper',
  ]);
  await demo.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(stage.locator('tbody tr td:first-child').first()).toHaveText('Grace Hopper');
  ({ demo, stage } = await open(page, 'pagination', 2));
  await stage.locator('[data-hl-page="next"]').click();
  await expect(stage.locator('[aria-current="page"]')).toHaveText('11');
  await stage.locator('[data-hl-page="20"]').click();
  await expect(stage.locator('[data-hl-page="next"]')).toBeDisabled();
  await demo.locator('.hl-knobs').getByLabel('Total pages', { exact: true }).press('Home');
  await expect(stage.locator('[aria-current="page"]')).toHaveText('1');
  ({ demo, stage } = await open(page, 'slider', 1));
  await stage.getByRole('slider').press('ArrowRight');
  await expect(stage.locator('output')).toHaveText('36%');
  await expect(stage.getByRole('slider')).toHaveAttribute('aria-valuetext', '36%');
  ({ demo, stage } = await open(page, 'checkbox', 1));
  await expect(stage.getByLabel('All notifications')).toHaveJSProperty('indeterminate', true);
  await stage.getByLabel('All notifications').check();
  for (const input of await stage.locator('input').all()) await expect(input).toBeChecked();
  ({ demo, stage } = await open(page, 'segmented-control', 1));
  await stage.getByRole('radio', { name: 'Cozy' }).press('ArrowRight');
  await expect(stage.getByRole('radio', { name: 'Comfortable' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
});

test('TOC links resolve inside the example and skip links transfer keyboard focus', async ({
  page,
}) => {
  let { stage } = await open(page, 'toc');
  await expect(stage.locator('nav a')).toHaveCount(4);
  for (const link of await stage.locator('nav a').all()) {
    const href = await link.getAttribute('href');
    await expect(stage.locator(href!)).toBeVisible();
  }
  ({ stage } = await open(page, 'skip-link'));
  const link = stage.getByRole('link', { name: 'Skip to content' });
  await link.focus();
  await expect(link).toBeInViewport();
  await link.press('Enter');
  await expect(stage.locator('#skip-demo-content')).toBeFocused();
});

test('theme studio changes actual typography and colors, exports mode, and resets interactions', async ({
  page,
}) => {
  await page.goto('/playground/theme');
  const studio = page.locator('.hl-studio');
  const preview = studio.locator('.hl-studio-preview');
  await studio.getByLabel('Font', { exact: true }).selectOption('Mono');
  await expect(preview).toHaveCSS('font-family', /monospace/);
  await studio.getByLabel('Base size', { exact: true }).press('End');
  await expect(preview).toHaveCSS('font-size', '18px');
  await expect(preview.locator('.hl-input')).toHaveCSS('font-size', '15.75px');
  await studio.getByLabel('Mode', { exact: true }).selectOption('dark');
  await expect(preview).toHaveCSS('color-scheme', 'dark');
  await expect(studio.locator('.hl-code code')).toContainText('color-scheme: dark;');
  await preview.getByLabel('Workspace name').fill('Updated');
  await preview.getByRole('tab', { name: 'Activity' }).click();
  await studio.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(preview.getByLabel('Workspace name')).toHaveValue('Hydrateless');
  await expect(preview.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(preview).toHaveCSS('color-scheme', 'light');
  const result = await new AxeBuilder({ page })
    .include('.hl-studio')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html) }))).toEqual(
    [],
  );
});
