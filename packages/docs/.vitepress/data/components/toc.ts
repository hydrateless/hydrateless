import type { ComponentDoc } from '../types';

export const toc: ComponentDoc = {
  slug: 'toc',
  name: 'Table of Contents',
  category: 'Navigation',
  importName: 'Toc',
  summary: 'Auto-generated navigation built from page headings.',
  description:
    'Auto-generated navigation built from the headings on the page, with optional scroll-spy highlighting of the current section. Add an empty `<nav data-hl-toc>` and the enhancer fills it in; call `refresh()` on the returned API after the content changes.',
  status: 'stable',
  cssOnly: false,
  native: '<nav>',
  cssFile: 'toc.css',
  enhancer: {
    fn: 'enhanceToc',
    subpath: '@hydrateless/enhancers/toc',
    signature: 'enhanceToc(document, { headings, scrollSpy, contentSelector })',
  },
  demos: [
    {
      id: 'default',
      title: 'Table of contents',
      description:
        'The empty nav on the left is filled from the sample content on the right. Toggle JS off to see the unenhanced state.',
      layout: 'fill',
      render: () =>
        `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:1rem;width:100%;align-items:start">
  <nav data-hl-toc data-hl-toc-content="#toc-demo-content" aria-label="On this page"></nav>
  <main id="toc-demo-content">
    <h2>Introduction</h2>
    <p style="margin:0 0 .75rem">A short overview of the project.</p>
    <h2>Installation</h2>
    <h3>Package managers</h3>
    <p style="margin:0 0 .75rem">Install with your tool of choice.</p>
    <h2>Usage</h2>
    <p style="margin:0">Import a component and render it.</p>
  </main>
</div>`,
      code: {
        react: () =>
          `import { Toc } from '@hydrateless/react';\n\n<Toc headings="h2,h3" scrollSpy />`,
        vue: () =>
          `<script setup>\nimport { Toc } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Toc headings="h2,h3" scroll-spy />\n</template>`,
        svelte: () =>
          `<script>\n  import { Toc } from '@hydrateless/svelte';\n</script>\n\n<Toc headings="h2,h3" scrollSpy />`,
      },
    },
  ],
  props: [
    {
      name: 'headings',
      type: 'string',
      default: `'h2,h3'`,
      description: 'Which headings to include.',
    },
    {
      name: 'scrollSpy',
      type: 'boolean',
      default: 'true',
      description: 'Highlight the section currently in view.',
    },
    {
      name: 'contentSelector',
      type: 'string',
      default: `'main'`,
      description: 'Root element to scan for headings.',
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Outline of the nav.' },
    { name: '--hl-surface-2', description: 'Active link background.' },
    { name: '--hl-radius-lg', description: 'Corner radius.' },
  ],
  a11y: [
    'Headings without an `id` are given one automatically so links resolve.',
    'Scroll-spy sets `aria-current` on the link for the section in view.',
  ],
  related: ['breadcrumb', 'pagination'],
};
