import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Hydrateless',
  description: 'Fast, accessible UI primitives built on semantic HTML and modern CSS.',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  // Overridable for deployment. GitHub Project Pages serve from a subpath
  // (e.g. /hydrateless/), set via DOCS_BASE in the Pages workflow.
  base: process.env.DOCS_BASE || '/',
  ignoreDeadLinks: [/^\.\/api\//],
  head: [['meta', { name: 'theme-color', content: '#3b82f6' }]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/accordion' },
      { text: 'Frameworks', link: '/frameworks/react' },
      { text: 'API', link: '/reference' },
      { text: '0.3.0', link: '/guide/getting-started' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Dark Mode', link: '/guide/dark-mode' },
            { text: 'CSS Layers', link: '/guide/css-layers' },
            { text: 'CDN Usage', link: '/guide/cdn' },
            { text: 'Server-Side Rendering', link: '/guide/ssr' },
          ],
        },
      ],
      '/frameworks/': [
        {
          text: 'Framework Guides',
          items: [
            { text: 'React', link: '/frameworks/react' },
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'Svelte', link: '/frameworks/svelte' },
            { text: 'Astro', link: '/frameworks/astro' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Accordion', link: '/components/accordion' },
            { text: 'Disclosure', link: '/components/disclosure' },
            { text: 'Tabs', link: '/components/tabs' },
            { text: 'Dropdown Menu', link: '/components/dropdown' },
            { text: 'Modal', link: '/components/modal' },
            { text: 'Drawer', link: '/components/drawer' },
            { text: 'Popover', link: '/components/popover' },
            { text: 'Tooltip', link: '/components/tooltip' },
            { text: 'Toast', link: '/components/toast' },
            { text: 'Table of Contents', link: '/components/toc' },
            { text: 'Breadcrumb', link: '/components/breadcrumb' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Skip Link', link: '/components/skip-link' },
          ],
        },
      ],
      '/reference': [
        {
          text: 'Reference',
          items: [{ text: 'Enhancer API', link: '/reference' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/hydrateless/hydrateless' }],
    search: { provider: 'local' },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Hydrateless',
    },
  },
});
