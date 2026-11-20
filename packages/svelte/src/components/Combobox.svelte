<script lang="ts">
  import { enhanceCombobox, type EnhanceComboboxOptions } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange' | 'onselect'> {
    /** Hide options that don't match the typed query. Defaults to `true`. */
    filter?: EnhanceComboboxOptions['filter'];
    /** Highlight the first match automatically while typing. Defaults to `true`. */
    autoHighlight?: EnhanceComboboxOptions['autoHighlight'];
    /** Committed value; two-way bindable (`bind:value`). */
    value?: string;
    /** Initial committed value for uncontrolled usage. */
    defaultValue?: string;
    /** Called with the committed value after a selection or `value` change. */
    onValueChange?: (value: string) => void;
    /** Whether the listbox is expanded; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Expand the listbox initially for uncontrolled usage. */
    defaultOpen?: boolean;
    /** Called after the listbox expands or collapses. */
    onOpenChange?: (open: boolean) => void;
    /** A `<ComboboxInput>` followed by a `<ComboboxList>` of `<ComboboxOption>`s. */
    children?: Snippet;
  }

  let {
    filter,
    autoHighlight,
    value = $bindable(),
    defaultValue,
    onValueChange,
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial values once
  if (value === undefined) value = defaultValue;
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial values once
  if (open === undefined) open = defaultOpen;
  let valueTick = $state(0);
  let openTick = $state(0);

  const combobox = useEnhancer(enhanceCombobox, () => ({
    filter,
    autoHighlight,
    defaultValue: untrack(() => value),
    defaultOpen: untrack(() => open),
    onValueChange: (next) => {
      value = next;
      onValueChange?.(next);
      valueTick += 1;
    },
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
      openTick += 1;
    },
  }));

  $effect(() => {
    void valueTick;
    if (value != null && combobox.api && combobox.api.value !== value) {
      combobox.api.setValue(value, { silent: true });
    }
  });

  $effect(() => {
    void openTick;
    if (open != null && combobox.api && combobox.api.open !== open) {
      combobox.api.setOpen(open, { silent: true });
    }
  });
</script>

<div {...rest} class={['hl-combobox', klass]} data-hl-combobox {@attach combobox.attach}>
  {@render children?.()}
</div>
