<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    children?: Snippet;
  }

  let { type, children, ...rest }: Props = $props();
</script>

<button {...rest} type={type ?? 'button'} data-hl-dropdown-trigger>
  {@render children?.()}
</button>
