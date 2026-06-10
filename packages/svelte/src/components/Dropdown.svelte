<script lang="ts">
  import {
    enhanceDropdown,
    type DropdownApi,
    type EnhanceDropdownOptions,
  } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    placement?: EnhanceDropdownOptions['placement'];
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    children?: Snippet;
  }

  let { placement, open = $bindable(false), children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();
  let api = $state<DropdownApi | null>(null);

  $effect(() => {
    if (!host) return;
    const handle = enhanceDropdown(host, {
      placement,
      defaultOpen: untrack(() => open),
      onOpenChange: (next) => (open = next),
    });
    api = handle.api;
    return () => {
      handle.destroy();
      api = null;
    };
  });

  $effect(() => {
    api?.setOpen(open);
  });
</script>

<div {...rest} data-hl-dropdown bind:this={host}>
  {@render children?.()}
</div>
