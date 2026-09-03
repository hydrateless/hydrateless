import type { ComponentDoc } from '../types';

export const toast: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  category: 'Feedback',
  importName: 'ToastRegion',
  summary: 'Non-modal notifications that auto-dismiss.',
  description:
    'Non-modal notifications that appear temporarily and auto-dismiss. The region is an ARIA live region so screen readers announce new messages; `danger` toasts get `role="alert"` so they interrupt. Declarative `data-hl-toast-trigger` buttons are handled through event delegation, so triggers added after enhancement just work. Hovering or focusing a toast pauses its timer.',
  status: 'stable',
  cssOnly: false,
  cssFile: 'toast.css',
  enhancer: {
    fn: 'enhanceToast',
    subpath: '@hydrateless/enhancers/toast',
    signature: 'enhanceToast(container, { duration, onOpenChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Toast',
      description:
        'Declarative triggers push messages into a live region. `data-hl-toast-intent` colors the toast and `data-hl-toast-duration` overrides the timeout. Toggle JS off to disable them.',
      layout: 'row',
      render: () =>
        `<button class="hl-button" data-hl-toast-trigger="Saved successfully!" data-hl-toast-intent="success">Success</button>
<button class="hl-button" data-hl-variant="outline" data-hl-toast-trigger="Heads up: quota at 90%." data-hl-toast-intent="warning" data-hl-toast-duration="8000">Warning</button>
<button class="hl-button" data-hl-intent="danger" data-hl-variant="soft" data-hl-toast-trigger="Upload failed." data-hl-toast-intent="danger" data-hl-toast-duration="0">Danger (sticky)</button>
<div data-hl-toast-region></div>`,
      code: {
        react: () =>
          `import { ToastRegion, useToast } from '@hydrateless/react';\n\nfunction SaveButton() {\n  const toast = useToast();\n  return (\n    <button onClick={() => toast.show('Saved!', { intent: 'success', duration: 4000 })}>\n      Save\n    </button>\n  );\n}\n\nexport function App() {\n  return (\n    <>\n      <SaveButton />\n      <ToastRegion />\n    </>\n  );\n}`,
        vue: () =>
          `<script setup>\nimport { ToastRegion, useToast } from '@hydrateless/vue';\nconst toast = useToast();\n</script>\n\n<template>\n  <button @click="toast.show('Saved!', { intent: 'success', duration: 4000 })">Save</button>\n  <ToastRegion />\n</template>`,
        svelte: () =>
          `<script>\n  import { ToastRegion, useToast } from '@hydrateless/svelte';\n  const toast = useToast();\n</script>\n\n<button onclick={() => toast.show('Saved!', { intent: 'success', duration: 4000 })}>Save</button>\n<ToastRegion />`,
      },
    },
  ],
  props: [
    {
      name: 'duration',
      type: 'number',
      default: '5000',
      description:
        'Default auto-dismiss delay in ms, set on `enhanceToast` or `ToastRegion`; `0` keeps toasts until dismissed. Per-toast `show()` options override it.',
    },
    {
      name: 'intent',
      type: `'info' | 'success' | 'warning' | 'danger'`,
      description:
        'Passed to `show(message, { intent })`. Sets `data-hl-intent` on the toast; `danger` also sets `role="alert"`.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean, toast: HTMLElement) => void',
      description: 'Called after a toast appears or is dismissed.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean, toast: HTMLElement }',
      description: 'Fires when a toast appears or is dismissed (also the `onOpenChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Toast background.' },
    { name: '--hl-overlay-shadow', description: 'Toast elevation.' },
    { name: '--hl-radius-lg', description: 'Corner radius.' },
    {
      name: '--hl-success',
      description: 'Accent stripe for each intent (`--hl-warning`, `--hl-danger`, `--hl-info`).',
    },
  ],
  a11y: [
    'The region is `role="status"` with `aria-live="polite"`, so new toasts are announced without stealing focus; `danger` toasts are `role="alert"`.',
    'Auto-dismiss pauses while the pointer or keyboard focus is on the toast (WCAG 2.2.1), so the dismiss button can be reached.',
    'Dismiss buttons include `aria-label="Dismiss"`.',
  ],
  related: ['alert', 'modal'],
};
