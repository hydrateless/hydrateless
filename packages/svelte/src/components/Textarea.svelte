<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { fieldBindings } from '../context.js';

  interface Props extends HTMLTextareaAttributes {
    value?: string;
    size?: 'sm' | 'md' | 'lg';
    invalid?: boolean;
  }

  let { value = $bindable(), size, invalid = false, class: klass, ...rest }: Props = $props();
  const field = fieldBindings();
</script>

<textarea
  {...field}
  {...rest}
  bind:value
  class={['hl-textarea', klass]}
  data-hl-size={size}
  data-hl-invalid={invalid || undefined}
  aria-invalid={invalid || undefined}
></textarea>
