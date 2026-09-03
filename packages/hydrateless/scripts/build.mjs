import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const srcDir = 'src';
const distDir = 'dist';

mkdirSync(distDir, { recursive: true });

// The library already requires engines with the Popover API, `:has()`, and
// anchor positioning, so the preset only needs to cover the trailing edge of
// evergreen browsers. Left at browserslist defaults it would down-level the
// very features the CSS is built on (see the disabled list below), turning
// logical properties physical (breaking RTL) and inflating the bundle several
// times over with `light-dark()` and `:is()` polyfills.
const browsers = [
  'last 2 Chrome versions',
  'last 2 Edge versions',
  'last 2 Firefox versions',
  'last 2 Safari versions',
  'last 2 iOS versions',
];

const basePlugins = [
  postcssImport(),
  postcssPresetEnv({
    stage: 2,
    browsers,
    features: {
      // Native `@layer` is the documented cascade contract; the polyfill
      // flattens layers into specificity hacks and breaks the layer order.
      'cascade-layers': false,
      // Theming is built on `light-dark()` + `color-scheme`; the polyfill
      // expands every color into toggle variables and inlines token values.
      'light-dark-function': false,
      // Logical properties are the RTL strategy and must ship as authored.
      'logical-properties-and-values': false,
      'logical-overflow': false,
      'logical-overscroll-behavior': false,
      'logical-viewport-units': false,
      'logical-resize': false,
      'float-clear-logical-values': false,
      // Selector polyfills multiply rule counts and change specificity.
      'is-pseudo-class': false,
      'dir-pseudo-class': false,
      'has-pseudo-class': false,
      // Tokens must stay live custom properties so authors can override them.
      'custom-properties': false,
      'color-mix': false,
    },
  }),
  autoprefixer({ overrideBrowserslist: browsers }),
];

const files = readdirSync(srcDir).filter((f) => f.endsWith('.css'));

for (const file of files) {
  const from = join(srcDir, file);
  const to = join(distDir, file);
  const css = readFileSync(from, 'utf8');
  const result = await postcss(basePlugins).process(css, { from, to });
  writeFileSync(to, result.css);
}

// Minified, fully-concatenated bundle for CDN consumers (unpkg / jsDelivr).
const entry = join(srcDir, 'hydrateless.css');
const entryCss = readFileSync(entry, 'utf8');
const minified = await postcss([...basePlugins, cssnano({ preset: 'default' })]).process(entryCss, {
  from: entry,
  to: join(distDir, 'hydrateless.min.css'),
});
writeFileSync(join(distDir, 'hydrateless.min.css'), minified.css);
