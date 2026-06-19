import type { ComponentDoc } from '../types';
import { INTENTS } from './_util';

export const badge: ComponentDoc = {
  slug: 'badge',
  name: 'Badge',
  category: 'Feedback',
  importName: 'Badge',
  summary: 'A small label for statuses, counts, and tags.',
  description: 'A small label for statuses, counts, and tags. CSS-only.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'badge.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [
        { id: 'intent', type: 'select', label: 'Intent', options: INTENTS, default: 'success' },
        {
          id: 'variant',
          type: 'select',
          label: 'Variant',
          options: ['soft', 'solid', 'outline'],
          default: 'soft',
        },
        { id: 'size', type: 'select', label: 'Size', options: ['sm', 'md'], default: 'md' },
        { id: 'label', type: 'text', label: 'Label', default: 'Active' },
      ],
      render: (v) =>
        `<span class="hl-badge" data-hl-intent="${v.intent}" data-hl-variant="${v.variant}"${v.size !== 'md' ? ` data-hl-size="${v.size}"` : ''}>${v.label}</span>`,
      code: {
        react: (v) =>
          `import { Badge } from '@hydrateless/react';\n\n<Badge intent="${v.intent}" variant="${v.variant}">${v.label}</Badge>`,
        vue: (v) =>
          `<script setup>\nimport { Badge } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Badge intent="${v.intent}" variant="${v.variant}">${v.label}</Badge>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Badge } from '@hydrateless/svelte';\n</script>\n\n<Badge intent="${v.intent}" variant="${v.variant}">${v.label}</Badge>`,
      },
    },
    {
      id: 'showcase',
      title: 'Intents',
      layout: 'center',
      render: () =>
        INTENTS.map(
          (i) => `<span class="hl-badge" data-hl-intent="${i}" data-hl-variant="soft">${i}</span>`,
        ).join('\n'),
    },
  ],
  props: [
    {
      name: 'intent',
      type: `'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info'`,
      default: `'neutral'`,
      description: 'Color role.',
    },
    {
      name: 'variant',
      type: `'soft' | 'solid' | 'outline'`,
      default: `'soft'`,
      description: 'Fill style.',
    },
    { name: 'size', type: `'sm' | 'md'`, default: `'md'`, description: 'Badge size.' },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Accent for the chosen intent.' },
    { name: '--hl-radius-full', description: 'Pill corner radius.' },
  ],
  a11y: [
    'A badge is decorative text; if it conveys status, include that meaning in nearby copy too.',
  ],
  related: ['alert', 'avatar'],
};
