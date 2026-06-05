# Theming

Every Hydrateless component is driven by CSS custom properties (variables).
Override them anywhere in your own CSS — typically on `:root` — and the change
cascades to every component automatically.

## Design tokens

The base tokens live in `hydrateless/tokens.css`:

```css
:root {
  /* Colors */
  --hl-color-bg: hsl(0 0% 100%);
  --hl-color-fg: hsl(222 47% 11%);
  --hl-color-muted: hsl(220 14% 96%);
  --hl-color-accent: hsl(221 75% 55%);

  /* Radius */
  --hl-radius-2: 0.25rem;
  --hl-radius-3: 0.5rem;

  /* Spacing */
  --hl-spacing-1: 0.25rem;
  --hl-spacing-2: 0.5rem;
  --hl-spacing-3: 0.75rem;
  --hl-spacing-4: 1rem;

  /* Focus */
  --hl-focus-ring: 2px solid hsl(221 80% 55%);
}
```

## Customizing

Override any token to restyle every component at once:

```css
:root {
  --hl-color-bg: #1a1a2e;
  --hl-color-fg: #eaeaea;
  --hl-color-accent: #e94560;
  --hl-radius-3: 0.75rem;
}
```

Because tokens are plain CSS variables, you can scope a theme to a subtree:

```css
.brand-section {
  --hl-color-accent: #16a34a;
}
```

Everything inside `.brand-section` now uses the green accent, while the rest of
the page keeps the default.

## Using your own design system

If you already have design tokens, map them to Hydrateless variables instead of
hard-coding values:

```css
:root {
  --hl-color-accent: var(--brand-primary);
  --hl-color-bg: var(--surface-1);
  --hl-color-fg: var(--text-1);
  --hl-radius-3: var(--radius-md);
}
```

## Working with CSS layers

Hydrateless ships all styles inside `@layer`, so any un-layered CSS you write
automatically wins over component defaults — no `!important` needed. See
[CSS Layers](./css-layers) for details.
