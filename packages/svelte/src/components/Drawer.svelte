<script lang="ts">
  import { enhanceDrawer } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLDialogAttributes {
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Open the drawer initially for uncontrolled usage. */
    defaultOpen?: boolean;
    /** Called after the drawer opens or closes (including native Escape). */
    onOpenChange?: (open: boolean) => void;
    /** Logical edge the drawer slides in from (RTL-aware). Defaults to `end`. */
    side?: 'start' | 'end';
    /** Let Escape and a backdrop click close the drawer. Defaults to `true`. */
    closeOnBackdrop?: boolean;
    /** Drawer content; compose with `<DrawerHeader>`, `<DrawerBody>`, `<DrawerFooter>`. */
    children?: Snippet;
  }

  let {
    defaultOpen = false,
    open = $bindable(),
    onOpenChange,
    side = 'end',
    closeOnBackdrop = true,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;

  const drawer = useEnhancer(enhanceDrawer, () => ({
    closeOnBackdrop,
    defaultOpen: untrack(() => open),
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    },
  }));

  $effect(() => {
    if (open != null) drawer.api?.setOpen(open);
  });
</script>

<dialog
  {...rest}
  class={['hl-drawer', klass]}
  data-hl-drawer
  data-hl-side={side}
  {@attach drawer.attach}
>
  {@render children?.()}
</dialog>
