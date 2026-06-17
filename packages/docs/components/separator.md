# Separator

A thin divider between content. CSS-only. Use a native `<hr>` for horizontal
rules, or a `role="separator"` element for vertical ones.

## Demo

<div class="hl-demo">
<div style="width: 100%">
  <p style="margin: 0">Above</p>
  <hr class="hl-separator" />
  <p style="margin: 0">Below</p>
</div>
<div style="display: flex; align-items: center; gap: 0.75rem">
  <span>Edit</span>
  <div class="hl-separator" role="separator" aria-orientation="vertical"></div>
  <span>Delete</span>
</div>
</div>

## HTML

```html
<hr class="hl-separator" />
```

For a vertical divider, use an element with `role="separator"`:

```html
<div class="hl-separator" role="separator" aria-orientation="vertical"></div>
```

- **CSS**: `hydrateless/separator.css`
- **JS**: none.

## Frameworks

::: code-group

```tsx [React]
import { Separator } from '@hydrateless/react';

<Separator />;
<Separator orientation="vertical" />;
```

```vue [Vue]
<script setup>
import { Separator } from '@hydrateless/vue';
</script>

<template>
  <Separator />
  <Separator orientation="vertical" />
</template>
```

```svelte [Svelte]
<script>
  import { Separator } from '@hydrateless/svelte';
</script>

<Separator />
<Separator orientation="vertical" />
```

:::
