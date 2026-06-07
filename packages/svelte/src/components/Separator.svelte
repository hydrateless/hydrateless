<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLHRElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }

  let { orientation = 'horizontal', decorative = false, class: klass, ...rest }: Props = $props();
</script>

<hr
  {...rest}
  class={['hl-separator', klass]}
  data-hl-orientation={orientation === 'vertical' ? 'vertical' : undefined}
  aria-orientation={orientation}
  role={decorative ? 'presentation' : undefined}
/>
