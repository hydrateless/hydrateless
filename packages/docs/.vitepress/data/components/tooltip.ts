import type { ComponentDoc } from '../types';

export const tooltip: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'Actions & Overlays',
  importName: 'Tooltip',
  summary: 'A text hint shown on hover and focus.',
  description:
    'A text hint shown on hover and focus, wired with `role="tooltip"` and `aria-describedby`. The enhancer toggles visibility and dismisses on `Esc`.',
  status: 'stable',
  cssOnly: false,
  native: '[role="tooltip"]',
  cssFile: 'tooltip.css',
  enhancer: {
    fn: 'enhanceTooltip',
    subpath: '@hydrateless/enhancers/tooltip',
    signature: 'enhanceTooltip(container, { placement, showDelay, hideDelay })',
  },
  demos: [
    {
      id: 'default',
      title: 'Tooltip',
      description: 'Hover or focus the trigger. Focus shows it immediately; hover waits a beat.',
      layout: 'center',
      render: () =>
        `<span style="position:relative;display:inline-block">
  <button class="hl-button" data-hl-variant="outline" data-hl-tooltip="demo-tip" aria-describedby="demo-tip">Hover or focus me</button>
  <span id="demo-tip" role="tooltip" hidden>Helpful tooltip text.</span>
</span>`,
      code: {
        react: () =>
          `import { Tooltip } from '@hydrateless/react';\n\n<Tooltip label="Helpful tooltip text.">\n  <button>Hover me</button>\n</Tooltip>`,
        vue: () =>
          `<script setup>\nimport { Tooltip } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Tooltip label="Helpful tooltip text.">\n    <button>Hover me</button>\n  </Tooltip>\n</template>`,
        svelte: () =>
          `<script>\n  import { Tooltip } from '@hydrateless/svelte';\n</script>\n\n<Tooltip label="Helpful tooltip text.">\n  <button>Hover me</button>\n</Tooltip>`,
      },
    },
  ],
  props: [
    { name: 'label', type: 'string', required: true, description: 'The tooltip text.' },
    {
      name: 'placement',
      type: 'string',
      default: `'top'`,
      description: 'Preferred side relative to the trigger.',
    },
  ],
  tokens: [
    { name: '--hl-fg', description: 'Tooltip background (inverted surface).' },
    { name: '--hl-bg', description: 'Tooltip text color.' },
    { name: '--hl-radius-sm', description: 'Corner radius.' },
  ],
  a11y: [
    'The trigger is linked to the tip with `aria-describedby`, so it is announced on focus.',
    'Focus reveals the tip instantly; `Esc` dismisses it without moving focus.',
  ],
  related: ['popover', 'kbd'],
};
