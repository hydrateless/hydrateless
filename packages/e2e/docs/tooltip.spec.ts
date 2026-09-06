import { expect, test } from '@playwright/test';

test('native tooltip stays hidden until hovered or focused', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/components/tooltip');
  const trigger = page.locator('.hl-demo-stage button');
  const tip = page.locator('.hl-demo-stage [role="tooltip"]');
  await expect(tip).toBeHidden();
  await trigger.focus();
  await expect(tip).toBeVisible();
  await page.getByRole('link', { name: 'Skip to content', exact: true }).focus();
  await expect(tip).toBeHidden();
  await trigger.hover();
  await expect(tip).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(tip).toBeHidden();
  await context.close();
});
