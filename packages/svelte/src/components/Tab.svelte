<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<button type="button" {...rest} role="tab">
  {@render children?.()}
</button>
