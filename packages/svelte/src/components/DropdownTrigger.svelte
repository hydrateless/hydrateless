<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { getDropdownContext } from '../context.js';

  interface Props extends HTMLButtonAttributes {
    /** Trigger label. */
    children?: Snippet;
  }

  let { type, id, children, ...rest }: Props = $props();
  const dropdown = getDropdownContext();
</script>

<button
  {...rest}
  id={id ?? dropdown?.triggerId}
  type={type ?? 'button'}
  data-hl-dropdown-trigger
  popovertarget={dropdown?.menuId}
  aria-haspopup="menu"
  aria-expanded={dropdown?.open ?? false}
  aria-controls={dropdown?.menuId}
>
  {@render children?.()}
</button>
