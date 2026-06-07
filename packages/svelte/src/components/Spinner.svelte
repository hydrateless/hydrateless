<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    label?: string;
  }

  let { size, label = 'Loading', class: klass, ...rest }: Props = $props();
</script>

<span {...rest} class={['hl-spinner', klass]} data-hl-size={size} role="status" aria-label={label}
></span>
