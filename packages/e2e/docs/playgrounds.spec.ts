import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { allComponents } from '../../docs/.vitepress/data/registry';
import type { KnobValues } from '../../docs/.vitepress/data/types';

for (const component of allComponents) {
  test(`${component.slug}: previews, controls, snippets, themes, JS, and mobile layout`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/components/${component.slug}`);
    await expect(page.locator('.hl-cmp h1')).toHaveText(component.name);
    const demos = page.locator('.hl-demo-block');
    await expect(demos).toHaveCount(component.demos.length);

    for (const [index, definition] of component.demos.entries()) {
      const demo = demos.nth(index);
      const preview = demo.locator('.hl-demo-preview');
      expect(await demo.locator('.hl-demo-stage > *').count()).toBeGreaterThan(0);
      await demo.getByRole('button', { name: 'Show code', exact: true }).click();
      const code = demo.locator('.hl-code code');
      const values: KnobValues = Object.fromEntries(
        (definition.knobs ?? []).map((knob) => [knob.id, knob.default]),
      );

      const verifyCode = async () => {
        for (const framework of ['html', 'react', 'vue', 'svelte'] as const) {
          const renderer = definition.code?.[framework];
          if (framework !== 'html' && !renderer) continue;
          const switcher = demo.getByRole('group', { name: 'Code language' });
          if (await switcher.count()) {
            await switcher
              .getByRole('button', {
                name: framework === 'html' ? 'HTML' : framework,
                exact: false,
              })
              .click();
          }
          await expect(code).toHaveText((renderer ?? definition.render)(values).trimEnd());
        }
      };
      await verifyCode();
      for (const knob of definition.knobs ?? []) {
        const control = demo.locator('.hl-knobs').getByLabel(knob.label, { exact: true });
        if (knob.type === 'boolean')
          await expect(control).toBeChecked({ checked: Boolean(knob.default) });
        else await expect(control).toHaveValue(String(knob.default));
        const choices =
          knob.type === 'select'
            ? knob.options.map((option) => (typeof option === 'string' ? option : option.value))
            : knob.type === 'boolean'
              ? [!knob.default, knob.default]
              : knob.type === 'number'
                ? [knob.min ?? 0, knob.max ?? 100]
                : ['A "quote" & <tag> {literal}', ''];
        for (const value of choices) {
          values[knob.id] = value;
          if (knob.type === 'select') await control.selectOption(String(value));
          else if (knob.type === 'boolean') await control.setChecked(Boolean(value));
          else if (knob.type === 'number')
            await control.press(value === (knob.min ?? 0) ? 'Home' : 'End');
          else await control.fill(String(value));
          await verifyCode();
          await expect(demo.locator('.hl-demo-stage tag')).toHaveCount(0);
        }
      }
      await demo.getByRole('button', { name: 'Theme: Auto', exact: true }).click();
      await expect(preview).toHaveCSS('color-scheme', 'light');
      await demo.getByRole('button', { name: 'Theme: Light', exact: true }).click();
      await expect(preview).toHaveCSS('color-scheme', 'dark');
      await demo.getByRole('button', { name: 'LTR', exact: true }).click();
      await expect(preview).toHaveCSS('direction', 'rtl');
      await demo.getByRole('button', { name: 'JS: On', exact: true }).click();
      await expect(demo.locator('[data-hl-ready]')).toHaveCount(0);
      await demo.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(demo.getByRole('button', { name: 'JS: On', exact: true })).toBeVisible();
      await expect(preview).toHaveCSS('direction', 'ltr');
      await demo.getByRole('button', { name: 'Hide code', exact: true }).click();
    }

    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await expect(demos.first().locator('.hl-demo-preview')).toHaveCSS(
        'color-scheme',
        colorScheme,
      );
      const accessibility = await new AxeBuilder({ page })
        .include('.hl-cmp')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        accessibility.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html) })),
        colorScheme,
      ).toEqual([]);
    }
    for (const width of [375, 320]) {
      await page.setViewportSize({ width, height: 850 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `page fits ${width}px`,
      ).toBe(true);
      for (const demo of await demos.all()) {
        expect(
          await demo
            .locator('.hl-demo-frame')
            .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
          `frame fits ${width}px`,
        ).toBe(true);
      }
    }
    expect(errors).toEqual([]);
  });
}
