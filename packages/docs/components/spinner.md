# Spinner

A loading indicator that inherits `currentColor`. CSS-only — use
`role="status"` with an `aria-label` so it's announced.

## Demo

<div class="hl-demo">
<span class="hl-spinner" role="status" aria-label="Loading"></span>
<span class="hl-spinner" data-hl-size="lg" role="status" aria-label="Loading"></span>
</div>

## HTML

```html
<span class="hl-spinner" role="status" aria-label="Loading"></span>
```

- **CSS**: `hydrateless/spinner.css`
- **JS**: none.
- **Size**: `data-hl-size` = `sm` | `md` | `lg` | `xl`.
- **Color**: inherits `currentColor`, so set the parent's `color` to recolor it.

## Frameworks

::: code-group

```tsx [React]
import { Spinner } from '@hydrateless/react';

<Spinner size="md" label="Loading" />;
```

```vue [Vue]
<template>
  <span class="hl-spinner" role="status" aria-label="Loading"></span>
</template>
```

```svelte [Svelte]
<span class="hl-spinner" role="status" aria-label="Loading"></span>
```

:::
