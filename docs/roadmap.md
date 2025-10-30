## Hydrateless Roadmap (TypeScript monorepo)

This roadmap tracks high-level goals for the first five releases, with a
detailed step-by-step plan to reach 0.1.0. Hydrateless ships accessible,
themeable UI primitives that work with semantic HTML and modern CSS first,
then optionally auto-loads tiny, framework-agnostic JS enhancers only when
needed.

Current snapshot (already in repo):
- Monorepo via npm workspaces, Changesets configured (independent versions)
- Base TypeScript config, ESM outputs, PostCSS config
- Packages present: `@hydrateless/components` (CSS), `@hydrateless/enhancers` (TS),
  `@hydrateless/auto` (auto-init loader), `@hydrateless/utils` (focus trap/tabbables),
  `@hydrateless/tokens`, `@hydrateless/theme-default`, `@hydrateless/reset`, and `hydrateless`
- CSS for: disclosure, tabs, accordion, modal, toc, drawer, popover, tooltip, skip-link, switch
- Enhancers for: disclosure, tabs, accordion, modal, toc, drawer, popover, tooltip

### Release goals

- **0.1.0 — MVP foundation**: Solidify component CSS + JS enhancers, ship `auto`
  lazy-init, publishable ESM builds, per-component CSS subpath exports, quickstart
  docs and minimal examples, basic CI, and Changesets release workflow.
- **0.2.0 — A11y + coverage**: Accessibility audit and keyboard/ARIA polish across
  components, additional primitives and options, improved docs with usage recipes,
  SSR-safe patterns and guidance.
- **0.3.0 — DX + integrations**: Per-component entry points and typings docs,
  playground and examples gallery, framework integration guides (React/Vue/Svelte
  usage without hydration), CDN-friendly bundles.
- **0.4.0 — Performance + theming**: Smaller CSS with layered/contained rules,
  dark mode and theme packs, token scale and semantic aliases, container-query
  patterns and visual regression tests.
- **0.5.0 — Ecosystem + stability**: Templates/starters, versioned docs site,
  CI hardening and release automation, contribution guides and governance.

---

### 0.1.0 detailed plan (MVP)

Focus: Deliver a usable MVP where teams can install Hydrateless, import CSS
and optionally enable tiny JS enhancers (or `@hydrateless/auto`) to get
accessible interactions with minimal runtime cost.

#### 1) Monorepo, builds, and release
- [x] Root `package.json` with `private: true` and workspaces
- [x] Changesets configured for independent versions
- [x] Base `tsconfig` and ESM outputs across TS packages
- [x] PostCSS config for CSS build (tokens/theme/components)
- [ ] Add `.github/workflows`:
  - [ ] CI: typecheck + build matrix (Node LTS)
  - [ ] Release: Changesets version/publish with provenance
- [ ] Add lint/format (ESLint + Prettier) and pre-commit hooks (optional)

#### 2) Package layout and entry points
- [x] `@hydrateless/components`: per-component CSS with subpath exports
- [x] `@hydrateless/enhancers`: per-component enhancers with subpath exports
- [x] `@hydrateless/auto`: lazy auto-init based on DOM presence
- [x] `@hydrateless/utils`: focus trap + tabbables
- [x] `@hydrateless/tokens`, `@hydrateless/theme-default`, `@hydrateless/reset`, `hydrateless`
- [ ] Verify tree-shaking friendliness and subpath export completeness
  - [ ] Document per-component import patterns for CSS and JS

#### 3) Components readiness and a11y baseline
- [x] CSS present: disclosure, tabs, accordion, modal, toc, drawer, popover, tooltip, skip-link, switch
- [x] Enhancers present: disclosure, tabs, accordion, modal, toc, drawer, popover, tooltip
- [ ] Verify ARIA roles/attributes and keyboard interactions by component
- [ ] Add minimal unit/e2e smoke tests for interactive enhancers
- [ ] Cross-browser sanity (Chromium/Firefox/WebKit) for core interactions

#### 4) Auto-init and SSR guidance
- [x] `@hydrateless/auto` imports enhancers on-demand by DOM query
- [ ] Document SSR-safe usage (defer to `DOMContentLoaded`, progressive enhancement)
- [ ] Provide snippet for selective opt-in per component

#### 5) Docs and examples (minimal for 0.1.0)
- [x] Roadmap (this file)
- [ ] Quickstart doc: install, import CSS, enable `auto`, per-component usage
- [ ] Minimal examples directory (Node + static HTML) with 2–3 components
- [ ] Contribution notes for local dev, build, version, publish

#### 6) Acceptance checklist
- [ ] A static HTML sample can import CSS and enable an enhancer to pass a11y checks
- [ ] `@hydrateless/auto` correctly initializes only the components present
- [ ] Per-component CSS and JS subpath imports work and tree-shake
- [ ] CI builds succeed; release workflow publishes prerelease or stable 0.1.0

#### 7) Release and versioning
- [ ] Create changesets per package with meaningful entries
- [ ] Tag and publish initial versions using the workflow
- [ ] Ensure `exports`, `types`, and `sideEffects` fields are correct per package

---

### Notes for later releases
- 0.2.x: Deep a11y/keyboard audit; add missing primitives; expand docs with examples
- 0.3.x: DX improvements, typed docs for enhancers, examples gallery and framework guides
- 0.4.x: CSS performance, theming/dark mode, token scale, container queries, VRT
- 0.5.x: Stable docs site, starters/templates, automation, and contribution governance
