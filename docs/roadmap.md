## Hydrateless Roadmap

Hydrateless ships accessible, themeable UI primitives built on semantic HTML and
modern CSS. JavaScript is optional — tiny, framework-agnostic enhancers load
only when needed. No build step required. No framework lock-in. No hydration
overhead.

---

### Package architecture (target for 0.1.0)

The monorepo should consolidate from 8 workspace packages to **3 published
packages** before anything is published.

| Package                  | What it ships                                                                               | Install                        |
| ------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------ |
| `hydrateless`            | All CSS — reset, tokens, theme, components. Subpath exports for granular imports.           | `npm i hydrateless`            |
| `@hydrateless/enhancers` | Optional JS enhancers with internal utilities. Subpath exports per component.               | `npm i @hydrateless/enhancers` |
| `@hydrateless/auto`      | Drop-in auto-initializer. Detects `data-hl-*` attributes and lazy-loads matching enhancers. | `npm i @hydrateless/auto`      |

#### Why consolidate?

- `@hydrateless/tokens` (16 lines), `@hydrateless/theme-default` (9 lines),
  and `@hydrateless/reset` (15 lines) don't justify separate npm packages.
  They're implementation layers, not independent libraries.
- `@hydrateless/components` depends on tokens and theme-default transitively,
  so users can never install it without them. A separate package adds friction
  with no benefit.
- `@hydrateless/utils` (focus trap, tabbable) is an internal dependency of
  enhancers. End users should never install it directly.
- Installing CSS today requires pulling in **5 npm packages**. After
  consolidation: **1**.

#### Import patterns after consolidation

```css
/* All CSS */
@import 'hydrateless';

/* Granular CSS */
@import 'hydrateless/reset.css';
@import 'hydrateless/tokens.css';
@import 'hydrateless/accordion.css';
```

```ts
// JS enhancers (tree-shakeable barrel)
import { enhanceAccordion } from '@hydrateless/enhancers';

// JS enhancers (direct subpath — zero barrel overhead)
import { enhanceAccordion } from '@hydrateless/enhancers/accordion';

// Auto-init — just import, nothing else needed
import '@hydrateless/auto';
```

#### Progressive enhancement tiers

| Tier              | What to install                          | Result                                                                                   |
| ----------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| CSS-only          | `hydrateless`                            | Semantic HTML styled with modern CSS. Disclosure, accordion, switch, etc. work natively. |
| CSS + targeted JS | `hydrateless` + `@hydrateless/enhancers` | Import specific enhancers for components that need JS (tabs, modal focus trap, etc.).    |
| CSS + auto JS     | `hydrateless` + `@hydrateless/auto`      | One import auto-detects `data-hl-*` attributes and lazy-loads only what's on the page.   |

---

### Release goals

- **0.1.0 — Solid foundation**: Consolidate packages, fix known issues, ship
  clean subpath exports, smoke tests, and a quickstart guide.
- **0.2.0 — Accessibility + primitives**: Deep a11y audit (ARIA, keyboard,
  screen readers), additional components (dropdown menu, toast, breadcrumb),
  SSR patterns and guidance.
- **0.3.0 — DX + integrations**: Interactive playground, framework integration
  guides (React, Vue, Svelte, Astro), CDN-friendly bundles, TypeDoc for
  enhancer APIs.
- **0.4.0 — Theming + performance**: Dark mode, theme packs, CSS `@layer`
  usage, container queries, visual regression tests, bundle size tracking.
- **0.5.0 — Ecosystem + stability**: Docs site, starter templates, contributor
  governance, breaking-change policy, 1.0 planning.

---

### 0.1.0 detailed plan

#### 1) Package consolidation

- [x] Merge `@hydrateless/reset`, `@hydrateless/tokens`,
      `@hydrateless/theme-default`, and `@hydrateless/components` into the
      `hydrateless` package
  - Move all CSS source into `packages/hydrateless/src/`
  - Add subpath exports: `./reset.css`, `./tokens.css`, `./theme.css`, and
    per-component exports (`./accordion.css`, `./modal.css`, etc.)
  - Remove the 4 old workspace directories
- [x] Fold `@hydrateless/utils` into `@hydrateless/enhancers` as internal
      modules
  - Move `focusTrap.ts` and `tabbable.ts` into `packages/enhancers/src/utils/`
  - Do not re-export from the package entry point
  - Remove `packages/utils/`
- [x] Update `@hydrateless/auto` imports (should require no changes if
      enhancer subpaths stay the same)
- [x] Update root `package.json` workspaces (now 3 directories)
- [x] Verify all `exports`, `types`, `sideEffects`, and `files` fields

#### 2) Build cleanup

- [x] Replace the single-line PostCSS build command for components with a build
      script that loops over component directories
- [x] Ensure each subpath export has a corresponding built file in `dist/`
- [x] Verify tree-shaking: importing one enhancer must not bundle others

#### 3) Bug fixes

- [x] Parallelize `auto()` — run all `maybeImport` calls with `Promise.all`
      instead of sequential `await`
- [x] Deduplicate reset/theme overlap (both declare `color-scheme: light` and
      body colors)
- [x] Verify all enhancers handle missing elements gracefully (no throws on
      empty queries)

#### 4) Accessibility baseline

- [x] Verify ARIA roles and attributes per component against WAI-ARIA Authoring
      Practices
- [x] Verify keyboard interactions (Tab, Enter, Space, Escape, Arrow keys) per
      component
- [x] Verify focus management in modal and drawer (trap on open, restore on
      close)

#### 5) Testing

- [x] Add smoke tests for each enhancer (DOM setup → enhance → assert behavior)
- [ ] Cross-browser sanity check (Chromium, Firefox, WebKit) for core
      interactions

#### 6) Documentation

- [x] Quickstart guide: install, import CSS, add enhancers or auto-init
- [x] Per-component reference: expected HTML markup, data attributes, behavior
- [x] Minimal example: static HTML page demonstrating all components

#### 7) Acceptance checklist

- [x] A static HTML page can import CSS and enable enhancers with correct a11y
- [x] `@hydrateless/auto` initializes only the components present in the DOM
- [x] Per-component subpath imports work for both CSS and JS
- [x] CI passes: lint, typecheck, build, tests
- [x] Semantic release publishes all 3 packages on merge to `main`

---

### Notes for later releases

- 0.2.x: Full a11y audit, screen reader testing, new primitives, SSR guidance
- 0.3.x: Interactive playground, framework examples, CDN builds, API reference
- 0.4.x: Dark mode, CSS `@layer`, container queries, VRT, bundle tracking
- 0.5.x: Versioned docs site, starter templates, governance, 1.0 roadmap
