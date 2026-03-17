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
- **0.2.0 — Accessibility + theming foundation**: Screen reader testing, dark
  mode, CSS `@layer` adoption, new components (dropdown menu, toast,
  breadcrumb).
- **0.3.0 — DX + integrations**: Docs site, framework integration guides
  (React, Vue, Svelte, Astro), SSR patterns, CDN-friendly bundles, API
  reference.
- **0.4.0 — Advanced theming + performance**: Theme packs, container queries,
  visual regression tests, bundle size tracking.
- **0.5.0 — Ecosystem + stability**: Interactive playground, starter templates,
  contributor governance, breaking-change policy, 1.0 planning.

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

### 0.2.0 detailed plan

#### 1) Screen reader testing

- [x] Test all components with VoiceOver (macOS / iOS)
- [x] Test all components with NVDA (Windows)
- [x] Fix any announced-label or role issues found during testing
- [x] Verify live region behavior for dynamic content (toast, popover)

#### 2) Dark mode

- [x] Add `prefers-color-scheme: dark` media query to `tokens.css` with dark
      token values
- [x] Add `[data-theme="dark"]` attribute override for manual toggle support
- [x] Audit all component CSS for hardcoded colors — replace with token
      references
- [x] Add dark mode section to quickstart guide
- [x] Update example page with a theme toggle

#### 3) CSS `@layer` adoption

- [x] Wrap all CSS in `@layer` declarations: `reset`, `tokens`, `theme`,
      `components`
- [x] Document layer order so users can override styles predictably
- [x] Verify no specificity regressions in existing components

#### 4) New components

- [x] Dropdown menu — CSS + enhancer with keyboard navigation and ARIA menu
      pattern (`role="menu"`, `role="menuitem"`, arrow keys, typeahead)
- [x] Toast / notification — CSS + enhancer with `role="status"` live region,
      configurable auto-dismiss timer, and stacking
- [x] Breadcrumb — CSS-only, semantic `<nav aria-label="Breadcrumb"> > ol`
      pattern

#### 5) Auto-init updates

- [x] Register dropdown menu, toast, and breadcrumb in `@hydrateless/auto`
      detection map
- [x] Add subpath exports for new enhancers in `@hydrateless/enhancers`

#### 6) Acceptance checklist

- [x] All components pass VoiceOver and NVDA testing
- [x] Dark mode works via media query and `data-theme` attribute
- [x] `@layer` declarations don't break existing integrations
- [x] New components have smoke tests and documentation
- [x] Example page updated with new components and theme toggle

---

### 0.3.0 detailed plan

#### 1) Docs site

- [ ] Set up VitePress (or similar static site generator)
- [ ] Migrate quickstart, component reference, and roadmap into the site
- [ ] Add embedded HTML previews per component (light and dark mode)
- [ ] Deploy to GitHub Pages

#### 2) Framework integration guides

- [ ] React — usage with and without enhancers, ref-based initialization
- [ ] Vue — directive or `onMounted` patterns for enhancers
- [ ] Svelte — Svelte action-based enhancer usage
- [ ] Astro — static-first with `client:load` for enhancers
- [ ] Each guide includes a working StackBlitz or CodeSandbox link

#### 3) SSR patterns

- [ ] Document that CSS-only components work with zero config in SSR
- [ ] Provide guidance for enhancer hydration timing (`DOMContentLoaded` vs.
      framework lifecycle hooks)
- [ ] Verify with Next.js, Nuxt, SvelteKit, and Astro

#### 4) CDN-friendly bundles

- [ ] Publish a single concatenated CSS file for CDN usage
- [ ] Publish an ESM bundle for `<script type="module">` usage from
      unpkg / jsDelivr
- [ ] Add CDN installation instructions to the docs site

#### 5) API reference

- [ ] Generate TypeDoc (or similar) for all enhancer functions
- [ ] Document parameters, return values, and expected DOM structure per
      enhancer
- [ ] Publish as a section of the docs site

#### 6) Acceptance checklist

- [ ] Docs site is live with all component documentation
- [ ] At least 4 framework guides published with working examples
- [ ] CDN links work in a plain HTML file with no build step
- [ ] API reference covers all public exports

---

### 0.4.0 detailed plan

#### 1) Theme packs

- [ ] Create 2–3 pre-built theme packs beyond default (e.g. compact, rounded)
- [ ] Each pack is a standalone CSS file that overrides token values
- [ ] Add subpath exports: `hydrateless/theme-compact.css`, etc.
- [ ] Document how to author custom themes

#### 2) Container queries

- [ ] Identify components that benefit from container-aware layout
- [ ] Add container query variants for responsive component internals
- [ ] Document browser support and fallback behavior

#### 3) Visual regression testing

- [ ] Set up Playwright for screenshot comparison
- [ ] Capture baseline screenshots for all components in light and dark mode
- [ ] Run VRT in CI on pull requests

#### 4) Bundle size tracking

- [ ] Add size-limit (or similar) to CI
- [ ] Set budgets for each package
- [ ] Report size changes on pull requests

#### 5) Performance audit

- [ ] Measure CSS parse and paint cost for the full stylesheet
- [ ] Verify enhancer initialization time stays under a defined budget
- [ ] Profile `@hydrateless/auto` lazy-loading behavior

#### 6) Acceptance checklist

- [ ] At least 2 theme packs available and documented
- [ ] Container queries used where they improve component responsiveness
- [ ] VRT running in CI with baseline snapshots
- [ ] Bundle size budgets enforced in CI

---

### 0.5.0 detailed plan

#### 1) Interactive playground

- [ ] Build a browser-based playground for experimenting with components
- [ ] Support live HTML editing with instant preview
- [ ] Include theme and dark mode toggles
- [ ] Deploy as part of the docs site

#### 2) Starter templates

- [ ] Plain HTML + CDN template
- [ ] Vite + vanilla JS template
- [ ] Framework-specific templates (React, Vue, Svelte, Astro)
- [ ] Each template is a standalone repo or `degit`-able directory

#### 3) Contributor governance

- [ ] `CONTRIBUTING.md` with PR process, code style, and review expectations
- [ ] Issue and PR templates
- [ ] Decision log for architectural choices

#### 4) Stability policy

- [ ] Breaking-change policy: semver, deprecation warnings, migration guides
- [ ] Review changelog automation for completeness
- [ ] Evaluate API surface freeze readiness

#### 5) 1.0 planning

- [ ] Audit API surface for anything that should change before 1.0
- [ ] Identify missing components for the 1.0 baseline
- [ ] Write 1.0 release criteria
- [ ] Draft migration guide from 0.x to 1.0

#### 6) Acceptance checklist

- [ ] Playground is live on the docs site
- [ ] At least 4 starter templates published
- [ ] `CONTRIBUTING.md` and issue templates in place
- [ ] 1.0 release criteria documented
