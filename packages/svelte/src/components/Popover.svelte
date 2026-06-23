<script lang="ts">
  import { enhancePopover, type PopoverApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Open state; two-way bindable (`bind:open`). The browser's light-dismiss
     * (Escape/outside click) closes it and updates the binding. */
    open?: boolean;
    children?: Snippet;
  }

  let { open = $bindable(false), children, ...rest }: Props = $props();
  let host = $state<HTMLDivElement>();
  let api = $state<PopoverApi | null>(null);

  $effect(() => {
    if (!host) return;
    const handle = enhancePopover(host, { onOpenChange: (next) => (open = next) });
    api = handle.api;
    if (untrack(() => open)) handle.api?.setOpen(true);
    return () => {
      handle.destroy();
      api = null;
    };
  });

  $effect(() => {
    api?.setOpen(open);
  });
</script>

<div {...rest} data-hl-popover popover="auto" role="dialog" bind:this={host}>
  {@render children?.()}
</div>
