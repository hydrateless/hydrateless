import { test, expect, type Page } from '@playwright/test';
import {
  gotoFixture,
  expectNoAxeViolations,
  STATIC_FIXTURES,
  type StaticFixture,
} from './helpers.js';

/**
 * These components work from HTML and CSS alone, so the same assertions must
 * hold with JavaScript on and off: the component renders and the page passes
 * axe. A few controls also get native-interaction checks (which likewise need
 * no JS). Where a fixture also opts into an enhancer, `enhanced.spec.ts`
 * covers what the enhancer adds.
 */

/** The element each fixture must render; checked visible unless noted. */
const RENDER_CHECKS: Record<StaticFixture, string> = {
  alert: '.hl-alert[role="alert"]',
  avatar: '.hl-avatar',
  badge: '.hl-badge',
  breadcrumb: 'nav[data-hl-breadcrumb] a[aria-current="page"]',
  button: '.hl-button',
  card: '.hl-card .hl-card-title',
  checkbox: '.hl-checkbox input[type="checkbox"]',
  field: '.hl-field .hl-error',
  input: '.hl-input',
  kbd: '.hl-kbd',
  pagination: '.hl-pagination [aria-current="page"]',
  progress: '.hl-progress',
  'radio-group': '.hl-radio-group[role="radiogroup"]',
  'segmented-control': '.hl-segmented[role="radiogroup"]',
  select: '.hl-select',
  separator: 'hr.hl-separator',
  skeleton: '.hl-skeleton',
  'skip-link': '.hl-skip-link',
  slider: '.hl-slider',
  spinner: '.hl-spinner[role="status"]',
  switch: '[data-hl-switch] input[role="switch"]',
  table: '.hl-table caption',
  textarea: '.hl-textarea',
};

/** WebKit only reaches links with Tab when Option is held. */
const tabKey = (browserName: string) => (browserName === 'webkit' ? 'Alt+Tab' : 'Tab');

async function expectRendered(page: Page, name: StaticFixture, browserName: string): Promise<void> {
  const target = page.locator(RENDER_CHECKS[name]).first();
  if (name === 'skip-link') {
    // The skip link is visually hidden until it receives keyboard focus.
    await expect(target).toBeAttached();
    await page.keyboard.press(tabKey(browserName));
    await expect(target).toBeFocused();
  }
  await expect(target).toBeVisible();
}

for (const mode of ['baseline', 'enhanced'] as const) {
  test.describe(`static components (${mode})`, () => {
    for (const name of STATIC_FIXTURES) {
      test(`${name}: renders and passes axe`, async ({ page, browserName }) => {
        await gotoFixture(page, name, mode);
        await expectRendered(page, name, browserName);
        await expectNoAxeViolations(page);
      });
    }
  });
}

test.describe('static components (native behavior)', () => {
  test('checkbox: label click toggles the input', async ({ page }) => {
    await gotoFixture(page, 'checkbox', 'baseline');
    const terms = page.locator('#terms');
    await expect(terms).not.toBeChecked();
    await page.locator('.hl-checkbox', { hasText: 'Accept terms' }).click();
    await expect(terms).toBeChecked();
  });

  test('radio group: arrow keys move the selection through the group', async ({ page }) => {
    await gotoFixture(page, 'radio-group', 'baseline');
    await page.locator('#free').focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#pro')).toBeChecked();
    await expect(page.locator('#pro')).toBeFocused();
  });

  test('switch: click flips the checked state', async ({ page }) => {
    await gotoFixture(page, 'switch', 'baseline');
    const notify = page.locator('#notify');
    await expect(notify).not.toBeChecked();
    await notify.click();
    await expect(notify).toBeChecked();
  });

  test('segmented control: clicking a segment selects it', async ({ page }) => {
    await gotoFixture(page, 'segmented-control', 'baseline');
    await page.locator('.hl-segmented-item', { hasText: 'Grid' }).click();
    await expect(page.locator('input[value="grid"]')).toBeChecked();
    await expect(page.locator('input[value="list"]')).not.toBeChecked();
  });

  test('slider: keyboard adjusts the value', async ({ page }) => {
    await gotoFixture(page, 'slider', 'baseline');
    const slider = page.locator('#volume');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('41');
  });

  test('select: choosing an option updates the value', async ({ page }) => {
    await gotoFixture(page, 'select', 'baseline');
    await page.locator('#fruit').selectOption('banana');
    await expect(page.locator('#fruit')).toHaveValue('banana');
  });

  test('skip link: activating it moves focus to the content', async ({ page, browserName }) => {
    await gotoFixture(page, 'skip-link', 'baseline');
    await page.keyboard.press(tabKey(browserName));
    await expect(page.locator('.hl-skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#content')).toBeFocused();
  });
});
