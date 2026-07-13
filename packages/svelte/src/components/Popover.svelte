<script lang="ts">
  import { enhancePopover, type PopoverApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Open state; two-way bindable (`bind:open`). The browser's light-dismiss
     * (Escape/outside click) closes it and updates the binding. */
    open?: boolean;
    /** Show the popover initially for uncontrolled usage. */
    defaultOpen?: boolean;
    children?: Snippet;
  }

  let { defaultOpen = false, open = $bindable(), children, ...rest }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;
  let host = $state<HTMLDivElement>();
  let api = $state<PopoverApi | null>(null);

  $effect(() => {
    if (!host) return;
    const handle = enhancePopover(host, {
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

<div {...rest} data-hl-popover popover="auto" role="dialog" bind:this={host}>
  {@render children?.()}
</div>
