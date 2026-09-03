<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLiAttributes } from 'svelte/elements';

  interface Props extends HTMLLiAttributes {
    /** Link target; omitted for the current page. */
    href?: string;
    /** Mark this item as the current page (`aria-current="page"`). */
    current?: boolean;
    /** Item label. */
    children?: Snippet;
  }

  let { href, current = false, children, ...rest }: Props = $props();
</script>

<li {...rest}>
  {#if current || !href}
    <span aria-current={current ? 'page' : undefined}>{@render children?.()}</span>
  {:else}
    <a {href}>{@render children?.()}</a>
  {/if}
</li>
