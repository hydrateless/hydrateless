<script lang="ts">
  import { enhanceAccordion, type AccordionApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Allow more than one panel to stay open at a time. */
    allowMultiple?: boolean;
    /** Open item values; two-way bindable (`bind:value`). */
    value?: string[];
    /** Initially open item values for uncontrolled usage. */
    defaultValue?: string[];
    children?: Snippet;
  }

  let {
    allowMultiple = false,
    value = $bindable(),
    defaultValue,
    children,
    ...rest
  }: Props = $props();
  let host = $state<HTMLDivElement>();
  let api = $state<AccordionApi | null>(null);

  $effect(() => {
    if (!host) return;
    const handle = enhanceAccordion(host, {
      allowMultiple,
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

<div {...rest} data-hl-accordion bind:this={host}>
  {@render children?.()}
</div>
