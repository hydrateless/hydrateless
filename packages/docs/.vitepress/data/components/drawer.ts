import type { ComponentDoc } from '../types';

export const drawer: ComponentDoc = {
  slug: 'drawer',
  name: 'Drawer',
  category: 'Actions & Overlays',
  importName: 'Drawer',
  summary: 'An off-canvas panel built on the native <dialog>.',
  description:
    'An off-canvas panel built on the native `<dialog>` element, sliding in from the left or right. It mirrors the modal but with a side-anchored layout and a slide animation that respects `prefers-reduced-motion`.',
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
        { id: 'side', type: 'select', label: 'Side', options: ['right', 'left'], default: 'right' },
      ],
      render: (v) =>
        `<button class="hl-button" command="show-modal" commandfor="demo-drawer">Open drawer</button>
<dialog id="demo-drawer" class="hl-drawer" data-hl-drawer data-side="${v.side}">
  <div class="hl-drawer-header">Settings</div>
  <div class="hl-drawer-body">A drawer slides in from the chosen side. Click the backdrop or press Escape to close.</div>
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
      description: 'Controlled visibility; pair with `onOpenChange`.',
    },
    {
      name: 'side',
      type: `'left' | 'right'`,
      default: `'right'`,
      description: 'Edge the panel anchors to.',
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
    { name: '--hl-overlay', description: 'Backdrop color.' },
    { name: '--hl-shadow-lg', description: 'Panel elevation.' },
  ],
  a11y: [
    'Built on `<dialog>`, so focus trapping, `inert` background, and `Esc` to close are native.',
    'The slide animation collapses to a fade under `prefers-reduced-motion`.',
  ],
  related: ['modal', 'popover'],
};
