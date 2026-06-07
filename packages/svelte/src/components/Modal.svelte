<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';

  interface Props extends HTMLDialogAttributes {
    open: boolean;
    closeOnBackdrop?: boolean;
    onclose?: () => void;
    children?: Snippet;
  }

  let { open, closeOnBackdrop = true, onclose, class: klass, children, ...rest }: Props = $props();
  let dialog = $state<HTMLDialogElement>();

  $effect(() => {
    const el = dialog;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  });

  function handleClose() {
    onclose?.();
  }
  function handleClick(e: MouseEvent) {
    if (closeOnBackdrop && e.target === dialog) onclose?.();
  }
</script>

<dialog
  {...rest}
  bind:this={dialog}
  class={['hydrateless-modal', klass]}
  onclose={handleClose}
  onclick={handleClick}
>
  {@render children?.()}
</dialog>
