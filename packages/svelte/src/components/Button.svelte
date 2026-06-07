<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
    intent?: 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    icon?: boolean;
    loading?: boolean;
    children?: Snippet;
  }

  let {
    variant,
    intent,
    size,
    block,
    icon,
    loading,
    disabled,
    type,
    class: klass,
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  type={type ?? 'button'}
  class={['hl-button', klass]}
  data-hl-variant={variant}
  data-hl-intent={intent}
  data-hl-size={size}
  data-hl-block={block || undefined}
  data-hl-icon={icon || undefined}
  data-hl-loading={loading || undefined}
  aria-busy={loading || undefined}
  disabled={disabled || loading || undefined}
>
  {@render children?.()}
</button>
