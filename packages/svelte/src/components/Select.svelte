<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { fieldBindings } from '../context.js';

  interface Props extends Omit<HTMLSelectAttributes, 'size'> {
    value?: string;
    size?: 'sm' | 'md' | 'lg';
    invalid?: boolean;
    children?: Snippet;
  }

  let {
    value = $bindable(),
    size,
    invalid = false,
    class: klass,
    children,
    ...rest
  }: Props = $props();
  const field = fieldBindings();
</script>

<span class="hl-select-wrapper">
  <select
    {...field}
    {...rest}
    bind:value
    class={['hl-select', klass]}
    data-hl-size={size}
    data-hl-invalid={invalid || undefined}
    aria-invalid={invalid || undefined}
  >
    {@render children?.()}
  </select>
</span>
