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
  <a href="https://hydrateless.com/">Documentation</a> ·
  <a href="https://hydrateless.com/guide/getting-started">Getting Started</a> ·
  <a href="https://hydrateless.com/components/accordion">Components</a> ·
  <a href="examples/">Examples</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## Overview

Hydrateless is a lightweight component library that delivers accessible, themeable UI primitives using semantic HTML and modern CSS first, with no JavaScript by default. Overlays ride on the web platform's own building blocks: the Popover API, HTML Invoker Commands (`command`/`commandfor`), the native `<dialog>` element, and CSS anchor positioning, while `<details>` and the `:has()` selector drive disclosures and tabs. A button opens a modal or a popover with no script at all. That keeps runtime cost near zero, and tiny JavaScript enhancers auto-load only to add the accessibility the platform can't yet express on its own, such as roving focus, arrow-key navigation, and ARIA wiring.

## Features

- **CSS-first components:** Accordions, tabs, modals, drawers, tooltips, and more work out of the box with no JavaScript.
- **Built on the web platform:** Overlays use the Popover API, Invoker Commands, the native `<dialog>`, and CSS anchor positioning instead of reinventing them in script, so light-dismiss, the top layer, focus trapping, and positioning come from the browser. Targets the modern Baseline.
- **Tested in real browsers:** Beyond unit tests, a Playwright and axe end-to-end suite exercises every component, with JavaScript both off and on, across Chromium, Firefox, and WebKit, so the no-JS baseline and the enhanced experience are both verified for accessibility.
- **A full component set:** Forms (button, input, textarea, select, checkbox, radio group, switch, slider, segmented control, combobox, field), actions & overlays (dropdown, menu, modal, drawer, popover, tooltip, command palette), feedback (alert, badge, progress, spinner, skeleton, toast), data display (card, avatar, table, kbd), and navigation (breadcrumb, pagination, table of contents, separator).
- **Optional JS enhancers:** Add keyboard navigation, focus return, and ARIA management only where needed. Every enhancer follows the same contract: `enhanceX(container?, options?)` returns an imperative API (`value`/`setValue`, `open`/`setOpen`) and emits `hl:change`, `hl:open-change`, `hl:select`, or `hl:command` DOM events. Enhancers are safe no-ops on the server.
- **APG keyboard behavior:** Menus, dropdowns, tabs, accordions, comboboxes, and the command palette follow the WAI-ARIA Authoring Practices: roving focus, arrow, Home/End, PageUp/PageDown, typeahead, disabled-item skipping, `menuitemcheckbox`/`menuitemradio` state, Escape-to-dismiss, and focus returned to the trigger when an overlay closes.
- **Controlled or uncontrolled:** Framework components support both modes: `defaultValue`/`defaultOpen` for hands-off use, `value`/`open` with change callbacks (or `v-model` / `bind:`) for full control.
- **Auto-initialization:** The `@hydrateless/auto` package detects `data-hl-*` attributes, lazy-loads the right enhancers, and keeps watching the DOM so dynamic content is enhanced automatically.
- **Design tokens:** Theme every component through CSS variables for colors, spacing, radii, typography, motion, focus rings, and overlay sizes.
- **Dark mode:** Colors are defined once with `light-dark()`; the system preference applies automatically, and `data-theme="light|dark"` overrides it for the page or any subtree.
- **CSS layers:** All styles use `@layer`, so your custom CSS can override defaults without specificity battles.
- **Accessible by default:** ARIA roles, keyboard support, focus management, forced-colors support, reduced-motion handling, and skip links are built in.
- **RTL ready:** Every stylesheet uses logical properties, so drawers, switches, breadcrumbs, and menus mirror correctly under `dir="rtl"`.
- **Modular imports:** Import the full bundle or individual component stylesheets as needed.
- **Framework parity:** First-class, fully typed component suites for [React](https://hydrateless.com/frameworks/react), [Vue](https://hydrateless.com/frameworks/vue), and [Svelte](https://hydrateless.com/frameworks/svelte) with identical component lists and prop contracts, a single `useEnhancer` escape hatch per framework, and an [Astro](https://hydrateless.com/frameworks/astro) guide.
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
    <div class="hl-accordion-panel">First panel content.</div>
  </details>
  <details>
    <summary>Section two</summary>
    <div class="hl-accordion-panel">Second panel content.</div>
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
compound API; only the framework idioms differ:

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

See the framework guides for [React](https://hydrateless.com/frameworks/react), [Vue](https://hydrateless.com/frameworks/vue), [Svelte](https://hydrateless.com/frameworks/svelte), and [Astro](https://hydrateless.com/frameworks/astro).

### Use via CDN

No build step? Pull the minified CSS and the self-contained auto-initializer straight from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/hydrateless/dist/hydrateless.min.css" />
<script type="module" src="https://unpkg.com/@hydrateless/auto/dist/hydrateless.js"></script>
```

## Browser support

Hydrateless targets the modern Baseline. Components build on the Popover API, the native `<dialog>` element, HTML Invoker Commands (`command`/`commandfor`), and CSS anchor positioning, which are interoperable across current Chrome, Edge, Firefox, and Safari. Where an engine hasn't shipped CSS anchor positioning yet, the enhancers fall back to a tiny JavaScript positioner so floating surfaces still land against their anchor. Behavior is verified continuously against Chromium, Firefox, and WebKit (see `packages/e2e`).

## Documentation

Full documentation (guides, framework integrations, per-component live demos, and the generated API reference) lives at **[hydrateless.com](https://hydrateless.com/)**.

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and guidelines for submitting pull requests.

## License

[MIT](LICENSE)
