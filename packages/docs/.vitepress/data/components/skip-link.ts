import type { ComponentDoc } from '../types';

export const skipLink: ComponentDoc = {
  slug: 'skip-link',
  name: 'Skip Link',
  category: 'Navigation',
  importName: 'SkipLink',
  summary: 'A "skip to content" link revealed on keyboard focus.',
  description:
    'An accessibility "skip to content" link that is visually hidden until it receives keyboard focus, letting keyboard and screen-reader users jump past repeated navigation. CSS-only.',
  status: 'stable',
  cssOnly: true,
  native: '<a>',
  cssFile: 'skip-link.css',
  demos: [
    {
      id: 'default',
      title: 'Skip link',
      description: 'Tab into the frame to reveal the link, which is hidden until focused.',
      layout: 'fill',
      render: () =>
        `<a class="hl-skip-link" href="#skip-demo-content" target="_self">Skip to content</a>
<p id="skip-demo-content" tabindex="-1" style="margin:2rem 0 0">Example content. Focus the skip link, then press Enter to move focus here.</p>`,
      code: {
        react: () =>
          `import { SkipLink } from '@hydrateless/react';\n\n<SkipLink href="#main-content" />`,
        vue: () =>
          `<script setup>\nimport { SkipLink } from '@hydrateless/vue';\n</script>\n\n<template>\n  <SkipLink href="#main-content" />\n</template>`,
        svelte: () =>
          `<script>\n  import { SkipLink } from '@hydrateless/svelte';\n</script>\n\n<SkipLink href="#main-content" />`,
      },
    },
  ],
  props: [
    {
      name: 'href',
      type: 'string',
      default: `'#main-content'`,
      description: 'Target landmark id.',
    },
  ],
  tokens: [
    { name: '--hl-fg', description: 'Link background when focused.' },
    { name: '--hl-radius-sm', description: 'Corner radius.' },
  ],
  a11y: [
    'Place it as the first focusable element in the document.',
    'It stays in the DOM (not `display:none`) so focus can reach it; only its position is offscreen until focused.',
  ],
  related: ['separator'],
};
