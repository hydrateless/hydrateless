# Popover

Floating content anchored to a trigger. Uses the native
[Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
where available, with a `hidden`-attribute fallback for older browsers.

## Demo

<div class="hl-demo">
<button popovertarget="demo-pop">Toggle popover</button>
<div id="demo-pop" popover>
  <p style="margin:0">This popover uses the native Popover API. Click outside or press Escape to dismiss.</p>
</div>
</div>

## HTML

Using the native Popover API:

```html
<button popovertarget="my-pop">Toggle</button>
<div id="my-pop" popover>Popover content.</div>
```

With the data-attribute fallback (no `popover` attribute):

```html
<button data-hl-popover-open="my-pop">Toggle</button>
<div id="my-pop" data-hl-popover hidden>Popover content.</div>
<button data-hl-popover-close="my-pop">Close</button>
```

- **CSS**: `hydrateless/popover.css`
- **JS**: `enhancePopover(container, { triggerEvent?, placement?, defaultOpen?, onOpenChange? })`
  — the handle's `api` exposes `open`/`setOpen`; openers get `aria-expanded`
  and `aria-controls`, and the popover emits `hl:open-change`.

## Frameworks

In React the popover is controlled by an `open` prop; pair it with your own
trigger button.

::: code-group

```tsx [React]
import { useState } from 'react';
import { Popover } from '@hydrateless/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>Toggle</button>
      <Popover open={open}>Popover content.</Popover>
    </>
  );
}
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Popover } from '@hydrateless/vue';

const open = ref(false);
</script>

<template>
  <button @click="open = !open">Toggle</button>
  <Popover :open="open">Popover content.</Popover>
</template>
```

```svelte [Svelte]
<script>
  import { Popover } from '@hydrateless/svelte';

  let open = $state(false);
</script>

<button onclick={() => (open = !open)}>Toggle</button>
<Popover {open}>Popover content.</Popover>
```

:::
