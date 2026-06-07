<p align="center">
  <img src=".github/assets/banner.jpg" alt="Hydrateless" width="800" />
</p>

<p align="center">
  <em>Fast, accessible UI primitives built on semantic HTML and modern CSS.</em>
</p>

<p align="center">
  <a href="https://github.com/hydrateless/hydrateless/actions/workflows/ci.yml"><img src="https://github.com/hydrateless/hydrateless/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/hydrateless/hydrateless/actions/workflows/release.yml"><img src="https://github.com/hydrateless/hydrateless/actions/workflows/release.yml/badge.svg" alt="Release" /></a>
  <a href="https://www.npmjs.com/package/hydrateless"><img src="https://img.shields.io/npm/v/hydrateless" alt="npm Version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/hydrateless" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://hydrateless.github.io/hydrateless/">Documentation</a> ·
  <a href="https://hydrateless.github.io/hydrateless/guide/getting-started">Getting Started</a> ·
  <a href="https://hydrateless.github.io/hydrateless/components/accordion">Components</a> ·
  <a href="examples/">Examples</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## Overview

Hydrateless is a lightweight component library that delivers accessible, themeable UI primitives using semantic HTML and modern CSS first, with no JavaScript by default. It relies on native browser capabilities such as `<details>` and the `:has()` selector to keep runtime cost near zero, then selectively auto-loads tiny JavaScript enhancers only when an interaction truly requires it.

## Features

- **CSS-first components:** Accordions, tabs, modals, drawers, tooltips, and more work out of the box with no JavaScript.
- **A full component set:** Forms (button, input, textarea, select, checkbox, radio group, switch, slider, segmented control, combobox, field), actions & overlays (dropdown, menu, modal, drawer, popover, tooltip, command palette), feedback (alert, badge, progress, spinner, skeleton, toast), data display (card, avatar, table, kbd), and navigation (breadcrumb, pagination, table of contents, separator).
- **Optional JS enhancers:** Add keyboard navigation, focus traps, and ARIA management only where needed.
- **Auto-initialization:** The `@hydrateless/auto` package detects `data-hl-*` attributes and lazy-loads the right enhancers.
- **Design tokens:** Theme every component through CSS variables for colors, spacing, radii, and typography.
- **Dark mode:** Automatic support via `prefers-color-scheme`, with manual overrides using `data-theme`.
- **CSS layers:** All styles use `@layer`, so your custom CSS can override defaults without specificity battles.
- **Accessible by default:** ARIA roles, keyboard support, focus management, and skip links are built in.
- **Modular imports:** Import the full bundle or individual component stylesheets as needed.
- **Framework parity:** First-class, fully-typed component suites for [React](https://hydrateless.github.io/hydrateless/frameworks/react), [Vue](https://hydrateless.github.io/hydrateless/frameworks/vue), and [Svelte](https://hydrateless.github.io/hydrateless/frameworks/svelte) — the same components and API surface in every framework — plus low-level hooks/directives/actions and an [Astro](https://hydrateless.github.io/hydrateless/frameworks/astro) guide.
- **CDN ready:** Drop in minified CSS and a self-contained auto-initializer from unpkg or jsDelivr. No build step required.

## Quick Start

### Installation

```bash
npm install hydrateless @hydrateless/auto
```

### Usage

```html
<link rel="stylesheet" href="node_modules/hydrateless/dist/hydrateless.css" />
<script type="module" src="node_modules/@hydrateless/auto/dist/index.js"></script>

<div data-hl-accordion>
  <details>
    <summary>Section one</summary>
    <div class="accordion-panel">First panel content.</div>
  </details>
  <details>
    <summary>Section two</summary>
    <div class="accordion-panel">Second panel content.</div>
  </details>
</div>
```

### Use with a framework

```bash
# Pick your framework binding
npm install hydrateless @hydrateless/react
npm install hydrateless @hydrateless/vue
npm install hydrateless @hydrateless/svelte
```

Every binding ships the same first-class component suite with an identical,
compound API — only the framework idioms differ:

```tsx
// React
import 'hydrateless/hydrateless.css';
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';

<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
  </TabList>
  <TabPanel>First</TabPanel>
  <TabPanel>Second</TabPanel>
</Tabs>;
```

```svelte
<!-- Svelte 5 -->
<script>
  import 'hydrateless/hydrateless.css';
  import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/svelte';
</script>

<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
  </TabList>
  <TabPanel>First</TabPanel>
  <TabPanel>Second</TabPanel>
</Tabs>
```

See the framework guides for [React](https://hydrateless.github.io/hydrateless/frameworks/react), [Vue](https://hydrateless.github.io/hydrateless/frameworks/vue), [Svelte](https://hydrateless.github.io/hydrateless/frameworks/svelte), and [Astro](https://hydrateless.github.io/hydrateless/frameworks/astro).

### Use via CDN

No build step? Pull the minified CSS and the self-contained auto-initializer straight from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/hydrateless/dist/hydrateless.min.css" />
<script type="module" src="https://unpkg.com/@hydrateless/auto/dist/hydrateless.js"></script>
```

## Documentation

Full documentation (guides, framework integrations, per-component live demos, and the generated API reference) lives at **[hydrateless.github.io/hydrateless](https://hydrateless.github.io/hydrateless/)**.

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and guidelines for submitting pull requests.

## License

[MIT](LICENSE)
