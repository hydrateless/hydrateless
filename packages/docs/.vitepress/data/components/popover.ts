import type { ComponentDoc } from '../types';

export const popover: ComponentDoc = {
  slug: 'popover',
  name: 'Popover',
  category: 'Actions & Overlays',
  importName: 'Popover',
  summary: 'Floating content anchored to a trigger.',
  description:
    'Floating content anchored to a trigger. The demo uses the native Popover API where available; the enhancer adds placement and a `hidden`-attribute fallback for older browsers.',
  status: 'stable',
  cssOnly: false,
  native: '[popover]',
  cssFile: 'popover.css',
  enhancer: {
    fn: 'enhancePopover',
    subpath: '@hydrateless/enhancers/popover',
    signature: 'enhancePopover(container, { triggerEvent, placement, defaultOpen, onOpenChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Popover',
      description: 'This uses the native Popover API. Click outside or press `Esc` to dismiss.',
      layout: 'center',
      render: () =>
        `<button class="hl-button" data-hl-variant="outline" popovertarget="demo-pop">Toggle popover</button>
<div id="demo-pop" popover class="hl-popover">
  <p style="margin:0">Popover content rendered in the top layer.</p>
</div>`,
      code: {
        react: () =>
          `import { useState } from 'react';\nimport { Popover } from '@hydrateless/react';\n\nfunction Example() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen((v) => !v)}>Toggle</button>\n      <Popover open={open}>Popover content.</Popover>\n    </>\n  );\n}`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Popover } from '@hydrateless/vue';\nconst open = ref(false);\n</script>\n\n<template>\n  <button @click="open = !open">Toggle</button>\n  <Popover :open="open">Popover content.</Popover>\n</template>`,
        svelte: () =>
          `<script>\n  import { Popover } from '@hydrateless/svelte';\n  let open = $state(false);\n</script>\n\n<button onclick={() => (open = !open)}>Toggle</button>\n<Popover {open}>Popover content.</Popover>`,
      },
    },
  ],
  props: [
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled visibility; pair with `onOpenChange`.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Uncontrolled initial visibility.',
    },
    {
      name: 'placement',
      type: 'string',
      default: `'bottom'`,
      description: 'Preferred side relative to the trigger.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description: 'Fires whenever the popover opens or closes.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Popover background.' },
    { name: '--hl-border', description: 'Popover border.' },
    { name: '--hl-shadow-md', description: 'Popover elevation.' },
  ],
  a11y: [
    'The native Popover API provides light-dismiss and top-layer stacking for free.',
    'With the fallback, openers gain `aria-expanded` and `aria-controls`.',
  ],
  related: ['tooltip', 'dropdown', 'modal'],
};
