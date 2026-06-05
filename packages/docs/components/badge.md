# Badge

A small label for statuses, counts, and tags. CSS-only.

## Demo

<div class="hl-demo">
<span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Active</span>
<span class="hl-badge" data-hl-intent="primary" data-hl-variant="solid">New</span>
<span class="hl-badge" data-hl-intent="danger" data-hl-variant="outline">Overdue</span>
</div>

## HTML

```html
<span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Active</span>
```

- **CSS**: `hydrateless/badge.css`
- **JS**: none.
- **Intent**: `data-hl-intent` = `neutral` | `primary` | `danger` | `success` |
  `warning` | `info`.
- **Variant**: `data-hl-variant` = `soft` | `solid` | `outline`.
- **Size**: `data-hl-size` = `sm` | `md`.

## Frameworks

::: code-group

```tsx [React]
import { Badge } from '@hydrateless/react';

<Badge intent="success" variant="soft">
  Active
</Badge>;
```

```vue [Vue]
<template>
  <span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Active</span>
</template>
```

```svelte [Svelte]
<span class="hl-badge" data-hl-intent="success" data-hl-variant="soft">Active</span>
```

:::
