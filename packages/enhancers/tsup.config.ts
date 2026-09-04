import { defineConfig } from 'tsup';
import { MANIFEST } from './src/manifest.js';

/**
 * One entry per enhancer subpath, derived from the manifest so a new
 * component only has to be added there (plus `package.json` `exports`).
 */
const componentEntries = Object.fromEntries(
  MANIFEST.map(({ name }) => [`${name}/index`, `src/${name}/index.ts`]),
);

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    manifest: 'src/manifest.ts',
    'core/index': 'src/core/index.ts',
    ...componentEntries,
  },
  format: ['esm'],
  dts: true,
  clean: true,
});
