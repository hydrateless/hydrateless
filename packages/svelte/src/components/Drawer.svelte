<script lang="ts">
  import { enhanceDrawer, type DrawerApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';

  interface Props extends HTMLDialogAttributes {
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Open the drawer initially for uncontrolled usage. */
    defaultOpen?: boolean;
    side?: 'left' | 'right';
    closeOnBackdrop?: boolean;
    children?: Snippet;
  }

  let {
    defaultOpen = false,
    open = $bindable(),
    side = 'right',
    closeOnBackdrop = true,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;
  let dialog = $state<HTMLDialogElement>();
  let api = $state<DrawerApi | null>(null);

  $effect(() => {
    if (!dialog) return;
    const handle = enhanceDrawer(dialog, {
      closeOnBackdrop,
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

<dialog {...rest} bind:this={dialog} data-side={side} class={['hl-drawer', klass]} data-hl-drawer>
  {@render children?.()}
</dialog>
