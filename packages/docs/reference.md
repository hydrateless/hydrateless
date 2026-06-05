# API Reference

The full, type-level API documentation for `@hydrateless/enhancers` is generated
from source with [TypeDoc](https://typedoc.org/).

<div class="hl-demo">
  <p style="margin:0 0 0.5rem">Browse the complete enhancer API — every function, option type, and return type.</p>
  <a href="./api/" target="_blank" rel="noreferrer">Open the generated API reference →</a>
</div>

## Enhancers at a glance

Each enhancer takes a container (`Document` or `HTMLElement`, defaulting to
`document`) and returns a [`Disposer`](#disposer) you can call to remove all
listeners and ARIA wiring it added.

| Function            | Options                                       | Notes                                             |
| ------------------- | --------------------------------------------- | ------------------------------------------------- |
| `enhanceAccordion`  | `{ allowMultiple?: boolean }`                 | Single-open `<details>` group                     |
| `enhanceDisclosure` | `{ allowMultiple?: boolean }`                 | Mutually exclusive disclosures                    |
| `enhanceTabs`       | —                                             | ARIA + roving tabindex                            |
| `enhanceDropdown`   | —                                             | WAI-ARIA menu pattern                             |
| `enhanceModal`      | `{ closeOnBackdrop?: boolean }`               | `<dialog>` openers/closers + focus trap           |
| `enhanceDrawer`     | `{ closeOnBackdrop?: boolean }`               | Off-canvas `<dialog>`                             |
| `enhancePopover`    | `{ triggerEvent?: 'click' \| 'hover' }`       | Popover API + fallback                            |
| `enhanceTooltip`    | —                                             | Hover/focus tooltips                              |
| `enhanceToc`        | `{ headings?, scrollSpy?, contentSelector? }` | Table of contents                                 |
| `enhanceToast`      | —                                             | Returns a `ToastApi` (`show`/`dismiss`/`destroy`) |

## Disposer

Every enhancer returns a `Disposer`:

```ts
type Disposer = () => void;
```

Call it to tear down the enhancement. Enhancers are idempotent — re-running one
on an already-enhanced element is a no-op — so they're safe to call after the
DOM changes.

```ts
import { enhanceTabs } from '@hydrateless/enhancers';

const dispose = enhanceTabs(document);
// later, e.g. on unmount or route change:
dispose();
```

## Framework APIs

The framework bindings are documented in their own guides:

- [React components & hooks](/frameworks/react)
- [Vue directives & composables](/frameworks/vue)
- [Svelte actions](/frameworks/svelte)
