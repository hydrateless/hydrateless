<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getDropdownContext } from '../context.js';

  interface Props extends HTMLAttributes<HTMLUListElement> {
    /** `<DropdownItem>`s, `<DropdownGroup>`s, and `<DropdownSeparator>`s. */
    children?: Snippet;
  }

  let { id, children, ...rest }: Props = $props();
  const dropdown = getDropdownContext();
</script>

<!-- `popover` is in the markup (not added by the enhancer) so the trigger's
     `popovertarget` opens the menu before hydration. -->
<ul
  {...rest}
  id={id ?? dropdown?.menuId}
  data-hl-dropdown-menu
  popover="auto"
  role="menu"
  aria-labelledby={dropdown?.triggerId}
>
  {@render children?.()}
</ul>
