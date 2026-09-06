import { test, expect, type Page } from '@playwright/test';
import { gotoFixture, openDialog, type Fixture } from './helpers.js';

/**
 * Right-to-left layout. The stylesheet is written with logical properties, so
 * flipping `dir` on the root must mirror every horizontal decision: drawer
 * sides, the switch thumb, and the reading order of inline lists. These checks
 * measure real boxes rather than inspecting CSS, so a physical `left`/`right`
 * slipping back in shows up as a wrong position, not a wrong string.
 */

/** Load a fixture, then flip the document to RTL before any interaction. */
async function gotoRtl(page: Page, name: Fixture, mode?: 'enhanced' | 'baseline'): Promise<void> {
  await gotoFixture(page, name, mode);
  await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
}

/** Left edge of an element's box, polled so entry transitions can settle. */
function leftEdge(page: Page, selector: string) {
  return expect.poll(async () => (await page.locator(selector).boundingBox())?.x ?? NaN);
}

/** Right edge of an element's box, polled so entry transitions can settle. */
function rightEdge(page: Page, selector: string) {
  return expect.poll(async () => {
    const box = await page.locator(selector).boundingBox();
    return box ? box.x + box.width : NaN;
  });
}

/**
 * Horizontal center of the switch thumb (the input's `::after`) relative to the
 * left edge of the track, in CSS pixels. Reads the used inset plus whatever
 * `transform`/`translate` the checked state applies, so it works no matter
 * which mechanism the stylesheet uses to move the thumb.
 */
function thumbCenter(page: Page, selector: string): Promise<number> {
  return page.locator(selector).evaluate((input) => {
    const track = input.getBoundingClientRect();
    const cs = getComputedStyle(input, '::after');
    const width = parseFloat(cs.width);
    let left = parseFloat(cs.left);
    if (Number.isNaN(left)) left = track.width - parseFloat(cs.right) - width;
    let dx = 0;
    if (cs.transform && cs.transform !== 'none') dx += new DOMMatrixReadOnly(cs.transform).m41;
    const translate = cs.getPropertyValue('translate');
    if (translate && translate !== 'none') dx += parseFloat(translate);
    return left + width / 2 + dx;
  });
}

test.describe('right-to-left', () => {
  test('drawer: side="end" opens on the left edge, side="start" on the right', async ({ page }) => {
    await gotoRtl(page, 'drawer');
    const viewport = page.viewportSize();
    if (!viewport) throw new Error('viewport size unavailable');

    await openDialog(page, '#open', '#dr');
    await leftEdge(page, '#dr').toBeLessThan(2);
    await rightEdge(page, '#dr').toBeLessThan(viewport.width / 2);
    await page.keyboard.press('Escape');
    await expect(page.locator('#dr')).toHaveJSProperty('open', false);

    await openDialog(page, '#open-start', '#dr-start');
    await rightEdge(page, '#dr-start').toBeGreaterThan(viewport.width - 2);
    await leftEdge(page, '#dr-start').toBeGreaterThan(viewport.width / 2);
  });

  test('drawer: in LTR the same sides resolve to right and left', async ({ page }) => {
    await gotoFixture(page, 'drawer');
    const viewport = page.viewportSize();
    if (!viewport) throw new Error('viewport size unavailable');

    await openDialog(page, '#open', '#dr');
    await rightEdge(page, '#dr').toBeGreaterThan(viewport.width - 2);
    await page.keyboard.press('Escape');
    await expect(page.locator('#dr')).toHaveJSProperty('open', false);

    await openDialog(page, '#open-start', '#dr-start');
    await leftEdge(page, '#dr-start').toBeLessThan(2);
  });

  test('switch: the thumb starts on the right and travels left when checked', async ({ page }) => {
    await gotoRtl(page, 'switch', 'baseline');
    const midpoint = async (selector: string) => {
      const box = await page.locator(selector).boundingBox();
      if (!box) throw new Error(`${selector} has no box`);
      return box.width / 2;
    };

    // #notify is unchecked, #dark is checked in the markup.
    await expect
      .poll(() => thumbCenter(page, '#notify'))
      .toBeGreaterThan(await midpoint('#notify'));
    await expect.poll(() => thumbCenter(page, '#dark')).toBeLessThan(await midpoint('#dark'));

    // Flipping the state flips the side, in the RTL direction.
    await page.locator('#notify').click();
    await expect(page.locator('#notify')).toBeChecked();
    await expect
      .poll(async () => (await thumbCenter(page, '#notify')) < (await midpoint('#notify')))
      .toBe(true);
  });

  test('switch: in LTR the thumb starts on the left and travels right', async ({ page }) => {
    await gotoFixture(page, 'switch', 'baseline');
    const box = await page.locator('#notify').boundingBox();
    if (!box) throw new Error('#notify has no box');
    expect(await thumbCenter(page, '#notify')).toBeLessThan(box.width / 2);
    expect(await thumbCenter(page, '#dark')).toBeGreaterThan(box.width / 2);
  });

  test('breadcrumb: the trail reads right to left', async ({ page }) => {
    await gotoRtl(page, 'breadcrumb', 'baseline');
    const items = page.locator('nav[data-hl-breadcrumb] li');
    const first = await items.first().boundingBox();
    const last = await items.last().boundingBox();
    if (!first || !last) throw new Error('breadcrumb items have no boxes');

    // "Home" is the first item, so in RTL it sits furthest to the right.
    expect(first.x).toBeGreaterThan(last.x + last.width);
    expect(first.y).toBeCloseTo(last.y, 0);
  });

  test('pagination: page numbers read right to left', async ({ page }) => {
    await gotoRtl(page, 'pagination', 'baseline');
    const items = page.locator('.hl-pagination li');
    const first = await items.first().boundingBox();
    const last = await items.last().boundingBox();
    if (!first || !last) throw new Error('pagination items have no boxes');

    expect(first.x).toBeGreaterThan(last.x + last.width);
    expect(first.y).toBeCloseTo(last.y, 0);
  });
});
