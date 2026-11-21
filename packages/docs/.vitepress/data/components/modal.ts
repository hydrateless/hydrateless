import type { ComponentDoc } from '../types';

export const modal: ComponentDoc = {
  slug: 'modal',
  name: 'Modal',
  category: 'Actions & Overlays',
  importName: 'Modal',
  summary: 'A dialog overlay built on the native <dialog> element.',
  description:
    'A dialog overlay built on the native `<dialog>` element and `showModal()`, which provides top-layer rendering and focus containment for free. Buttons open and close it declaratively with HTML Invoker Commands (`command="show-modal"` and `command="close"`), so it works with no JavaScript; the enhancer adds labeling, background scroll locking, a backdrop dismissal fallback, and the controlled API.',
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
        'Open the dialog, then press `Esc` or click the backdrop to close. With JS off, backdrop dismissal requires native `closedby` support.',
      layout: 'center',
      render: () =>
        `<button class="hl-button" command="show-modal" commandfor="demo-modal">Open modal</button>
<dialog id="demo-modal" closedby="any" aria-labelledby="demo-modal-title" class="hl-modal" data-hl-modal>
  <div class="hl-modal-header" id="demo-modal-title">Confirm action</div>
  <div class="hl-modal-body">This is a native dialog. Press Escape or choose Cancel or Confirm to close it.</div>
  <div class="hl-modal-footer">
    <button class="hl-button" data-hl-variant="ghost" command="close" commandfor="demo-modal">Cancel</button>
    <button class="hl-button" data-hl-intent="primary" command="close" commandfor="demo-modal">Confirm</button>
  </div>
</dialog>`,
      code: {
        react: () =>
          `import { Modal, ModalTrigger, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/react';\n\nfunction Example() {\n  return (\n    <>\n      <ModalTrigger target="example-modal" className="hl-button">Open</ModalTrigger>\n      <Modal id="example-modal">\n        <ModalHeader>Title</ModalHeader>\n        <ModalBody>Content.</ModalBody>\n        <ModalFooter>\n          <ModalTrigger target="example-modal" command="close" className="hl-button">Close</ModalTrigger>\n        </ModalFooter>\n      </Modal>\n    </>\n  );\n}`,
        vue: () =>
          `<script setup>\nimport { Modal, ModalTrigger, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/vue';\n</script>\n\n<template>\n  <ModalTrigger target="example-modal" class="hl-button">Open</ModalTrigger>\n  <Modal id="example-modal">\n    <ModalHeader>Title</ModalHeader>\n    <ModalBody>Content.</ModalBody>\n    <ModalFooter>\n      <ModalTrigger target="example-modal" command="close" class="hl-button">Close</ModalTrigger>\n    </ModalFooter>\n  </Modal>\n</template>`,
        svelte: () =>
          `<script>\n  import { Modal, ModalTrigger, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/svelte';\n</script>\n\n<ModalTrigger target="example-modal" class="hl-button">Open</ModalTrigger>\n<Modal id="example-modal">\n  <ModalHeader>Title</ModalHeader>\n  <ModalBody>Content.</ModalBody>\n  <ModalFooter>\n    <ModalTrigger target="example-modal" command="close" class="hl-button">Close</ModalTrigger>\n  </ModalFooter>\n</Modal>`,
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
        'Called after the dialog opens or closes, including native `Esc` and backdrop dismissal.',
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Sets `closedby="any"` so clicking the backdrop dismisses the dialog.',
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
    { name: '--hl-scrim', description: 'Backdrop color.' },
    { name: '--hl-modal-inline-size', description: 'Dialog width.' },
    { name: '--hl-radius-lg', description: 'Dialog corner radius.' },
    { name: '--hl-overlay-shadow', description: 'Dialog elevation.' },
  ],
  a11y: [
    '`showModal()` renders in the top layer, traps focus, and makes the rest of the page `inert`.',
    '`Esc` closes natively and focus returns to the trigger on close.',
  ],
  related: ['drawer', 'popover', 'command-palette'],
};
