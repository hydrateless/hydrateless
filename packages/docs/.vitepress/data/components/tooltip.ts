import type { ComponentDoc } from '../types';

export const tooltip: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'Actions & Overlays',
  importName: 'Tooltip',
  summary: 'A text hint shown on hover and focus.',
  description:
    'A text hint shown on hover and focus, wired with `role="tooltip"` and `aria-describedby`. The CSS baseline reveals the tip on the trigger\'s `:hover`/`:focus-visible` with no JavaScript. The enhancer promotes the tip to a `popover="manual"` so it renders in the top layer above any clipping ancestor, adds show/hide delays and a grace period for crossing onto the tip, and dismisses on `Esc` from anywhere.',
  status: 'stable',
  cssOnly: false,
  native: '[role="tooltip"][popover]',
  cssFile: 'tooltip.css',
  enhancer: {
    fn: 'enhanceTooltip',
    subpath: '@hydrateless/enhancers/tooltip',
    signature:
      'enhanceTooltip(container, { placement, showDelay, hideDelay, defaultOpen, onOpenChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Tooltip',
      description:
        'Hover or focus the trigger. Focus shows it immediately; hover waits a beat. Press `Esc` to dismiss.',
      layout: 'center',
      render: () =>
        `<button class="hl-button" data-hl-variant="outline" data-hl-tooltip="demo-tip" aria-describedby="demo-tip">Hover or focus me</button>
<span id="demo-tip" role="tooltip">Helpful tooltip text.</span>`,
      code: {
        react: () =>
          `import { Tooltip } from '@hydrateless/react';\n\n<Tooltip content="Helpful tooltip text." placement="top">\n  <button>Hover me</button>\n</Tooltip>`,
        vue: () =>
          `<script setup>\nimport { Tooltip } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Tooltip content="Helpful tooltip text." placement="top">\n    <button>Hover me</button>\n  </Tooltip>\n</template>`,
        svelte: () =>
          `<script>\n  import { Tooltip } from '@hydrateless/svelte';\n</script>\n\n<Tooltip content="Helpful tooltip text." placement="top">\n  <button>Hover me</button>\n</Tooltip>`,
      },
    },
  ],
  props: [
    { name: 'content', type: 'string', required: true, description: 'The tooltip text.' },
    {
      name: 'placement',
      type: 'Placement',
      default: `'top'`,
      description: 'Preferred side relative to the trigger.',
    },
    {
      name: 'showDelay',
      type: 'number',
      default: '150',
      description: 'Delay in ms before showing on hover. Focus shows immediately.',
    },
    {
      name: 'hideDelay',
      type: 'number',
      default: '100',
      description: 'Grace period in ms before hiding, so the pointer can reach the tip.',
    },
    {
      name: 'open',
      type: 'boolean',
      description:
        'Controlled visibility; pair with `onOpenChange` (Vue: `v-model:open`, Svelte: `bind:open`).',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called after the tooltip shows or hides.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description: 'Fires after the tooltip shows or hides (also the `onOpenChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-fg', description: 'Tooltip background (inverted surface).' },
    { name: '--hl-bg', description: 'Tooltip text color.' },
    { name: '--hl-radius-sm', description: 'Corner radius.' },
  ],
  a11y: [
    'The trigger is linked to the tip with `aria-describedby`, so it is announced on focus.',
    'Focus reveals the tip instantly; `Esc` dismisses it without moving focus (WCAG 1.4.13).',
    'The tip is `popover="manual"` while enhanced, so it is never light-dismissed while the pointer is on the trigger.',
  ],
  related: ['popover', 'kbd'],
};
