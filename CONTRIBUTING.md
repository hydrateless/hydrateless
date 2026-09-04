### Contributing to Hydrateless

Thanks for your interest in contributing. Hydrateless is a lightweight component library that delivers fast, accessible UI primitives using semantic HTML and modern CSS first, with no JavaScript by default. Contributions should keep the code simple, accessible, and performant.

## Quick start

Development uses Node ≥ 20.

```bash
# clone
git clone https://github.com/hydrateless/hydrateless.git
cd hydrateless

# install dependencies
npm install

# build all packages
npm run build

# lint and typecheck
npm run lint
npm run lint:css
npm run typecheck

# unit tests and size budgets
npm test
npm run size

# end-to-end tests (Playwright; run npx playwright install once)
npm -w packages/e2e run test:e2e

# format code
npm run format
```

## Project layout (high-level)

- `packages/`
  - `hydrateless/`: all CSS (reset, tokens, theme, and component styles) with subpath exports
  - `enhancers/`: optional JS enhancers built on the shared `defineEnhancer` contract, plus the core helpers they share (lifecycle, keyboard, menu items and submenus, positioning, pagination math, platform detection). Each enhancer is its own subpath export and declares its `data-hl-*` attribute schema in its definition
  - `auto/`: drop-in auto-loader that detects `data-hl-*` attributes and lazy-loads enhancers
  - `test-setup/` (root): shared Vitest setup and the cross-framework component contract
  - `react/`, `vue/`, `svelte/`: framework component suites wrapping the enhancers. The three export the same component list and prop contracts; each ships one low-level escape hatch, `useEnhancer`, plus `useField` and `useToast`
  - `e2e/`: Playwright and axe suite that exercises every component with JavaScript off and on
  - `docs/`: the VitePress documentation site (private; deployed to GitHub Pages)
