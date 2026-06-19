import type { ComponentDoc } from '../types';

export const spinner: ComponentDoc = {
  slug: 'spinner',
  name: 'Spinner',
  category: 'Feedback',
  importName: 'Spinner',
  summary: 'A loading indicator that inherits currentColor.',
  description:
    'A loading indicator that inherits `currentColor`. Use `role="status"` with an `aria-label` so it is announced. CSS-only.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'spinner.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [
        {
          id: 'size',
          type: 'select',
          label: 'Size',
          options: ['sm', 'md', 'lg', 'xl'],
          default: 'md',
        },
      ],
      render: (v) =>
        `<span class="hl-spinner"${v.size !== 'md' ? ` data-hl-size="${v.size}"` : ''} role="status" aria-label="Loading"></span>`,
      code: {
        react: (v) =>
          `import { Spinner } from '@hydrateless/react';\n\n<Spinner${v.size !== 'md' ? ` size="${v.size}"` : ''} />`,
        vue: (v) =>
          `<script setup>\nimport { Spinner } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Spinner${v.size !== 'md' ? ` size="${v.size}"` : ''} />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Spinner } from '@hydrateless/svelte';\n</script>\n\n<Spinner${v.size !== 'md' ? ` size="${v.size}"` : ''} />`,
      },
    },
  ],
  props: [
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg' | 'xl'`,
      default: `'md'`,
      description: 'Diameter of the spinner.',
    },
  ],
  tokens: [{ name: 'currentColor', description: 'The spinner inherits the parent text color.' }],
  a11y: [
    'Wrap it in `role="status"` with an `aria-label` so the loading state is announced.',
    'The animation pauses under `prefers-reduced-motion`.',
  ],
  related: ['progress', 'skeleton'],
};
