# @hydrateless/svelte

Svelte bindings for [Hydrateless](https://github.com/hydrateless/hydrateless).
Tiny actions that wire the framework-agnostic enhancers and clean up
automatically when the element is destroyed.

## Install

```bash
npm install hydrateless @hydrateless/svelte
```

Import the CSS once (e.g., in your root layout):

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

## Components

Interactive components support two-way binding on their state:

```svelte
<script lang="ts">
  import { Tabs, TabList, Tab, TabPanel, Modal, ModalBody } from '@hydrateless/svelte';

  let tab = $state('overview');
  let open = $state(false);
</script>

<Tabs bind:value={tab}>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="install">Install</Tab>
  </TabList>
  <TabPanel>Zero runtime by default.</TabPanel>
  <TabPanel><code>npm i hydrateless</code></TabPanel>
</Tabs>

<button onclick={() => (open = true)}>Open</button>
<Modal bind:open>
  <ModalBody>Body content.</ModalBody>
</Modal>
```

## Toasts

`useToast()` works anywhere, no setup required:

```svelte
<script lang="ts">
  import { useToast } from '@hydrateless/svelte';

  const toast = useToast();
</script>

<button onclick={() => toast.show('Saved', { variant: 'success' })}>Save</button>
```

## License

[MIT](../../LICENSE)
