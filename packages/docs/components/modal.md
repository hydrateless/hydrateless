# Modal

A dialog overlay built on the native `<dialog>` element and `showModal()`, which
provides top-layer rendering and focus containment for free. The enhancer wires
open/close triggers and optional backdrop dismissal.

## Demo

<div class="hl-demo">
<button data-hl-modal-open="demo-modal">Open modal</button>
<dialog id="demo-modal" class="hydrateless-modal" data-hl-modal>
  <div class="hl-modal-header">Confirm action</div>
  <div class="hl-modal-body">This dialog is the native <code>&lt;dialog&gt;</code> element. Press Escape or click the backdrop to close.</div>
  <div class="hl-modal-footer">
    <button data-hl-modal-close>Cancel</button>
  </div>
</dialog>
</div>

## HTML

```html
<button data-hl-modal-open="my-modal">Open</button>
<dialog id="my-modal" class="hydrateless-modal" data-hl-modal>
  <div class="hl-modal-header">Title</div>
  <div class="hl-modal-body">Content.</div>
  <div class="hl-modal-footer">
    <button data-hl-modal-close>Close</button>
  </div>
</dialog>
```

- **CSS**: `hydrateless/modal.css`
- **JS**: `enhanceModal(container, { closeOnBackdrop?: boolean })`
- **Keyboard**: `Esc` closes (native `<dialog>`), `Tab` is trapped within the
  modal.

## Frameworks

In frameworks, the modal is controlled by an `open` prop/state rather than
declarative trigger attributes.

::: code-group

```tsx [React]
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>Title</ModalHeader>
        <ModalBody>Content.</ModalBody>
        <ModalFooter>
          <button onClick={() => setOpen(false)}>Close</button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/vue';

const open = ref(false);
</script>

<template>
  <button @click="open = true">Open</button>
  <Modal :open="open" @close="open = false">
    <ModalHeader>Title</ModalHeader>
    <ModalBody>Content.</ModalBody>
    <ModalFooter>
      <button @click="open = false">Close</button>
    </ModalFooter>
  </Modal>
</template>
```

```svelte [Svelte]
<script>
  import { Modal, ModalHeader, ModalBody, ModalFooter } from '@hydrateless/svelte';

  let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open</button>
<Modal {open} onclose={() => (open = false)}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content.</ModalBody>
  <ModalFooter>
    <button onclick={() => (open = false)}>Close</button>
  </ModalFooter>
</Modal>
```

:::
