import type { ComponentDoc } from '../types';

export const kbd: ComponentDoc = {
  slug: 'kbd',
  name: 'Kbd',
  category: 'Data Display',
  importName: 'Kbd',
  summary: 'A styled keyboard key for documenting shortcuts.',
  description:
    'A styled keyboard key for documenting shortcuts, built on the native `<kbd>` element. CSS-only.',
  status: 'stable',
  cssOnly: true,
  native: '<kbd>',
  cssFile: 'kbd.css',
  demos: [
    {
      id: 'default',
      title: 'Kbd',
      layout: 'center',
      render: () => `<kbd class="hl-kbd">⌘</kbd> <kbd class="hl-kbd">K</kbd>`,
      code: {
        react: () =>
          `import { Kbd } from '@hydrateless/react';\n\n<>\n  <Kbd>⌘</Kbd> <Kbd>K</Kbd>\n</>`,
        vue: () =>
          `<script setup>\nimport { Kbd } from '@hydrateless/vue';\n</script>\n\n<template><Kbd>⌘</Kbd> <Kbd>K</Kbd></template>`,
        svelte: () =>
          `<script>\n  import { Kbd } from '@hydrateless/svelte';\n</script>\n\n<Kbd>⌘</Kbd> <Kbd>K</Kbd>`,
      },
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Key background.' },
    { name: '--hl-border', description: 'Key border and bottom edge.' },
    { name: '--hl-radius-sm', description: 'Corner radius.' },
  ],
  a11y: ['Use real `<kbd>` elements so shortcuts are semantic, not just styled text.'],
  related: ['command-palette', 'tooltip'],
};
