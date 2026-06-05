# @hydrateless/vue

Vue 3 bindings for [Hydrateless](https://github.com/hydrateless/hydrateless):
directives, composables, and a plugin that wire the framework-agnostic
enhancers, with automatic cleanup when components unmount.

## Install

```bash
npm install hydrateless @hydrateless/vue
```

Import the CSS once (e.g. in your entry):

```ts
import 'hydrateless/hydrateless.css';
```

## Plugin (global directives)

```ts
import { createApp } from 'vue';
import { HydratelessPlugin } from '@hydrateless/vue';
import App from './App.vue';

createApp(App).use(HydratelessPlugin).mount('#app');
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
    <div role="tabpanel"><code>npm i hydrateless</code></div>
  </div>
</template>
```

Available directives: `v-hl-accordion`, `v-hl-disclosure`, `v-hl-tabs`,
`v-hl-dropdown`, `v-hl-modal`, `v-hl-drawer`, `v-hl-popover`, `v-hl-tooltip`,
`v-hl-toc`. You can also import individual directives (e.g. `vHlTabs`) and
register them locally.

## Composables

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useEnhancer, useToast } from '@hydrateless/vue';
import { enhanceDropdown } from '@hydrateless/enhancers';

const menu = ref<HTMLElement | null>(null);
useEnhancer(menu, enhanceDropdown);

const toast = useToast();
</script>

<template>
  <div ref="menu" data-hl-dropdown>…</div>
  <button @click="toast.show('Saved')">Save</button>
</template>
```

## License

[MIT](../../LICENSE)
