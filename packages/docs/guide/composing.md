# Composing and Extending

Hydrateless is designed to be built on. Tokens are plain custom properties,
styles live in `@layer`, state is expressed with `data-hl-*` attributes, and
`defineEnhancer` gives your own components the same lifecycle the built-in ones
use.

## Customizing tokens

Start with tokens before you write a selector. Most visual changes are a token
override, scoped as narrowly as you need:

```css
/* Whole app */
:root {
  --hl-radius-md: 0.75rem;
  --hl-primary: light-dark(#7c3aed, #a78bfa);
}

/* One region */
.marketing {
  --hl-font-sans: 'Fraunces', serif;
}

/* One component instance */
.hl-button.cta {
  --hl-primary: light-dark(#db2777, #f472b6);
}
```

Color tokens are `light-dark()` pairs; give both sides so your override still
adapts to dark mode. See [Theming](./theming) for the full list.

## Working with layers

All Hydrateless styles are declared inside `@layer reset, tokens, theme,
components`. Anything you write **outside** a layer beats them regardless of
specificity, so overrides are one class deep and never need `!important`:

```css
.hl-card {
  border-radius: var(--hl-radius-2xl);
}
```

If your app has its own layers, import Hydrateless into one of them so the
ordering is explicit:

```css
@layer vendor, app;

@import 'hydrateless' layer(vendor);

@layer app {
  .hl-card {
    border-radius: var(--hl-radius-2xl);
  }
}
```

See [CSS Layers](./css-layers) for more.

## The `data-hl-*` conventions

Every attribute the library reads or writes follows a small vocabulary:

| Attribute                                       | Role                                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| `data-hl-<component>`                           | Component root; the enhancer's selector (`data-hl-tabs`, `data-hl-dropdown`)            |
| `data-hl-<component>-<part>`                    | A named part inside the root (`data-hl-dropdown-trigger`, `data-hl-command-input`)      |
| `data-hl-value`                                 | The value an item reports (tabs, accordion items, menu items, options, commands)        |
| `data-hl-intent`                                | Semantic color: `neutral`, `primary`, `danger`, `success`, `warning`, `info`            |
| `data-hl-variant`                               | Visual style of a button or badge: `solid`, `soft`, `outline`, `ghost`, `link`          |
| `data-hl-size`                                  | `sm`, `md`, `lg` (and `xl` for spinners)                                                |
| `data-hl-shape`                                 | Skeleton shape: `text`, `circle`, `rect`                                                |
| `data-hl-side`                                  | Drawer edge: `start`, `end`                                                             |
| `data-hl-orientation`                           | `horizontal`, `vertical`                                                                |
| `data-hl-invalid`, `data-hl-required`           | Form states, paired with `aria-invalid` and `required`                                  |
| `data-hl-ready`                                 | Set on a root by its enhancer; CSS no-JS baselines are gated on `:not([data-hl-ready])` |
| `data-hl-toast-trigger`, `-intent`, `-duration` | Declarative toast buttons                                                               |

Rules of thumb when you add your own:

- Prefix with `data-hl-` only for attributes a Hydrateless stylesheet or
  enhancer reads. Use your own prefix for app state so upgrades can't collide.
- Prefer attributes over modifier classes for state. `[data-hl-intent="danger"]`
  composes with `.hl-button` without a class-naming scheme.
- Keep ARIA as the source of truth for interactive state (`aria-selected`,
  `aria-checked`, `aria-expanded`) and style off it. The enhancers already
  maintain those attributes; don't duplicate them.

## Extending a component

### Add a variant

Match the existing attribute and add a value:

```css
.hl-button[data-hl-variant='glass'] {
  background: color-mix(in oklab, var(--hl-surface) 60%, transparent);
  backdrop-filter: blur(8px);
  border: var(--hl-border-width) solid var(--hl-border);
}
```

```html
<button class="hl-button" data-hl-variant="glass">Glass</button>
```

### Compose primitives

Components are designed to nest. A card header with a dropdown, a field with a
combobox, a modal containing a command palette: all work because each component
only styles its own class or attribute and reads shared tokens.

```html
<div class="hl-card">
  <div class="hl-card-header">
    <h3 class="hl-card-title">Members</h3>
    <div data-hl-dropdown>
      <button
        class="hl-button"
        data-hl-variant="ghost"
        data-hl-dropdown-trigger
        popovertarget="members-menu"
      >
        Manage
      </button>
      <ul id="members-menu" data-hl-dropdown-menu popover>
        <li><button role="menuitem" data-hl-value="invite">Invite</button></li>
      </ul>
    </div>
  </div>
</div>
```

