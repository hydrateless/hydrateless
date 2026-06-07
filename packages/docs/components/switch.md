# Switch

A toggle switch built on a native checkbox with `role="switch"`. CSS-only — it
keeps full keyboard and form semantics for free.

## Demo

<div class="hl-demo">
<label data-hl-switch>
  <input type="checkbox" role="switch" checked />
  Enable notifications
</label>
</div>

## HTML

```html
<label data-hl-switch>
  <input type="checkbox" role="switch" />
  Enable notifications
</label>
```

- **CSS**: `hydrateless/switch.css`
- **JS**: none.

Because it's a real checkbox, it participates in forms, supports `:checked`,
`:focus-visible`, and the `Space` key, and is announced correctly by assistive
technology.

## Frameworks

::: code-group

```tsx [React]
import { Switch } from '@hydrateless/react';

<Switch defaultChecked>Enable notifications</Switch>;
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Switch } from '@hydrateless/vue';

const checked = ref(true);
</script>

<template>
  <Switch v-model="checked">Enable notifications</Switch>
</template>
```

```svelte [Svelte]
<script>
  import { Switch } from '@hydrateless/svelte';

  let checked = $state(true);
</script>

<Switch bind:checked>Enable notifications</Switch>
```

:::
