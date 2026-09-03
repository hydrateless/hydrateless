<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    /** Link text. Defaults to "Skip to content". */
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<a {...rest} class={['hl-skip-link', klass]}>
  {#if children}{@render children()}{:else}Skip to content{/if}
</a>
