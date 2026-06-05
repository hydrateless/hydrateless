# Svelte

`@hydrateless/svelte` exposes the Hydrateless enhancers as Svelte
[actions](https://svelte.dev/docs/svelte-action). Actions are the perfect fit:
they receive the DOM node, run the enhancer, and tear it down automatically when
the element is removed.

## Install

```bash
npm install hydrateless @hydrateless/svelte
```

Import the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Use an action

Add `use:<name>` to the element you want enhanced:

```svelte
<script>
  import { tabs } from '@hydrateless/svelte';
</script>

<div use:tabs data-hl-tabs>
  <div role="tablist">
    <button role="tab">Overview</button>
    <button role="tab">Install</button>
  </div>
  <div role="tabpanel">Zero runtime by default.</div>
  <div role="tabpanel">npm install hydrateless</div>
</div>
```

The action runs the enhancer when the node mounts and calls its disposer in the
action's `destroy` lifecycle, so listeners are cleaned up automatically.

### Available actions

`accordion`, `disclosure`, `tabs`, `dropdown`, `menu`, `modal`, `drawer`,
`popover`, `tooltip`, `combobox`, `command`, `toc`.

```svelte
<script>
  import { accordion, dropdown, tooltip } from '@hydrateless/svelte';
</script>

<div use:accordion data-hl-accordion>…</div>
<div use:dropdown data-hl-dropdown>…</div>
<button use:tooltip data-hl-tooltip="tip">Hover me</button>
```

## Toasts

`createToast` returns the imperative toast API. Create it in `onMount` and tear
it down in `onDestroy`:

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { createToast } from '@hydrateless/svelte';

  let toast;
  onMount(() => (toast = createToast()));
  onDestroy(() => toast?.destroy());
</script>

<button on:click={() => toast.show('Saved!')}>Save</button>
```

## TypeScript

The package ships with full type definitions. Actions are typed as
`Action<HTMLElement>`, and the `Disposer` type is re-exported.
