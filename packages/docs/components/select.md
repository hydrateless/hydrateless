# Select

A native `<select>` styled with the `hl-select` primitive. The wrapper draws a
custom caret in pure CSS while the native control keeps full keyboard and mobile
behavior.

## Demo

<div class="hl-demo">
<span class="hl-select-wrapper">
  <select class="hl-select">
    <option>One</option>
    <option>Two</option>
    <option>Three</option>
  </select>
</span>
</div>

## HTML

```html
<span class="hl-select-wrapper">
  <select class="hl-select">
    <option>One</option>
    <option>Two</option>
    <option>Three</option>
  </select>
</span>
```

- **CSS**: `hydrateless/select.css`
- **JS**: none.
- **Size**: `data-hl-size` = `sm` | `md` | `lg` on the `<select>`.
- **Invalid**: add `data-hl-invalid` (with `aria-invalid="true"`) to the
  `<select>`.

## Frameworks

The React component renders the wrapper for you; pass `options` or your own
`<option>` children.

::: code-group

```tsx [React]
import { Select } from '@hydrateless/react';

<Select defaultValue="1">
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</Select>;
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Select } from '@hydrateless/vue';

const value = ref('1');
</script>

<template>
  <Select v-model="value">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </Select>
</template>
```

```svelte [Svelte]
<script>
  import { Select } from '@hydrateless/svelte';

  let value = $state('1');
</script>

<Select bind:value>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</Select>
```

:::
