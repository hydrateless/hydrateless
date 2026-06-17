# Toast

Non-modal notifications that appear temporarily and auto-dismiss. The region
uses an ARIA live region so screen readers announce new messages.

## Demo

<div class="hl-demo">
<button data-hl-toast-trigger="Saved successfully!">Show toast</button>
<div data-hl-toast-region></div>
</div>

## Declarative triggers

Place a region somewhere in your page, then use trigger buttons:

```html
<div data-hl-toast-region></div>

<button data-hl-toast-trigger="Item copied!">Copy</button>
```

## Imperative API

For full control, grab the API from the enhancer's handle:

```js
import { enhanceToast } from '@hydrateless/enhancers/toast';

const toast = enhanceToast(document).api;
toast.show('Changes saved.');
toast.show('Something went wrong.', { duration: 8000, variant: 'danger' });
```

- **CSS**: `hydrateless/toast.css`
- **JS**: `enhanceToast(container, options?)` returns a handle whose `api` is
  `{ show(message, options?), dismiss(toast) }`
- **Options**: `duration` (ms, default 5000; `0` disables auto-dismiss) and
  `variant` (`info` | `success` | `warning` | `danger`).
- **Accessibility**: the region uses `role="status"` with `aria-live="polite"`;
  dismiss buttons include `aria-label="Dismiss"`.

## Frameworks

`useToast()` works anywhere in every binding, no provider or setup required.

::: code-group

```tsx [React]
import { useToast } from '@hydrateless/react';

function SaveButton() {
  const toast = useToast();
  return <button onClick={() => toast.show('Saved!')}>Save</button>;
}
```

```vue [Vue]
<script setup>
import { useToast } from '@hydrateless/vue';
const toast = useToast();
</script>

<template>
  <button @click="toast.show('Saved!')">Save</button>
</template>
```

```svelte [Svelte]
<script>
  import { useToast } from '@hydrateless/svelte';

  const toast = useToast();
</script>

<button onclick={() => toast.show('Saved!')}>Save</button>
```

:::
