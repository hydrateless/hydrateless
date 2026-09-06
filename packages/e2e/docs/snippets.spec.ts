import { expect, test } from '@playwright/test';
import ts from 'typescript';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import { compile as compileSvelte } from 'svelte/compiler';
import { allComponents } from '../../docs/.vitepress/data/registry';

test('framework examples compile, including literal editable text', () => {
  for (const component of allComponents) {
    for (const demo of component.demos) {
      const defaults = Object.fromEntries(
        (demo.knobs ?? []).map((knob) => [knob.id, knob.default]),
      );
      const edited = { ...defaults };
      for (const knob of demo.knobs ?? []) {
        if (knob.type === 'text') edited[knob.id] = 'A "quote" & <tag> {literal}';
      }
      for (const [index, values] of [defaults, edited].entries()) {
        const id = `${component.slug}-${demo.id}-${index}`;
        if (demo.code?.react) {
          const result = ts.transpileModule(demo.code.react(values), {
            fileName: `${id}.tsx`,
            reportDiagnostics: true,
            compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ESNext },
          });
          expect(result.diagnostics, `${id}: React syntax`).toEqual([]);
        }
        if (demo.code?.vue) {
          const { descriptor, errors } = parse(demo.code.vue(values), { filename: `${id}.vue` });
          expect(errors, `${id}: Vue syntax`).toEqual([]);
          expect(() => compileScript(descriptor, { id }), `${id}: Vue script`).not.toThrow();
          const result = compileTemplate({
            source: descriptor.template!.content,
            filename: `${id}.vue`,
            id,
          });
          expect(result.errors, `${id}: Vue template`).toEqual([]);
        }
        if (demo.code?.svelte) {
          expect(
            () =>
              compileSvelte(demo.code!.svelte!(values), {
                filename: `${id}.svelte`,
                generate: 'server',
              }),
            `${id}: Svelte syntax`,
          ).not.toThrow();
        }
      }
    }
  }
});
