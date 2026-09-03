<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** `<Tab>`s, in the same order as the panels. */
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<div {...rest} role="tablist">
  {@render children?.()}
</div>
