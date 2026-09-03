<script lang="ts">
  import { enhancePopover, type EnhancePopoverOptions } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /**
     * Open state; two-way bindable (`bind:open`). The browser's light-dismiss
     * (Escape/outside click) closes it and updates the binding.
     */
    open?: boolean;
    /** Show the popover initially for uncontrolled usage. */
    defaultOpen?: boolean;
    /** Called after the popover shows or hides. */
    onOpenChange?: (open: boolean) => void;
    /** Preferred placement relative to the invoker. Defaults to `bottom`. */
    placement?: EnhancePopoverOptions['placement'];
    /** Open on hover/focus of the invoker instead of on click. */
    hover?: boolean;
    /** Popover content. Point a `<button popovertarget={id}>` at this element's `id`. */
    children?: Snippet;
  }

  let {
    defaultOpen = false,
    open = $bindable(),
    onOpenChange,
    placement,
    hover = false,
    id,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;
  // An id is required so invokers can target the popover before hydration.
  const generatedId = $props.id();
  const popoverId = $derived(id ?? `hl-popover-${generatedId}`);

  const popover = useEnhancer(enhancePopover, () => ({
    placement,
    triggerEvent: hover ? ('hover' as const) : ('click' as const),
    defaultOpen: untrack(() => open),
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    },
  }));

  $effect(() => {
    if (open != null) popover.api?.setOpen(open);
  });
</script>

<div {...rest} id={popoverId} data-hl-popover popover="auto" role="dialog" {@attach popover.attach}>
  {@render children?.()}
</div>
