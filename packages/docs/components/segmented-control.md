# Segmented Control

A compact single-select control built on native radios under
`role="radiogroup"`. CSS-only — the radios give you keyboard navigation and form
semantics for free.

## Demo

<div class="hl-demo">
<div class="hl-segmented" role="radiogroup">
  <label class="hl-segmented-item">
    <input type="radio" name="view" checked />
    <span>List</span>
  </label>
  <label class="hl-segmented-item">
    <input type="radio" name="view" />
    <span>Grid</span>
  </label>
</div>
</div>

## HTML

```html
<div class="hl-segmented" role="radiogroup">
  <label class="hl-segmented-item">
    <input type="radio" name="view" checked />
    <span>List</span>
  </label>
  <label class="hl-segmented-item">
    <input type="radio" name="view" />
    <span>Grid</span>
  </label>
</div>
```

- **CSS**: `hydrateless/segmented.css`
- **JS**: none.
- **Size**: `data-hl-size` = `sm` | `md` | `lg`.

## Frameworks

::: code-group

```tsx [React]
import { SegmentedControl } from '@hydrateless/react';

<SegmentedControl
  options={[
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
  ]}
  defaultValue="list"
/>;
```

```vue [Vue]
<template>
  <div class="hl-segmented" role="radiogroup">
    <label class="hl-segmented-item">
      <input type="radio" name="view" checked />
      <span>List</span>
    </label>
    <label class="hl-segmented-item">
      <input type="radio" name="view" />
      <span>Grid</span>
    </label>
  </div>
</template>
```

```svelte [Svelte]
<div class="hl-segmented" role="radiogroup">
  <label class="hl-segmented-item">
    <input type="radio" name="view" checked />
    <span>List</span>
  </label>
  <label class="hl-segmented-item">
    <input type="radio" name="view" />
    <span>Grid</span>
  </label>
</div>
```

:::
