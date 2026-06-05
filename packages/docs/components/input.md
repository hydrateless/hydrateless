# Input

A text input styled with the `hl-input` primitive. CSS-only — it's a native
`<input>`, so validation, autofill, and form behavior work as expected.

## Demo

<div class="hl-demo">
<input class="hl-input" placeholder="Email" />
<input class="hl-input" data-hl-size="sm" placeholder="Small" />
<input class="hl-input" data-hl-invalid placeholder="Invalid" />
</div>

## HTML

```html
<input class="hl-input" placeholder="Email" />
```

- **CSS**: `hydrateless/input.css`
- **JS**: none.
- **Size**: `data-hl-size` = `sm` | `md` | `lg`.
- **Invalid**: add `data-hl-invalid` (pair it with `aria-invalid="true"`) to show
  the error state.

## Frameworks

::: code-group

```tsx [React]
import { Input } from '@hydrateless/react';

<Input size="md" placeholder="Email" />;
<Input invalid placeholder="Email" />;
```

```vue [Vue]
<template>
  <input class="hl-input" placeholder="Email" />
</template>
```

```svelte [Svelte]
<input class="hl-input" placeholder="Email" />
```

:::
