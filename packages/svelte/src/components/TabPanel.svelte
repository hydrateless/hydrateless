<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<div {...rest} role="tabpanel">
  {@render children?.()}
</div>
