### Contributing to Hydrateless

This repo uses Conventional Commits for all commits. Keep it simple: we do not use scopes.

## Conventional Commits

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
