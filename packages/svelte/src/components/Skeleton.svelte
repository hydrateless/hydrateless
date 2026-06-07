<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'rect' | 'text' | 'circle';
    width?: string | number;
    height?: string | number;
  }

  let { variant, width, height, style, class: klass, ...rest }: Props = $props();

  function dim(v: string | number): string {
    return typeof v === 'number' ? `${v}px` : v;
  }

  const sizeStyle = $derived(
    [
      width != null ? `inline-size:${dim(width)}` : '',
      height != null ? `block-size:${dim(height)}` : '',
      style ?? '',
    ]
      .filter(Boolean)
      .join(';'),
  );
</script>

<span
  {...rest}
  class={['hl-skeleton', klass]}
  data-hl-variant={variant}
  style={sizeStyle || undefined}
  aria-hidden="true"
></span>
