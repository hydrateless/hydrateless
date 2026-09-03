# Vue

`@hydrateless/vue` ships first-class Vue components for every Hydrateless
primitive. Components render the same semantic markup as the core CSS, so they
look right before hydration, and the enhancer that adds keyboard navigation,
ARIA wiring, and focus management is attached on mount and disposed on unmount.

## Install

```bash
npm install hydrateless @hydrateless/vue
```

Requires **Vue 3.5 or later** (the package uses `useId()` for SSR-stable ids
and `useTemplateRef()`). Import the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Components

Composable primitives use a **compound API**: a parent plus named parts you
arrange with slots.

```vue
<script setup>
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/vue';
</script>

<template>
  <Tabs default-value="overview">
    <TabList>
      <Tab value="overview">Overview</Tab>
      <Tab value="install">Install</Tab>
    </TabList>
    <TabPanel>Zero runtime by default.</TabPanel>
    <TabPanel>npm install hydrateless</TabPanel>
  </Tabs>
</template>
```

`Tabs` renders `role="tablist"`, `aria-selected`, `tabindex`, and `hidden` in
its render function, so server output is already correct and there's no flash
when the enhancer attaches.

### `v-model` and uncontrolled state

Every stateful component works both ways:

- **Uncontrolled**: pass `default-value` (or `default-open`, `default-query`)
  and let the component own its state.
- **Controlled**: bind with `v-model`. The primary value uses plain `v-model`
  (`modelValue` + `update:modelValue`); named state uses `v-model:open` and
  `v-model:query`. Dismissals the user triggers (Escape, backdrop click,
  outside click) flow back into your ref.

```vue
<script setup>
import { ref } from 'vue';
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/vue';

const tab = ref('overview');
</script>

<template>
  <Tabs v-model="tab">
    <TabList>
      <Tab value="overview">Overview</Tab>
      <Tab value="install">Install</Tab>
    </TabList>
    <TabPanel>...</TabPanel>
    <TabPanel>...</TabPanel>
  </Tabs>
</template>
```

```vue
<script setup>
import { ref } from 'vue';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@hydrateless/vue';

const open = ref(false);
</script>

<template>
  <Button @click="open = true">Delete</Button>

  <Modal v-model:open="open">
    <ModalHeader><h2>Delete project?</h2></ModalHeader>
    <ModalBody>This can't be undone.</ModalBody>
    <ModalFooter>
      <Button variant="ghost" @click="open = false">Cancel</Button>
      <Button intent="danger">Delete</Button>
    </ModalFooter>
  </Modal>
</template>
```

Which model and emits each component uses:

| Component          | Model                                                                                    | Other props and emits                                    |
| ------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `Tabs`             | `v-model` (string), `default-value`                                                      | `orientation`, `activation`                              |
| `Accordion`        | `v-model` (string[]), `default-value`                                                    | `allow-multiple`                                         |
| `Disclosure`       | `v-model:open`, `default-open`                                                           | `title` or the `summary` slot                            |
| `Menu`             | `v-model` (open submenu or `null`), `default-value`                                      | `@select="(value, item, checked) => ..."`, `orientation` |
| `Dropdown`         | `v-model:open`, `default-open`                                                           | `@select`, `close-on-select`, `placement`                |
| `Modal`, `Drawer`  | `v-model:open`, `default-open`                                                           | `close-on-backdrop`; Drawer `side="start" \| "end"`      |
| `Popover`          | `v-model:open`, `default-open`                                                           | `placement`, `hover`                                     |
| `Tooltip`          | `v-model:open`                                                                           | `content`, `placement`, `show-delay`, `hide-delay`       |
| `Combobox`         | `v-model` (string), `v-model:open`                                                       | `filter`, `auto-highlight`                               |
| `Command`          | `v-model:query`, `default-query`                                                         | `@command="(value, item) => ..."`, `hotkey`              |
| `SegmentedControl` | `v-model` (defaults to the first option)                                                 | `options`, `size`                                        |
| `Pagination`       | `v-model:page`                                                                           | `count`, `sibling-count`, `show-controls`                |
| Form controls      | `v-model` on `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `RadioGroup` |                                                          |

### Dropdown with checkable items

`DropdownItem` accepts `role="menuitemcheckbox" | "menuitemradio"` and
`checked`; `DropdownGroup` wraps a labeled `role="group"`. The trigger renders
`popovertarget` and the menu renders `popover`, so the menu opens before
JavaScript loads.

```vue
<script setup>
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
} from '@hydrateless/vue';
</script>

<template>
  <Dropdown @select="(value, item, checked) => console.log(value, checked)">
    <DropdownTrigger>View</DropdownTrigger>
    <DropdownMenu>
      <DropdownGroup label="Show">
        <DropdownItem value="grid" role="menuitemradio" checked>Grid</DropdownItem>
        <DropdownItem value="list" role="menuitemradio">List</DropdownItem>
      </DropdownGroup>
      <DropdownSeparator />
      <DropdownItem value="hidden" role="menuitemcheckbox">Show hidden files</DropdownItem>
      <DropdownItem value="reset" disabled>Reset view</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>
