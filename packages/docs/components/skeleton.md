# Skeleton

A placeholder shown while content loads. CSS-only — mark it `aria-hidden="true"`
so screen readers skip it, and it respects `prefers-reduced-motion`.

## Demo

<div class="hl-demo">
<span class="hl-skeleton" data-hl-variant="circle" aria-hidden="true" style="width: 3rem; height: 3rem"></span>
<span class="hl-skeleton" data-hl-variant="text" aria-hidden="true" style="width: 12rem"></span>
<span class="hl-skeleton" data-hl-variant="rect" aria-hidden="true" style="width: 100%; height: 5rem"></span>
</div>

## HTML

```html
<span class="hl-skeleton" data-hl-variant="text" aria-hidden="true"></span>
```

- **CSS**: `hydrateless/skeleton.css`
- **JS**: none.
- **Variant**: `data-hl-variant` = `rect` | `text` | `circle`.
- **Motion**: the shimmer animation is disabled under `prefers-reduced-motion`.

## Frameworks

The React component takes `variant`, `width`, and `height` props.

::: code-group

```tsx [React]
import { Skeleton } from '@hydrateless/react';

<Skeleton variant="text" width="12rem" />;
```

```vue [Vue]
<template>
  <span class="hl-skeleton" data-hl-variant="text" aria-hidden="true"></span>
</template>
```

```svelte [Svelte]
<span class="hl-skeleton" data-hl-variant="text" aria-hidden="true"></span>
```

:::
