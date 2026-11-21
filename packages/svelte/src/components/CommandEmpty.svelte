<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Message shown when no command matches the query. */
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['hl-command-empty', klass]} data-hl-command-empty hidden>
  {#if children}{@render children()}{:else}No results found.{/if}
</div>
