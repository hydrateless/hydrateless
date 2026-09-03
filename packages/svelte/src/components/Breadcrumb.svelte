<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** `<BreadcrumbItem>`s, first to current. */
    children?: Snippet;
  }

  let { 'aria-label': ariaLabel = 'Breadcrumb', children, ...rest }: Props = $props();
</script>

<nav {...rest} data-hl-breadcrumb aria-label={ariaLabel}>
  <ol>{@render children?.()}</ol>
</nav>
