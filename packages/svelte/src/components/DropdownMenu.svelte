<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLUListElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<ul {...rest} data-hl-dropdown-menu>
  {@render children?.()}
</ul>
