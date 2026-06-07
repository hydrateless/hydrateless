<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLiAttributes } from 'svelte/elements';

  interface Props extends HTMLLiAttributes {
    href?: string;
    current?: boolean;
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
