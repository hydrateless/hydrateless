<script lang="ts">
  import { enhanceDropdown, type EnhanceDropdownOptions } from '@hydrateless/enhancers';
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { setDropdownContext } from '../context.js';
  import { useEnhancer } from '../useEnhancer.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
    /** Open state; two-way bindable (`bind:open`). */
    open?: boolean;
    /** Open the menu initially for uncontrolled usage. */
    defaultOpen?: boolean;
    /** Called after the menu opens or closes. */
    onOpenChange?: (open: boolean) => void;
    /**
     * Called with the item's value when a menu item is activated. For
     * `menuitemcheckbox`/`menuitemradio` items, `checked` is the new state.
     */
    onSelect?: (value: string, item: HTMLElement, checked?: boolean) => void;
    /** Close the menu after an item is activated. Defaults to `true`. */
    closeOnSelect?: boolean;
    /** Placement of the menu relative to the trigger. Defaults to `bottom-start`. */
    placement?: EnhanceDropdownOptions['placement'];
    /** A `<DropdownTrigger>` followed by a `<DropdownMenu>`. */
    children?: Snippet;
  }

  let {
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    onSelect,
    closeOnSelect = true,
    placement,
    children,
    ...rest
  }: Props = $props();
  // svelte-ignore state_referenced_locally -- seeds the uncontrolled initial value once
  if (open === undefined) open = defaultOpen;

  // The trigger's `popovertarget` must name the menu in server-rendered
  // markup so the menu opens before (or without) JavaScript.
  const generatedId = $props.id();
  setDropdownContext({
    menuId: `hl-dropdown-menu-${generatedId}`,
    triggerId: `hl-dropdown-trigger-${generatedId}`,
  });

  const dropdown = useEnhancer(enhanceDropdown, () => ({
    placement,
    closeOnSelect,
    defaultOpen: untrack(() => open),
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    },
    onSelect: (value, item, checked) => onSelect?.(value, item, checked),
  }));

  $effect(() => {
    if (open != null) dropdown.api?.setOpen(open);
  });
</script>

<div {...rest} data-hl-dropdown {@attach dropdown.attach}>
  {@render children?.()}
</div>
