# Vue

`@hydrateless/vue` ships **first-class Vue 3 components** for every Hydrateless
primitive, plus the low-level directives and composables. Components render the
same semantic markup as the core library; the interactive behavior (keyboard
navigation, ARIA wiring, focus traps) comes from the underlying enhancer,
attached and disposed automatically through the component lifecycle.

## Install

```bash
npm install hydrateless @hydrateless/vue
```

Import the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Components

Composable primitives use a **compound API** — a parent plus named parts you
arrange with slots:

```vue
<script setup>
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/vue';
</script>

<template>
  <Tabs>
    <TabList>
      <Tab>Overview</Tab>
      <Tab>Install</Tab>
    </TabList>
    <TabPanel>Zero runtime by default.</TabPanel>
    <TabPanel>npm install hydrateless</TabPanel>
  </Tabs>
</template>
```

Controlled overlays take an `open` prop and emit `close`:

```vue
<script setup>
import { ref } from 'vue';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@hydrateless/vue';

const open = ref(false);
</script>

<template>
  <Button @click="open = true">Open</Button>

  <Modal :open="open" @close="open = false">
    <ModalHeader><h2>Confirm</h2></ModalHeader>
    <ModalBody>Are you sure?</ModalBody>
    <ModalFooter>
      <Button @click="open = false">Close</Button>
    </ModalFooter>
  </Modal>
</template>
```

Form controls support `v-model`, and `<Field>` wires up label, help, and error
ids automatically:

```vue
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel, FieldHelp, Input } from '@hydrateless/vue';

const email = ref('');
</script>

<template>
  <Field>
    <FieldLabel>Email</FieldLabel>
    <Input type="email" v-model="email" />
    <FieldHelp>We never share it.</FieldHelp>
  </Field>
</template>
```

### Available components

| Group        | Components                                                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disclosure   | `Accordion`, `AccordionItem`, `Disclosure`, `Tabs`, `TabList`, `Tab`, `TabPanel`                                                                                                 |
| Overlays     | `Dropdown` (+ `DropdownTrigger`/`DropdownMenu`/`DropdownItem`/`DropdownSeparator`), `Menu`, `MenuItem`, `Modal`, `Drawer` (+ parts), `Popover`, `Tooltip`                        |
| Forms        | `Field`, `FieldLabel`, `FieldHelp`, `FieldError`, `Fieldset`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `RadioGroup`, `Radio`, `SegmentedControl`, `Button` |
| Combobox     | `Combobox`, `ComboboxInput`, `ComboboxList`, `ComboboxOption`                                                                                                                    |
| Command      | `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`                                                                                          |
| Feedback     | `Alert`, `Badge`, `Progress`, `Spinner`, `Skeleton`, `ToastRegion`                                                                                                               |
| Data display | `Card` (+ `CardHeader`/`CardBody`/`CardFooter`/`CardTitle`/`CardDescription`), `Avatar`, `AvatarGroup`, `Kbd`, `Separator`                                                       |
| Navigation   | `Breadcrumb`, `BreadcrumbItem`, `Pagination`, `Toc`, `SkipLink`                                                                                                                  |

## Low-level: directives

Prefer to keep writing plain template markup? Install the plugin to register
every `v-hl-*` directive globally:

```js
import { createApp } from 'vue';
import { HydratelessPlugin } from '@hydrateless/vue';
import App from './App.vue';

createApp(App).use(HydratelessPlugin);
```

Then add a directive to any semantic markup:

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

The directive attaches the enhancer on `mounted` and disposes it on
`unmounted`. Available directives: `v-hl-accordion`, `v-hl-disclosure`,
`v-hl-tabs`, `v-hl-dropdown`, `v-hl-menu`, `v-hl-modal`, `v-hl-drawer`,
`v-hl-popover`, `v-hl-tooltip`, `v-hl-combobox`, `v-hl-command`, `v-hl-toc`.

Don't want all of them globally? Import only what you need and register locally:

```vue
<script setup>
import { vHlDropdown } from '@hydrateless/vue';
</script>

<template>
  <div v-hl-dropdown data-hl-dropdown>…</div>
</template>
```

### The `useEnhancer` composable

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

Type definitions ship with the package. Component props, the `Disposer` type,
and toast option types are all exported for reuse.