- `examples/`: minimal starter apps (built in CI so the published packages keep working from a consumer's point of view)

### Naming conventions

- Component roots carry a `data-hl-<component>` attribute; the enhancer for that component is `enhance<Component>` and lives at `@hydrateless/enhancers/<component>`.
- State and variant attributes are always prefixed: `data-hl-intent`, `data-hl-size`, `data-hl-variant` (visual style), `data-hl-side`, `data-hl-shape`, `data-hl-orientation`, `data-hl-ready` (set by an enhancer once JS owns behavior).
- Stylesheet file names match the docs slugs (`segmented-control.css`, `radio-group.css`, `command-palette.css`).
- Directional values are logical (`start`/`end`), never `left`/`right`, and CSS uses logical properties throughout.
- Enhancer options follow one pattern: `defaultX` for initial state, `onXChange(value)` for notifications, and an imperative `x`/`setX` pair on the returned API. Cancelable actions emit `hl:select` or `hl:command`.
- Every non-function option is declared in the enhancer's `attributes` schema so markup can set it as `data-hl-<option-in-kebab-case>`. Don't read `root.getAttribute('data-hl-…')` by hand for options.
- Enhancers read their items lazily and call `observe(root, …)` so items added after setup take part. Don't snapshot `querySelectorAll` results at setup time.

### Adding an enhancer

1. Create `packages/enhancers/src/<name>/index.ts` with `defineEnhancer`, a TSDoc comment on every export, and a unit test beside it.
2. Export it from `packages/enhancers/src/index.ts`, add the subpath to `package.json` `exports` and `tsup.config.ts`, and add its `{ name, selector }` to `manifest.ts`. The auto-loader's typed loader maps (`auto/src/index.ts` and `cdn.ts`) fail to compile until they know the new name.
3. Add the CSS hooks it needs to the component stylesheet, the docs component data (`packages/docs/.vitepress/data/components/`), the docs demo runtime (`demo-runtime.ts`), a row in `reference.md`, and an e2e fixture and spec.
4. If a framework component should wrap it, add it to all three bindings; `test-setup/component-contract.ts` fails any package that lags behind.

## Coding guidelines

- **Format**: Prettier (see `.prettierrc.json`). Run `npm run format`.
- **Lint**: ESLint for JS/TS. Run `npm run lint`.
- **Typecheck**: TypeScript. Run `npm run typecheck`.
- **Tests**: if you add tests, place them alongside the source or under a `tests/` directory and keep them fast. Anything a user can do in a browser also needs an e2e assertion in `packages/e2e` (fixtures are plain HTML pages that run with JavaScript off and on).

### Documentation comments

Every exported symbol in the packages' TypeScript source (functions, classes, interfaces, type aliases, enums, and `const`s) must carry a [TSDoc](https://tsdoc.org/) doc comment. These comments document the public API: they ship in each package's generated `.d.ts` (so they surface as editor tooltips for consumers), and TypeDoc renders the `@hydrateless/enhancers` surface into the docs site's API reference (see `packages/docs/typedoc.json` and `reference.md`), so a doc comment and its rendered docs never drift apart.

This is enforced by ESLint across `packages/*/src/**/*.{ts,tsx}`, so `npm run lint` fails on an undocumented export:

- `jsdoc/require-jsdoc` requires a doc comment on each exported declaration.
- `jsdoc/require-description` requires that comment to have a description.
- `tsdoc/syntax` validates that the comment is well-formed TSDoc (the format TypeDoc consumes).

Notes:

- A one-line summary is enough; per-parameter `@param`/`@returns` tags aren't required, though documenting non-obvious option fields with inline `/** ... */` comments is encouraged.
- Re-export barrels (`export { x } from './y'`) and internal (non-exported) helpers are exempt, as are test files.
- Svelte `.svelte` single-file components aren't ESLint-parsed, so document their exports directly in the component files by convention.
- Match the prose style of the docs (Chicago Manual of Style, straight quotes, no em dashes, contractions where natural).

## Conventional Commits

This repo uses Conventional Commits for all commits. Keep it simple: we don't use scopes.

Use the form:

```
<type>: <subject>

[optional body]

[optional footer(s)]
```

Subject rules:

- Imperative mood, no trailing period, ≤ 72 characters
- UTF‑8 allowed; avoid emoji in the subject

Accepted types:

- `build`: build system or external dependencies (e.g., package.json, tooling)
- `chore`: maintenance (no app behavior change)
- `ci`: continuous integration configuration (workflows, pipelines)
- `docs`: documentation only
- `feat`: user-facing feature or capability
- `fix`: bug fix
- `perf`: performance improvements
- `refactor`: code change that neither fixes a bug nor adds a feature
- `revert`: revert of a previous commit
- `style`: formatting/whitespace (no code behavior)
- `test`: add/adjust tests only

Examples:

```text
feat: add tabs component with full ARIA and keyboard support
fix: correct focus trapping in modal on Safari
docs: document Hydrateless theming and CSS variable tokens
style: format CSS and update stylelint config
chore: update Playwright fixtures and snapshots
ci: add workflow for a11y (axe) and visual regression tests
perf: reduce CSS specificity and bundle size for accordion
refactor: extract shared base styles and JS enhancer utilities
test: add axe and keyboard navigation tests for disclosure
revert: revert "perf: reduce CSS specificity and bundle size for accordion"
```

Breaking changes:

- Use `!` after the type or a `BREAKING CHANGE:` footer.

```text
feat!: rename CSS variable prefix to --hyd-*

BREAKING CHANGE: All component CSS variables now use the --hyd- prefix; update themes and overrides.
```

## Pull requests and squash merges

- **PR title**: use Conventional Commit format.
  - Example: `feat: add tabs component`
  - Imperative mood; no trailing period; aim for ≤ 72 chars; use `!` for breaking changes.
- **PR description**: include brief sections: What, Why, How (brief), Testing, Risks/Impact, Docs/Follow-ups.
  - Link issues with keywords (e.g., `Closes #123`).
- **Merging**: prefer "Squash and merge" with "Pull request title and description".
- Keep PRs focused; avoid unrelated changes in the same PR.

Conventional Commits applies to the subject line (your PR title) and optional footers. The PR body is free-form; when squashing, it becomes the commit body. Place any footers at the bottom of the description.

Recommended PR template:

```text
What
- Short summary of the change

Why
- Motivation/user value

How (brief)
- Key implementation notes or decisions

Testing
- Local/CI coverage; links to tests if relevant

Risks/Impact
- Compat, rollout, perf, security; mitigations

Docs/Follow-ups
- Docs updated or TODO next steps

Closes #123
BREAKING CHANGE: <details if any>
Co-authored-by: Name <email>
```

## Pull request checklist

- PR title: Conventional Commits format (CI-enforced by `pr-lint.yml`).
- Format: `npm run format:check` passes.
- Lint: `npm run lint` passes.
- Typecheck: `npm run typecheck` passes.
- Tests: added/updated if applicable; all pass.
- Docs: update `README.md`, the relevant guide, and `packages/docs/reference.md` if behavior changes; add a note to `packages/docs/guide/migration.md` for anything breaking.

## Versioning and releases

- All packages are versioned in lockstep. The version is tracked in the root `package.json` and mirrored across all workspace `packages/*/package.json` files. Both are updated automatically by [semantic-release](https://semantic-release.gitbook.io/).
- **Automated release pipeline** (on every merge to `main`):
  1. `semantic-release` scans Conventional Commit messages since the last tag.
  2. It determines the next SemVer bump: `feat` → **minor**, `fix`/`perf` → **patch**, `BREAKING CHANGE` → **minor** (while version < 1.0; see note below).
  3. `CHANGELOG.md` is generated, version files are updated, and a tagged release commit (`chore(release): vX.Y.Z`) is pushed.
  4. All workspace packages are built and published to npm with provenance.
  5. A GitHub Release is created with auto-generated release notes.
- Commit types that trigger a release: `feat` (minor), `fix` and `perf` (patch), `BREAKING CHANGE` (minor while pre-1.0). All other types (`build`, `chore`, `ci`, `docs`, `refactor`, `revert`, `style`, `test`) are recorded in the changelog but do **not** trigger a release on their own.
- **Pre-1.0 breaking changes**: The `{ "breaking": true, "release": "minor" }` rule in `.releaserc.json` caps breaking changes to a minor bump. When the project is ready for 1.0.0, remove that rule so breaking changes bump major as normal.
- Tag format: `v`-prefixed (e.g., `v0.1.0`).
- Manual version bumps are no longer needed; just merge PRs with valid Conventional Commit titles. For ad-hoc runs, use the workflow's **Run workflow** button (`workflow_dispatch`).

### Branching rules

- `main`: default branch.
- All work branches are created from `main`.

#### Branch naming

- Use lowercase kebab-case; no spaces; keep names concise (aim ≤ 40 chars).
- Branch prefixes match Conventional Commit types:
  - `feat/<short-desc>`
  - `fix/<short-desc>`
  - `chore/<short-desc>`
  - `docs/<short-desc>`
  - `ci/<short-desc>`
  - `refactor/<short-desc>`
  - `test/<short-desc>`
  - `perf/<short-desc>`
  - `build/<short-desc>`

Examples:

```text
feat/tabs-component
fix/modal-focus-trap-safari
docs/contributing-guidelines
ci/add-a11y-workflow
build/update-postcss
refactor/shared-base-styles
test/disclosure-a11y
fix/accordion-overflow
```

## CI

- **CI** (`ci.yml`): runs lint, format check, typecheck, build, test, and size budgets on Node 20 and 22 for every push and PR, then runs the Playwright end-to-end suite (JavaScript off and on, with axe checks) against the built packages, and builds every app in `examples/` against the workspace packages.
- **PR Lint** (`pr-lint.yml`): validates the PR title against Conventional Commits format (protects squash merges) and checks individual commit messages via commitlint (protects rebase merges). Recommended: add the **PR title** job as a required status check in branch-protection settings.
- **Release** (`release.yml`): runs on merge to `main`; computes version, generates changelog, tags, creates GitHub Release, and publishes all workspace packages to npm.

## Security and provenance

- Do not commit secrets or credentials.
- npm packages are published with provenance via Trusted Publishing.

## License

By contributing, you agree that your contributions are licensed under the repository's MIT License.
