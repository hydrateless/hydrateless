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
    /** Open the menu initially for uncontrolled usage. */
    defaultOpen?: boolean;
    children?: Snippet;
  }

  let { placement, defaultOpen = false, open = $bindable(), children, ...rest }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;
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
    if (open != null) api?.setOpen(open);
  });
</script>

<div {...rest} data-hl-dropdown bind:this={host}>
  {@render children?.()}
</div>
