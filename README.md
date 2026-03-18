<p align="center">
  <img src="docs/assets/banner.jpg" alt="Hydrateless" width="800" />
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
  <a href="docs/quickstart.md">Getting Started</a> ·
  <a href="docs/components.md">Components</a> ·
  <a href="examples/">Examples</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## Overview

Hydrateless is a lightweight component library that delivers accessible, themeable UI primitives using semantic HTML and modern CSS first, with no JavaScript by default. It relies on native browser capabilities such as `<details>` and the `:has()` selector to keep runtime cost near zero, then selectively auto-loads tiny JavaScript enhancers only when an interaction truly requires it.

## Features

- **CSS-first components:** Accordions, tabs, modals, drawers, tooltips, and more work out of the box with no JavaScript.
- **Optional JS enhancers:** Add keyboard navigation, focus traps, and ARIA management only where needed.
- **Auto-initialization:** The `@hydrateless/auto` package detects `data-hl-*` attributes and lazy-loads the right enhancers.
- **Design tokens:** Theme every component through CSS variables for colors, spacing, radii, and typography.
- **Dark mode:** Automatic support via `prefers-color-scheme`, with manual overrides using `data-theme`.
- **CSS layers:** All styles use `@layer`, so your custom CSS can override defaults without specificity battles.
- **Accessible by default:** ARIA roles, keyboard support, focus management, and skip links are built in.
- **Modular imports:** Import the full bundle or individual component stylesheets as needed.

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

## Documentation

Component guides and usage examples are available in the [`docs/`](docs/) directory. A dedicated documentation site is planned for an upcoming release.

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and guidelines for submitting pull requests.

## License

[MIT](LICENSE)
