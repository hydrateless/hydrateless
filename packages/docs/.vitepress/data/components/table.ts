import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const table: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  category: 'Data Display',
  importName: 'Table',
  summary: 'A styled native <table> with striping and hover.',
  description:
    'A styled native `<table>` with optional zebra striping, row hover, cell alignment, and density. Apply the class to standard table markup and wrap it in `.hl-table-wrapper` to scroll horizontally on narrow screens. The layout is CSS-only; add `data-hl-table` and mark headers `data-hl-sort` and the optional enhancer sorts rows client-side with `aria-sort`.',
  status: 'stable',
  cssOnly: true,
  native: '<table>',
  cssFile: 'table.css',
  enhancer: {
    fn: 'enhanceTable',
    subpath: '@hydrateless/enhancers/table',
    signature: 'enhanceTable(container, { defaultValue, compare, onValueChange })',
  },
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'fill',
      knobs: [
        { id: 'striped', type: 'boolean', label: 'Striped', default: true },
        { id: 'hover', type: 'boolean', label: 'Row hover', default: true },
        { id: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
      ],
      render: (v) =>
        `<div class="hl-table-wrapper" style="width:100%">
  <table class="hl-table"${attr('data-hl-striped', v.striped)}${attr('data-hl-hover', v.hover)}${v.size !== 'md' ? attr('data-hl-size', v.size) : ''}>
    <thead>
      <tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col" data-hl-align="end">Commits</th></tr>
    </thead>
    <tbody>
      <tr><td>Ada Lovelace</td><td>Engineer</td><td data-hl-align="end">128</td></tr>
      <tr><td>Alan Turing</td><td>Researcher</td><td data-hl-align="end">96</td></tr>
      <tr><td>Grace Hopper</td><td>Compiler</td><td data-hl-align="end">204</td></tr>
    </tbody>
  </table>
</div>`,
      code: {
        react: (v) =>
          `import { Table } from '@hydrateless/react';\n\n<Table${v.striped ? ' striped' : ''}${v.hover ? ' hover' : ''}${v.size !== 'md' ? ` size="${v.size}"` : ''}>\n  <thead>\n    <tr><th scope="col">Name</th><th scope="col">Role</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ada Lovelace</td><td>Engineer</td></tr>\n    <tr><td>Alan Turing</td><td>Researcher</td></tr>\n  </tbody>\n</Table>`,
        vue: (v) =>
          `<script setup>\nimport { Table } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Table${v.striped ? ' striped' : ''}${v.hover ? ' hover' : ''}${v.size !== 'md' ? ` size="${v.size}"` : ''}>\n    <thead>\n      <tr><th scope="col">Name</th><th scope="col">Role</th></tr>\n    </thead>\n    <tbody>\n      <tr><td>Ada Lovelace</td><td>Engineer</td></tr>\n      <tr><td>Alan Turing</td><td>Researcher</td></tr>\n    </tbody>\n  </Table>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Table } from '@hydrateless/svelte';\n</script>\n\n<Table${v.striped ? ' striped' : ''}${v.hover ? ' hover' : ''}${v.size !== 'md' ? ` size="${v.size}"` : ''}>\n  <thead>\n    <tr><th scope="col">Name</th><th scope="col">Role</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ada Lovelace</td><td>Engineer</td></tr>\n    <tr><td>Alan Turing</td><td>Researcher</td></tr>\n  </tbody>\n</Table>`,
      },
    },
    {
      id: 'sortable',
      title: 'Sortable',
      description:
        'Headers with `data-hl-sort` become buttons that cycle ascending and descending. Cells sort by `data-hl-value` when present (here, the ISO date) and by text otherwise, numerically when both sides are numbers. `data-hl-default-value` picks the initial sort without any script.',
      layout: 'fill',
      render: () =>
        `<div class="hl-table-wrapper" style="width:100%">
  <table class="hl-table" data-hl-table data-hl-hover data-hl-default-value="commits:descending">
    <thead>
      <tr>
        <th scope="col" data-hl-sort="name">Name</th>
        <th scope="col">Role</th>
        <th scope="col" data-hl-sort="joined">Joined</th>
        <th scope="col" data-hl-sort="commits" data-hl-align="end">Commits</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Ada Lovelace</td><td>Engineer</td><td data-hl-value="2021-03-09">Mar 2021</td><td data-hl-align="end">128</td></tr>
      <tr><td>Alan Turing</td><td>Researcher</td><td data-hl-value="2019-11-23">Nov 2019</td><td data-hl-align="end">96</td></tr>
      <tr><td>Grace Hopper</td><td>Compiler</td><td data-hl-value="2020-06-01">Jun 2020</td><td data-hl-align="end">204</td></tr>
    </tbody>
  </table>
</div>`,
    },
  ],
  props: [
    {
      name: 'striped',
      type: 'boolean',
      default: 'false',
      description: 'Zebra-stripe body rows; renders `data-hl-striped`.',
    },
    {
      name: 'hover',
      type: 'boolean',
      default: 'false',
      description: 'Highlight the hovered row; renders `data-hl-hover`.',
    },
    {
      name: 'align',
      type: `'start' | 'center' | 'end'`,
      default: `'start'`,
      description:
        'Default cell alignment; renders `data-hl-align`. Override per cell with the same attribute.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Cell padding density; renders `data-hl-size`.',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: `{ value: { column: string; direction: 'ascending' | 'descending' } | null }`,
      description:
        'Fires after an enhanced table is re-sorted; `null` means authored order (also the `onValueChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Row dividers.' },
    { name: '--hl-surface-2', description: 'Striped and hovered row background.' },
    { name: '--hl-fg-muted', description: 'Header text color.' },
  ],
  a11y: [
    'A native `<table>` with `<thead>` and `<th scope="col">` exposes column structure to assistive tech.',
    'Striping and hover are purely visual; they never replace real headers or captions.',
    'The `.hl-table-wrapper` scrolls horizontally instead of clipping columns on narrow viewports.',
    'Sortable headers are focusable, respond to Enter and Space, and expose the active order through `aria-sort`.',
  ],
  related: ['card', 'pagination'],
};
