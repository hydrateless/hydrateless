# Configuring with Data Attributes

Every enhancer can be configured from the markup it enhances. Any option that
isn't a function can be written as a `data-hl-*` attribute on the component
root, so a server-rendered page, a CMS template, or a plain HTML file gets the
full range of behavior with nothing but the auto-initializer `<script>` tag.

```html
<div data-hl-accordion data-hl-allow-multiple data-hl-default-value="shipping returns">
  <details data-hl-value="shipping">…</details>
  <details data-hl-value="returns">…</details>
  <details data-hl-value="warranty">…</details>
</div>

<div data-hl-tabs data-hl-activation="automatic" data-hl-orientation="vertical">…</div>

<span data-hl-tooltip="save-tip" data-hl-placement="bottom-start" data-hl-show-delay="0">
  Save
</span>
```

## Naming

The attribute is the option name in kebab case with the `data-hl-` prefix:

| Option            | Attribute                  |
| ----------------- | -------------------------- |
| `allowMultiple`   | `data-hl-allow-multiple`   |
| `defaultValue`    | `data-hl-default-value`    |
| `activation`      | `data-hl-activation`       |
| `closeOnSelect`   | `data-hl-close-on-select`  |
| `showDelay`       | `data-hl-show-delay`       |
| `contentSelector` | `data-hl-content-selector` |
| `hotkey`          | `data-hl-hotkey`           |

The [API reference](/reference) lists every option per enhancer; each non-function
option has a matching attribute.

## Parsing

Values are parsed according to the option's type:

- **Booleans** accept a bare attribute (`data-hl-allow-multiple`), an empty
  string, or `"true"`/`"false"`. Write `data-hl-close-on-select="false"` to turn
  a default-on option off.
- **Numbers** are parsed with `Number()`; `data-hl-duration="8000"`.
- **Strings** are taken verbatim.
- **Enumerations** (`activation`, `orientation`, `placement`, `triggerEvent`)
  accept only their listed values.
- **Lists** (accordion and checkbox group `defaultValue`) split on whitespace
  or commas: `data-hl-default-value="shipping returns"`.
- **Structured values** have their own shorthand. The table's `defaultValue` is
  `data-hl-default-value="price"` or `"price:descending"`.

An attribute that is missing or fails to parse is ignored, so a typo never
shadows the enhancer's default.

## Precedence

Options are merged in three layers, later ones winning:

1. The enhancer's defaults.
2. `data-hl-*` attributes on the root.
3. The options object passed to the call, `enhanceTabs(el, { activation: 'manual' })`.

Options passed as `undefined` are dropped before merging, so a framework
binding can forward an unset prop without clobbering either the attribute or
the default. The framework components pass their props through the call (layer
3), so a `<Tabs activation="automatic">` behaves the same whether or not the
markup also carries `data-hl-activation`.

## Introspection

Every enhancer exposes its definition, including the attribute schema, so
tooling can stay in sync with the code:

```ts
import { enhanceTabs } from '@hydrateless/enhancers/tabs';

enhanceTabs.definition.name; // 'tabs'
enhanceTabs.definition.selector; // '[data-hl-tabs]'
enhanceTabs.definition.defaults; // { activation: 'manual', orientation: 'horizontal', ... }
enhanceTabs.definition.attributes; // { activation: ['manual', 'automatic'], orientation: [...], defaultValue: 'string' }
```

The docs site's component pages and the auto-loader's manifest are both derived
from these definitions.

## Live collections

Configuration isn't the only thing enhancers read from the DOM. Each one
watches its root with a `MutationObserver`, so items that arrive after
enhancement (fetched search results in a combobox, a new row in a sorted table,
a tab rendered from state) take part immediately, with nothing to re-run. (The
table of contents keeps a `refresh()` for the one case where you turn its
`watch` option off.) If you need to limit the observed subtree, call the
enhancer on a narrower container instead of `document`.

## Opting out of auto-start

Importing `@hydrateless/auto` (or the CDN bundle) scans the page as soon as the
DOM is ready. To take control, add `data-hl-manual` to `<html>` and call
`auto()` yourself, for example to pass an error reporter or scope it to part of
the page:

```html
<html data-hl-manual>
  …
  <script type="module">
    import { auto } from '@hydrateless/auto';
    await auto(document.querySelector('#app'), {
      onError: (error, component) => report(error, { component }),
    });
  </script>
</html>
```

## Writing your own

Declare an `attributes` schema in `defineEnhancer` and your enhancer reads its
options from markup the same way:

```ts
export const enhanceRating = defineEnhancer<RatingOptions, RatingApi>({
  name: 'rating',
  selector: '[data-hl-rating]',
  defaults: { max: 5 },
  attributes: { max: 'number', defaultValue: 'number' },
  setup({ root, options }) {
    // options.max came from data-hl-max, or the caller, or the default
  },
});
```

See [Composing and Extending](/guide/composing#writing-your-own-enhancer) for
the full context object, including `observe()` for live collections.
