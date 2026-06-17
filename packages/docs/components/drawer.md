# Drawer

An off-canvas panel built on the native `<dialog>` element, sliding in from the
left or right. It mirrors the [Modal](./modal) but with a side-anchored layout
and slide animation (which respects `prefers-reduced-motion`).

## Demo

<div class="hl-demo">
<button data-hl-drawer-open="demo-drawer">Open drawer</button>
<dialog id="demo-drawer" class="hl-drawer" data-hl-drawer data-side="right">
  <div class="hl-drawer-header">Settings</div>
  <div class="hl-drawer-body">A drawer slides in from the chosen side. Click the backdrop or press Escape to close.</div>
  <div class="hl-drawer-footer">
    <button data-hl-drawer-close>Close</button>
  </div>
</dialog>
</div>

## HTML

```html
<button data-hl-drawer-open="my-drawer">Open drawer</button>
<dialog id="my-drawer" class="hl-drawer" data-hl-drawer data-side="right">
  <div class="hl-drawer-header">Drawer title</div>
  <div class="hl-drawer-body">Drawer content.</div>
  <div class="hl-drawer-footer">
    <button data-hl-drawer-close>Close</button>
  </div>
</dialog>
```

- **CSS**: `hydrateless/drawer.css`
- **JS**: `enhanceDrawer(container, { closeOnBackdrop?, defaultOpen?, onOpenChange? })`.
  The handle's `api` exposes `open` and `setOpen(open)`; the dialog also
  emits `hl:open-change`.
- **Variants**: `data-side="left"` or `data-side="right"`.

## Frameworks

::: code-group

```tsx [React]
import { useState } from 'react';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@hydrateless/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Drawer open={open} side="right" onOpenChange={setOpen}>
        <DrawerHeader>Settings</DrawerHeader>
        <DrawerBody>Drawer content.</DrawerBody>
        <DrawerFooter>
          <button onClick={() => setOpen(false)}>Close</button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@hydrateless/vue';

const open = ref(false);
</script>

<template>
  <button @click="open = true">Open</button>
  <Drawer v-model:open="open" side="right">
    <DrawerHeader>Settings</DrawerHeader>
    <DrawerBody>Drawer content.</DrawerBody>
    <DrawerFooter>
      <button @click="open = false">Close</button>
    </DrawerFooter>
  </Drawer>
</template>
```

```svelte [Svelte]
<script>
  import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@hydrateless/svelte';

  let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open</button>
<Drawer bind:open side="right">
  <DrawerHeader>Settings</DrawerHeader>
  <DrawerBody>Drawer content.</DrawerBody>
  <DrawerFooter>
    <button onclick={() => (open = false)}>Close</button>
  </DrawerFooter>
</Drawer>
```

:::
