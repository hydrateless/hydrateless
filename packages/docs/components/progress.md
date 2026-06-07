# Progress

A determinate or indeterminate progress bar built on the native `<progress>`
element. CSS-only — the browser handles the accessible value announcement.

## Demo

<div class="hl-demo">
<progress class="hl-progress" value="60" max="100"></progress>
<progress class="hl-progress" data-hl-intent="success" value="100" max="100"></progress>
<progress class="hl-progress"></progress>
</div>

## HTML

```html
<progress class="hl-progress" value="60" max="100"></progress>
```

Omit `value` for an indeterminate bar:

```html
<progress class="hl-progress"></progress>
```

- **CSS**: `hydrateless/progress.css`
- **JS**: none.
- **Intent**: `data-hl-intent` = `primary` | `success` | `warning` | `danger` |
  `info`.
- **Size**: `data-hl-size` = `sm` | `md` | `lg`.

## Frameworks

::: code-group

```tsx [React]
import { Progress } from '@hydrateless/react';

<>
  <Progress value={60} />
  <Progress value={100} intent="success" />
  <Progress />
</>;
```

```vue [Vue]
<script setup>
import { Progress } from '@hydrateless/vue';
</script>

<template>
  <Progress :value="60" />
  <Progress :value="100" intent="success" />
  <Progress />
</template>
```

```svelte [Svelte]
<script>
  import { Progress } from '@hydrateless/svelte';
</script>

<Progress value={60} />
<Progress value={100} intent="success" />
<Progress />
```

:::
