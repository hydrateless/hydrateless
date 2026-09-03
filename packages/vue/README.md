# @hydrateless/vue

Vue 3 bindings for [Hydrateless](https://github.com/hydrateless/hydrateless):
first-class components that render the library's HTML and attach the
framework-agnostic enhancers on mount, plus three composables (`useEnhancer`,
`useField`, `useToast`) for anything the components don't cover.

Requires Vue 3.5 or later (the package uses `useId()` for every generated id,
so server and client markup always agree).

## Install

```bash
npm install hydrateless @hydrateless/vue
```

Import the CSS once (e.g., in your entry):

```ts
import 'hydrateless/hydrateless.css';
```

## Components

Every component forwards `class`, `id`, and other attributes to its root
element and exports a `XProps` type (`TabsProps`, `DropdownItemProps`, and so
on). Stateful components work uncontrolled out of the box and accept `v-model`
for their primary value: `modelValue`/`defaultValue` for values, and
`open`/`defaultOpen` (`v-model:open`) for open state. Selection state is
rendered on the server (`aria-selected`, `hidden`, `popover`, `popovertarget`),
so nothing flashes before hydration.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, TabList, Tab, TabPanel, Modal, ModalBody } from '@hydrateless/vue';

const tab = ref('overview');
const open = ref(false);
</script>

<template>
  <Tabs v-model="tab">
    <TabList>
      <Tab value="overview">Overview</Tab>
      <Tab value="install">Install</Tab>
    </TabList>
    <TabPanel>Zero runtime by default.</TabPanel>
    <TabPanel><code>npm i hydrateless</code></TabPanel>
  </Tabs>

  <button @click="open = true">Open</button>
  <Modal v-model:open="open">
    <ModalBody>Body content.</ModalBody>
  </Modal>
</template>
```

### Prop and event contracts

| Component          | State                                                  | Events                             | Notes                                                                        |
| ------------------ | ------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| `Tabs`             | `v-model` (`modelValue`/`defaultValue`)                | `update:modelValue`                | `orientation`, `activation`                                                  |
| `Accordion`        | `v-model` (`string[]`)                                 | `update:modelValue`                | `allowMultiple`; `AccordionItem` takes `value` and `title` or a summary slot |
| `Disclosure`       | `v-model:open`                                         | `update:open`                      |                                                                              |
| `Dropdown`         | `v-model:open`                                         | `update:open`, `select`            | `closeOnSelect`, `placement`; `select` gets `(value, item, checked?)`        |
| `Menu`             | `v-model` (open submenu value or `null`)               | `update:modelValue`, `select`      | `orientation`; no `open` prop                                                |
| `Command`          | `v-model:query` (`query`/`defaultQuery`)               | `update:query`, `command`          | `hotkey`; `command` gets `(value, item)`                                     |
| `Combobox`         | `v-model` and `v-model:open`                           | `update:modelValue`, `update:open` | `filter`, `autoHighlight`; `ComboboxOption` takes `disabled`                 |
| `Modal`, `Drawer`  | `v-model:open`                                         | `update:open`                      | `closeOnBackdrop`; `Drawer` takes `side: 'start' \| 'end'` (default `end`)   |
| `Popover`          | `v-model:open`                                         | `update:open`                      | `placement`, `hover`                                                         |
| `Tooltip`          | `v-model:open`                                         | `update:open`                      | `content`, `placement`, `showDelay`, `hideDelay`                             |
| `SegmentedControl` | `v-model`; uncontrolled default is the first `options` | `update:modelValue`                | `options`, `size`                                                            |
| `Pagination`       | `v-model:page`                                         | `update:page`                      | `count`, `siblingCount`                                                      |

`DropdownItem` takes `value`, `disabled`, `role` (`menuitem`, `menuitemcheckbox`,
or `menuitemradio`), and `checked`, and emits both `click` and `select`.
`DropdownGroup` wraps items in a labelled `role="group"` (radio items check one
per group), and `DropdownSeparator` draws a divider. `MenuSubmenu` opens a
flyout of `MenuItem`s from a top-level `Menu`.

Primitives: `Alert`, `Avatar`, `AvatarGroup`, `Badge`, `Breadcrumb`, `Button`,
`Card` (with `CardHeader`, `CardBody`, `CardFooter`, `CardTitle`,
`CardDescription`), `Kbd`, `Progress`, `Separator`, `Skeleton` (`shape`,
`width`, `height`), `SkipLink`, `Spinner`, `Table` (`striped`, `hover`,
`align`, `size`), and `Toc`.

## Forms and `useField()`

`<Field>` gives its control an id and describes it with the help and error
text. Pass `label`, `description`, `error`, and `required` as props, or compose
`<FieldLabel>`, `<FieldHelp>`, and `<FieldError>` yourself. Every Hydrateless
control (`Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`,
`ComboboxInput`) reads the field automatically: `id`, `aria-describedby`,
`aria-invalid`, and `required` are wired for you, and the controls work
unchanged outside a field.

```vue
<Field label="Email" description="We never share it." :error="error" required>
  <Input v-model="email" type="email" />
</Field>
```

For a custom control, call `useField()`. It returns `{ id, describedBy,
invalid, required }` (reactive) inside a `<Field>` and `null` outside one.

```vue
<script setup lang="ts">
import { useField } from '@hydrateless/vue';
const field = useField();
</script>

<template>
  <div
    role="textbox"
    :id="field?.id"
    :aria-describedby="field?.describedBy"
    :aria-invalid="field?.invalid || undefined"
  />
</template>
```

## Toasts

Mount `<ToastRegion>` once near the app root; it enhances itself on mount. Then
call `useToast()` anywhere. No provider is required.

```vue
<script setup lang="ts">
import { ToastRegion, useToast } from '@hydrateless/vue';

const toast = useToast();
const save = () => toast.show('Saved', { intent: 'success', duration: 4000 });
</script>

<template>
  <button @click="save">Save</button>
  <ToastRegion />
</template>
```

`show(message, { duration, intent })` returns the toast element, which you can
pass to `dismiss()`. Intents are `info`, `success`, `warning`, and `danger`
(`danger` toasts are announced assertively).

## `useEnhancer()`

The one low-level escape hatch. Pass a template ref, an enhancer from
`@hydrateless/enhancers`, and its options; the enhancer attaches on mount, is
destroyed on unmount, and its imperative API is returned as a shallow ref.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useEnhancer } from '@hydrateless/vue';
import { enhanceDropdown } from '@hydrateless/enhancers';

const host = useTemplateRef('host');
const api = useEnhancer(host, enhanceDropdown, { placement: 'bottom-end' });
// api.value?.setOpen(true)
</script>

<template>
  <div ref="host" data-hl-dropdown>...</div>
</template>
```

Pass a getter for `options` and a fourth `deps` watch source to re-attach when
an option changes.

## Breaking changes in this release

- The `v-hl-*` directives and `HydratelessPlugin` are gone; use the components
  or `useEnhancer`.
- `useFieldBindings()` is now `useField()` and returns `{ id, describedBy,
invalid, required } | null` instead of attribute names.
- `Menu` is controlled through `v-model` (the open submenu's value) instead of
  `v-model:open`.
- `Command` uses `v-model:query` and emits `command` (was `select`).
- `Drawer` `side` is `'start' | 'end'`; `Skeleton` `variant` is `shape`;
  `Tooltip` `label` is `content`; toast `variant` is `intent`.

## License

[MIT](../../LICENSE)
