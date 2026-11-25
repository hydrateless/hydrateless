import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { allComponents } from '../../docs/.vitepress/data/registry';

test('every knob changes the HTML and each available framework example', () => {
  for (const component of allComponents) {
    for (const demo of component.demos) {
      const defaults = Object.fromEntries(
        (demo.knobs ?? []).map((knob) => [knob.id, knob.default]),
      );
      for (const knob of demo.knobs ?? []) {
        const next =
          knob.type === 'boolean'
            ? !knob.default
            : knob.type === 'select'
              ? knob.options
                  .map((option) => (typeof option === 'string' ? option : option.value))
                  .find((value) => value !== knob.default)!
              : knob.type === 'number'
                ? knob.default === knob.min
                  ? knob.max!
                  : (knob.min ?? 0)
                : 'New label <with> "quotes" & {braces}';
        for (const [framework, render] of Object.entries({ html: demo.render, ...demo.code })) {
          expect(
            render({ ...defaults, [knob.id]: next }),
            `${component.slug}/${demo.id}/${knob.id}/${framework}`,
          ).not.toEqual(render(defaults));
        }
      }
    }
  }
});

test('framework preference persists across navigation without leaking controls or hydration errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) errors.push(message.text());
  });
  await page.goto('/components/button');
  const first = page.locator('.hl-demo-block').first();
  await first.getByRole('button', { name: 'Show code' }).click();
  await first
    .getByRole('group', { name: 'Code language' })
    .getByRole('button', { name: 'Svelte', exact: true })
    .click();
  await first.getByLabel('Disabled', { exact: true }).check();
  await page.locator('.hl-related-card').filter({ hasText: 'Badge' }).click();
  await expect(page.locator('.hl-cmp h1')).toHaveText('Badge');
  await expect(page.locator('.hl-knobs').getByLabel('Label', { exact: true })).toHaveValue(
    'Active',
  );
  await first.getByRole('button', { name: 'Show code' }).click();
  await expect(first.locator('.hl-code code')).toContainText("from '@hydrateless/svelte'");
  await page.reload();
  await first.getByRole('button', { name: 'Show code' }).click();
  await expect(first.getByRole('button', { name: 'Svelte', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(errors).toEqual([]);
});

test('copy buttons copy the displayed source and report clipboard errors', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.copied = text;
        },
      },
    });
  });
  await page.goto('/components/button');
  const demo = page.locator('.hl-demo-block').first();
  await demo.getByRole('button', { name: 'Show code' }).click();
  await demo.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-copied',
    (await demo.locator('.hl-code code').textContent())!,
  );
  await expect(demo.getByRole('status')).toHaveText('Code copied.');
  await demo.getByLabel('Label', { exact: true }).fill('Changed');
  await expect(demo.getByRole('status')).toBeEmpty();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          throw new Error('Denied');
        },
      },
    });
  });
  await demo.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(demo.getByRole('status')).toContainText('Clipboard unavailable');
  await page.goto('/guide/getting-started');
  const install = page.locator('.hl-install').first();
  for (const [manager, command] of [
    ['npm', 'npm install'],
    ['pnpm', 'pnpm add'],
    ['yarn', 'yarn add'],
    ['bun', 'bun add'],
  ]) {
    await install.getByRole('button', { name: manager, exact: true }).click();
    await expect(install.locator('code')).toContainText(command);
    await expect(install.getByRole('button', { name: manager, exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  }
});

test('native previews remain usable with all page JavaScript disabled', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  for (const component of allComponents) {
    await page.goto(`/components/${component.slug}`);
    await expect(page.locator('.hl-cmp h1')).toHaveText(component.name);
    await expect(page.locator('.hl-demo-stage')).toHaveCount(component.demos.length);
    await expect(page.locator('[data-hl-ready]')).toHaveCount(0);
  }
  await page.goto('/components/combobox');
  const input = page.locator('.hl-demo-stage input');
  await input.focus();
  const list = page.locator('.hl-demo-stage [role="listbox"]');
  await expect(list).toBeVisible();
  const anchor = (await input.boundingBox())!;
  const panel = (await list.boundingBox())!;
  expect(Math.abs(panel.x - anchor.x)).toBeLessThan(3);
  expect(Math.abs(panel.width - anchor.width)).toBeLessThan(3);
  expect(panel.y >= anchor.y + anchor.height || panel.y + panel.height <= anchor.y + 1).toBe(true);
  await page.goto('/components/tooltip');
  const trigger = page.locator('.hl-demo-stage button');
  await trigger.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  const tip = (await page.getByRole('tooltip').boundingBox())!;
  const target = (await trigger.boundingBox())!;
  expect(Math.abs(tip.y - target.y)).toBeLessThan(100);
  await page.goto('/components/tabs');
  const baseline = page.locator('.hl-demo-stage').nth(1);
  await baseline.locator('label').nth(1).click();
  await expect(baseline.locator('.hl-tabpanel').nth(1)).toBeVisible();
  await expect(baseline.locator('.hl-tabpanel').first()).toBeHidden();
  await page.goto('/components/skip-link');
  const skip = page.locator('.hl-demo-stage a');
  await skip.focus();
  await skip.press('Enter');
  await expect(page.locator('#skip-demo-content')).toBeFocused();
  await context.close();
});

