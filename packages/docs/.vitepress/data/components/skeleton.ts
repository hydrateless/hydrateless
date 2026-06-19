import type { ComponentDoc } from '../types';

export const skeleton: ComponentDoc = {
  slug: 'skeleton',
  name: 'Skeleton',
  category: 'Feedback',
  importName: 'Skeleton',
  summary: 'A placeholder shown while content loads.',
  description:
    'A placeholder shown while content loads. Mark it `aria-hidden="true"` so screen readers skip it. It respects `prefers-reduced-motion`. CSS-only.',
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
          id: 'variant',
          type: 'select',
          label: 'Variant',
          options: ['text', 'rect', 'circle'],
          default: 'text',
        },
      ],
      render: (v) => {
        const dims =
          v.variant === 'circle'
            ? 'width:3rem;height:3rem'
            : v.variant === 'rect'
              ? 'width:12rem;height:5rem'
              : 'width:12rem';
        return `<span class="hl-skeleton" data-hl-variant="${v.variant}" aria-hidden="true" style="${dims}"></span>`;
      },
      code: {
        react: (v) =>
          `import { Skeleton } from '@hydrateless/react';\n\n<Skeleton variant="${v.variant}"${v.variant === 'circle' ? ' width="3rem" height="3rem"' : ' width="12rem"'} />`,
        vue: (v) =>
          `<script setup>\nimport { Skeleton } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Skeleton variant="${v.variant}"${v.variant === 'circle' ? ' width="3rem" height="3rem"' : ' width="12rem"'} />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Skeleton } from '@hydrateless/svelte';\n</script>\n\n<Skeleton variant="${v.variant}"${v.variant === 'circle' ? ' width="3rem" height="3rem"' : ' width="12rem"'} />`,
      },
    },
  ],
  props: [
    {
      name: 'variant',
      type: `'rect' | 'text' | 'circle'`,
      default: `'rect'`,
      description: 'Shape of the placeholder.',
    },
    { name: 'width', type: 'string', description: 'CSS width.' },
    { name: 'height', type: 'string', description: 'CSS height.' },
  ],
  tokens: [{ name: '--hl-surface', description: 'Base color of the placeholder.' }],
  a11y: [
    'Mark skeletons `aria-hidden="true"` so assistive tech skips placeholder noise.',
    'The shimmer animation is disabled under `prefers-reduced-motion`.',
  ],
  related: ['spinner', 'progress', 'avatar'],
};
