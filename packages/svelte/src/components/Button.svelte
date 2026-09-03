<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    /** Visual style. */
    variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
    /** Semantic tone; sets `data-hl-intent`. */
    intent?: 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
    /** Button size. */
    size?: 'sm' | 'md' | 'lg';
    /** Stretch to the container's full inline size. */
    block?: boolean;
    /** Square icon-only button; remember to pass `aria-label`. */
    icon?: boolean;
    /** Show a spinner and disable the button while work is pending. */
    loading?: boolean;
    /** Button label. */
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