test('homepage and guide slot demos reset, preserve the selected panel, and pass accessibility checks', async ({
  page,
}) => {
  for (const path of ['/', '/guide/getting-started']) {
    await page.goto(path);
    const demo = page.locator('.hl-demo-block').filter({ has: page.locator('[data-hl-tabs]') });
    await expect(demo).toHaveAttribute('data-demo-ready', '');
    const stage = demo.locator('.hl-demo-stage');
    await stage.getByRole('tab').nth(1).click();
    await expect(stage.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    await demo.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(stage.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
    await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
    await expect(stage.getByRole('tabpanel')).toHaveCount(1);
    const result = await new AxeBuilder({ page })
      .include('.hl-demo-block')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html) })),
      path,
    ).toEqual([]);
  }
});

test('local navigation and avatar assets resolve and the gallery lists all components', async ({
  page,
  request,
}) => {
  await page.goto('/components/');
  await expect(page.locator('.hl-gallery-card')).toHaveCount(allComponents.length);
  for (const path of [
    '/',
    '/guide/getting-started',
    '/playground/theme',
    ...allComponents.map((component) => `/components/${component.slug}`),
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
  await page.goto('/components/avatar');
  for (const img of await page.locator('.hl-demo-stage img').all()) {
    await expect(img).toHaveJSProperty('complete', true);
    expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
});

test('every button and badge color combination has readable text in light and dark mode', async ({
  page,
}) => {
  for (const slug of ['button', 'badge']) {
    await page.goto(`/components/${slug}`);
    const demo = page.locator('.hl-demo-block').first();
    await expect(demo).toHaveAttribute('data-demo-ready', '');
    const definition = allComponents.find((component) => component.slug === slug)!.demos[0];
    const markup = ['neutral', 'primary', 'danger', 'success', 'warning', 'info']
      .flatMap((intent) =>
        (slug === 'button'
          ? ['solid', 'soft', 'outline', 'ghost', 'link']
          : ['solid', 'soft', 'outline']
        ).map((variant) =>
          definition.render({ intent, variant, size: 'md', label: `${intent} ${variant}` }),
        ),
      )
      .join('');
    await demo.locator('.hl-demo-stage').evaluate((element, html) => {
      element.innerHTML = html;
    }, markup);
    for (const theme of ['light', 'dark']) {
      await demo.locator('.hl-demo-preview').evaluate(async (element, mode) => {
        (element as HTMLElement).dataset.hlTheme = mode;
        // Contrast applies to the settled theme, not interpolated transition colors.
        await Promise.all(
          element.getAnimations({ subtree: true }).map((animation) => animation.finished),
        );
      }, theme);
      const result = await new AxeBuilder({ page })
        .include('.hl-demo-stage')
        .withRules(['color-contrast'])
        .analyze();
      expect(
        result.violations.map((violation) => violation.nodes.map((node) => node.html)),
        `${slug}, ${theme}`,
      ).toEqual([]);
    }
  }
});

test('native popup anchors stay with their own instance', async ({ page }) => {
  for (const slug of ['combobox', 'tooltip']) {
    await page.goto(`/components/${slug}`);
    const demo = page.locator('.hl-demo-block').first();
    await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
    const stage = demo.locator('.hl-demo-stage');
    const definition = allComponents.find((component) => component.slug === slug)!.demos[0];
    const html = definition.render({});
    await stage.evaluate((element, markup) => {
      element.innerHTML = `<div style="margin-bottom:150px">${markup.replaceAll('demo-tip', 'first-tip')}</div><div>${markup.replaceAll('demo-tip', 'second-tip')}</div>`;
    }, html);
    // Native tooltips appear for keyboard focus (:focus-visible), not merely
    // programmatic focus while the browser is still in pointer modality.
    await page.keyboard.press('Tab');
    for (const index of [0, 1]) {
      const trigger = stage.locator(slug === 'combobox' ? 'input' : 'button').nth(index);
      await trigger.focus();
      const popup = stage
        .locator(slug === 'combobox' ? '[role="listbox"]' : '[role="tooltip"]')
        .nth(index);
      await expect(popup).toBeVisible();
      const anchor = (await trigger.boundingBox())!;
      const panel = (await popup.boundingBox())!;
      if (slug === 'combobox') {
        expect(Math.abs(panel.x - anchor.x)).toBeLessThan(3);
        expect(panel.y >= anchor.y + anchor.height || panel.y + panel.height <= anchor.y + 1).toBe(
          true,
        );
      } else {
        expect(Math.abs(panel.x + panel.width / 2 - anchor.x - anchor.width / 2)).toBeLessThan(3);
        expect(Math.abs(panel.y - anchor.y)).toBeLessThan(100);
      }
    }
  }
});

test('theme studio keeps generated text readable and focus colors in sync', async ({ page }) => {
  await page.goto('/playground/theme');
  const studio = page.locator('.hl-studio');
  const preview = studio.locator('.hl-studio-preview');
  for (const mode of ['light', 'dark']) {
    await studio.getByLabel('Mode', { exact: true }).selectOption(mode);
    for (const color of ['#ffff00', '#ffffff', '#000000', '#808080', '#ff0000', '#00ff00']) {
      await studio.getByLabel('Primary color', { exact: true }).fill(color);
      await preview.getByRole('button', { name: 'Save', exact: true }).hover();
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => {})),
        ),
      );
      const result = await new AxeBuilder({ page })
        .include('.hl-studio-preview')
        .withRules(['color-contrast'])
        .analyze();
      expect(
        result.violations.map((v) => v.nodes.map((n) => n.html)),
        `${mode}/${color}`,
      ).toEqual([]);
    }
  }
  await studio.getByLabel('Primary color', { exact: true }).fill('#ff0000');
  await preview.getByRole('switch').focus();
  await expect(preview.getByRole('switch')).toHaveCSS('outline-color', 'rgb(255, 0, 0)');
  await expect(studio.locator('.hl-code code')).toContainText('--hl-focus-shadow:');
});

