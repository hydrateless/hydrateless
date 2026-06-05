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

const basePlugins = [
  postcssImport(),
  // Keep native `@layer` rules intact — the cascade-layers polyfill flattens
  // them into specificity hacks, which silently breaks the documented layer
  // order. `@layer` is widely supported, so we ship it as authored.
  postcssPresetEnv({ stage: 1, features: { 'cascade-layers': false } }),
  autoprefixer(),
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
