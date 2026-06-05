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
import { Modal } from '@hydrateless/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Title"
        footer={<button onClick={() => setOpen(false)}>Close</button>}
      >
        Content.
      </Modal>
    </>
  );
}
```

```vue [Vue]
<template>
  <button data-hl-modal-open="my-modal">Open</button>
  <dialog id="my-modal" class="hydrateless-modal" v-hl-modal data-hl-modal>
    <div class="hl-modal-body">Content.</div>
    <button data-hl-modal-close>Close</button>
  </dialog>
</template>
```

```svelte [Svelte]
<script>
  import { modal } from '@hydrateless/svelte';
</script>

<div use:modal>
  <button data-hl-modal-open="my-modal">Open</button>
  <dialog id="my-modal" class="hydrateless-modal" data-hl-modal>
    <div class="hl-modal-body">Content.</div>
    <button data-hl-modal-close>Close</button>
  </dialog>
</div>
```

:::
