import { readFileSync } from 'node:fs';
import { defineConfig, type DefaultTheme } from 'vitepress';
import { componentsByCategory } from './data/registry';

// Single source of truth for the version chip: the published library package.
const { version } = JSON.parse(
  readFileSync(new URL('../../hydrateless/package.json', import.meta.url), 'utf8'),
) as { version: string };

// The Components sidebar is derived from the component registry, so adding a
// component data file is all it takes to list it; there is no second list to
// keep in sync.
const componentSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Overview',
    items: [{ text: 'All components', link: '/components/' }],
  },
  ...componentsByCategory().map(({ category, items }) => ({
    text: category,
    items: items.map((c) => ({ text: c.name, link: `/components/${c.slug}` })),
  })),
];

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
      { text: 'Components', link: '/components/' },
      { text: 'Playground', link: '/playground/theme' },
      { text: 'Frameworks', link: '/frameworks/react' },
      { text: 'API', link: '/reference' },
      {
        text: `v${version}`,
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          {
            text: 'Changelog',
            link: 'https://github.com/hydrateless/hydrateless/blob/main/CHANGELOG.md',
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'CDN Usage', link: '/guide/cdn' },
            { text: 'Configuring with Data Attributes', link: '/guide/data-attributes' },
            { text: 'Server-Side Rendering', link: '/guide/ssr' },
            { text: 'Browser Support', link: '/guide/browser-support' },
            { text: 'Migrating to 0.10', link: '/guide/migration' },
          ],
        },
        {
          text: 'Styling',
          items: [
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Dark Mode', link: '/guide/dark-mode' },
            { text: 'CSS Layers', link: '/guide/css-layers' },
            { text: 'Motion', link: '/guide/motion' },
            { text: 'Right-to-Left', link: '/guide/rtl' },
            { text: 'Composing and Extending', link: '/guide/composing' },
          ],
        },
        {
          text: 'Behavior',
          items: [
            { text: 'Accessibility', link: '/guide/accessibility' },
            { text: 'Forms', link: '/guide/forms' },
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
      '/playground/': [
        {
          text: 'Playground',
          items: [{ text: 'Theme Studio', link: '/playground/theme' }],
        },
      ],
      '/components/': componentSidebar,
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
