import type { ComponentDoc } from '../types';

export const pagination: ComponentDoc = {
  slug: 'pagination',
  name: 'Pagination',
  category: 'Navigation',
  importName: 'Pagination',
  summary: 'Page navigation with first/last and ellipsis truncation.',
  description:
    'Page navigation with first/last anchors and ellipsis truncation. It is a semantic `<nav>` wrapping a list of links, and server-rendered links work with no JavaScript. Add `data-hl-pagination` and the optional enhancer tracks the current page, disables the end controls, adds arrow-key navigation, and can render the whole control from a `data-hl-total`.',
  status: 'stable',
  cssOnly: true,
  native: '<nav>',
  cssFile: 'pagination.css',
  enhancer: {
    fn: 'enhancePagination',
    subpath: '@hydrateless/enhancers/pagination',
    signature:
      'enhancePagination(container, { total, defaultValue, siblings, boundaries, onValueChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Pagination',
      description:
        'This in-page preview updates with the enhancer. Use real page URLs for server-rendered navigation without JavaScript.',
      layout: 'center',
      render: () =>
        `<nav class="hl-pagination" aria-label="Pagination" data-hl-pagination data-hl-total="9">
  <ul>
    <li><a class="hl-pagination-item" href="#" data-hl-page="prev" aria-label="Previous page" aria-disabled="true">‹</a></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="1" aria-current="page">1</a></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="2">2</a></li>
    <li aria-hidden="true"><span class="hl-pagination-ellipsis">…</span></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="9">9</a></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="next" aria-label="Next page">›</a></li>
  </ul>
</nav>`,
      code: {
        react: () =>
          `import { useState } from 'react';\nimport { Pagination } from '@hydrateless/react';\n\nfunction Example() {\n  const [page, setPage] = useState(1);\n  return <Pagination page={page} count={9} onPageChange={setPage} />;\n}`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Pagination } from '@hydrateless/vue';\nconst page = ref(1);\n</script>\n\n<template>\n  <Pagination v-model:page="page" :count="9" />\n</template>`,
        svelte: () =>
          `<script>\n  import { Pagination } from '@hydrateless/svelte';\n  let page = $state(1);\n</script>\n\n<Pagination {page} count={9} onPageChange={(p) => (page = p)} />`,
      },
    },
    {
      id: 'enhanced',
      title: 'Enhanced',
      description:
        'Mark each control with `data-hl-page` (a number, `prev`, or `next`). Hash links and buttons become in-page page changes; links with a real `href` keep navigating so the server can render the next page.',
      layout: 'center',
      render: () =>
        `<nav class="hl-pagination" aria-label="Pagination" data-hl-pagination>
  <ul>
    <li><a class="hl-pagination-item" href="#" data-hl-page="prev" aria-label="Previous page">‹</a></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="1">1</a></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="2" aria-current="page">2</a></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="3">3</a></li>
    <li aria-hidden="true"><span class="hl-pagination-ellipsis">…</span></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="9">9</a></li>
    <li><a class="hl-pagination-item" href="#" data-hl-page="next" aria-label="Next page">›</a></li>
  </ul>
</nav>`,
    },
    {
      id: 'rendered',
      title: 'Rendered from a total',
      description:
        'Leave the list empty and give the enhancer a `data-hl-total`; it renders numbered buttons with ellipses using the same range algorithm as the framework bindings and re-renders on every change.',
      layout: 'center',
      knobs: [
        { id: 'total', type: 'number', label: 'Total pages', default: 20, min: 1, max: 100 },
        { id: 'page', type: 'number', label: 'Current page', default: 10, min: 1, max: 100 },
        { id: 'siblings', type: 'number', label: 'Siblings', default: 1, min: 0, max: 3 },
      ],
      render: (v) =>
        `<nav class="hl-pagination" aria-label="Search results" data-hl-pagination data-hl-total="${v.total}" data-hl-default-value="${v.page}" data-hl-siblings="${v.siblings}">
  <ul></ul>
</nav>`,
    },
  ],
  props: [
    { name: 'page', type: 'number', description: 'Current page (1-based).' },
    { name: 'count', type: 'number', description: 'Total number of pages.' },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: 'Fires when a page link is chosen (Vue: `v-model:page` / `update:page`).',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: number }',
      description:
        'Fires from an enhanced `<nav>` with the new page after every change (also the `onValueChange` callback).',
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
    'When enhanced, the numbered controls stay in the tab order and Left/Right (flipped in RTL), Home, and End move between them.',
  ],
  related: ['breadcrumb', 'table'],
};
