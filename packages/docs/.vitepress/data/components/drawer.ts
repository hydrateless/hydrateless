import type { ComponentDoc } from '../types';

export const drawer: ComponentDoc = {
  slug: 'drawer',
  name: 'Drawer',
  category: 'Actions & Overlays',
  importName: 'Drawer',
  summary: 'An off-canvas panel built on the native <dialog>.',
  description:
    'An off-canvas panel built on the native `<dialog>` element, sliding in from the start or end edge. `data-hl-side` is logical, so `end` is the right edge in left-to-right pages and the left edge in right-to-left pages. It mirrors the modal, opening with `command="show-modal"` and closing with `command="close"`, and its slide animation respects `prefers-reduced-motion`.',
  status: 'stable',
  cssOnly: false,
  native: '<dialog>',
  cssFile: 'drawer.css',
  enhancer: {
    fn: 'enhanceDrawer',
    subpath: '@hydrateless/enhancers/drawer',
    signature: 'enhanceDrawer(container, { closeOnBackdrop, defaultOpen, onOpenChange })',
  },
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [
        { id: 'side', type: 'select', label: 'Side', options: ['end', 'start'], default: 'end' },
      ],
      render: (v) =>
        `<button class="hl-button" command="show-modal" commandfor="demo-drawer">Open drawer</button>
<dialog id="demo-drawer" class="hl-drawer" data-hl-drawer data-hl-side="${v.side}">
  <div class="hl-drawer-header">Settings</div>
  <div class="hl-drawer-body">A drawer slides in from the chosen edge. Click the backdrop or press Escape to close.</div>
  <div class="hl-drawer-footer">
    <button class="hl-button" data-hl-variant="ghost" command="close" commandfor="demo-drawer">Close</button>
  </div>
</dialog>`,
      code: {
        react: (v) =>
          `import { useState } from 'react';\nimport { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@hydrateless/react';\n\nfunction Example() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>Open</button>\n      <Drawer open={open} side="${v.side}" onOpenChange={setOpen}>\n        <DrawerHeader>Settings</DrawerHeader>\n        <DrawerBody>Drawer content.</DrawerBody>\n        <DrawerFooter>\n          <button onClick={() => setOpen(false)}>Close</button>\n        </DrawerFooter>\n      </Drawer>\n    </>\n  );\n}`,
        vue: (v) =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@hydrateless/vue';\nconst open = ref(false);\n</script>\n\n<template>\n  <button @click="open = true">Open</button>\n  <Drawer v-model:open="open" side="${v.side}">\n    <DrawerHeader>Settings</DrawerHeader>\n    <DrawerBody>Drawer content.</DrawerBody>\n    <DrawerFooter>\n      <button @click="open = false">Close</button>\n    </DrawerFooter>\n  </Drawer>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@hydrateless/svelte';\n  let open = $state(false);\n</script>\n\n<button onclick={() => (open = true)}>Open</button>\n<Drawer bind:open side="${v.side}">\n  <DrawerHeader>Settings</DrawerHeader>\n  <DrawerBody>Drawer content.</DrawerBody>\n  <DrawerFooter>\n    <button onclick={() => (open = false)}>Close</button>\n  </DrawerFooter>\n</Drawer>`,
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
      description:
        'Called after the drawer opens or closes, including native `Esc` and backdrop dismissal.',
    },
    {
      name: 'side',
      type: `'start' | 'end'`,
      default: `'end'`,
      description: 'Logical edge the panel anchors to; mirrors automatically under `dir="rtl"`.',
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Sets `closedby="any"` so clicking the backdrop dismisses the drawer.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description: 'Fires whenever the drawer opens or closes.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Panel background.' },
    { name: '--hl-scrim', description: 'Backdrop color.' },
    { name: '--hl-overlay-inline-size', description: 'Panel width.' },
    { name: '--hl-overlay-shadow', description: 'Panel elevation.' },
  ],
  a11y: [
    'Built on `<dialog>`, so focus trapping, `inert` background, and `Esc` to close are native, and focus returns to the invoker on close.',
    'The slide animation collapses to an instant switch under `prefers-reduced-motion`.',
  ],
  related: ['modal', 'popover'],
};