### Restyle from scratch

Because behavior lives in enhancers and ARIA, you can drop the `hl-*` classes
entirely and keep the `data-hl-*` roots. The enhancer still wires roles, keys,
and focus; your stylesheet owns the look, and can still read the tokens.

## Writing your own enhancer

`defineEnhancer` turns a per-root `setup` function into a full enhancer with
the shared lifecycle: root discovery inside a container, idempotent
de-duplication, automatic listener teardown, re-enhancement after destroy, SSR
safety, and the uniform handle.

```ts
import { defineEnhancer, ensureId, setAttrs, Events, Keys } from '@hydrateless/enhancers';

type RatingOptions = {
  max?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};
type RatingApi = { readonly value: number; setValue: (value: number) => void };

export const enhanceRating = defineEnhancer<RatingOptions, RatingApi>({
  name: 'rating',
  selector: '[data-hl-rating]',
  defaults: { max: 5 },
  setup({ root, options, on, add, emit }) {
    const stars = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
    let value = options.defaultValue ?? 0;

    setAttrs(root, {
      role: 'radiogroup',
      'aria-label': root.getAttribute('aria-label') || 'Rating',
    });
    ensureId(root, 'hl-rating');

    const paint = () => {
      stars.forEach((star, i) => {
        setAttrs(star, { role: 'radio', 'aria-checked': i + 1 === value ? 'true' : 'false' });
        star.tabIndex = i + 1 === value || (value === 0 && i === 0) ? 0 : -1;
      });
    };

    const set = (next: number) => {
      value = Math.max(0, Math.min(options.max!, next));
      paint();
      options.onValueChange?.(value);
      emit(Events.change, { value });
    };

    on(root, 'click', (e) => {
      const index = stars.indexOf((e.target as HTMLElement).closest('button')!);
      if (index !== -1) set(index + 1);
    });

    on<KeyboardEvent>(root, 'keydown', (e) => {
      if (e.key === Keys.ArrowRight || e.key === Keys.ArrowUp) set(value + 1);
      else if (e.key === Keys.ArrowLeft || e.key === Keys.ArrowDown) set(value - 1);
      else return;
      e.preventDefault();
      stars[value - 1]?.focus();
    });

    root.setAttribute('data-hl-ready', '');
    add(() => root.removeAttribute('data-hl-ready'));

    paint();
    return {
      get value() {
        return value;
      },
      setValue: set,
    };
  },
});
```

What the context gives you:

| Member      | Purpose                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------- |
| `root`      | The matched element.                                                                        |
| `container` | What the enhancer was called with (often `document`).                                       |
| `options`   | Caller options merged over `defaults`.                                                      |
| `on()`      | `addEventListener` that is removed automatically on destroy.                                |
| `add()`     | Register any other disposer (timers, observers, attribute resets).                          |
| `uid()`     | Generate an id namespaced to the enhancer.                                                  |
| `emit()`    | Dispatch a bubbling `hl:*` `CustomEvent` from the root; returns `false` if it was canceled. |

Use the shared helpers so your component behaves like the built-in ones:
`Events` and `Keys` for names, `ensureId`/`setAttrs` for ARIA wiring,
`createTypeahead`, `nextIndex`, `keepPositioned` for floating surfaces, and the
menu-item helpers (`menuItemsOf`, `activateMenuItem`) if you build a menu-like
control.

Calling `enhanceRating()` with no container in the browser scans `document`;
outside a browser it returns an empty handle, so it is safe in SSR code paths.

### Framework wrapper

Wrap your enhancer with the framework `useEnhancer` hook to get the same
lifecycle handling as the shipped components:

```tsx
import { useRef } from 'react';
import { useEnhancer } from '@hydrateless/react';
import { enhanceRating } from './rating';

export function Rating({ onValueChange }: { onValueChange?: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // Callbacks always run from the latest render, so they don't need to be deps.
  const api = useEnhancer(ref, enhanceRating, { onValueChange });
  // api.current?.setValue(3)
  return (
    <div ref={ref} data-hl-rating aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" aria-label={`${n} stars`}>
          *
        </button>
      ))}
    </div>
  );
}
```

See the [React](/frameworks/react#useenhancer), [Vue](/frameworks/vue#useenhancer),
and [Svelte](/frameworks/svelte#useenhancer) guides for each framework's
`useEnhancer`.

### Registering with the auto-loader

The auto-loader only knows the built-in manifest. For a custom enhancer, call it
yourself after the DOM is ready, or from the same place you call `auto()`:

```js
import { auto } from '@hydrateless/auto';
import { enhanceRating } from './rating';

await auto(document);
enhanceRating(document);
```
