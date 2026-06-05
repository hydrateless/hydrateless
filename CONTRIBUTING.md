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
npm run typecheck

# format code
npm run format
```

## Project layout (high-level)

- `packages/`
  - `hydrateless/` – all CSS: reset, tokens, theme, and component styles with subpath exports
  - `enhancers/` – optional JS enhancers with internal utilities (focus trap, tabbable)
  - `auto/` – drop-in auto-loader that detects `data-hl-*` attributes and lazy-loads enhancers
  - `react/` – React components and hooks wrapping the enhancers
  - `vue/` – Vue directives, plugin, and composables
  - `svelte/` – Svelte actions
  - `docs/` – the VitePress documentation site (private; deployed to GitHub Pages)

## Coding guidelines

- **Format**: Prettier (see `.prettierrc.json`). Run `npm run format`.
- **Lint**: ESLint for JS/TS. Run `npm run lint`.
- **Typecheck**: TypeScript. Run `npm run typecheck`.
- **Tests**: if you add tests, place them alongside the source or under a `tests/` directory and keep them fast.

## Conventional Commits

This repo uses Conventional Commits for all commits. Keep it simple: we do not use scopes.

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

- `build` – build system or external dependencies (e.g., package.json, tooling)
- `chore` – maintenance (no app behavior change)
- `ci` – continuous integration configuration (workflows, pipelines)
- `docs` – documentation only
- `feat` – user-facing feature or capability
- `fix` – bug fix
- `perf` – performance improvements
- `refactor` – code change that neither fixes a bug nor adds a feature
- `revert` – revert of a previous commit
- `style` – formatting/whitespace (no code behavior)
- `test` – add/adjust tests only

Examples:

```text
feat: add tabs component with full ARIA and keyboard support
fix: correct focus trapping in modal on Safari
docs: document Hydrateless theming and CSS variable tokens
style: format CSS and update stylelint config
chore: update Storybook and visual regression fixtures
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
- Docs: update `README.md` if behavior changes.

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
- Manual version bumps are no longer needed — just merge PRs with valid Conventional Commit titles. For ad-hoc runs, use the workflow's **Run workflow** button (`workflow_dispatch`).

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

- **CI** (`ci.yml`): runs lint, format check, typecheck, build, and test on Node 20 and 22 for every push and PR.
- **PR Lint** (`pr-lint.yml`): validates the PR title against Conventional Commits format (protects squash merges) and checks individual commit messages via commitlint (protects rebase merges). Recommended: add the **PR title** job as a required status check in branch-protection settings.
- **Release** (`release.yml`): runs on merge to `main`; computes version, generates changelog, tags, creates GitHub Release, and publishes all workspace packages to npm.

## Security and provenance

- Do not commit secrets or credentials.
- npm packages are published with provenance via Trusted Publishing.

## License

By contributing, you agree that your contributions are licensed under the repository's MIT License.
