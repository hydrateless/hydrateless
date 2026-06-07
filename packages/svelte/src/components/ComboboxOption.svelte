<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLiAttributes } from 'svelte/elements';

  interface Props extends HTMLLiAttributes {
    value: string;
    children?: Snippet;
  }

  let { value, children, ...rest }: Props = $props();
</script>

<li {...rest} role="option" data-hl-value={value}>
  {#if children}{@render children()}{:else}{value}{/if}
</li>
