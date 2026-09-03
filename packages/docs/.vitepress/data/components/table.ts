import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const table: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  category: 'Data Display',
  importName: 'Table',
  summary: 'A styled native <table> with striping and hover.',
  description:
    'A styled native `<table>` with optional zebra striping, row hover, cell alignment, and density. Apply the class to standard table markup and wrap it in `.hl-table-wrapper` to scroll horizontally on narrow screens. CSS-only.',
  status: 'stable',
  cssOnly: true,
  native: '<table>',
  cssFile: 'table.css',
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
  tokens: [
    { name: '--hl-border', description: 'Row dividers.' },
    { name: '--hl-surface-2', description: 'Striped and hovered row background.' },
    { name: '--hl-fg-muted', description: 'Header text color.' },
  ],
  a11y: [
    'A native `<table>` with `<thead>` and `<th scope="col">` exposes column structure to assistive tech.',
    'Striping and hover are purely visual; they never replace real headers or captions.',
    'The `.hl-table-wrapper` scrolls horizontally instead of clipping columns on narrow viewports.',
  ],
  related: ['card', 'pagination'],
};
