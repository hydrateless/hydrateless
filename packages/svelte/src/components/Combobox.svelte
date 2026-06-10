<script lang="ts">
  import {
    enhanceCombobox,
    type ComboboxApi,
    type EnhanceComboboxOptions,
  } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    filter?: EnhanceComboboxOptions['filter'];
    autoHighlight?: EnhanceComboboxOptions['autoHighlight'];
    /** Committed value; two-way bindable (`bind:value`). */
    value?: string;
    /** Initial committed value for uncontrolled usage. */
    defaultValue?: string;
    /** Called with the committed value when an option is selected. */
    onValueChange?: (value: string) => void;
    children?: Snippet;
  }

  let {
    filter,
    autoHighlight,
    value = $bindable(),
    defaultValue,
    onValueChange,
    children,
    ...rest
  }: Props = $props();
  let host = $state<HTMLDivElement>();
  let api = $state<ComboboxApi | null>(null);

  $effect(() => {
    if (!host) return;
    const handle = enhanceCombobox(host, {
      filter,
      autoHighlight,
      defaultValue: untrack(() => value ?? defaultValue),
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
    });
    api = handle.api;
    return () => {
      handle.destroy();
      api = null;
    };
  });

  $effect(() => {
    if (value != null) api?.setValue(value);
  });
</script>

<div {...rest} data-hl-combobox bind:this={host}>
  {@render children?.()}
</div>
