# Tooltip

A text hint shown on hover and focus, wired with `role="tooltip"` and
`aria-describedby`. The enhancer toggles visibility and dismisses on `Esc`.

## Demo

<div class="hl-demo">
<span style="position:relative;display:inline-block">
  <button data-hl-tooltip="demo-tip" aria-describedby="demo-tip">Hover or focus me</button>
  <span id="demo-tip" role="tooltip" hidden>Helpful tooltip text.</span>
</span>
</div>

## HTML

```html
<button data-hl-tooltip="tip1" aria-describedby="tip1">Hover me</button>
<div id="tip1" role="tooltip" hidden>Helpful tooltip text.</div>
```

- **CSS**: `hydrateless/tooltip.css`
- **JS**: `enhanceTooltip(container, { placement?, showDelay?, hideDelay? })`
  — shows after a short hover delay (focus is immediate) and stays open while
  the pointer rests on the tip; the handle's `api` exposes `show`/`hide`.
- **Keyboard**: shows on focus, dismisses on `Esc`.

## Frameworks

The React `Tooltip` wraps a single focusable child and renders the tip for you.

::: code-group

```tsx [React]
import { Tooltip } from '@hydrateless/react';

<Tooltip label="Helpful tooltip text.">
  <button>Hover me</button>
</Tooltip>;
```

```vue [Vue]
<script setup>
import { Tooltip } from '@hydrateless/vue';
</script>

<template>
  <Tooltip label="Helpful tooltip text.">
    <button>Hover me</button>
  </Tooltip>
</template>
```

```svelte [Svelte]
<script>
  import { Tooltip } from '@hydrateless/svelte';
</script>

<Tooltip label="Helpful tooltip text.">
  <button>Hover me</button>
</Tooltip>
```

:::
