# Slider

A range slider styled with the `hl-slider` primitive. CSS-only. It's a native
`<input type="range">`, so keyboard support and form values come built in.

## Demo

<div class="hl-demo">
<input type="range" class="hl-slider" min="0" max="100" value="50" />
</div>

## HTML

```html
<input type="range" class="hl-slider" min="0" max="100" value="50" />
```

- **CSS**: `hydrateless/slider.css`
- **JS**: none.

## Frameworks

::: code-group

```tsx [React]
import { Slider } from '@hydrateless/react';

<Slider min={0} max={100} defaultValue={50} />;
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Slider } from '@hydrateless/vue';

const value = ref(50);
</script>

<template>
  <Slider v-model="value" min="0" max="100" />
</template>
```

```svelte [Svelte]
<script>
  import { Slider } from '@hydrateless/svelte';

  let value = $state(50);
</script>

<Slider bind:value min={0} max={100} />
```

:::
