<script lang="ts">
  import { enhanceDrawer, type DrawerApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';

  interface Props extends HTMLDialogAttributes {
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    side?: 'left' | 'right';
    closeOnBackdrop?: boolean;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    side = 'right',
    closeOnBackdrop = true,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  let dialog = $state<HTMLDialogElement>();
  let api = $state<DrawerApi | null>(null);

  $effect(() => {
    if (!dialog) return;
    const handle = enhanceDrawer(dialog, {
      closeOnBackdrop,
      onOpenChange: (next) => (open = next),
    });
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

<dialog {...rest} bind:this={dialog} data-side={side} class={['hl-drawer', klass]} data-hl-drawer>
  {@render children?.()}
</dialog>
