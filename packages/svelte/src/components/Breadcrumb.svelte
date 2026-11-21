<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** `<BreadcrumbItem>`s, first to current. */
    children?: Snippet;
  }

  let { 'aria-label': ariaLabel = 'Breadcrumb', class: klass, children, ...rest }: Props = $props();
</script>

<nav {...rest} class={['hl-breadcrumb', klass]} aria-label={ariaLabel}>
  <ol>{@render children?.()}</ol>
</nav>
