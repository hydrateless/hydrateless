<script lang="ts">
  import type { HTMLProgressAttributes } from 'svelte/elements';

  interface Props extends HTMLProgressAttributes {
    /** Current progress; omit for an indeterminate bar. */
    value?: number;
    /** Value that represents completion. Defaults to `100`. */
    max?: number;
    /** Semantic tone; sets `data-hl-intent`. */
    intent?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    /** Bar thickness. */
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
