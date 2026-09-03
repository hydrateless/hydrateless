import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@hydrateless/enhancers'],
  // Every component touches the DOM through effects, so the whole bundle is a
  // client module. Embedding the directive lets React Server Components apps
  // import from the package root without wrapping each component themselves.
  banner: { js: "'use client';" },
});
