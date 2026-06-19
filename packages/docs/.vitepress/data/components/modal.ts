import type { ComponentDoc } from '../types';

export const modal: ComponentDoc = {
  slug: 'modal',
  name: 'Modal',
  category: 'Actions & Overlays',
  importName: 'Modal',
  summary: 'A dialog overlay built on the native <dialog> element.',
  description:
    'A dialog overlay built on the native `<dialog>` element and `showModal()`, which provides top-layer rendering and focus containment for free. The enhancer wires open/close triggers and optional backdrop dismissal.',
  status: 'stable',
  cssOnly: false,
  native: '<dialog>',
  cssFile: 'modal.css',
  enhancer: {
    fn: 'enhanceModal',
    subpath: '@hydrateless/enhancers/modal',
    signature: 'enhanceModal(container, { closeOnBackdrop, defaultOpen, onOpenChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Modal',
      description:
        'Open the dialog, then press `Esc` or click the backdrop to close. Toggle JS off to see the native fallback.',
      layout: 'center',
      render: () =>
        `<button class="hl-button" data-hl-modal-open="demo-modal">Open modal</button>
<dialog id="demo-modal" class="hl-modal" data-hl-modal>
  <div class="hl-modal-header">Confirm action</div>
  <div class="hl-modal-body">This dialog is the native dialog element. Press Escape or click the backdrop to close.</div>
  <div class="hl-modal-footer">
    <button class="hl-button" data-hl-variant="ghost" data-hl-modal-close>Cancel</button>
    <button class="hl-button" data-hl-intent="primary" data-hl-modal-close>Confirm</button>
  </div>
</dialog>`,
      code: {
        react: () =>
          `import { useState } from 'react';\nimport { Modal, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/react';\n\nfunction Example() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>Open</button>\n      <Modal open={open} onOpenChange={setOpen}>\n        <ModalHeader>Title</ModalHeader>\n        <ModalBody>Content.</ModalBody>\n        <ModalFooter>\n          <button onClick={() => setOpen(false)}>Close</button>\n        </ModalFooter>\n      </Modal>\n    </>\n  );\n}`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Modal, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/vue';\nconst open = ref(false);\n</script>\n\n<template>\n  <button @click="open = true">Open</button>\n  <Modal v-model:open="open">\n    <ModalHeader>Title</ModalHeader>\n    <ModalBody>Content.</ModalBody>\n    <ModalFooter>\n      <button @click="open = false">Close</button>\n    </ModalFooter>\n  </Modal>\n</template>`,
        svelte: () =>
          `<script>\n  import { Modal, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/svelte';\n  let open = $state(false);\n</script>\n\n<button onclick={() => (open = true)}>Open</button>\n<Modal bind:open>\n  <ModalHeader>Title</ModalHeader>\n  <ModalBody>Content.</ModalBody>\n  <ModalFooter>\n    <button onclick={() => (open = false)}>Close</button>\n  </ModalFooter>\n</Modal>`,
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
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Dismiss when the backdrop is clicked.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description: 'Fires whenever the dialog opens or closes.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Dialog background.' },
    { name: '--hl-overlay', description: 'Backdrop color.' },
    { name: '--hl-radius-lg', description: 'Dialog corner radius.' },
    { name: '--hl-shadow-lg', description: 'Dialog elevation.' },
  ],
  a11y: [
    '`showModal()` renders in the top layer, traps focus, and makes the rest of the page `inert`.',
    '`Esc` closes natively and focus returns to the trigger on close.',
  ],
  related: ['drawer', 'popover', 'command-palette'],
};
