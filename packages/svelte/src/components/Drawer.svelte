<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';

  interface Props extends HTMLDialogAttributes {
    open: boolean;
    side?: 'left' | 'right';
    closeOnBackdrop?: boolean;
    onclose?: () => void;
    children?: Snippet;
  }

  let {
    open,
    side = 'right',
    closeOnBackdrop = true,
    onclose,
    class: klass,
    children,
    ...rest
  }: Props = $props();
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
  data-side={side}
  class={['hydrateless-drawer', klass]}
  onclose={handleClose}
  onclick={handleClick}
>
  {@render children?.()}
</dialog>
