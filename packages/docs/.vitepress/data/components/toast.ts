import type { ComponentDoc } from '../types';

export const toast: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  category: 'Feedback',
  importName: 'useToast',
  summary: 'Non-modal notifications that auto-dismiss.',
  description:
    'Non-modal notifications that appear temporarily and auto-dismiss. The region uses an ARIA live region so screen readers announce new messages.',
  status: 'stable',
  cssOnly: false,
  cssFile: 'toast.css',
  enhancer: {
    fn: 'enhanceToast',
    subpath: '@hydrateless/enhancers/toast',
    signature: 'enhanceToast(container, options?)',
  },
  demos: [
    {
      id: 'default',
      title: 'Toast',
      description:
        'Declarative triggers push messages into a live region. Toggle JS off to disable them.',
      layout: 'center',
      render: () =>
        `<button class="hl-button" data-hl-toast-trigger="Saved successfully!">Show toast</button>
<div data-hl-toast-region></div>`,
      code: {
        react: () =>
          `import { useToast } from '@hydrateless/react';\n\nfunction SaveButton() {\n  const toast = useToast();\n  return <button onClick={() => toast.show('Saved!')}>Save</button>;\n}`,
        vue: () =>
          `<script setup>\nimport { useToast } from '@hydrateless/vue';\nconst toast = useToast();\n</script>\n\n<template>\n  <button @click="toast.show('Saved!')">Save</button>\n</template>`,
        svelte: () =>
          `<script>\n  import { useToast } from '@hydrateless/svelte';\n  const toast = useToast();\n</script>\n\n<button onclick={() => toast.show('Saved!')}>Save</button>`,
      },
    },
  ],
  props: [
    {
      name: 'duration',
      type: 'number',
      default: '5000',
      description: 'Auto-dismiss delay in ms; `0` disables it.',
    },
    {
      name: 'variant',
      type: `'info' | 'success' | 'warning' | 'danger'`,
      description: 'Color of the toast passed to `show()`.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Toast background.' },
    { name: '--hl-shadow-lg', description: 'Toast elevation.' },
    { name: '--hl-radius-md', description: 'Corner radius.' },
  ],
  a11y: [
    'The region is `role="status"` with `aria-live="polite"`, so new toasts are announced without stealing focus.',
    'Dismiss buttons include `aria-label="Dismiss"`.',
  ],
  related: ['alert', 'modal'],
};
