<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<div {...rest} data-hl-command-empty hidden>
  {#if children}{@render children()}{:else}No results found.{/if}
</div>
