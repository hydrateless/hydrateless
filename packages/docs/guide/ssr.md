# Server-Side Rendering

Hydrateless is a natural fit for server-side rendering (SSR) and static site
generation (SSG). Because components are plain semantic HTML styled with CSS,
the markup you render on the server is fully functional before any JavaScript
runs: modals open through Invoker Commands, popovers through `popovertarget`,
accordions through `<details>`. There's no hydration step to wait for and no
flash of non-interactive content.

## The mental model

1. **Render HTML on the server.** Components are just elements with `data-hl-*`
   attributes. Many (accordion, disclosure, modal, drawer, popover, dropdown,
   tooltip) work with CSS and the platform alone.
2. **Ship the CSS.** Include `hydrateless` in your stylesheet bundle so the
   server-rendered markup is styled immediately.
3. **Enhance on the client (optional).** For behavior the platform can't express
   (roving focus, typeahead, single-open accordions), run the enhancers after
   the document loads.

The enhancers only **add** behavior (event listeners and ARIA attributes) to
existing DOM; they never replace it, so there is no server/client markup
mismatch to reconcile.

## Enhancers are no-ops on the server

Every enhancer resolves its container lazily. Called without a container in a
browser it defaults to `document`; called outside a browser (Node, a worker, a
test without a DOM) it returns an empty handle instead of throwing:

```js
import { enhanceTabs } from '@hydrateless/enhancers/tabs';

const handle = enhanceTabs();
// On the server: { instances: [], api: null, destroy() {} }
```

That makes it safe to import and call enhancers from shared modules that run in
both environments. The framework bindings rely on this: their components render
role and ARIA state on the server and attach the enhancer in a mount effect.

## Render state on the server

Because the enhancers read initial state from the markup, put it there:

- Tabs: `aria-selected="true"` on the selected tab and `hidden` on the other
  panels (or a `checked` radio in the CSS-only markup).
- Accordion: the `open` attribute on the expanded `<details>`.
- Dropdown: `popover` on the menu and `popovertarget` on the trigger, so it
  opens before hydration.
- Checkable menu items: an explicit `aria-checked`.

The framework components do this for you. `<Tabs defaultValue="install">`
renders the matching `aria-selected`/`hidden` during SSR, so the right panel is
visible in the first paint.

## Enhancing after load

With the auto-loader, run `auto()` once on the client. It scans for
`data-hl-*` roots, lazy-loads only the enhancers those roots need, and keeps
watching the document so content swapped in later is enhanced too. It resolves
to a disposer:

```js
import { auto } from '@hydrateless/auto';

const dispose = await auto(document);
// later, e.g. when unmounting an app shell:
dispose();
```

Pass `{ watch: false }` for a one-shot scan without the `MutationObserver`, or
import the package for its side effect (`import '@hydrateless/auto'`) to run
`auto(document)` on `DOMContentLoaded` with defaults.

## Streaming and partial hydration

Because enhancers operate on whatever DOM exists when they run, they compose
well with streaming SSR and island architectures. Enhance a specific island by
passing its root element instead of `document`:

```js
import { enhanceTabs } from '@hydrateless/enhancers/tabs';

const tabs = enhanceTabs(document.querySelector('#tabs-island'));
tabs.api?.setValue('install');
// tabs.destroy() when the island unmounts
```

Enhancers are idempotent: re-running one over a root that is already enhanced
is a no-op, so calling them again after a streamed chunk lands is safe.

## Framework guides

For framework-specific instructions, see:

- [React](/frameworks/react), including the React Server Components note
- [Vue](/frameworks/vue)
- [Svelte](/frameworks/svelte)
- [Astro](/frameworks/astro)
