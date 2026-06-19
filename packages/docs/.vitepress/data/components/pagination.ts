import type { ComponentDoc } from '../types';

export const pagination: ComponentDoc = {
  slug: 'pagination',
  name: 'Pagination',
  category: 'Navigation',
  importName: 'Pagination',
  summary: 'Page navigation with first/last and ellipsis truncation.',
  description:
    'Page navigation with first/last anchors and ellipsis truncation. It is a semantic `<nav>` wrapping a list of links. CSS-only.',
  status: 'stable',
  cssOnly: true,
  native: '<nav>',
  cssFile: 'pagination.css',
  demos: [
    {
      id: 'default',
      title: 'Pagination',
      layout: 'center',
      render: () =>
        `<nav class="hl-pagination" aria-label="Pagination">
  <ul>
    <li><a class="hl-pagination-item" href="#" aria-label="Previous page">‹</a></li>
    <li><a class="hl-pagination-item" href="#" aria-current="page">1</a></li>
    <li><a class="hl-pagination-item" href="#">2</a></li>
    <li aria-hidden="true"><span class="hl-pagination-ellipsis">…</span></li>
    <li><a class="hl-pagination-item" href="#">9</a></li>
    <li><a class="hl-pagination-item" href="#" aria-label="Next page">›</a></li>
  </ul>
</nav>`,
      code: {
        react: () =>
          `import { useState } from 'react';\nimport { Pagination } from '@hydrateless/react';\n\nfunction Example() {\n  const [page, setPage] = useState(1);\n  return <Pagination page={page} count={9} onPageChange={setPage} />;\n}`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Pagination } from '@hydrateless/vue';\nconst page = ref(1);\n</script>\n\n<template>\n  <Pagination :page="page" :count="9" @update:page="page = $event" />\n</template>`,
        svelte: () =>
          `<script>\n  import { Pagination } from '@hydrateless/svelte';\n  let page = $state(1);\n</script>\n\n<Pagination {page} count={9} onPageChange={(p) => (page = p)} />`,
      },
    },
  ],
  props: [
    { name: 'page', type: 'number', description: 'Current page (1-based).' },
    { name: 'count', type: 'number', description: 'Total number of pages.' },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: 'Fires when a page link is chosen.',
    },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Active page background.' },
    { name: '--hl-surface-2', description: 'Hovered item background.' },
    { name: '--hl-radius-md', description: 'Item corner radius.' },
  ],
  a11y: [
    'Label the `<nav>` with `aria-label="Pagination"`.',
    'Mark the active page with `aria-current="page"`; give the arrows accessible labels.',
  ],
  related: ['breadcrumb', 'table'],
};
