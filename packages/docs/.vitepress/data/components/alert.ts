import type { ComponentDoc } from '../types';
import { str } from './_util';

export const alert: ComponentDoc = {
  slug: 'alert',
  name: 'Alert',
  category: 'Feedback',
  importName: 'Alert',
  summary: 'A short, prominent message with an intent color.',
  description:
    'A short, prominent message with an intent color and optional title. Use `role="alert"` so assistive technology announces it. CSS-only.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'alert.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'fill',
      knobs: [
        {
          id: 'intent',
          type: 'select',
          label: 'Intent',
          options: ['info', 'success', 'warning', 'danger', 'neutral'],
          default: 'info',
        },
        { id: 'title', type: 'text', label: 'Title', default: 'Heads up' },
        { id: 'body', type: 'text', label: 'Body', default: 'Your trial ends soon.' },
      ],
      render: (v) =>
        `<div class="hl-alert" role="alert" data-hl-intent="${v.intent}" style="width:100%">
  <div class="hl-alert-body">
    ${v.title ? `<p class="hl-alert-title">${str(v, 'title')}</p>` : ''}
    <p>${str(v, 'body')}</p>
  </div>
</div>`,
      code: {
        react: (v) =>
          `import { Alert } from '@hydrateless/react';\n\n<Alert intent="${v.intent}" title="${str(v, 'title')}">\n  ${str(v, 'body')}\n</Alert>`,
        vue: (v) =>
          `<script setup>\nimport { Alert } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Alert intent="${v.intent}" title="${str(v, 'title')}">${str(v, 'body')}</Alert>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Alert } from '@hydrateless/svelte';\n</script>\n\n<Alert intent="${v.intent}" title="${str(v, 'title')}">${str(v, 'body')}</Alert>`,
      },
    },
  ],
  props: [
    {
      name: 'intent',
      type: `'info' | 'success' | 'warning' | 'danger' | 'neutral'`,
      default: `'neutral'`,
      description: 'Color and default icon.',
    },
    { name: 'title', type: 'string', description: 'Optional bold heading above the body.' },
  ],
  tokens: [
    {
      name: '--hl-info',
      description: 'Accent for the info intent (and the success/warning/danger equivalents).',
    },
    { name: '--hl-radius-md', description: 'Corner radius.' },
  ],
  a11y: [
    '`role="alert"` makes screen readers announce the message immediately.',
    'A leading `<svg>` is automatically tinted to match the intent.',
  ],
  related: ['toast', 'badge'],
};
