import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const table: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  category: 'Data Display',
  summary: 'A styled native <table> with striping and hover.',
  description:
    'A styled native `<table>` with optional zebra striping and row hover. Apply the class to standard table markup. CSS-only.',
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
      ],
      render: (v) =>
        `<table class="hl-table"${attr('data-hl-striped', v.striped)}${attr('data-hl-hover', v.hover)} style="width:100%">
  <thead>
    <tr><th>Name</th><th>Role</th><th data-hl-align="end">Commits</th></tr>
  </thead>
  <tbody>
    <tr><td>Ada Lovelace</td><td>Engineer</td><td data-hl-align="end">128</td></tr>
    <tr><td>Alan Turing</td><td>Researcher</td><td data-hl-align="end">96</td></tr>
    <tr><td>Grace Hopper</td><td>Compiler</td><td data-hl-align="end">204</td></tr>
  </tbody>
</table>`,
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Row dividers.' },
    { name: '--hl-surface-2', description: 'Striped row background.' },
    { name: '--hl-fg-muted', description: 'Header text color.' },
  ],
  a11y: [
    'A native `<table>` with `<thead>`/`<th>` exposes column structure to assistive tech.',
    'Striping and hover are purely visual; they never replace real headers.',
  ],
  related: ['card', 'pagination'],
};
