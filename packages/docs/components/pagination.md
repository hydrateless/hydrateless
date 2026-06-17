# Pagination

Page navigation with first/last anchors and ellipsis truncation. CSS-only. It's
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
<script setup>
import { ref } from 'vue';
import { Pagination } from '@hydrateless/vue';

const page = ref(1);
</script>

<template>
  <Pagination :page="page" :count="9" @update:page="page = $event" />
</template>
```

```svelte [Svelte]
<script>
  import { Pagination } from '@hydrateless/svelte';

  let page = $state(1);
</script>

<Pagination {page} count={9} onPageChange={(p) => (page = p)} />
```

:::