```

### Available components

| Group        | Components                                                                                                                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disclosure   | `Accordion`, `AccordionItem`, `Disclosure`, `Tabs`, `TabList`, `Tab`, `TabPanel`                                                                                                                                |
| Overlays     | `Dropdown` (+ `DropdownTrigger`, `DropdownMenu`, `DropdownGroup`, `DropdownItem`, `DropdownSeparator`), `Menu`, `MenuItem`, `MenuSubmenu`, `Modal`, `Drawer` (+ `Header`/`Body`/`Footer`), `Popover`, `Tooltip` |
| Forms        | `Field`, `FieldLabel`, `FieldHelp`, `FieldError`, `Fieldset`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `RadioGroup`, `Radio`, `SegmentedControl`, `Button`                                |
| Combobox     | `Combobox`, `ComboboxInput`, `ComboboxList`, `ComboboxOption`                                                                                                                                                   |
| Command      | `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`                                                                                                                         |
| Feedback     | `Alert`, `Badge`, `Progress`, `Spinner`, `Skeleton`, `ToastRegion`                                                                                                                                              |
| Data display | `Card` (+ `CardHeader`, `CardBody`, `CardFooter`, `CardTitle`, `CardDescription`), `Avatar`, `AvatarGroup`, `Kbd`, `Separator`, `Table`                                                                         |
| Navigation   | `Breadcrumb`, `BreadcrumbItem`, `Pagination`, `Toc`, `SkipLink`                                                                                                                                                 |

Every component forwards `class`, `id`, and other attributes to its root
element, and template refs resolve to the root DOM node.

## Forms and `useField`

`Field` provides a shared id so `FieldLabel`, `FieldHelp`, and `FieldError`
wire `for` and `aria-describedby` for you. The built-in controls read that
context automatically, and work without it.

```vue
<script setup>
import { ref } from 'vue';
import { Field, Input } from '@hydrateless/vue';

const email = ref('');
const error = ref('');
</script>

<template>
  <Field label="Email" description="We never share it." :error="error" required>
    <Input type="email" name="email" v-model="email" />
  </Field>
</template>
```

For a custom control, `useField()` returns reactive bindings
(`{ id, describedBy, invalid, required }`) inside a `Field` and `null` outside
one:

```vue
<script setup>
import { useField } from '@hydrateless/vue';

const field = useField();
</script>

<template>
  <input
    type="color"
    :id="field?.id"
    :aria-describedby="field?.describedBy"
    :aria-invalid="field?.invalid || undefined"
    :required="field?.required"
  />
</template>
```

See [Forms](/guide/forms) for validation states and native constraint
validation.

## Toasts and `useToast`

`useToast()` returns `{ show(message, { duration, intent }), dismiss(toast) }`
and works from any component with no plugin or provider. The first `show()`
creates a polite live region at the end of `<body>`; render `<ToastRegion />`
once if you want to control where toasts appear.

```vue
<script setup>
import { ToastRegion, useToast } from '@hydrateless/vue';

const toast = useToast();
</script>

<template>
  <button @click="toast.show('Saved', { intent: 'success' })">Save</button>
  <ToastRegion />
</template>
```

`intent` is one of `info`, `success`, `warning`, or `danger`; `danger` toasts
are announced assertively.

## `useEnhancer`

The one low-level escape hatch. Attach any enhancer to a template ref and get
back a shallow ref to its imperative API:

```vue
<script setup>
import { useTemplateRef } from 'vue';
import { useEnhancer } from '@hydrateless/vue';
import { enhanceTabs } from '@hydrateless/enhancers';

const host = useTemplateRef('host');
const api = useEnhancer(host, enhanceTabs, { activation: 'automatic' });
// api.value?.setValue('install')
</script>

<template>
  <div ref="host" data-hl-tabs>
    <!-- your own tablist and tabpanel markup -->
  </div>
</template>
```

Signature: `useEnhancer(elRef, enhancer, options?, deps?)`.

- The enhancer runs on the client only (in `onMounted`), so components stay
  SSR-safe, and is destroyed in `onBeforeUnmount`.
- `options` may be a plain object, a ref, or a getter; it's re-read and the
  enhancer re-attached whenever the `deps` watch source changes.

All shipped components are built on this composable, so custom wrappers behave
exactly like the built-in ones. See [Composing](/guide/composing#writing-your-own-enhancer)
for writing an enhancer to attach.

## TypeScript

Type definitions ship with the package. Every component exports its public
prop type (`TabsProps`, `DropdownItemProps`, `ModalProps`, `TableProps`, and so
on), and the enhancer API types (`TabsApi`, `ModalApi`, `ToastApi`,
`ToastIntent`) are re-exported for reuse.
