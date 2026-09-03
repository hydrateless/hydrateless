<script lang="ts">
  import { enhanceModal } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLDialogAttributes {
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Open the dialog initially for uncontrolled usage. */
    defaultOpen?: boolean;
    /** Called after the dialog opens or closes (including native Escape). */
    onOpenChange?: (open: boolean) => void;
    /** Let Escape and a backdrop click close the dialog. Defaults to `true`. */
    closeOnBackdrop?: boolean;
    /** Dialog content; compose with `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>`. */
    children?: Snippet;
  }

  let {
    defaultOpen = false,
    open = $bindable(),
    onOpenChange,
    closeOnBackdrop = true,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;

  const modal = useEnhancer(enhanceModal, () => ({
    closeOnBackdrop,
    defaultOpen: untrack(() => open),
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    },
  }));

  $effect(() => {
    if (open != null) modal.api?.setOpen(open);
  });
</script>

<dialog {...rest} class={['hl-modal', klass]} data-hl-modal {@attach modal.attach}>
  {@render children?.()}
</dialog>