test('local search indexes component pages and component outlines exclude demo headings', async ({
  page,
}) => {
  await page.goto('/components/button');
  const outline = page.locator('.VPDocAsideOutline');
  await expect(outline).toBeVisible();
  await expect(outline.getByRole('link', { name: 'Examples', exact: true })).toBeVisible();
  await expect(outline.getByRole('link', { name: 'Props', exact: true })).toBeVisible();
  await expect(outline.getByRole('link', { name: 'CSS variables', exact: true })).toBeVisible();
  await expect(outline.getByRole('link', { name: 'Accessibility', exact: true })).toBeVisible();

  await page.goto('/components/toc');
  await expect(page.locator('.hl-demo-block')).toHaveAttribute('data-demo-ready', '');
  await expect(outline.getByRole('link', { name: 'Examples', exact: true })).toBeVisible();
  await expect(outline.getByRole('link', { name: 'Introduction', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Search' }).click();
  const searchInput = page.locator('#localsearch-input');
  await searchInput.fill('enhanceModal');
  await expect(
    page.locator('.VPLocalSearchBox a[href^="/components/modal"]').first(),
  ).toBeVisible();
});

test('navbar active states, inline API code, related cards, and dark-mode studio defaults work', async ({
  page,
}) => {
  for (const [path, navLabel] of [
    ['/components/modal', 'Components'],
    ['/guide/theming', 'Guide'],
    ['/frameworks/vue', 'Frameworks'],
  ]) {
    await page.goto(path);
    await expect(page.locator('.VPNavBarMenu a.active', { hasText: navLabel }), path).toBeVisible();
  }

  await page.goto('/components/modal');
  await expect(
    page.locator('.hl-api-table td:last-child code', { hasText: 'onOpenChange' }),
  ).toBeVisible();
  for (const text of await page.locator('.hl-api-table td').allTextContents()) {
    expect(text).not.toContain('`');
  }
  await expect(page.locator('.hl-related-card').first()).toHaveCSS('text-decoration-line', 'none');

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('.hl-hero-preview')).toHaveCSS('color-scheme', 'dark');
  await expect(page.locator('.hl-demo-preview').first()).toHaveCSS('color-scheme', 'dark');
  await page.goto('/components/button');
  await expect(page.locator('.hl-demo-preview').first()).toHaveCSS('color-scheme', 'dark');

  await page.goto('/playground/theme');
  await expect(page.locator('.hl-studio').getByLabel('Mode', { exact: true })).toHaveValue('dark');
  await expect(page.locator('.hl-studio').getByLabel('Border color', { exact: true })).toHaveValue(
    '#1e293b',
  );
});

test('homepage hero preview and showcase pass accessibility and fit narrow screens', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.hl-hero-card')).toBeVisible();
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    const result = await new AxeBuilder({ page })
      .include('.VPHero')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html) })),
      colorScheme,
    ).toEqual([]);
  }
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 850 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `homepage fits ${width}px`,
    ).toBe(true);
  }
});
