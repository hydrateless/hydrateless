# Textarea

A multi-line text input styled with the `hl-textarea` primitive. CSS-only and
built on a native `<textarea>`.

## Demo

<div class="hl-demo">
<textarea class="hl-textarea" placeholder="Write a message…" rows="3"></textarea>
</div>

## HTML

```html
<textarea class="hl-textarea"></textarea>
```

- **CSS**: `hydrateless/textarea.css`
- **JS**: none.
- **Invalid**: add `data-hl-invalid` (with `aria-invalid="true"`) for the error
  state.

## Frameworks

::: code-group

```tsx [React]
import { Textarea } from '@hydrateless/react';

<Textarea placeholder="Write a message…" rows={3} />;
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Textarea } from '@hydrateless/vue';

const value = ref('');
</script>

<template>
  <Textarea v-model="value" placeholder="Write a message…" rows="3" />
</template>
```

```svelte [Svelte]
<script>
  import { Textarea } from '@hydrateless/svelte';

  let value = $state('');
</script>

<Textarea bind:value placeholder="Write a message…" rows="3" />
```

:::
