# Vue

`@hydrateless/vue` exposes the Hydrateless enhancers as Vue directives plus a
couple of composables. Because the enhancers operate on real DOM, you keep
writing ordinary semantic markup in your templates and add a directive to wire
up behavior.

## Install

```bash
npm install hydrateless @hydrateless/vue
```

Import the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Register the directives

Install the plugin to register every `v-hl-*` directive globally:

```js
import { createApp } from 'vue';
import { HydratelessPlugin } from '@hydrateless/vue';
import App from './App.vue';

createApp(App).use(HydratelessPlugin);
```

Then use the directives in any template:

```vue
<template>
  <div v-hl-tabs data-hl-tabs>
    <div role="tablist">
      <button role="tab">Overview</button>
      <button role="tab">Install</button>
    </div>
    <div role="tabpanel">Zero runtime by default.</div>
    <div role="tabpanel">npm install hydrateless</div>
  </div>
</template>
```

The directive attaches the enhancer on `mounted` and disposes it on `unmounted`,
so there are no leaked listeners.

### Available directives

`v-hl-accordion`, `v-hl-disclosure`, `v-hl-tabs`, `v-hl-dropdown`, `v-hl-modal`,
`v-hl-drawer`, `v-hl-popover`, `v-hl-tooltip`, `v-hl-toc`.

### Registering selectively

Don't want all directives globally? Import only the ones you need and register
them locally:

```vue
<script setup>
import { vHlDropdown } from '@hydrateless/vue';
</script>

<template>
  <div v-hl-dropdown data-hl-dropdown>…</div>
</template>
```

## The `useEnhancer` composable

For full control, attach any enhancer to a template ref:

```vue
<script setup>
import { ref } from 'vue';
import { useEnhancer } from '@hydrateless/vue';
import { enhanceTabs } from '@hydrateless/enhancers';

const el = ref(null);
useEnhancer(el, enhanceTabs);
</script>

<template>
  <div ref="el" data-hl-tabs>…</div>
</template>
```

## Toasts

`useToast` sets up a toast region for the current component tree and returns an
imperative API. The region is torn down automatically on unmount.

```vue
<script setup>
import { useToast } from '@hydrateless/vue';

const toast = useToast();
</script>

<template>
  <button @click="toast.show('Saved!')">Save</button>
</template>
```

## TypeScript

Type definitions ship with the package. The `Disposer` type and toast option
types are re-exported for convenience.
