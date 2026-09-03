<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLTableAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLTableAttributes, 'align'> {
    /** Zebra-stripe the body rows. */
    striped?: boolean;
    /** Highlight a body row under the pointer. */
    hover?: boolean;
    /** Default text alignment of cells (logical, RTL-aware). */
    align?: 'start' | 'center' | 'end';
    /** Cell padding scale. */
    size?: 'sm' | 'md' | 'lg';
    /** `<thead>`, `<tbody>`, `<tfoot>`, and `<caption>` as usual. */
    children?: Snippet;
  }

  let { striped, hover, align, size, class: klass, children, ...rest }: Props = $props();
</script>

<table
  {...rest}
  class={['hl-table', klass]}
  data-hl-striped={striped || undefined}
  data-hl-hover={hover || undefined}
  data-hl-align={align}
  data-hl-size={size}
>
  {@render children?.()}
</table>
