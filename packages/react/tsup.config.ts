import { readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const shared = {
  format: ['esm'] as ['esm'],
  dts: true,
  treeshake: true,
  external: ['react', 'react-dom', '@hydrateless/enhancers'],
};

/**
 * Split server-safe components (no hooks, no `'use client'`) from interactive
 * client components (`'use client'`). The root barrel re-exports both without
 * carrying `'use client'` itself, so React Server Components can import static
 * primitives (`Button`, `Card`, `ModalTrigger`, etc.) with zero client boundary
 * while interactive components automatically cross the boundary when imported.
 */
export default defineConfig([
  {
    ...shared,
    entry: ['src/server.ts'],
    clean: true,
  },
  {
    ...shared,
    entry: ['src/client.ts'],
    clean: false,
    // Rollup drops top-level `'use client'` directives during `treeshake`, so
    // prepend it after the chunk is written.
    async onSuccess() {
      const path = 'dist/client.js';
      const code = readFileSync(path, 'utf8');
      if (!code.startsWith("'use client';")) {
        writeFileSync(path, `'use client';\n${code}`);
      }
    },
  },
  {
    ...shared,
    entry: ['src/index.ts'],
    clean: false,
    external: [...shared.external, './server.js', './client.js'],
  },
]);
