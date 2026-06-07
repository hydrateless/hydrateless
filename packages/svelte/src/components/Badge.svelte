<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    intent?: 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
    variant?: 'soft' | 'solid' | 'outline';
    size?: 'sm' | 'md';
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
