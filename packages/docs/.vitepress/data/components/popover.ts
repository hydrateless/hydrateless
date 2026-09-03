import type { ComponentDoc } from '../types';

export const popover: ComponentDoc = {
  slug: 'popover',
  name: 'Popover',
  category: 'Actions & Overlays',
  importName: 'Popover',
  summary: 'Floating content anchored to a trigger.',
  description:
    'Floating content anchored to a trigger, built on the native Popover API. A button with `popovertarget` opens it with no JavaScript; the browser provides the top layer, light dismiss, and `Esc`, and CSS anchor positioning places it. The enhancer mirrors `aria-expanded` onto the invokers, adds optional hover triggering, runs a JS positioning fallback (kept in sync on scroll and resize) where anchor positioning is missing, and exposes the controlled API.',
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
      description:
        'Click outside or press `Esc` to dismiss. Focus returns to the invoker on close.',
      layout: 'center',
      render: () =>
        `<button class="hl-button" data-hl-variant="outline" popovertarget="demo-pop">Toggle popover</button>
<div id="demo-pop" popover class="hl-popover" data-hl-popover>
  <p style="margin:0">Popover content rendered in the top layer.</p>
</div>`,
      code: {
        react: () =>
          `import { useState } from 'react';\nimport { Popover } from '@hydrateless/react';\n\nfunction Example() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen((v) => !v)}>Toggle</button>\n      <Popover open={open} onOpenChange={setOpen} placement="bottom">\n        Popover content.\n      </Popover>\n    </>\n  );\n}`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Popover } from '@hydrateless/vue';\nconst open = ref(false);\n</script>\n\n<template>\n  <button @click="open = !open">Toggle</button>\n  <Popover v-model:open="open" placement="bottom">Popover content.</Popover>\n</template>`,
        svelte: () =>
          `<script>\n  import { Popover } from '@hydrateless/svelte';\n  let open = $state(false);\n</script>\n\n<button onclick={() => (open = !open)}>Toggle</button>\n<Popover bind:open placement="bottom">Popover content.</Popover>`,
      },
    },
  ],
  props: [
    {
      name: 'open',
      type: 'boolean',
      description:
        'Controlled visibility; pair with `onOpenChange` (Vue: `v-model:open`, Svelte: `bind:open`).',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Uncontrolled initial visibility.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called after the popover shows or hides, including light dismiss.',
    },
    {
      name: 'placement',
      type: 'Placement',
      default: `'bottom'`,
      description: 'Preferred side relative to the trigger.',
    },
    {
      name: 'hover',
      type: 'boolean',
      default: 'false',
      description:
        'Also open on pointer hover and focus, with a short grace period before closing.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description: 'Fires whenever the popover opens or closes (also the `onOpenChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Popover background.' },
    { name: '--hl-border', description: 'Popover border.' },
    { name: '--hl-overlay-shadow', description: 'Popover elevation.' },
  ],
  a11y: [
    'The native Popover API provides light dismiss, `Esc`, and top-layer stacking; focus returns to the invoker on close.',
    'Invokers gain `aria-expanded` and `aria-controls` so the relationship is announced.',
  ],
  related: ['tooltip', 'dropdown', 'modal'],
};
