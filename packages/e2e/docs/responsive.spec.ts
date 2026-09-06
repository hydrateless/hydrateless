import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 320, height: 850 } });

test('segmented controls keep every option reachable in narrow previews', async ({ page }) => {
  await page.goto('/components/segmented-control');
  const demos = page.locator('.hl-demo-block');
  await expect(demos.first()).toHaveAttribute('data-demo-ready', '');
  // A wider font exposes overflow even on platforms whose system font fits.
  await page.locator('.hl-demo-preview').evaluateAll((elements) => {
    for (const element of elements)
      (element as HTMLElement).style.setProperty('--hl-font-sans', 'monospace');
  });
  for (const direction of ['ltr', 'rtl']) {
    for (const demo of await demos.all()) {
      if (direction === 'rtl') await demo.getByRole('button', { name: 'LTR', exact: true }).click();
      const stage = demo.locator('.hl-demo-stage');
      const group = stage.locator('.hl-segmented');
      const options = group.getByRole('radio');
      await expect(options).toHaveCount(3);
      // Native horizontal radio navigation differs in RTL between engines.
      // Down consistently selects the next native option; button segments use
      // the enhancer's direction-aware horizontal navigation.
      const nextKey = (await group.locator('input[type="radio"]').count())
        ? 'ArrowDown'
        : direction === 'rtl'
          ? 'ArrowLeft'
          : 'ArrowRight';
      const size = demo.getByLabel('Size', { exact: true });
      for (const value of (await size.count()) ? ['sm', 'md', 'lg'] : ['md']) {
        if (await size.count()) await size.selectOption(value);
        expect(await stage.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(
          1,
        );
        await options.first().focus();
        for (let index = 1; index < 3; index++) {
          await page.keyboard.press(nextKey);
          await expect(options.nth(index)).toBeChecked();
          await expect
            .poll(
              () =>
                options.nth(index).evaluate((el) => {
                  const option = el.closest('.hl-segmented-item')!.getBoundingClientRect();
                  const track = el.closest('.hl-segmented')!.getBoundingClientRect();
                  return option.left >= track.left && option.right <= track.right;
                }),
              { message: `${direction}, ${value}, option ${index + 1}` },
            )
            .toBe(true);
        }
      }
    }
  }
});

test('table of contents stacks its navigation and content on narrow screens', async ({ page }) => {
  await page.goto('/components/toc');
  const demo = page.locator('.hl-demo-block');
  await expect(demo).toHaveAttribute('data-demo-ready', '');
  await demo.locator('.hl-demo-preview').evaluate((element) => {
    (element as HTMLElement).style.setProperty('--hl-font-sans', 'monospace');
  });
  const stage = demo.locator('.hl-demo-stage');
  for (const direction of ['ltr', 'rtl']) {
    if (direction === 'rtl') await demo.getByRole('button', { name: 'LTR', exact: true }).click();
    expect(await stage.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    const nav = (await stage.locator('nav').boundingBox())!;
    const article = (await stage.locator('article').boundingBox())!;
    expect(article.y).toBeGreaterThanOrEqual(nav.y + nav.height);
    for (const heading of await stage.locator('h2, h3').all())
      expect(await heading.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(
        1,
      );
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  const nav = (await stage.locator('nav').boundingBox())!;
  const article = (await stage.locator('article').boundingBox())!;
  expect(article.y).toBe(nav.y);
});
