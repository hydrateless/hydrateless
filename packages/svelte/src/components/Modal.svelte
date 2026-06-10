<script lang="ts">
  import { enhanceModal, type ModalApi } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';

  interface Props extends HTMLDialogAttributes {
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    closeOnBackdrop?: boolean;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    closeOnBackdrop = true,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  let dialog = $state<HTMLDialogElement>();
  let api = $state<ModalApi | null>(null);

  $effect(() => {
    if (!dialog) return;
    const handle = enhanceModal(dialog, {
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

<dialog {...rest} bind:this={dialog} class={['hl-modal', klass]} data-hl-modal>
  {@render children?.()}
</dialog>
