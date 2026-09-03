<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Spinner size. */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Accessible name announced by screen readers. Defaults to "Loading". */
    label?: string;
  }

  let { size, label = 'Loading', class: klass, ...rest }: Props = $props();
</script>

<span {...rest} class={['hl-spinner', klass]} data-hl-size={size} role="status" aria-label={label}
></span>
