import { readFileSync } from 'node:fs';
import { defineConfig, type DefaultTheme } from 'vitepress';
import { componentsByCategory, getComponent } from './data/registry';
import { renderComponentSearchMarkdown } from './data/search';

// Single source of truth for the version chip: the published library package.
const { version } = JSON.parse(
  readFileSync(new URL('../../hydrateless/package.json', import.meta.url), 'utf8'),
) as { version: string };

const siteUrl = 'https://hydrateless.com';
const defaultDescription = 'Fast, accessible UI primitives built on semantic HTML and modern CSS.';

// The site is served at the root of the custom domain (hydrateless.com), so
// the base is '/'. Overridable via DOCS_BASE for a subpath deployment (e.g.
// a GitHub Project Pages preview at /hydrateless/).
const base = process.env.DOCS_BASE || '/';

function componentSlugFromPath(relativePath: string): string | undefined {
  const match = relativePath.match(/^components\/([^/]+)\.md$/);
  return match && match[1] !== 'index' ? match[1] : undefined;
}

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
  description: defaultDescription,
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  // The published CSS already targets our supported browsers. Reprocessing it
  // with the repository's PostCSS preset rewrites light-dark(), logical RTL
  // properties, and selectors, so previews no longer match the shipped library.
  vite: { css: { postcss: { plugins: [] } } },
  base,
  sitemap: { hostname: `${siteUrl}/` },
  ignoreDeadLinks: [/^\.\/api\//],
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Hydrateless' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/og-image.png` }],
  ],
  transformPageData(pageData) {
    const slug = componentSlugFromPath(pageData.relativePath);
    if (slug && !pageData.description) {
      const doc = getComponent(slug);
      if (doc) pageData.description = doc.summary;
    }
  },
  transformHead({ pageData }) {
    const pageTitle =
      pageData.title && pageData.title !== 'Hydrateless'
        ? `${pageData.title} | Hydrateless`
        : 'Hydrateless | Accessible UI primitives, near-zero runtime';
    const pageDescription = pageData.description || defaultDescription;
    const cleanPath = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
    const canonicalUrl = `${siteUrl}/${cleanPath}`;
    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
    ];
  },
  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24 },
    outline: { level: [2, 3], label: 'On this page' },
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '^/guide/' },
      { text: 'Components', link: '/components/', activeMatch: '^/components/' },
      { text: 'Playground', link: '/playground/theme', activeMatch: '^/playground/' },
      { text: 'Frameworks', link: '/frameworks/react', activeMatch: '^/frameworks/' },
      { text: 'API', link: '/reference', activeMatch: '^/reference' },
      {
        text: `v${version}`,
        items: [
          { text: 'Migration Guide', link: '/guide/migration' },
          {
            text: 'Changelog',
            link: 'https://github.com/hydrateless/hydrateless/blob/main/CHANGELOG.md',
          },
          {
            text: 'Releases',
            link: 'https://github.com/hydrateless/hydrateless/releases',
          },
          {
            text: 'npm',
            link: 'https://www.npmjs.com/package/hydrateless',
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
            { text: 'Migration Guide', link: '/guide/migration' },
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
    editLink: {
      pattern: ({ filePath }) => {
        const match = filePath.match(/^components\/([^/]+)\.md$/);
        if (match && match[1] !== 'index') {
          return `https://github.com/hydrateless/hydrateless/edit/main/packages/docs/.vitepress/data/components/${match[1]}.ts`;
        }
        return `https://github.com/hydrateless/hydrateless/edit/main/packages/docs/${filePath}`;
      },
      text: 'Edit this page on GitHub',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/hydrateless/hydrateless' }],
    search: {
      provider: 'local',
      options: {
        _render(src, env, md) {
          const slug = componentSlugFromPath(env.relativePath);
          if (slug) {
            const doc = getComponent(slug);
            if (doc) return md.render(renderComponentSearchMarkdown(doc), env);
          }
          const html = md.render(src, env);
          return env.frontmatter?.search === false ? '' : html;
        },
      },
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Hydrateless',
    },
  },
});
