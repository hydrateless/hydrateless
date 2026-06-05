# Pagination

Page navigation with first/last anchors and ellipsis truncation. CSS-only — it's
a semantic `<nav>` wrapping a list of links.

## Demo

<div class="hl-demo">
<nav class="hl-pagination" aria-label="Pagination">
  <ul>
    <li><a class="hl-pagination-item" href="#" aria-label="Previous page">‹</a></li>
    <li><a class="hl-pagination-item" href="#" aria-current="page">1</a></li>
    <li><a class="hl-pagination-item" href="#">2</a></li>
    <li aria-hidden="true"><span class="hl-pagination-ellipsis">…</span></li>
    <li><a class="hl-pagination-item" href="#">9</a></li>
    <li><a class="hl-pagination-item" href="#" aria-label="Next page">›</a></li>
  </ul>
</nav>
</div>

## HTML

```html
<nav class="hl-pagination" aria-label="Pagination">
  <ul>
    <li><a class="hl-pagination-item" href="#" aria-label="Previous page">‹</a></li>
    <li><a class="hl-pagination-item" href="#" aria-current="page">1</a></li>
    <li><a class="hl-pagination-item" href="#">2</a></li>
    <li aria-hidden="true"><span class="hl-pagination-ellipsis">…</span></li>
    <li><a class="hl-pagination-item" href="#">9</a></li>
    <li><a class="hl-pagination-item" href="#" aria-label="Next page">›</a></li>
  </ul>
</nav>
```

- **CSS**: `hydrateless/pagination.css`
- **JS**: none.
- **Accessibility**: label the `<nav>` with `aria-label="Pagination"` and mark
  the active page with `aria-current="page"`.

## Frameworks

The React component computes the ellipsis range for you and calls
`onPageChange`. Props: `page`, `count`, `onPageChange`, `siblingCount`, and
`showControls`.

::: code-group

```tsx [React]
import { useState } from 'react';
import { Pagination } from '@hydrateless/react';

function Example() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} count={9} onPageChange={setPage} />;
}
```

```vue [Vue]
<template>
  <nav class="hl-pagination" aria-label="Pagination">
    <ul>
      <li><a class="hl-pagination-item" href="#" aria-current="page">1</a></li>
      <li><a class="hl-pagination-item" href="#">2</a></li>
    </ul>
  </nav>
</template>
```

```svelte [Svelte]
<nav class="hl-pagination" aria-label="Pagination">
  <ul>
    <li><a class="hl-pagination-item" href="#" aria-current="page">1</a></li>
    <li><a class="hl-pagination-item" href="#">2</a></li>
  </ul>
</nav>
```

:::
