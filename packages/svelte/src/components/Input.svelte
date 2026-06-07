<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { fieldBindings } from '../context.js';

  interface Props extends Omit<HTMLInputAttributes, 'size'> {
    value?: string | number;
    size?: 'sm' | 'md' | 'lg';
    invalid?: boolean;
  }

  let { value = $bindable(), size, invalid = false, class: klass, ...rest }: Props = $props();
  const field = fieldBindings();
</script>

<input
  {...field}
  {...rest}
  bind:value
  class={['hl-input', klass]}
  data-hl-size={size}
  data-hl-invalid={invalid || undefined}
  aria-invalid={invalid || undefined}
/>
