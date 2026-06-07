<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value: string;
    /** Extra search terms for filtering. */
    keywords?: string;
    /** Leading icon snippet. */
    icon?: Snippet;
    children?: Snippet;
  }

  let { value, keywords, icon, children, ...rest }: Props = $props();
</script>

<div {...rest} role="option" data-hl-value={value} data-hl-keywords={keywords}>
  {@render icon?.()}
  <span>{@render children?.()}</span>
</div>
