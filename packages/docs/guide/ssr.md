# Server-Side Rendering

Hydrateless is a natural fit for server-side rendering (SSR) and static site
generation (SSG). Because components are plain semantic HTML styled with CSS,
the markup you render on the server is fully functional before any JavaScript
runs: there's no hydration step and no flash of unstyled or non-interactive
content.

## The mental model

1. **Render HTML on the server.** Components are just elements with `data-hl-*`
   attributes. Many (accordion, disclosure, modal, drawer, popover, tooltip)
   work with CSS alone.
2. **Ship the CSS.** Include `hydrateless` in your stylesheet bundle so the
   server-rendered markup is styled immediately.
3. **Enhance on the client (optional).** For components that benefit from JS
   (keyboard nav, focus traps, single-open accordions), run the enhancers after
   the document loads.

There's no server/client markup mismatch to worry about, because the enhancers
only **add** behavior (event listeners and ARIA attributes) to existing DOM;
they never replace it.

## Enhancing after load

With a framework that controls the document, run `auto()` once on mount:

```js
import { auto } from '@hydrateless/auto';

// Returns a disposer so you can tear down listeners on teardown.
const dispose = await auto(document);
```

## Single-page apps and client-side navigation

`auto()` keeps a `MutationObserver` on the container, so content swapped in by
your router is enhanced automatically and instances are disposed when their
roots leave the document; one call at startup is all you need:

```js
import { auto } from '@hydrateless/auto';

await auto(document);
```

This is exactly the pattern used by this documentation site, which is built
with VitePress. (Pass `{ watch: false }` for a one-shot scan instead.)

## Streaming and partial hydration

Because enhancers operate on whatever DOM exists when they run, they compose
well with streaming SSR and island/partial-hydration architectures. Enhance a
specific island by passing its root element instead of `document`:

```js
import { enhanceTabs } from '@hydrateless/enhancers/tabs';

const tabs = enhanceTabs(document.querySelector('#tabs-island'));
// tabs.api?.setValue('install'); tabs.destroy();
```

## Framework guides

For framework-specific instructions, see:

- [React](/frameworks/react)
- [Vue](/frameworks/vue)
- [Svelte](/frameworks/svelte)
- [Astro](/frameworks/astro)
