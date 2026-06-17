import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Hydrateless',
  description: 'Fast, accessible UI primitives built on semantic HTML and modern CSS.',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  // The site is served at the root of the custom domain (hydrateless.com), so
  // the base is '/'. Overridable via DOCS_BASE for a subpath deployment (e.g.
  // a GitHub Project Pages preview at /hydrateless/).
  base: process.env.DOCS_BASE || '/',
  sitemap: { hostname: 'https://hydrateless.com/' },
  ignoreDeadLinks: [/^\.\/api\//],
  head: [['meta', { name: 'theme-color', content: '#3b82f6' }]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/button' },
      { text: 'Frameworks', link: '/frameworks/react' },
      { text: 'API', link: '/reference' },
      { text: '0.4.0', link: '/guide/getting-started' },
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
          text: 'Forms',
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'Input', link: '/components/input' },
            { text: 'Textarea', link: '/components/textarea' },
            { text: 'Select', link: '/components/select' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Radio Group', link: '/components/radio-group' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Slider', link: '/components/slider' },
            { text: 'Segmented Control', link: '/components/segmented-control' },
            { text: 'Combobox', link: '/components/combobox' },
            { text: 'Field', link: '/components/field' },
          ],
        },
        {
          text: 'Actions & Overlays',
          items: [
            { text: 'Dropdown Menu', link: '/components/dropdown' },
            { text: 'Menu', link: '/components/menu' },
            { text: 'Modal', link: '/components/modal' },
            { text: 'Drawer', link: '/components/drawer' },
            { text: 'Popover', link: '/components/popover' },
            { text: 'Tooltip', link: '/components/tooltip' },
            { text: 'Command Palette', link: '/components/command-palette' },
          ],
        },
        {
          text: 'Disclosure',
          items: [
            { text: 'Accordion', link: '/components/accordion' },
            { text: 'Disclosure', link: '/components/disclosure' },
            { text: 'Tabs', link: '/components/tabs' },
          ],
        },
        {
          text: 'Feedback',
          items: [
            { text: 'Alert', link: '/components/alert' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Progress', link: '/components/progress' },
            { text: 'Spinner', link: '/components/spinner' },
            { text: 'Skeleton', link: '/components/skeleton' },
            { text: 'Toast', link: '/components/toast' },
          ],
        },
        {
          text: 'Data Display',
          items: [
            { text: 'Card', link: '/components/card' },
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Table', link: '/components/table' },
            { text: 'Kbd', link: '/components/kbd' },
          ],
        },
        {
          text: 'Navigation',
          items: [
            { text: 'Breadcrumb', link: '/components/breadcrumb' },
            { text: 'Pagination', link: '/components/pagination' },
            { text: 'Table of Contents', link: '/components/toc' },
            { text: 'Skip Link', link: '/components/skip-link' },
            { text: 'Separator', link: '/components/separator' },
          ],
        },
      ],
      '/reference': [
        {
          text: 'Reference',
          items: [{ text: 'API Reference', link: '/reference' }],
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
