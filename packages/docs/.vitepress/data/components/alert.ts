import type { ComponentDoc } from '../types';
import { str } from './_util';

export const alert: ComponentDoc = {
  slug: 'alert',
  name: 'Alert',
  category: 'Feedback',
  importName: 'Alert',
  summary: 'A short, prominent message with an intent color.',
  description:
    'A short, prominent message with an intent color and optional title. Use `role="alert"` so assistive technology announces it. The alert itself is CSS-only; add `data-hl-alert` and a `data-hl-dismiss` button and the optional enhancer makes it dismissible with an exit transition and an `hl:open-change` event.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'alert.css',
  enhancer: {
    fn: 'enhanceAlert',
    subpath: '@hydrateless/enhancers/alert',
    signature: 'enhanceAlert(container, { defaultOpen, onOpenChange })',
  },
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
    {
      id: 'dismissible',
      title: 'Dismissible',
      description:
        'A `data-hl-dismiss` button inside a `data-hl-alert` hides the alert. The enhancer waits for the CSS exit transition before setting `hidden`, so the alert fades out instead of vanishing.',
      layout: 'fill',
      render: () =>
        `<div class="hl-alert" role="status" data-hl-intent="success" data-hl-alert style="width:100%">
  <div class="hl-alert-body">
    <p class="hl-alert-title">Saved</p>
    <p>Your changes are live.</p>
  </div>
  <button type="button" data-hl-dismiss aria-label="Dismiss"></button>
</div>`,
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
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description:
        'Fires after an enhanced alert is dismissed or shown again (also the `onOpenChange` callback).',
    },
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
