# Slider

A range slider styled with the `hl-slider` primitive. CSS-only — it's a native
`<input type="range">`, so keyboard support and form values come built in.

## Demo

<div class="hl-demo">
<input type="range" class="hl-slider" min="0" max="100" value="50" />
</div>

## HTML

```html
<input type="range" class="hl-slider" min="0" max="100" value="50" />
```

- **CSS**: `hydrateless/slider.css`
- **JS**: none.

## Frameworks

::: code-group

```tsx [React]
import { Slider } from '@hydrateless/react';

<Slider min={0} max={100} defaultValue={50} />;
```

```vue [Vue]
<template>
  <input type="range" class="hl-slider" min="0" max="100" value="50" />
</template>
```

```svelte [Svelte]
<input type="range" class="hl-slider" min="0" max="100" value="50" />
```

:::
