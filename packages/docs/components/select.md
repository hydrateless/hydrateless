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

<Select
  options={[
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
  ]}
/>;
```

```vue [Vue]
<template>
  <span class="hl-select-wrapper">
    <select class="hl-select">
      <option>One</option>
      <option>Two</option>
    </select>
  </span>
</template>
```

```svelte [Svelte]
<span class="hl-select-wrapper">
  <select class="hl-select">
    <option>One</option>
    <option>Two</option>
  </select>
</span>
```

:::
