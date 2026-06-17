# CSS Layers

All Hydrateless styles are wrapped in CSS [`@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
declarations. This gives you a predictable cascade and eliminates specificity
battles.

## The layer order

Hydrateless declares its layers up front, in this order:

```css
@layer reset, tokens, theme, components;
```

- **reset**: minimal normalization
- **tokens**: design token variables
- **theme**: theme wiring (background, color, `color-scheme`)
- **components**: all component styles

## Why it matters

Any CSS you write **outside** of a layer automatically beats CSS written
**inside** a layer, regardless of specificity. That means your overrides win
without `!important`:

```css
/* This wins over Hydrateless's component styles, even though it's a single
   class selector, because un-layered styles always beat layered styles. */
.my-button {
  background: rebeccapurple;
}
```

## Slotting Hydrateless into your own layers

If your app uses layers, you can place Hydrateless wherever you like in the
cascade using the `layer()` import syntax:

```css
@layer vendor, app;

@import 'hydrateless' layer(vendor);

@layer app {
  /* Your styles in the `app` layer beat anything in `vendor`. */
}
```

## Build note

Hydrateless ships `@layer` rules untouched in its compiled CSS. The build is
configured **not** to flatten or polyfill layers, so the cascade you see in
development is exactly what ships to production. All modern browsers support
`@layer`.
