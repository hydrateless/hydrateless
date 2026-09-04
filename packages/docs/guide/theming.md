# Theming

Every Hydrateless component is driven by CSS custom properties. Override them
anywhere in your own CSS (typically on `:root`) and the change cascades to every
component automatically. There are no build-time theme files to regenerate.

## Three layers of tokens

The tokens live in `hydrateless/tokens.css`, split into three files that build
on one another:

| File           | What it holds                                                                                    | Example                           |
| -------------- | ------------------------------------------------------------------------------------------------ | --------------------------------- |
| `palette.css`  | Raw color ramps, 50 to 950. The only place literal colors live.                                  | `--hl-brand-600`, `--hl-gray-200` |
| `scale.css`    | Theme-independent scales: spacing, radii, typography, shadows, control sizing, z-index, motion.  | `--hl-space-4`, `--hl-radius-md`  |
| `semantic.css` | Role-based colors that components actually read. Each is a `light-dark()` pair over the palette. | `--hl-surface`, `--hl-primary`    |

Components reference **only** semantic and scale tokens, so restyling is a
matter of remapping a couple dozen variables. You never touch component CSS.

## Semantic color tokens

Semantic tokens are defined once with `light-dark()`, so one declaration covers
both color schemes:

```css
:root {
  color-scheme: light dark;

  --hl-bg: light-dark(var(--hl-gray-50), var(--hl-gray-950));
  --hl-surface: light-dark(hsl(0deg 0% 100%), var(--hl-gray-900));
  --hl-fg: light-dark(var(--hl-gray-900), var(--hl-gray-50));
  --hl-primary: light-dark(var(--hl-brand-600), var(--hl-brand-500));
  /* ... */
}
```

The full set:

| Group    | Tokens                                                                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces | `--hl-bg`, `--hl-surface`, `--hl-surface-2`, `--hl-surface-3`                                                                                                     |
| Text     | `--hl-fg`, `--hl-fg-muted`, `--hl-fg-subtle`                                                                                                                      |
| Borders  | `--hl-border`, `--hl-border-strong`                                                                                                                               |
| Focus    | `--hl-ring`, `--hl-focus-ring`, `--hl-focus-offset`, `--hl-focus-shadow`                                                                                          |
| Primary  | `--hl-primary`, `--hl-primary-hover`, `--hl-primary-active`, `--hl-primary-fg`, `--hl-primary-subtle`, `--hl-primary-subtle-fg`                                   |
| Intents  | `--hl-danger`, `--hl-success`, `--hl-warning`, `--hl-info`, each with `-hover`, `-fg`, `-subtle`, and `-subtle-fg` variants (for example `--hl-danger-subtle-fg`) |
| Overlays | `--hl-scrim` (dialog backdrops), `--hl-overlay` (floating surface background), `--hl-overlay-shadow`                                                              |
| Disabled | `--hl-disabled-opacity`                                                                                                                                           |

Every component with an `intent` (buttons, badges, alerts, toasts, progress)
reads the matching `--hl-<intent>` family, so changing `--hl-danger` recolors
all of them at once.

## Scale tokens

| Group      | Tokens                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Spacing    | `--hl-space-0` through `--hl-space-24` (including `--hl-space-px`, `--hl-space-0-5`, `--hl-space-1-5`)                                     |
| Radii      | `--hl-radius-xs`, `-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-full`                                                                              |
| Borders    | `--hl-border-width`, `--hl-border-width-2`                                                                                                 |
| Typography | `--hl-font-sans`, `--hl-font-mono`, `--hl-text-xs` through `--hl-text-4xl`, `--hl-leading-*`, `--hl-font-normal` through `--hl-font-bold`  |
| Shadows    | `--hl-shadow-xs`, `-sm`, `-md`, `-lg`, `-xl`                                                                                               |
| Controls   | `--hl-control-block-size` (shared height of inputs, buttons, and selects), `--hl-control-height-sm`, `-md`, `-lg`                          |
| Overlays   | `--hl-modal-inline-size`, `--hl-overlay-inline-size` (drawer width)                                                                        |
| Z-index    | `--hl-z-dropdown`, `--hl-z-popover`, `--hl-z-toast`, `--hl-z-tooltip` (only for the JS positioning fallback; top-layer surfaces need none) |
| Motion     | `--hl-duration-fast`, `-base`, `-slow`, `--hl-ease-standard`, `--hl-ease-emphasized` (see [Motion](./motion))                              |

## Customizing

Override any token to restyle every component at once. Because the semantic
tokens use `light-dark()`, give both values when you override a color so your
theme still adapts:

```css
:root {
  --hl-primary: light-dark(#e94560, #ff6b81);
  --hl-primary-hover: light-dark(#d63d57, #ff8296);
  --hl-primary-fg: white;
  --hl-radius-md: 0.75rem;
  --hl-font-sans: 'Inter', system-ui, sans-serif;
}
```

Tokens are plain CSS variables, so you can scope a theme to a subtree:

```css
.brand-section {
  --hl-primary: light-dark(#16a34a, #4ade80);
}
```

Everything inside `.brand-section` now uses the green accent, while the rest of
the page keeps the default.

## Swapping the brand ramp

The quickest way to rebrand is to replace the `--hl-brand-*` palette ramp.
Every primary-colored token derives from it, in both light and dark:

```css
:root {
  --hl-brand-50: hsl(270deg 100% 98%);
  --hl-brand-100: hsl(269deg 100% 95%);
  --hl-brand-200: hsl(269deg 100% 92%);
  --hl-brand-300: hsl(269deg 97% 85%);
  --hl-brand-400: hsl(270deg 95% 75%);
  --hl-brand-500: hsl(271deg 91% 65%);
  --hl-brand-600: hsl(271deg 81% 56%);
  --hl-brand-700: hsl(272deg 72% 47%);
  --hl-brand-800: hsl(273deg 67% 39%);
  --hl-brand-900: hsl(274deg 66% 32%);
  --hl-brand-950: hsl(274deg 87% 21%);
}
```

## Using your own design system

If you already have design tokens, map them to Hydrateless variables instead of
hard-coding values:

```css
:root {
  --hl-primary: var(--brand-primary);
  --hl-surface: var(--surface-1);
  --hl-fg: var(--text-1);
  --hl-radius-md: var(--radius-md);
  --hl-focus-ring: 2px solid var(--brand-focus);
}
```

If your system already ships separate light and dark values, wrap them:

```css
:root {
  --hl-bg: light-dark(var(--surface-light), var(--surface-dark));
}
```

## Working with CSS layers

Hydrateless ships all styles inside `@layer`, so any un-layered CSS you write
automatically wins over component defaults, no `!important` needed. See
[CSS Layers](./css-layers) for details, and [Composing and Extending](./composing)
for how to build new components on top of the tokens.

## Try it live

The [theme studio](/playground/theme) lets you tweak the core tokens and watch
every component respond, then copies the resulting CSS.
