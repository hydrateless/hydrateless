# Button

A native `<button>` styled with intent, variant, and size modifiers. CSS-only —
it keeps focus, form submission, and keyboard semantics for free.

## Demo

<div class="hl-demo">
<button class="hl-button" data-hl-variant="solid" data-hl-intent="primary">Save</button>
<button class="hl-button" data-hl-variant="soft" data-hl-intent="primary">Soft</button>
<button class="hl-button" data-hl-variant="outline" data-hl-intent="neutral">Outline</button>
<button class="hl-button" data-hl-variant="ghost" data-hl-intent="danger">Delete</button>
<button class="hl-button" data-hl-variant="link" data-hl-intent="primary">Learn more</button>
</div>

## HTML

```html
<button class="hl-button" data-hl-variant="solid" data-hl-intent="primary">Save</button>
```

- **CSS**: `hydrateless/button.css`
- **JS**: none.
- **Variant**: `data-hl-variant` = `solid` | `soft` | `outline` | `ghost` | `link`.
- **Intent**: `data-hl-intent` = `neutral` | `primary` | `danger` | `success` | `warning` | `info`.
- **Size**: `data-hl-size` = `sm` | `md` | `lg`.
- **Modifiers**: boolean `data-hl-block` (full width), `data-hl-icon` (square,
  icon-only), and `data-hl-loading` (shows a spinner and disables the button).

## Frameworks

The React component maps every attribute to a prop: `variant`, `intent`, `size`,
`block`, `icon`, and `loading`.

::: code-group

```tsx [React]
import { Button } from '@hydrateless/react';

<Button intent="primary" variant="solid" size="md">
  Save
</Button>;
```

```vue [Vue]
<script setup>
import { Button } from '@hydrateless/vue';
</script>

<template>
  <Button intent="primary" variant="solid" size="md">Save</Button>
</template>
```

```svelte [Svelte]
<script>
  import { Button } from '@hydrateless/svelte';
</script>

<Button intent="primary" variant="solid" size="md">Save</Button>
```

:::
