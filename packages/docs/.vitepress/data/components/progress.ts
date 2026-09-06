import type { ComponentDoc } from '../types';
import { str } from './_util';

export const progress: ComponentDoc = {
  slug: 'progress',
  name: 'Progress',
  category: 'Feedback',
  importName: 'Progress',
  summary: 'A progress bar built on the native <progress> element.',
  description:
    'A determinate or indeterminate progress bar built on the native `<progress>` element. The browser handles the accessible value announcement. CSS-only.',
  status: 'stable',
  cssOnly: true,
  native: '<progress>',
  cssFile: 'progress.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'fill',
      knobs: [
        { id: 'value', type: 'number', label: 'Value', default: 60, min: 0, max: 100, step: 1 },
        {
          id: 'intent',
          type: 'select',
          label: 'Intent',
          options: ['primary', 'success', 'warning', 'danger', 'info'],
          default: 'primary',
        },
        { id: 'indeterminate', type: 'boolean', label: 'Indeterminate', default: false },
      ],
      render: (v) =>
        `<progress aria-label="Upload progress" class="hl-progress" data-hl-intent="${v.intent}"${v.indeterminate ? '' : ` value="${str(v, 'value', '60')}" max="100"`} style="width:100%"></progress>`,
      code: {
        react: (v) =>
          `import { Progress } from '@hydrateless/react';\n\n<Progress aria-label="Upload progress"${v.indeterminate ? '' : ` value={${str(v, 'value', '60')}}`} intent="${v.intent}" />`,
        vue: (v) =>
          `<script setup>\nimport { Progress } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Progress aria-label="Upload progress"${v.indeterminate ? '' : ` :value="${str(v, 'value', '60')}"`} intent="${v.intent}" />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Progress } from '@hydrateless/svelte';\n</script>\n\n<Progress aria-label="Upload progress"${v.indeterminate ? '' : ` value={${str(v, 'value', '60')}}`} intent="${v.intent}" />`,
      },
    },
  ],
  props: [
    { name: 'value', type: 'number', description: 'Current value; omit for an indeterminate bar.' },
    {
      name: 'intent',
      type: `'primary' | 'success' | 'warning' | 'danger' | 'info'`,
      default: `'primary'`,
      description: 'Fill color.',
    },
    { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: 'Bar thickness.' },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Fill color.' },
    { name: '--hl-surface-3', description: 'Track color.' },
    { name: '--hl-radius-full', description: 'Bar corner radius.' },
  ],
  a11y: [
    'A native `<progress>` exposes its value, so screen readers announce completion automatically.',
    'Omitting `value` yields an indeterminate bar for unknown-length work; its sweep becomes a static bar under `prefers-reduced-motion`.',
  ],
  related: ['spinner', 'slider', 'skeleton'],
};
