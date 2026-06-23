import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Fixture pages, served from the repo root by `server.mjs`. */
export type Fixture =
  | 'modal'
  | 'drawer'
  | 'popover'
  | 'dropdown'
  | 'tooltip'
  | 'tabs'
  | 'combobox'
  | 'disclosure';

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
 * Assert the page (or a subtree) has no axe violations. Returns the rule ids so
 * a failure message names exactly what regressed.
 */
export async function expectNoAxeViolations(page: Page, include?: string): Promise<void> {
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
