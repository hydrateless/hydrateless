# Checkbox

A checkbox built on a native `<input type="checkbox">`, label-wrapped for a
larger hit target. CSS-only — it keeps `:checked`, `:focus-visible`, the `Space`
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

<Checkbox>Accept terms</Checkbox>;
```

```vue [Vue]
<template>
  <label class="hl-checkbox">
    <input type="checkbox" />
    <span>Accept terms</span>
  </label>
</template>
```

```svelte [Svelte]
<label class="hl-checkbox">
  <input type="checkbox" />
  <span>Accept terms</span>
</label>
```

:::
