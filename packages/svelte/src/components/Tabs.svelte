<script lang="ts">
  import { enhanceTabs, type EnhanceTabsOptions, type TabsApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    activation?: EnhanceTabsOptions['activation'];
    orientation?: EnhanceTabsOptions['orientation'];
    /** Selected tab value; two-way bindable (`bind:value`). */
    value?: string;
    /** Initial value for uncontrolled usage. */
    defaultValue?: string;
    children?: Snippet;
  }

  let {
    activation,
    orientation,
    value = $bindable(),
    defaultValue,
    children,
    ...rest
  }: Props = $props();
  let host = $state<HTMLDivElement>();
  let api = $state<TabsApi | null>(null);

  $effect(() => {
    if (!host) return;
    const handle = enhanceTabs(host, {
      activation,
      orientation,
      defaultValue: untrack(() => value ?? defaultValue),
      onValueChange: (next) => (value = next),
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

<div {...rest} data-hl-tabs bind:this={host}>
  {@render children?.()}
</div>
