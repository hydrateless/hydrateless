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
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial values once
  if (value === undefined) value = defaultValue;
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial values once
  if (open === undefined) open = defaultOpen;

  const combobox = useEnhancer(enhanceCombobox, () => ({
    filter,
    autoHighlight,
    defaultValue: untrack(() => value),
    onValueChange: (next) => {
      value = next;
      onValueChange?.(next);
    },
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    },
  }));

  $effect(() => {
    if (value != null) combobox.api?.setValue(value);
  });

  $effect(() => {
    if (open != null) combobox.api?.setOpen(open);
  });
</script>

<div {...rest} data-hl-combobox {@attach combobox.attach}>
  {@render children?.()}
</div>
