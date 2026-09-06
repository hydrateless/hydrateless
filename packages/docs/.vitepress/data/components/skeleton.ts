import type { ComponentDoc } from '../types';

export const skeleton: ComponentDoc = {
  slug: 'skeleton',
  name: 'Skeleton',
  category: 'Feedback',
  importName: 'Skeleton',
  summary: 'A placeholder shown while content loads.',
  description:
    'A placeholder shown while content loads. `data-hl-shape` picks a text line, a circle, or a rectangle. Mark it `aria-hidden="true"` so screen readers skip it. The shimmer respects `prefers-reduced-motion`. CSS-only.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'skeleton.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [
        {
          id: 'shape',
          type: 'select',
          label: 'Shape',
          options: ['text', 'rect', 'circle'],
          default: 'text',
        },
      ],
      render: (v) => {
        const dims =
          v.shape === 'circle'
            ? 'inline-size:3rem;block-size:3rem'
            : v.shape === 'rect'
              ? 'inline-size:12rem;block-size:5rem'
              : 'inline-size:12rem';
        return `<span class="hl-skeleton" data-hl-shape="${v.shape}" aria-hidden="true" style="${dims}"></span>`;
      },
      code: {
        react: (v) =>
          `import { Skeleton } from '@hydrateless/react';\n\n<Skeleton shape="${v.shape}"${v.shape === 'circle' ? ' width="3rem" height="3rem"' : v.shape === 'rect' ? ' width="12rem" height="5rem"' : ' width="12rem"'} />`,
        vue: (v) =>
          `<script setup>\nimport { Skeleton } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Skeleton shape="${v.shape}"${v.shape === 'circle' ? ' width="3rem" height="3rem"' : v.shape === 'rect' ? ' width="12rem" height="5rem"' : ' width="12rem"'} />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Skeleton } from '@hydrateless/svelte';\n</script>\n\n<Skeleton shape="${v.shape}"${v.shape === 'circle' ? ' width="3rem" height="3rem"' : v.shape === 'rect' ? ' width="12rem" height="5rem"' : ' width="12rem"'} />`,
      },
    },
  ],
  props: [
    {
      name: 'shape',
      type: `'text' | 'circle' | 'rect'`,
      default: `'text'`,
      description: 'Shape of the placeholder; renders `data-hl-shape`.',
    },
    { name: 'width', type: 'string', description: 'Maps to the `inline-size` inline style.' },
    { name: 'height', type: 'string', description: 'Maps to the `block-size` inline style.' },
  ],
  tokens: [{ name: '--hl-surface-2', description: 'Base color of the placeholder.' }],
  a11y: [
    'Mark skeletons `aria-hidden="true"` so assistive tech skips placeholder noise.',
    'The shimmer animation is disabled under `prefers-reduced-motion`.',
  ],
  related: ['spinner', 'progress', 'avatar'],
};
