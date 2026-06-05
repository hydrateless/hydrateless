# Breadcrumb

Breadcrumb navigation using a semantic `<nav>` wrapping an ordered list.
CSS-only — no enhancer required.

## Demo

<div class="hl-demo">
<nav data-hl-breadcrumb aria-label="Breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li><a href="#">Docs</a></li>
    <li><span aria-current="page">Components</span></li>
  </ol>
</nav>
</div>

## HTML

```html
<nav data-hl-breadcrumb aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Docs</a></li>
    <li><span aria-current="page">Components</span></li>
  </ol>
</nav>
```

- **CSS**: `hydrateless/breadcrumb.css`
- **JS**: none.
- **Accessibility**: use `aria-label="Breadcrumb"` on the `<nav>` and
  `aria-current="page"` on the current item.

## Frameworks

::: code-group

```tsx [React]
import { Breadcrumb } from '@hydrateless/react';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Components', current: true },
  ]}
/>;
```

```vue [Vue]
<template>
  <nav data-hl-breadcrumb aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><span aria-current="page">Components</span></li>
    </ol>
  </nav>
</template>
```

```svelte [Svelte]
<nav data-hl-breadcrumb aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><span aria-current="page">Components</span></li>
  </ol>
</nav>
```

:::
