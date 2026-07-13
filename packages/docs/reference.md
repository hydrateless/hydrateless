# API Reference

The full, type-level API documentation for every Hydrateless package is generated
from source with [TypeDoc](https://typedoc.org/): the framework-agnostic
`@hydrateless/enhancers`, the `@hydrateless/auto` initializer, and the
`@hydrateless/react`, `@hydrateless/vue`, and `@hydrateless/svelte` bindings.

::: tip Generated reference
Browse the complete API for every package, with each function, component, option type, and return type. [Open the generated API reference →](./api/)
:::

## Enhancers at a glance

Each enhancer takes a container (`Document` or `HTMLElement`, defaulting to
`document`) and returns an [`EnhancerHandle`](#enhancerhandle) with a `destroy`
teardown and the component's imperative API.

| Function            | State options                                          | API (`handle.api`)                       |
| ------------------- | ------------------------------------------------------ | ---------------------------------------- |
| `enhanceAccordion`  | `allowMultiple`, `defaultValue`, `onValueChange`       | `value`, `setValue(values)`              |
| `enhanceDisclosure` | `defaultOpen`, `onOpenChange`                          | `open`, `setOpen(open)`                  |
| `enhanceTabs`       | `defaultValue`, `onValueChange`                        | `value`, `setValue(value, { focus? })`   |
| `enhanceDropdown`   | `defaultOpen`, `onOpenChange`, `onSelect`              | `open`, `setOpen(open, { focus? })`      |
| `enhanceModal`      | `defaultOpen`, `onOpenChange`, `closeOnBackdrop`       | `open`, `setOpen(open)`                  |
| `enhanceDrawer`     | `defaultOpen`, `onOpenChange`, `closeOnBackdrop`       | `open`, `setOpen(open)`                  |
| `enhancePopover`    | `defaultOpen`, `onOpenChange`, `triggerEvent`          | `open`, `setOpen(open)`                  |
| `enhanceTooltip`    | `placement`, `showDelay`, `hideDelay`, `onOpenChange`  | `open`, `setOpen(open)`                  |
| `enhanceMenu`       | `orientation`, `onOpenChange`, `onSelect`              | `open`, `setOpen(value \| null)`         |
| `enhanceCombobox`   | `defaultValue`, `onValueChange`, `onOpenChange`        | `value`, `setValue`, `open`, `setOpen`   |
| `enhanceCommand`    | `hotkey`, `defaultValue`, `onValueChange`, `onCommand` | `value`, `setValue(query)`               |
| `enhanceToc`        | `headings`, `scrollSpy`, `contentSelector`             | `refresh()`                              |
| `enhanceToast`      | `duration`, `onOpenChange`                             | `show(message, options?)`, `dismiss(el)` |

## EnhancerHandle

Every enhancer returns the same handle shape:

```ts
interface EnhancerHandle<Api> {
  /** Tear down every instance this call created. */
  destroy: () => void;
  /** The first enhanced root's API, or null when nothing matched. */
  api: Api | null;
  /** One entry per enhanced root: { root, api, destroy }. */
  instances: EnhancerInstance<Api>[];
}
```

Enhancers are idempotent (re-running one on an already-enhanced element is a
no-op), so they're safe to call after the DOM changes.

```ts
import { enhanceTabs } from '@hydrateless/enhancers';

const tabs = enhanceTabs(document);
tabs.api?.setValue('install');
// later, e.g. on unmount or route change:
tabs.destroy();
```

## Events

State changes are also broadcast as bubbling DOM events, so you can listen
without holding a handle:

| Event            | Detail                      | Fired by                                                                     |
| ---------------- | --------------------------- | ---------------------------------------------------------------------------- |
| `hl:change`      | `{ value }`                 | tabs, accordion, combobox, command                                           |
| `hl:open-change` | `{ open, ... }`             | disclosure, dropdown, modal, drawer, popover, tooltip, combobox, menu, toast |
| `hl:select`      | `{ value, item \| option }` | dropdown, combobox, menu (cancelable)                                        |
| `hl:command`     | `{ value, item }`           | command palette (cancelable)                                                 |

Some `hl:open-change` details carry extra context: menus include the open
submenu's `value`, and toast includes the `toast` element.

## Framework APIs

The framework bindings are included in the generated reference above:
`@hydrateless/react`, `@hydrateless/vue`, and the action and store layer of
`@hydrateless/svelte`. Svelte's single-file components can't be read by TypeDoc,
so their props are covered in the Svelte guide instead.

For usage patterns and examples, see the framework guides:

- [React components & hooks](/frameworks/react)
- [Vue directives & composables](/frameworks/vue)
- [Svelte actions & components](/frameworks/svelte)
