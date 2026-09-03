<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Semantic tone; sets `data-hl-intent`. */
    intent?: 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
    /** Visual style. */
    variant?: 'soft' | 'solid' | 'outline';
    /** Badge size. */
    size?: 'sm' | 'md';
    /** Badge text. */
    children?: Snippet;
  }

  let { intent, variant, size, class: klass, children, ...rest }: Props = $props();
</script>

<span
  {...rest}
  class={['hl-badge', klass]}
  data-hl-intent={intent}
  data-hl-variant={variant}
  data-hl-size={size}
>
  {@render children?.()}
</span>
