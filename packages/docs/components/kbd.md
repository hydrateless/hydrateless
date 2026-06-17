# Kbd

A styled keyboard key for documenting shortcuts. CSS-only, built on the native
`<kbd>` element.

## Demo

<div class="hl-demo">
<kbd class="hl-kbd">⌘</kbd> <kbd class="hl-kbd">K</kbd>
</div>

## HTML

```html
<kbd class="hl-kbd">⌘</kbd> <kbd class="hl-kbd">K</kbd>
```

- **CSS**: `hydrateless/kbd.css`
- **JS**: none.

## Frameworks

::: code-group

```tsx [React]
import { Kbd } from '@hydrateless/react';

<>
  <Kbd>⌘</Kbd> <Kbd>K</Kbd>
</>;
```

```vue [Vue]
<script setup>
import { Kbd } from '@hydrateless/vue';
</script>

<template><Kbd>⌘</Kbd> <Kbd>K</Kbd></template>
```

```svelte [Svelte]
<script>
  import { Kbd } from '@hydrateless/svelte';
</script>

<Kbd>⌘</Kbd> <Kbd>K</Kbd>
```

:::
