import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  test: {
    projects: [
      // Component behavior in a DOM, with the client build of Svelte.
      {
        plugins: [svelte(), svelteTesting()],
        test: {
          name: 'dom',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/ssr.test.ts', '**/node_modules/**'],
        },
      },
      // Server rendering: no DOM, components compiled for `svelte/server`, so
      // the markup the browser receives before hydration is what's asserted.
      {
        plugins: [svelte()],
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['tests/ssr.test.ts'],
        },
      },
    ],
  },
});
