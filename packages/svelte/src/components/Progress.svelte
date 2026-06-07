<script lang="ts">
  import type { HTMLProgressAttributes } from 'svelte/elements';

  interface Props extends HTMLProgressAttributes {
    value?: number;
    max?: number;
    intent?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
  }

  let { value, max = 100, intent, size, class: klass, ...rest }: Props = $props();
</script>

<progress
  {...rest}
  class={['hl-progress', klass]}
  data-hl-intent={intent}
  data-hl-size={size}
  {value}
  {max}
></progress>
