# @hydrateless/svelte

Svelte bindings for [Hydrateless](https://github.com/hydrateless/hydrateless).
Tiny actions that wire the framework-agnostic enhancers and clean up
automatically when the element is destroyed.

## Install

```bash
npm install hydrateless @hydrateless/svelte
```

Import the CSS once (e.g. in your root layout):

```ts
import 'hydrateless/hydrateless.css';
```

## Actions

```svelte
<script lang="ts">
  import { tabs, dropdown } from '@hydrateless/svelte';
</script>

<div use:tabs data-hl-tabs>
  <div role="tablist">
    <button role="tab">Overview</button>
    <button role="tab">Install</button>
  </div>
  <div role="tabpanel">Zero runtime by default.</div>
  <div role="tabpanel"><code>npm i hydrateless</code></div>
</div>

<div use:dropdown data-hl-dropdown>
  <button data-hl-dropdown-trigger>Actions</button>
  <ul data-hl-dropdown-menu>
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Delete</button></li>
  </ul>
</div>
```

Available actions: `accordion`, `disclosure`, `tabs`, `dropdown`, `modal`,
`drawer`, `popover`, `tooltip`, `toc`. For container-scoped components (modal,
drawer, popover, tooltip) put the action on a wrapper that contains the trigger
and target.

## Toasts

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createToast } from '@hydrateless/svelte';

  let toast: ReturnType<typeof createToast>;
  onMount(() => (toast = createToast()));
  onDestroy(() => toast?.destroy());
</script>

<button on:click={() => toast.show('Saved')}>Save</button>
```

## License

[MIT](../../LICENSE)
