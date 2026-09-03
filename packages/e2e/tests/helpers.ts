import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Fixture pages with a JavaScript enhancer, served from the repo root by `server.mjs`. */
export type EnhancedFixture =
  | 'accordion'
  | 'combobox'
  | 'command-palette'
  | 'disclosure'
  | 'drawer'
  | 'dropdown'
  | 'menu'
  | 'modal'
  | 'popover'
  | 'tabs'
  | 'toast'
  | 'toc'
  | 'tooltip';

/** CSS-only fixture pages that render identically with and without JavaScript. */
export const STATIC_FIXTURES = [
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'card',
  'checkbox',
  'field',
  'input',
  'kbd',
  'pagination',
  'progress',
  'radio-group',
  'segmented-control',
  'select',
  'separator',
  'skeleton',
  'skip-link',
  'slider',
  'spinner',
  'switch',
  'table',
  'textarea',
] as const;

/** A CSS-only fixture page name. */
export type StaticFixture = (typeof STATIC_FIXTURES)[number];

/** Any fixture page. */
export type Fixture = EnhancedFixture | StaticFixture;

type Mode = 'enhanced' | 'baseline';

/**
 * Navigate to a fixture and wait for its deterministic ready state. `enhanced`
 * loads the CDN auto bundle; `baseline` keeps the page pure HTML + CSS.
 */
export async function gotoFixture(
  page: Page,
  name: Fixture,
  mode: Mode = 'enhanced',
): Promise<void> {
  const query = mode === 'baseline' ? '?js=off' : '';
  await page.goto(`/packages/e2e/fixtures/${name}.html${query}`);
  await page.waitForSelector(`html[data-hl-mode="${mode}"]`, { state: 'attached' });
}

/** WCAG 2.1 A/AA tags every fixture is held to. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Wait for every finite CSS animation and transition on the page to finish.
 * Overlays fade in through `@starting-style`, and axe samples colors as they
 * are at that instant, so a contrast check taken mid-fade fails for the wrong
 * reason. Infinite animations (the spinner) are left alone.
 */
export async function settleAnimations(page: Page): Promise<void> {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
}

/**
 * Assert the page (or a subtree) has no axe violations. Returns the rule ids so
 * a failure message names exactly what regressed.
 */
export async function expectNoAxeViolations(page: Page, include?: string): Promise<void> {
  await settleAnimations(page);
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  expect(
    violations.map((v) => v.id),
    violations.map((v) => `${v.id}: ${v.help}`).join('\n'),
  ).toEqual([]);
}

/** Whether the browser under test implements HTML Invoker Commands. */
export function supportsInvokers(page: Page): Promise<boolean> {
  return page.evaluate(() => 'commandForElement' in HTMLButtonElement.prototype);
}

/** Whether the browser under test implements the Popover API. */
export function supportsPopover(page: Page): Promise<boolean> {
  return page.evaluate(() => 'popover' in HTMLElement.prototype);
}

/**
 * Open a `<dialog>` the way a keyboard user would: focus the invoker, then
 * press Enter. Focusing first matters because WebKit doesn't focus buttons on
 * click, and the dialog returns focus to whatever was focused when it opened.
 * Engines without Invoker Commands fall back to `showModal()` with the invoker
 * still focused, which records the same return target.
 */
export async function openDialog(page: Page, invoker: string, dialog: string): Promise<void> {
  await page.locator(invoker).focus();
  if (await supportsInvokers(page)) {
    await page.keyboard.press('Enter');
  } else {
    await page.locator(dialog).evaluate((d) => (d as HTMLDialogElement).showModal());
  }
  await expect(page.locator(dialog)).toHaveJSProperty('open', true);
}

/** Computed `background-color` of `<body>`, as the browser serializes it. */
export function bodyBackground(page: Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

/**
 * Relative luminance (0 = black, 1 = white) of an `rgb()`/`rgba()` string, so
 * theme assertions can say "darker than" instead of pinning exact colors.
 */
export function luminance(color: string): number {
  const channels = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  if (!channels || channels.length !== 3) throw new Error(`Not an rgb color: ${color}`);
  const [r, g, b] = channels.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
