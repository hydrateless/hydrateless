<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Placeholder shape. */
    shape?: 'text' | 'circle' | 'rect';
    /** Inline size; numbers are pixels. */
    width?: string | number;
    /** Block size; numbers are pixels. */
    height?: string | number;
  }

  let { shape, width, height, style, class: klass, ...rest }: Props = $props();

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
  data-hl-shape={shape}
  style={sizeStyle || undefined}
  aria-hidden="true"
></span>
