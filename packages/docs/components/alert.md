# Alert

A short, prominent message with an intent color and optional title. CSS-only —
use `role="alert"` so assistive technology announces it.

## Demo

<div class="hl-demo">
<div class="hl-alert" role="alert" data-hl-intent="info">
  <div class="hl-alert-body">
    <p class="hl-alert-title">Heads up</p>
    <p>Your trial ends soon.</p>
  </div>
</div>
</div>

## HTML

```html
<div class="hl-alert" role="alert" data-hl-intent="info">
  <div class="hl-alert-body">
    <p class="hl-alert-title">Heads up</p>
    <p>Your trial ends soon.</p>
  </div>
</div>
```

- **CSS**: `hydrateless/alert.css`
- **JS**: none.
- **Intent**: `data-hl-intent` = `info` | `success` | `warning` | `danger` |
  `neutral`.
- **Icon**: an optional leading `<svg>` as the first child is automatically
  colored to match the intent.

## Frameworks

The React component renders the body wrapper for you; pass `title`, `intent`, and
an optional `icon` node.

::: code-group

```tsx [React]
import { Alert } from '@hydrateless/react';

<Alert intent="info" title="Heads up">
  Your trial ends soon.
</Alert>;
```

```vue [Vue]
<template>
  <div class="hl-alert" role="alert" data-hl-intent="info">
    <div class="hl-alert-body">
      <p class="hl-alert-title">Heads up</p>
      <p>Your trial ends soon.</p>
    </div>
  </div>
</template>
```

```svelte [Svelte]
<div class="hl-alert" role="alert" data-hl-intent="info">
  <div class="hl-alert-body">
    <p class="hl-alert-title">Heads up</p>
    <p>Your trial ends soon.</p>
  </div>
</div>
```

:::
