# Drawer

An off-canvas panel built on the native `<dialog>` element, sliding in from the
left or right. It mirrors the [Modal](./modal) but with a side-anchored layout
and slide animation (which respects `prefers-reduced-motion`).

## Demo

<div class="hl-demo">
<button data-hl-drawer-open="demo-drawer">Open drawer</button>
<dialog id="demo-drawer" class="hydrateless-drawer" data-hl-drawer data-side="right">
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
<dialog id="my-drawer" class="hydrateless-drawer" data-hl-drawer data-side="right">
  <div class="hl-drawer-header">Drawer title</div>
  <div class="hl-drawer-body">Drawer content.</div>
  <div class="hl-drawer-footer">
    <button data-hl-drawer-close>Close</button>
  </div>
</dialog>
```

- **CSS**: `hydrateless/drawer.css`
- **JS**: `enhanceDrawer(container, { closeOnBackdrop?: boolean })`
- **Variants**: `data-side="left"` or `data-side="right"`.

## Frameworks

::: code-group

```tsx [React]
import { useState } from 'react';
import { Drawer } from '@hydrateless/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Drawer open={open} side="right" onClose={() => setOpen(false)} title="Settings">
        Drawer content.
      </Drawer>
    </>
  );
}
```

```vue [Vue]
<template>
  <button data-hl-drawer-open="my-drawer">Open</button>
  <dialog id="my-drawer" class="hydrateless-drawer" v-hl-drawer data-hl-drawer data-side="right">
    <div class="hl-drawer-body">Drawer content.</div>
    <button data-hl-drawer-close>Close</button>
  </dialog>
</template>
```

```svelte [Svelte]
<script>
  import { drawer } from '@hydrateless/svelte';
</script>

<div use:drawer>
  <button data-hl-drawer-open="my-drawer">Open</button>
  <dialog id="my-drawer" class="hydrateless-drawer" data-hl-drawer data-side="right">
    <div class="hl-drawer-body">Drawer content.</div>
    <button data-hl-drawer-close>Close</button>
  </dialog>
</div>
```

:::
