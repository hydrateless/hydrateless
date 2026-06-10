<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    /** Stable value identifying this tab; defaults to its index. */
    value?: string;
    children?: Snippet;
  }

  let { value, children, ...rest }: Props = $props();
</script>

<button type="button" {...rest} role="tab" data-hl-value={value}>
  {@render children?.()}
</button>
