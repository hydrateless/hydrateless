import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
  },
  {
    // Self-contained bundle for unpkg / jsDelivr: enhancers are inlined so a
    // single <script type="module"> works with no import map.
    entry: { hydrateless: 'src/cdn.ts' },
    format: ['esm'],
    minify: true,
    noExternal: [/@hydrateless\/enhancers/],
  },
]);
