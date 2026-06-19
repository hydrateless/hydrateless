import type { ComponentDoc } from '../types';

export const breadcrumb: ComponentDoc = {
  slug: 'breadcrumb',
  name: 'Breadcrumb',
  category: 'Navigation',
  importName: 'Breadcrumb',
  summary: 'Breadcrumb navigation using a semantic nav and list.',
  description:
    'Breadcrumb navigation using a semantic `<nav>` wrapping an ordered list. CSS-only, no enhancer required.',
  status: 'stable',
  cssOnly: true,
  native: '<nav>',
  cssFile: 'breadcrumb.css',
  demos: [
    {
      id: 'default',
      title: 'Breadcrumb',
      layout: 'fill',
      render: () =>
        `<nav data-hl-breadcrumb aria-label="Breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li><a href="#">Docs</a></li>
    <li><span aria-current="page">Components</span></li>
  </ol>
</nav>`,
      code: {
        react: () =>
          `import { Breadcrumb, BreadcrumbItem } from '@hydrateless/react';\n\n<Breadcrumb>\n  <BreadcrumbItem href="/">Home</BreadcrumbItem>\n  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>\n  <BreadcrumbItem current>Components</BreadcrumbItem>\n</Breadcrumb>`,
        vue: () =>
          `<script setup>\nimport { Breadcrumb, BreadcrumbItem } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Breadcrumb>\n    <BreadcrumbItem href="/">Home</BreadcrumbItem>\n    <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>\n    <BreadcrumbItem current>Components</BreadcrumbItem>\n  </Breadcrumb>\n</template>`,
        svelte: () =>
          `<script>\n  import { Breadcrumb, BreadcrumbItem } from '@hydrateless/svelte';\n</script>\n\n<Breadcrumb>\n  <BreadcrumbItem href="/">Home</BreadcrumbItem>\n  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>\n  <BreadcrumbItem current>Components</BreadcrumbItem>\n</Breadcrumb>`,
      },
    },
  ],
  props: [
    { name: 'href', type: 'string', description: 'Link target for an item.' },
    {
      name: 'current',
      type: 'boolean',
      default: 'false',
      description: 'Marks the current page with `aria-current`.',
    },
  ],
  tokens: [
    { name: '--hl-fg-muted', description: 'Separator and inactive link color.' },
    { name: '--hl-primary', description: 'Hovered link color.' },
  ],
  a11y: [
    'Label the `<nav>` with `aria-label="Breadcrumb"`.',
    'Mark the current page with `aria-current="page"` and render it as text, not a link.',
  ],
  related: ['pagination', 'menu'],
};
