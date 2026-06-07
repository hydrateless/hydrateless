<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<a {...rest} class={['a11y-skip-link', klass]}>
  {#if children}{@render children()}{:else}Skip to content{/if}
</a>
