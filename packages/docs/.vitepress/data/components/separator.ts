import type { ComponentDoc } from '../types';

export const separator: ComponentDoc = {
  slug: 'separator',
  name: 'Separator',
  category: 'Navigation',
  importName: 'Separator',
  summary: 'A thin divider between content.',
  description:
    'A thin divider between content. Use a native `<hr>` for horizontal rules, or a `role="separator"` element for vertical ones. CSS-only.',
  status: 'stable',
  cssOnly: true,
  native: '<hr>',
  cssFile: 'separator.css',
  demos: [
    {
      id: 'default',
      title: 'Separator',
      layout: 'fill',
      render: () =>
        `<div style="width:100%">
  <p style="margin:0">Above</p>
  <hr class="hl-separator" />
  <p style="margin:0">Below</p>
</div>
<div style="display:flex;align-items:center;gap:.75rem;margin-top:1rem">
  <span>Edit</span>
  <div class="hl-separator" role="separator" aria-orientation="vertical"></div>
  <span>Delete</span>
</div>`,
      code: {
        react: () =>
          `import { Separator } from '@hydrateless/react';\n\n<>\n  <Separator />\n  <Separator orientation="vertical" />\n</>`,
        vue: () =>
          `<script setup>\nimport { Separator } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Separator />\n  <Separator orientation="vertical" />\n</template>`,
        svelte: () =>
          `<script>\n  import { Separator } from '@hydrateless/svelte';\n</script>\n\n<Separator />\n<Separator orientation="vertical" />`,
      },
    },
  ],
  props: [
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Divider direction.',
    },
  ],
  tokens: [{ name: '--hl-border', description: 'Divider color.' }],
  a11y: [
    'A native `<hr>` already has separator semantics.',
    'For vertical dividers, set `role="separator"` and `aria-orientation="vertical"`.',
  ],
  related: ['skip-link'],
};
