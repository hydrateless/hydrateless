# Checkbox

A checkbox built on a native `<input type="checkbox">`, label-wrapped for a
larger hit target. CSS-only. It keeps `:checked`, `:focus-visible`, the `Space`
key, and form participation.

## Demo

<div class="hl-demo">
<label class="hl-checkbox">
  <input type="checkbox" checked />
  <span>Accept terms</span>
</label>
</div>

## HTML

```html
<label class="hl-checkbox">
  <input type="checkbox" />
  <span>Accept terms</span>
</label>
```

- **CSS**: `hydrateless/checkbox.css`
- **JS**: none.

## Frameworks

::: code-group

```tsx [React]
import { Checkbox } from '@hydrateless/react';

<Checkbox defaultChecked>Accept terms</Checkbox>;
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Checkbox } from '@hydrateless/vue';

const checked = ref(true);
</script>

<template>
  <Checkbox v-model="checked">Accept terms</Checkbox>
</template>
```

```svelte [Svelte]
<script>
  import { Checkbox } from '@hydrateless/svelte';

  let checked = $state(true);
</script>

<Checkbox bind:checked>Accept terms</Checkbox>
```

:::
